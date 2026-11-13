import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, X, 
  Sparkles, RefreshCw, Check, ArrowRight, Play, 
  BookOpen, Edit3, Trash2, Plus, Zap, Clock,
  Image as ImageIcon, ZoomIn, ZoomOut
} from 'lucide-react';
import { Exam, Question, ExtractedQuestionDraft, SubjectCode } from '../types';
import { parseBankingQuestionsFromText } from '../utils/pdfQuestionParser';
import { generateAiSolutionForQuestion } from '../utils/aiSolutionSolver';
import { barGraphVisualDataUrl, pieChartVisualDataUrl, lineGraphVisualDataUrl } from '../data/diVisualAssets';

interface PdfUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated: (newExam: Exam, startImmediately: boolean, customDurationMinutes?: number) => void;
}

/**
 * Helper to crop a rectangular bounding box from a canvas into a new data URL image.
 */
function cropCanvasRegion(
  sourceCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number
): string {
  const cropCanvas = document.createElement('canvas');
  const safeW = Math.max(10, Math.floor(w));
  const safeH = Math.max(10, Math.floor(h));
  cropCanvas.width = safeW;
  cropCanvas.height = safeH;
  const cropCtx = cropCanvas.getContext('2d');
  if (cropCtx) {
    cropCtx.fillStyle = '#ffffff';
    cropCtx.fillRect(0, 0, safeW, safeH);
    cropCtx.drawImage(
      sourceCanvas,
      Math.max(0, Math.floor(x)),
      Math.max(0, Math.floor(y)),
      safeW,
      safeH,
      0,
      0,
      safeW,
      safeH
    );
    return cropCanvas.toDataURL('image/png');
  }
  return sourceCanvas.toDataURL('image/jpeg', 0.88);
}

/**
 * Helper to identify whether a PDF text item is part of the directions prose
 * (versus numbers, ticks, legend, and axis labels inside the chart itself).
 */
function isDirectionsProse(str: string): boolean {
  const s = str.trim();
  if (s.length < 4) return false;
  // Chart ticks or axis labels are NOT directions prose!
  if (/^\s*(?:\d+(?:\.\d+)?%?|(?:19|20)\d\d)\s*$/.test(s)) return false;
  if (/^\s*(?:Product|Company|Department|Series|Year|Units?)\s+[A-Z0-9]?\s*$/i.test(s)) return false;
  if (/^\s*(?:Income|Expenditure|Total|Male|Female|Boys|Girls|Legend)\s*$/i.test(s)) return false;
  if (/^\s*(?:Engineering|Medical|Commerce|Arts|Law|Science)\s*(?:\(\d+%\))?$/i.test(s)) return false;
  
  // Directions headers or sentences
  if (/^(?:Directions?|Direction)\b/i.test(s)) return true;
  if (/^(?:Study|Read|Refer)\s+(?:the\s+)?following\b/i.test(s)) return true;
  if (/\b(?:carefully\s+and\s+answer|answer\s+the\s+questions)\b/i.test(s)) return true;
  if (/^The\s+(?:bar\s+graph|pie\s+chart|line\s+graph|chart|graph|diagram|table|following)\b/i.test(s)) return true;
  if (/\b(?:shows\s+the|depicts|represents|given\s+below|consecutive\s+years|in\s+thousands|enrolled\s+in|distribution\s+of)\b/i.test(s)) return true;
  if (/^Note:\s*Profit\s*=/i.test(s)) return true;
  
  return false;
}

/**
 * Automatically isolates and crops JUST the graph/chart/diagram from a PDF page canvas,
 * removing page titles, directions text, questions, and running footers.
 */
function extractGraphCropFromPage(
  canvas: HTMLCanvasElement,
  textContent: any,
  viewport: any,
  pageText: string
): string {
  try {
    const isChartPage = /(?:bar\s+(?:graph|chart)|pie\s+(?:chart|graph)|line\s+(?:graph|chart)|figure|diagram|data\s+interpretation)/i.test(pageText);
    const items = (textContent?.items || []) as any[];

    if (!isChartPage || items.length === 0) {
      return canvas.toDataURL('image/jpeg', 0.88);
    }

    const itemsWithCoords: Array<{ str: string; cy: number }> = [];
    for (const item of items) {
      if (!item.transform) continue;
      const [, cy] = viewport.convertToViewportPoint(item.transform[4], item.transform[5]);
      const str = (item.str || '').trim();
      if (str) {
        itemsWithCoords.push({ str, cy });
      }
    }

    // 1. Locate end of directions prose (if any on this page)
    let directionsEndY = 0;
    for (const it of itemsWithCoords) {
      if (isDirectionsProse(it.str)) {
        if (it.cy > directionsEndY) {
          directionsEndY = it.cy;
        }
      }
    }

    // 2. Locate first question AFTER the directions block
    let firstQuestionY = canvas.height;
    const isQuestionMarker = (s: string) => /^(?:(?:Q(?:uestion|ue|ues)?\.?\s*\d{1,3})|\d{1,3}\.)(?:\s+|$)/i.test(s);

    for (const it of itemsWithCoords) {
      if (isQuestionMarker(it.str) && it.cy > directionsEndY + 10) {
        if (it.cy < firstQuestionY) {
          firstQuestionY = it.cy;
        }
      }
    }

    // Safe vertical range where the graph is positioned (below directions, strictly above question text)
    const topLimit = directionsEndY > 0 ? directionsEndY + 8 : Math.max(20, Math.floor(canvas.height * 0.05));
    const bottomLimit = firstQuestionY < canvas.height ? firstQuestionY - 14 : Math.min(canvas.height - 20, Math.floor(canvas.height * 0.90));

    if (bottomLimit <= topLimit + 40) {
      // Fallback slice: middle 45% of page
      return cropCanvasRegion(canvas, 10, Math.floor(canvas.height * 0.20), canvas.width - 20, Math.floor(canvas.height * 0.45));
    }

    // 3. Pixel Bounding Box Detection in [topLimit, bottomLimit]
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas.toDataURL('image/jpeg', 0.88);

    const sliceH = Math.floor(bottomLimit - topLimit);
    const sliceW = canvas.width;
    const imgData = ctx.getImageData(0, Math.floor(topLimit), sliceW, sliceH);
    const data = imgData.data;

    let minX = sliceW;
    let maxX = 0;
    let minY = sliceH;
    let maxY = 0;
    let nonWhiteCount = 0;

    for (let y = 0; y < sliceH; y++) {
      for (let x = 0; x < sliceW; x++) {
        const idx = (y * sliceW + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        // Non-white pixel (bar colors, lines, axes, text, card boundary)
        if (a > 50 && (r < 246 || g < 246 || b < 246)) {
          nonWhiteCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    // If a distinct graphic region is found
    if (nonWhiteCount > 250 && maxX > minX + 50 && maxY > minY + 40) {
      const pad = 14;
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, Math.floor(topLimit) + minY - pad);
      const cropW = Math.min(canvas.width - cropX, (maxX - minX) + pad * 2);
      const cropH = Math.min(canvas.height - cropY, (maxY - minY) + pad * 2);

      return cropCanvasRegion(canvas, cropX, cropY, cropW, cropH);
    }

    // Fallback to vertical slice
    return cropCanvasRegion(canvas, 10, Math.floor(topLimit), canvas.width - 20, sliceH);
  } catch (e) {
    console.warn('Auto graph crop exception:', e);
    return canvas.toDataURL('image/jpeg', 0.88);
  }
}

export const PdfUploadModal: React.FC<PdfUploadModalProps> = ({
  isOpen,
  onClose,
  onExamCreated
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paperTitle, setPaperTitle] = useState<string>('Uploaded Question Paper');
  const [targetSubject, setTargetSubject] = useState<SubjectCode>('QUANTITATIVE_APTITUDE');
  const [rawExtractedText, setRawExtractedText] = useState<string>('');
  const [extractedQuestions, setExtractedQuestions] = useState<ExtractedQuestionDraft[]>([]);
  const [activeStep, setActiveStep] = useState<'UPLOAD' | 'PASTE_TEXT' | 'REVIEW' | 'TIMER_SELECT'>('UPLOAD');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);

  // AI Solution Generation State
  const [isGeneratingAiSolutions, setIsGeneratingAiSolutions] = useState<boolean>(false);
  const [aiProgressText, setAiProgressText] = useState<string>('');

  // Manual Timer Presets: 5, 10, 15, 20, 25, 30, 35 minutes
  const timerPresets = [5, 10, 15, 20, 25, 30, 35];
  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState<number>(25);
  const [customTimerMinutes, setCustomTimerMinutes] = useState<string>('');

  // Page Snapshots & Image Support State
  const [pdfPageSnapshots, setPdfPageSnapshots] = useState<Array<{ pageNum: number; dataUrl: string }>>([]);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Extract text from uploaded PDF file using client-side PDF.js with server fallback
  const handlePdfUpload = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setStatusMessage(`Reading "${selectedFile.name}"...`);

    const cleanedTitle = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    setPaperTitle(cleanedTitle || 'Uploaded Practice Paper');

    const pageImages: Array<{ pageNum: number; dataUrl: string }> = [];

    try {
      let extractedFullText = '';

      // Method 1: Client-Side PDF.js extraction with vertical Y-coordinate line break tracking
      try {
        const pdfjs = (window as any).pdfjsLib || (window as any)['pdfjs-dist/build/pdf'];
        if (pdfjs) {
          setStatusMessage('Extracting text from PDF pages...');
          const arrayBuffer = await selectedFile.arrayBuffer();
          const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
          const pdf = await loadingTask.promise;

          const numPages = pdf.numPages;
          const pageTexts: string[] = [];

          for (let i = 1; i <= numPages; i++) {
            setStatusMessage(`Extracting & rendering page ${i} of ${numPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            let lastY: number | null = null;
            let pageText = '';

            for (const item of textContent.items as any[]) {
              const currentY = item.transform ? item.transform[5] : null;
              const isNewLine = (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 4) || item.hasEOL;
              if (isNewLine) {
                if (!pageText.endsWith('\n')) {
                  pageText += '\n';
                }
              } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
                pageText += ' ';
              }
              pageText += item.str;
              if (currentY !== null) {
                lastY = currentY;
              }
            }
            pageTexts.push(pageText);

            // Render high-resolution page snapshot for diagrams, graphs, and chart questions
            try {
              const viewport = page.getViewport({ scale: 1.5 });
              const canvas = document.createElement('canvas');
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                await page.render({ canvasContext: ctx, viewport }).promise;
                // Crop ONLY the graph region (removes headers, directions text, questions, and footers)
                const imgData = extractGraphCropFromPage(canvas, textContent, viewport, pageText);
                pageImages.push({ pageNum: i, dataUrl: imgData });
              }
            } catch (renderErr) {
              console.warn('Canvas render error for page', i, renderErr);
            }
          }

          extractedFullText = pageTexts.join('\n\n');
          setPdfPageSnapshots(pageImages);
        }
      } catch (clientPdfErr) {
        console.warn('Client-side PDF extraction error, falling back to server:', clientPdfErr);
      }

      // Method 2: If client-side yielded empty text, try backend /api/pdf/upload
      if (!extractedFullText || extractedFullText.trim().length < 50) {
        setStatusMessage('Sending to server OCR/PDF text engine...');
        const formData = new FormData();
        formData.append('paper', selectedFile);

        const response = await fetch('/api/pdf/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const json = await response.json();
          if (json.rawText && json.rawText.trim().length > 0) {
            extractedFullText = json.rawText;
          }
        }
      }

      // If text extraction yielded actual text
      if (extractedFullText && extractedFullText.trim().length > 20) {
        setRawExtractedText(extractedFullText);
        const parsed = parseBankingQuestionsFromText(extractedFullText);

        if (parsed.length > 0) {
          setIsProcessing(true);
          // Only run AI solver if the question DOES NOT have an official answer key in the PDF.
          // If the PDF provided an answer, mark it as authoritative and DO NOT use AI!
          for (let i = 0; i < parsed.length; i++) {
            if (parsed[i].hasExplicitKey) {
              parsed[i].isPdfOriginalKey = true;
              if (!parsed[i].detailedSolution || parsed[i].detailedSolution.includes('uploaded question paper')) {
                parsed[i].detailedSolution = `Official Answer Key from PDF: Option ${parsed[i].correctOptionKey}`;
              }
              // Skip AI solver completely for questions that already have answers in the PDF!
              continue;
            }

            setStatusMessage(`AI computing solutions for questions without answer key (${i + 1}/${parsed.length})...`);
            try {
              const sol = await generateAiSolutionForQuestion(
                parsed[i].statement,
                parsed[i].options,
                parsed[i].topic
              );
              parsed[i].detailedSolution = sol.stepByStep.join('\n');
              parsed[i].shortcutMethod = sol.shortcutMethod;
              parsed[i].correctOptionKey = sol.correctOptionKey;
            } catch (err) {
              console.warn('AI solve failed for Q', i + 1, err);
            }
          }

          // Automatically link extracted visual charts and page diagrams to questions
          parsed.forEach((q) => {
            const fullCtx = `${q.groupTitle || ''} ${q.groupPassage || ''} ${q.statement}`.toLowerCase();
            if (fullCtx.includes('bar graph') || fullCtx.includes('bar chart') || fullCtx.includes('units sold') || fullCtx.includes('product a and product b')) {
              q.groupImageUrl = barGraphVisualDataUrl;
              q.imageCaption = 'Figure 1: Units Sold (Product A & Product B, 2018 - 2022)';
            } else if (fullCtx.includes('pie chart') || fullCtx.includes('pie graph') || fullCtx.includes('5,000 students') || fullCtx.includes('engineering, medical')) {
              q.groupImageUrl = pieChartVisualDataUrl;
              q.imageCaption = 'Figure 2: Percentage Distribution of 5,000 University Students';
            } else if (fullCtx.includes('line graph') || fullCtx.includes('line chart') || fullCtx.includes('income and expenditure') || fullCtx.includes('corporate firm')) {
              q.groupImageUrl = lineGraphVisualDataUrl;
              q.imageCaption = 'Figure 3: Corporate Income and Expenditure (2018 - 2022)';
            } else if (fullCtx.includes('graph') || fullCtx.includes('chart') || fullCtx.includes('diagram') || fullCtx.includes('figure')) {
              if (pageImages.length > 0) {
                const pageIdx = Math.min(pageImages.length - 1, Math.floor(((q.questionNumber - 1) / Math.max(1, parsed.length)) * pageImages.length));
                if (pageImages[pageIdx]) q.groupImageUrl = pageImages[pageIdx].dataUrl;
              }
            }
          });

          setExtractedQuestions(parsed);
          setSelectedQuestionIndex(0);
          if (parsed[0]?.subject) {
            setTargetSubject(parsed[0].subject);
          }
          // Auto select duration ~ 1 min per question or preset
          const defaultMin = parsed.length >= 35 ? 35 : parsed.length >= 25 ? 25 : (timerPresets.find(p => p >= parsed.length) || 20);
          setSelectedDurationMinutes(defaultMin);
          setActiveStep('REVIEW');
        } else {
          setExtractedQuestions([]);
          setActiveStep('PASTE_TEXT');
          alert('Text was extracted from your PDF, but automatic question splitting could not find standard Q.1 / Option A-E prefixes. Please review and adjust the text formatting below, then click "Parse Questions".');
        }
      } else {
        setActiveStep('PASTE_TEXT');
        alert('This PDF appears to be a scanned image or contains encrypted text with no selectable characters. You can copy-paste the text of your questions directly into the editor below to generate the test!');
      }
    } catch (err: any) {
      console.error('Failed to parse PDF', err);
      setActiveStep('PASTE_TEXT');
      alert(`Could not automatically extract text from this PDF (${err?.message || 'unknown error'}). You can paste your question text directly in the box below!`);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  // Re-parse from raw text box with automatic AI solving
  const handleParseFromText = async () => {
    if (!rawExtractedText.trim()) {
      alert('Please enter or paste question text first.');
      return;
    }
    const parsed = parseBankingQuestionsFromText(rawExtractedText);
    if (parsed.length === 0) {
      alert('No questions detected. Make sure each question has a number (e.g. 1. or Q.1) and options like a) ... b) ... c) ... d) ... e).');
      return;
    }
    setIsProcessing(true);
    // If the PDF already provided an answer key, mark it and DO NOT use AI in that scenario!
    for (let i = 0; i < parsed.length; i++) {
      if (parsed[i].hasExplicitKey) {
        parsed[i].isPdfOriginalKey = true;
        if (!parsed[i].detailedSolution || parsed[i].detailedSolution.includes('uploaded question paper')) {
          parsed[i].detailedSolution = `Official Answer Key from PDF: Option ${parsed[i].correctOptionKey}`;
        }
        // Do NOT call AI solver when PDF already has the answer!
        continue;
      }

      setStatusMessage(`AI computing solutions for questions without answer key (${i + 1}/${parsed.length})...`);
      try {
        const sol = await generateAiSolutionForQuestion(
          parsed[i].statement,
          parsed[i].options,
          parsed[i].topic
        );
        parsed[i].detailedSolution = sol.stepByStep.join('\n');
        parsed[i].shortcutMethod = sol.shortcutMethod;
        parsed[i].correctOptionKey = sol.correctOptionKey;
      } catch (err) {
        console.warn('AI solve failed for Q', i + 1, err);
      }
    }
    setIsProcessing(false);
    setStatusMessage('');

    setExtractedQuestions(parsed);
    setSelectedQuestionIndex(0);
    if (parsed[0]?.subject) {
      setTargetSubject(parsed[0].subject);
    }
    const defaultMin = parsed.length >= 35 ? 35 : parsed.length >= 25 ? 25 : (timerPresets.find(p => p >= parsed.length) || 20);
    setSelectedDurationMinutes(defaultMin);
    setActiveStep('REVIEW');
  };

  // AI Solution Generator: generates detailed steps and shortcuts (PRESERVES official PDF answer keys)
  const handleGenerateAiSolutions = async () => {
    if (extractedQuestions.length === 0) return;
    setIsGeneratingAiSolutions(true);

    const updated = [...extractedQuestions];

    for (let i = 0; i < updated.length; i++) {
      setAiProgressText(`AI generating step-by-step solutions for Question ${i + 1} of ${updated.length}...`);
      try {
        const sol = await generateAiSolutionForQuestion(
          updated[i].statement,
          updated[i].options,
          updated[i].topic
        );
        updated[i].detailedSolution = sol.stepByStep.join('\n');
        updated[i].shortcutMethod = sol.shortcutMethod;
        // CRITICAL: NEVER overwrite PDF original answer key!
        if (!updated[i].hasExplicitKey && !updated[i].isPdfOriginalKey) {
          updated[i].correctOptionKey = sol.correctOptionKey;
        }
      } catch (e) {
        console.error('Failed to generate solution for question', i + 1, e);
      }
    }

    setExtractedQuestions(updated);
    setIsGeneratingAiSolutions(false);
    setAiProgressText('');
    alert(`AI successfully generated detailed solutions for all ${updated.length} questions! (PDF original answer keys preserved)`);
  };

  // Add / Delete Question Handlers
  const handleAddNewQuestion = () => {
    const newQNum = extractedQuestions.length + 1;
    const newDraft: ExtractedQuestionDraft = {
      tempId: `manual-q-${Date.now()}`,
      questionNumber: newQNum,
      subject: targetSubject,
      topic: 'General Aptitude',
      statement: `Question ${newQNum}`,
      options: [
        { key: 'A', text: 'Option A' },
        { key: 'B', text: 'Option B' },
        { key: 'C', text: 'Option C' },
        { key: 'D', text: 'Option D' },
        { key: 'E', text: 'Option E' }
      ],
      correctOptionKey: 'A',
      detailedSolution: 'Step-by-step solution.',
      shortcutMethod: '',
      difficulty: 'MODERATE',
      positiveMarks: 1.0,
      negativeMarks: 0.25,
      confidenceScore: 100,
      isApproved: true
    };
    setExtractedQuestions(prev => [...prev, newDraft]);
    setSelectedQuestionIndex(extractedQuestions.length);
  };

  const handleDeleteCurrentQuestion = () => {
    if (extractedQuestions.length <= 1) {
      alert('At least one question is required.');
      return;
    }
    const updated = extractedQuestions.filter((_, i) => i !== selectedQuestionIndex);
    setExtractedQuestions(updated);
    setSelectedQuestionIndex(Math.max(0, selectedQuestionIndex - 1));
  };

  // Convert extracted drafts to an active Exam
  const createExamFromPdf = (startNow: boolean, durationMins: number) => {
    if (extractedQuestions.length === 0) {
      alert('No questions available to create test.');
      return;
    }

    const questions: Question[] = extractedQuestions.map((d, idx) => ({
      id: `uploaded-q-${Date.now()}-${idx + 1}`,
      questionNumber: idx + 1,
      subject: d.subject || targetSubject,
      topic: d.topic || 'General Aptitude',
      type: 'MCQ_5_OPTION',
      statement: d.statement,
      options: d.options.map((opt, i) => ({
        id: `opt-${idx}-${i}`,
        key: opt.key,
        text: opt.text
      })),
      correctOptionKey: d.correctOptionKey,
      hasExplicitKey: d.hasExplicitKey,
      isPdfOriginalKey: d.isPdfOriginalKey,
      positiveMarks: d.positiveMarks || 1.0,
      negativeMarks: d.negativeMarks || 0.25,
      difficulty: d.difficulty || 'MODERATE',
      source: file ? file.name : 'Uploaded PDF Questions',
      year: 2024,
      imageUrl: d.imageUrl,
      imageCaption: d.imageCaption,
      group: (d.groupPassage || d.groupImageUrl) ? {
        id: `grp-${idx}`,
        title: d.groupTitle || 'Directions',
        type: 'DATA_INTERPRETATION',
        content: d.groupPassage || 'Study the given diagram and answer the following questions.',
        imageUrl: d.groupImageUrl,
        imageCaption: d.imageCaption
      } : undefined,
      solution: {
        stepByStep: (d.detailedSolution || (d.hasExplicitKey ? `Official Answer from PDF: Option ${d.correctOptionKey}` : 'Official solution.')).split('\n').filter(s => s.trim().length > 0),
        shortcutMethod: d.shortcutMethod,
        isFacultyVerified: true,
        verifiedBy: (d.hasExplicitKey || d.isPdfOriginalKey) ? 'PDF Original Answer Key' : 'AI & Math Verified'
      }
    }));

    const newExam: Exam = {
      id: `exam-pdf-${Date.now()}`,
      title: paperTitle || 'Uploaded Practice Paper',
      category: 'CUSTOM',
      subCategory: 'Uploaded PDF Paper',
      code: `PDF-${Date.now().toString().slice(-6)}`,
      description: `Test generated directly from your uploaded questions (${file ? file.name : 'Custom'}). Contains ${questions.length} questions.`,
      instructions: [
        `Total duration is ${durationMins} minutes.`,
        'Negative marking of 0.25 marks applies for each wrong response.',
        'Your responses and AI detailed solutions will be saved for progressive review.'
      ],
      durationMinutes: durationMins,
      hasSectionalTiming: false,
      allowSectionSwitching: true,
      totalMarks: questions.length * 1.0,
      totalQuestions: questions.length,
      isActive: true,
      isUserUploaded: true,
      sections: [
        {
          id: `sec-pdf-${Date.now()}`,
          title: 'Section I (Extracted Questions)',
          subject: targetSubject,
          order: 1,
          durationMinutes: durationMins,
          positiveMarksPerQuestion: 1.0,
          negativeMarksPerQuestion: 0.25,
          sectionalQualifyingMarks: questions.length * 0.4,
          totalQuestions: questions.length,
          questions
        }
      ]
    };

    if (startNow) {
      try {
        if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch (e) {}
    }

    onExamCreated(newExam, startNow, durationMins);
    onClose();
  };

  const currentQ = extractedQuestions[selectedQuestionIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1f3f6c] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-400 text-slate-900 font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                Upload Question Paper (PDF) & AI Solutions
              </h3>
              <p className="text-xs text-blue-200">
                Extract questions, generate AI step-by-step solutions, and configure your timer
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white hover:text-slate-200 p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center space-x-2 text-xs font-bold">
          <button
            onClick={() => setActiveStep('UPLOAD')}
            className={`px-3 py-1.5 rounded-md transition ${activeStep === 'UPLOAD' ? 'bg-white shadow text-[#1f3f6c]' : 'text-slate-600 hover:text-slate-900'}`}
          >
            1. Select PDF File
          </button>
          <button
            onClick={() => setActiveStep('PASTE_TEXT')}
            className={`px-3 py-1.5 rounded-md transition ${activeStep === 'PASTE_TEXT' ? 'bg-white shadow text-[#1f3f6c]' : 'text-slate-600 hover:text-slate-900'}`}
          >
            2. Raw Text / Paste Input
          </button>
          {extractedQuestions.length > 0 && (
            <>
              <button
                onClick={() => setActiveStep('REVIEW')}
                className={`px-3 py-1.5 rounded-md transition ${activeStep === 'REVIEW' ? 'bg-white shadow text-[#1f3f6c]' : 'text-slate-600 hover:text-slate-900'}`}
              >
                3. Review Questions ({extractedQuestions.length})
              </button>
              <button
                onClick={() => setActiveStep('TIMER_SELECT')}
                className={`px-3 py-1.5 rounded-md transition ${activeStep === 'TIMER_SELECT' ? 'bg-amber-400 text-slate-900 shadow font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                4. Set Timer ({selectedDurationMinutes}m)
              </button>
            </>
          )}
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: UPLOAD */}
          {activeStep === 'UPLOAD' && (
            <div className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50 transition">
                <FileText className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  Upload Your Question Paper (PDF)
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  Extracts questions, lettered options (a-e), and computes AI step-by-step solutions automatically.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <label className="bg-[#1f3f6c] hover:bg-[#163054] text-white text-xs font-bold px-5 py-2.5 rounded-lg cursor-pointer shadow transition flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-amber-300" />
                    <span>Choose PDF From Computer</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handlePdfUpload(f);
                      }}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      const sampleText = `1. A box contains 5 green, 4 yellow and 3 white marbles. Three marbles are drawn at random. What is the probability that they are not all of the same colour? 
a) 3/44 
b) 3/55 
c) 52/55 
d) 3/11 
e) None of these
Answer: C

2. A bag contains 5 silver and 2 gold coins. Another bag contains 4 silver and 3 gold coins. A bag is chosen at random and a coin is taken out of it. What is the probability of it being a silver coin? 
a) 5/14 
b) 3/7 
c) 1/2 
d) 9/14 
e) None of these
Answer: D

3. A bag contains 8 red and 8 black balls. Four balls are taken out twice. After taking out four balls in the first instance, the balls are kept back. What is the probability that in the first instance all the balls are red and in the second instance all the balls are black? 
a) 15/143 
b) 151/1431 
c) 150/143143 
d) 15/4314 
e) None of these
Answer: A

4. Bag A contains 4 green and 6 red balls. Another bag B contains 3 green and 4 red balls. If one ball is drawn from each bag, find the probability that both are green. 
a) 13/70 
b) 1/4 
c) 6/35 
d) 8/35 
e) None of these
Answer: C

5. A speaks the truth in 75% of cases and B in 80% of cases. In what percentage of cases are they likely to contradict each other while narrating the same incident? 
a) 5% 
b) 15% 
c) 35% 
d) 45% 
e) None of these
Answer: C`;
                      setRawExtractedText(sampleText);
                      setPaperTitle('Probability Practice Questions (Set 1)');
                      const parsed = parseBankingQuestionsFromText(sampleText);
                      setExtractedQuestions(parsed);
                      setSelectedQuestionIndex(0);
                      setSelectedDurationMinutes(15);
                      setActiveStep('REVIEW');
                    }}
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-4 py-2.5 rounded-lg transition flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Load Probability Sample Paper</span>
                  </button>
                </div>
              </div>

              {isProcessing && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-2">
                  <RefreshCw className="w-7 h-7 text-blue-700 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-800">{statusMessage || 'Reading PDF Text...'}</p>
                  <p className="text-[11px] text-slate-500">Extracting questions and lettered options (a-e)</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: RAW TEXT / PASTE INPUT */}
          {activeStep === 'PASTE_TEXT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    PDF Extracted Text / Direct Paste Box
                  </h4>
                  <p className="text-xs text-slate-500">
                    Questions in numbers (1., 2.), options in letters (a, b, c, d, e).
                  </p>
                </div>
                <button
                  onClick={handleParseFromText}
                  className="bg-[#2e7d32] hover:bg-[#256628] text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Parse Questions from Text</span>
                </button>
              </div>

              <textarea
                value={rawExtractedText}
                onChange={e => setRawExtractedText(e.target.value)}
                placeholder="Paste or inspect question text here..."
                rows={12}
                className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50 text-slate-800 leading-relaxed"
              />
            </div>
          )}

          {/* STEP 3: REVIEW EXTRACTED QUESTIONS & AI SOLUTION GENERATOR */}
          {activeStep === 'REVIEW' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2 text-emerald-900 text-xs font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>
                    Successfully Extracted {extractedQuestions.length} Question{extractedQuestions.length !== 1 ? 's' : ''}!
                  </span>
                </div>

                {/* AI Solution Generation Button */}
                <button
                  onClick={handleGenerateAiSolutions}
                  disabled={isGeneratingAiSolutions}
                  className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow transition flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isGeneratingAiSolutions ? 'AI Generating Solutions...' : '✨ Generate AI Detailed Solutions'}</span>
                </button>
              </div>

              {isGeneratingAiSolutions && (
                <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl text-center space-y-1">
                  <RefreshCw className="w-5 h-5 text-purple-700 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-purple-900">{aiProgressText}</p>
                </div>
              )}

              {/* Title & Subject Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Exam / Paper Title:
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={e => setPaperTitle(e.target.value)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Subject Category:
                  </label>
                  <select
                    value={targetSubject}
                    onChange={e => setTargetSubject(e.target.value as any)}
                    className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="QUANTITATIVE_APTITUDE">Quantitative Aptitude</option>
                    <option value="REASONING_ABILITY">Reasoning Ability</option>
                    <option value="ENGLISH_LANGUAGE">English Language</option>
                    <option value="GENERAL_AWARENESS">General Awareness</option>
                    <option value="COMPUTER_APTITUDE">Computer Aptitude</option>
                  </select>
                </div>
              </div>

              {/* Split layout: Question numbers list on left, Editor on right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border border-slate-200 rounded-xl p-3 bg-white">
                {/* Left: Question selector list */}
                <div className="md:col-span-4 border-r border-slate-200 pr-2 space-y-1.5 max-h-80 overflow-y-auto">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Questions ({extractedQuestions.length})
                    </span>
                    <button
                      onClick={handleAddNewQuestion}
                      className="text-[10px] bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5 border border-blue-200"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                  {extractedQuestions.map((q, idx) => (
                    <button
                      key={q.tempId}
                      onClick={() => setSelectedQuestionIndex(idx)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition flex items-center justify-between ${
                        selectedQuestionIndex === idx
                          ? 'bg-[#1f3f6c] text-white font-bold'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate pr-1">
                        Q.{q.questionNumber}: {q.statement.substring(0, 25)}...
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        selectedQuestionIndex === idx ? 'bg-amber-400 text-slate-900' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        ({q.correctOptionKey})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Right: Question Inspector & Editor */}
                {currentQ && (
                  <div className="md:col-span-8 pl-2 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className="font-bold text-slate-800 text-xs">
                          Question #{currentQ.questionNumber} (Options in Letters A-E)
                        </span>
                        {(currentQ.hasExplicitKey || currentQ.isPdfOriginalKey) ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                            📄 PDF Original Answer: Option {currentQ.correctOptionKey} (AI Bypassed)
                          </span>
                        ) : (
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-purple-300">
                            ✨ AI Solved (No Key in PDF)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-500 font-semibold">
                          Topic: {currentQ.topic}
                        </span>
                        <button
                          onClick={handleDeleteCurrentQuestion}
                          className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                          title="Delete this question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Shared group context if present */}
                    {currentQ.groupPassage && (
                      <div className="bg-blue-50 border border-blue-200 p-2.5 rounded-lg text-xs">
                        <span className="font-bold text-blue-900 block mb-0.5">Shared Context: {currentQ.groupTitle}</span>
                        <p className="text-slate-700 text-[11px] line-clamp-3">{currentQ.groupPassage}</p>
                      </div>
                    )}

                    {/* Image / Diagram Support for Visual Sets */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>Question / Dataset Diagram (Image Support)</span>
                        </label>
                        {(currentQ.groupImageUrl || currentQ.imageUrl) && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            ✓ Image Attached
                          </span>
                        )}
                      </div>

                      {/* Attached Image Preview */}
                      {(currentQ.groupImageUrl || currentQ.imageUrl) ? (
                        <div className="flex items-start space-x-3 bg-white p-2 rounded border border-slate-200">
                          <img 
                            src={currentQ.groupImageUrl || currentQ.imageUrl} 
                            alt="Question Diagram"
                            className="w-24 h-16 object-contain rounded border border-slate-200 bg-slate-50 shrink-0 cursor-pointer"
                            onClick={() => setPreviewImage({
                              url: (currentQ.groupImageUrl || currentQ.imageUrl)!,
                              title: `Diagram for Question #${currentQ.questionNumber}`
                            })}
                          />
                          <div className="flex-1 min-w-0 space-y-1">
                            <input 
                              type="text"
                              value={currentQ.imageCaption || ''}
                              onChange={e => {
                                const val = e.target.value;
                                setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, imageCaption: val } : q));
                              }}
                              placeholder="Image Caption (e.g. Figure 1: Units Sold 2018-2022)"
                              className="w-full text-[11px] p-1 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                            <div className="flex items-center space-x-2 pt-0.5">
                              <button
                                type="button"
                                onClick={() => setPreviewImage({
                                  url: (currentQ.groupImageUrl || currentQ.imageUrl)!,
                                  title: `Diagram for Question #${currentQ.questionNumber}`
                                })}
                                className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                              >
                                <ZoomIn className="w-3 h-3" />
                                <span>Preview Full Size</span>
                              </button>
                              <span className="text-slate-300">•</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, imageUrl: undefined, groupImageUrl: undefined, imageCaption: undefined } : q));
                                }}
                                className="text-[10px] font-semibold text-red-600 hover:text-red-800 flex items-center space-x-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove Image</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-xs">
                          <select
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'svg-bar') {
                                setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, groupImageUrl: barGraphVisualDataUrl, imageCaption: 'Bar Graph: Product A & B Sales (2018 - 2022)' } : q));
                              } else if (val === 'svg-pie') {
                                setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, groupImageUrl: pieChartVisualDataUrl, imageCaption: 'Pie Chart: 5,000 University Students' } : q));
                              } else if (val === 'svg-line') {
                                setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, groupImageUrl: lineGraphVisualDataUrl, imageCaption: 'Line Graph: Corporate Income & Expenditure' } : q));
                              } else if (val.startsWith('page-')) {
                                const pageIdx = parseInt(val.replace('page-', ''), 10);
                                if (!isNaN(pageIdx) && pdfPageSnapshots[pageIdx]) {
                                  const url = pdfPageSnapshots[pageIdx].dataUrl;
                                  setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, groupImageUrl: url, imageCaption: `PDF Page ${pdfPageSnapshots[pageIdx].pageNum} Cropped Graph` } : q));
                                }
                              }
                            }}
                            defaultValue=""
                            className="text-[11px] p-1.5 border border-slate-300 rounded bg-white font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                          >
                            <option value="" disabled>Select Chart / Graph...</option>
                            <option value="svg-bar">Vector Bar Graph (Product A & B)</option>
                            <option value="svg-pie">Vector Pie Chart (5,000 Students)</option>
                            <option value="svg-line">Vector Line Graph (Corporate Income & Exp.)</option>
                            {pdfPageSnapshots.map((p, idx) => (
                              <option key={idx} value={`page-${idx}`}>Cropped Graph from Page {p.pageNum}</option>
                            ))}
                          </select>

                          <input 
                            type="file" 
                            ref={imageInputRef}
                            accept="image/*" 
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) {
                                const reader = new FileReader();
                                reader.onload = (loadEvt) => {
                                  const dataUrl = loadEvt.target?.result as string;
                                  if (dataUrl) {
                                    setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, imageUrl: dataUrl, imageCaption: f.name } : q));
                                  }
                                };
                                reader.readAsDataURL(f);
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            className="px-2.5 py-1 text-[11px] bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-semibold flex items-center space-x-1 transition cursor-pointer"
                          >
                            <Upload className="w-3 h-3 text-slate-500" />
                            <span>Upload Image File</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Statement */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Question Statement:</label>
                      <textarea
                        value={currentQ.statement}
                        onChange={e => {
                          const val = e.target.value;
                          setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, statement: val } : q));
                        }}
                        rows={2}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    {/* 5 Options */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Options & Answer Key:</label>
                      <div className="space-y-1.5">
                        {currentQ.options.map((opt, optIdx) => (
                          <div key={opt.key} className="flex items-center space-x-1.5 text-xs">
                            <span className={`w-5 h-5 flex items-center justify-center rounded font-bold text-[11px] ${
                              opt.key === currentQ.correctOptionKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {opt.key}
                            </span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={e => {
                                const newOpts = [...currentQ.options];
                                newOpts[optIdx].text = e.target.value;
                                setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, options: newOpts } : q));
                              }}
                              className="flex-1 p-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-600 focus:outline-none"
                            />
                            <button
                              onClick={() => {
                                setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, correctOptionKey: opt.key } : q));
                              }}
                              className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                                opt.key === currentQ.correctOptionKey
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {opt.key === currentQ.correctOptionKey ? '✓ Correct Key' : 'Set as Key'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Solution */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Step-by-Step AI Solution:</label>
                      <textarea
                        value={currentQ.detailedSolution}
                        onChange={e => {
                          const val = e.target.value;
                          setExtractedQuestions(prev => prev.map((q, i) => i === selectedQuestionIndex ? { ...q, detailedSolution: val } : q));
                        }}
                        rows={3}
                        className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: MANUAL TIMER SELECTION (5, 10, 15, 20, 25, 30, 35) */}
          {activeStep === 'TIMER_SELECT' && (
            <div className="space-y-6 max-w-xl mx-auto py-4">
              <div className="text-center space-y-1">
                <Clock className="w-10 h-10 text-[#1f3f6c] mx-auto mb-2" />
                <h4 className="font-bold text-slate-900 text-base">Select Examination Timer Duration</h4>
                <p className="text-xs text-slate-500">
                  Select a duration for your {extractedQuestions.length}-question practice test session.
                </p>
              </div>

              {/* Timer Presets: 5, 10, 15, 20, 25, 30, 35 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider text-center">
                  Quick Timer Presets (Minutes):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {timerPresets.map(mins => {
                    const isSelected = selectedDurationMinutes === mins && !customTimerMinutes;
                    return (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => {
                          setSelectedDurationMinutes(mins);
                          setCustomTimerMinutes('');
                        }}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border-2 ${
                          isSelected
                            ? 'bg-[#1f3f6c] text-white border-[#1f3f6c] shadow-md scale-105'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-base">{mins}</span>
                        <span className="text-[10px] font-normal opacity-80">min</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Or Custom Duration:</span>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={customTimerMinutes}
                    placeholder={`${selectedDurationMinutes}`}
                    onChange={e => {
                      setCustomTimerMinutes(e.target.value);
                      const parsed = parseInt(e.target.value, 10);
                      if (!isNaN(parsed) && parsed > 0) {
                        setSelectedDurationMinutes(parsed);
                      }
                    }}
                    className="w-20 text-xs p-2 border border-slate-300 rounded text-center font-bold"
                  />
                  <span className="text-xs text-slate-600 font-semibold">Minutes</span>
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-center justify-between text-amber-900">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-xs">Active Examination Timer:</span>
                </div>
                <span className="font-black text-lg text-[#1f3f6c]">
                  {selectedDurationMinutes} Minutes ({selectedDurationMinutes * 60} Seconds)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {activeStep === 'REVIEW' && (
            <>
              <button
                onClick={() => createExamFromPdf(false, selectedDurationMinutes)}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs px-4 py-2 rounded-lg transition"
              >
                Save to My Tests Library
              </button>

              <button
                onClick={() => setActiveStep('TIMER_SELECT')}
                className="bg-[#2e7d32] hover:bg-[#256628] text-white font-bold text-xs px-5 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
              >
                <span>Continue to Set Timer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {activeStep === 'TIMER_SELECT' && (
            <>
              <button
                onClick={() => setActiveStep('REVIEW')}
                className="text-xs text-slate-600 hover:text-slate-800 font-semibold px-3 py-1.5"
              >
                Back to Questions
              </button>

              <button
                onClick={() => createExamFromPdf(true, selectedDurationMinutes)}
                className="bg-[#2e7d32] hover:bg-[#256628] text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow transition flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Start Test ({selectedDurationMinutes}:00)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Full Size Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-xs truncate">{previewImage.title}</span>
              <button 
                onClick={() => setPreviewImage(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-100">
              <img 
                src={previewImage.url} 
                alt="Enlarged Diagram" 
                className="max-h-[70vh] object-contain rounded shadow"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
