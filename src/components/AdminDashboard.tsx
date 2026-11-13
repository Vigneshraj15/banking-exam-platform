import React, { useState } from 'react';
import { 
  Upload, FileText, CheckCircle2, AlertCircle, Database, 
  Plus, Edit3, Trash2, Search, Filter, ShieldCheck, 
  Layers, ArrowRight, Eye, RefreshCw, Download, Check, X, Sparkles
} from 'lucide-react';
import { ExtractedQuestionDraft, SubjectCode, DifficultyLevel, Question } from '../types';
import { sampleExams } from '../data/mockExams';

interface AdminDashboardProps {
  onBackToStudentView: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStudentView }) => {
  const [activeTab, setActiveTab] = useState<'PDF_STUDIO' | 'QUESTION_BANK' | 'EXAM_MANAGER' | 'STUDENT_LOGS'>('PDF_STUDIO');

  // PDF Studio State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false);
  const [extractionConfidence, setExtractionConfidence] = useState<number | null>(null);
  const [extractedDrafts, setExtractedDrafts] = useState<ExtractedQuestionDraft[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [ocrEngine, setOcrEngine] = useState<'AUTO_AI' | 'TESSERACT_OCR' | 'PDF_NATIVE_TEXT'>('AUTO_AI');

  // Question Bank State
  const [bankQuestions, setBankQuestions] = useState<Question[]>(
    sampleExams.flatMap(e => e.sections.flatMap(s => s.questions))
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');

  // Simulate PDF Processing with realistic Banking PDF extraction
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setIsProcessingPdf(true);

    setTimeout(() => {
      setIsProcessingPdf(false);
      setExtractionConfidence(96.4);

      // Extracted questions maintaining shared grouped context!
      const drafts: ExtractedQuestionDraft[] = [
        {
          tempId: 'draft-1',
          questionNumber: 1,
          subject: 'REASONING_ABILITY',
          topic: 'Puzzles',
          statement: 'Which of the following persons lives on Floor 5 of the 7-storey building?',
          groupTitle: 'Floor & Designation Puzzle (SBI PO Pattern)',
          groupPassage: 'Directions (Q. 1 - 3): Seven bankers—A, B, C, D, E, F, and G—live on seven different floors of a building numbered 1 to 7 from bottom to top. Each person holds a different designation in the bank: Clerk, Officer, Manager, AGM, DGM, GM, and CGM. B lives on an odd-numbered floor above floor 3. Only two persons live between B and the General Manager (GM).',
          options: [
            { key: 'A', text: 'B (AGM)' },
            { key: 'B', text: 'D (Manager)' },
            { key: 'C', text: 'A (Officer)' },
            { key: 'D', text: 'F (GM)' },
            { key: 'E', text: 'E (Clerk)' }
          ],
          correctOptionKey: 'A',
          detailedSolution: 'Floor 7: D (CGM)\nFloor 6: F (GM)\nFloor 5: B (AGM)\nFloor 4: C (DGM)\nFloor 3: A (Manager)\nFloor 2: G (Officer)\nFloor 1: E (Clerk).\nTherefore, B lives on Floor 5.',
          shortcutMethod: 'Use floor-number deduction matrix: Floor 5 is odd > 3, fixing B immediately.',
          difficulty: 'MODERATE',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          confidenceScore: 98,
          isApproved: false
        },
        {
          tempId: 'draft-2',
          questionNumber: 2,
          subject: 'REASONING_ABILITY',
          topic: 'Puzzles',
          statement: 'How many floors are there between the floor on which the General Manager (GM) lives and the floor on which E lives?',
          groupTitle: 'Floor & Designation Puzzle (SBI PO Pattern)',
          groupPassage: 'Directions (Q. 1 - 3): Seven bankers—A, B, C, D, E, F, and G—live on seven different floors of a building numbered 1 to 7 from bottom to top. Each person holds a different designation in the bank: Clerk, Officer, Manager, AGM, DGM, GM, and CGM. B lives on an odd-numbered floor above floor 3. Only two persons live between B and the General Manager (GM).',
          options: [
            { key: 'A', text: 'One' },
            { key: 'B', text: 'Two' },
            { key: 'C', text: 'Three' },
            { key: 'D', text: 'Four' },
            { key: 'E', text: 'Five' }
          ],
          correctOptionKey: 'D',
          detailedSolution: 'GM (F) lives on Floor 6. E lives on Floor 1. Floors between them are 2, 3, 4, 5. Hence exactly four floors.',
          shortcutMethod: 'Direct difference: 6 - 1 - 1 = 4 floors.',
          difficulty: 'EASY',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          confidenceScore: 97,
          isApproved: false
        },
        {
          tempId: 'draft-3',
          questionNumber: 3,
          subject: 'QUANTITATIVE_APTITUDE',
          topic: 'Approximation',
          statement: 'What approximate value should come in place of the question mark (?):\n\n39.98% of 650.04 + 55.02% of 420.12 - 12.98^2 = ?',
          options: [
            { key: 'A', text: '322' },
            { key: 'B', text: '350' },
            { key: 'C', text: '375' },
            { key: 'D', text: '390' },
            { key: 'E', text: '410' }
          ],
          correctOptionKey: 'A',
          detailedSolution: 'Round off to integers: 40% of 650 + 55% of 420 - 13^2 = 260 + 231 - 169 = 491 - 169 = 322.',
          shortcutMethod: '40% of 650 = 260. 50% + 5% of 420 = 210 + 21 = 231. 260 + 231 - 169 = 322.',
          difficulty: 'EASY',
          positiveMarks: 1.0,
          negativeMarks: 0.25,
          confidenceScore: 99,
          isApproved: false
        }
      ];

      setExtractedDrafts(drafts);
      setSelectedDraftId(drafts[0].tempId);
    }, 1800);
  };

  const selectedDraft = extractedDrafts.find(d => d.tempId === selectedDraftId);

  // Approve single draft question
  const approveDraft = (tempId: string) => {
    setExtractedDrafts(prev => prev.map(d => d.tempId === tempId ? { ...d, isApproved: true } : d));
  };

  // Publish all approved questions into Question Bank
  const publishApprovedQuestions = () => {
    const approved = extractedDrafts.filter(d => d.isApproved);
    if (approved.length === 0) {
      alert('Please approve at least one question before publishing.');
      return;
    }

    const newQuestions: Question[] = approved.map(d => ({
      id: `q-pub-${Date.now()}-${d.questionNumber}`,
      questionNumber: bankQuestions.length + 1,
      subject: d.subject,
      topic: d.topic,
      type: 'MCQ_5_OPTION',
      statement: d.statement,
      options: d.options.map((opt, i) => ({ id: `opt-${i}`, key: opt.key, text: opt.text })),
      correctOptionKey: d.correctOptionKey,
      positiveMarks: d.positiveMarks,
      negativeMarks: d.negativeMarks,
      difficulty: d.difficulty,
      source: 'Admin PDF Extraction',
      year: 2024,
      group: d.groupPassage ? {
        id: `grp-${Date.now()}`,
        title: d.groupTitle || 'Extracted Common Information',
        type: 'PUZZLE',
        content: d.groupPassage
      } : undefined,
      solution: {
        stepByStep: [d.detailedSolution],
        shortcutMethod: d.shortcutMethod,
        isFacultyVerified: true,
        verifiedBy: 'Administrator / Verified Faculty'
      }
    }));

    setBankQuestions(prev => [...prev, ...newQuestions]);
    alert(`Successfully verified and published ${newQuestions.length} questions into the Centralized Question Bank!`);
    setActiveTab('QUESTION_BANK');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {/* Top Admin Header */}
      <header className="bg-[#1f3f6c] text-white px-6 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-400 text-slate-900 p-1.5 rounded-lg font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide flex items-center space-x-2">
              <span>Admin Examination Controller & Question Bank Studio</span>
            </h1>
            <p className="text-xs text-blue-200">
              Multi-Tenant Architecture | PDF Parser | Question Verification Engine
            </p>
          </div>
        </div>

        <button
          onClick={onBackToStudentView}
          className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center space-x-2"
        >
          <span>Exit to Student Examination Portal</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Admin Subnav */}
      <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center space-x-4 text-xs font-bold shadow-sm">
        <button
          onClick={() => setActiveTab('PDF_STUDIO')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition ${
            activeTab === 'PDF_STUDIO' ? 'bg-[#1f3f6c] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>PDF Question Extraction Studio</span>
        </button>

        <button
          onClick={() => setActiveTab('QUESTION_BANK')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition ${
            activeTab === 'QUESTION_BANK' ? 'bg-[#1f3f6c] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Centralized Question Bank ({bankQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EXAM_MANAGER')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition ${
            activeTab === 'EXAM_MANAGER' ? 'bg-[#1f3f6c] text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Mock Exam & Pattern Config</span>
        </button>
      </div>

      {/* TAB 1: PDF EXTRACTION STUDIO */}
      {activeTab === 'PDF_STUDIO' && (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Upload Dropzone */}
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors shadow-sm">
            <Upload className="w-12 h-12 mx-auto text-blue-600 mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              Upload Question Paper & Answer Key (PDF)
            </h3>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 mb-4">
              Upload scanned or text-based question papers from SBI PO, IBPS, RBI, or NABARD. The AI parser extracts statements, 5 options (A-E), reading passages, and grouped puzzles without data loss.
            </p>

            <div className="flex items-center justify-center space-x-4">
              <label className="bg-[#1f3f6c] hover:bg-[#163054] text-white font-bold text-xs px-5 py-2.5 rounded-lg cursor-pointer shadow transition flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Select PDF Question Paper</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
              </label>

              {/* Sample PDF Demo Trigger */}
              <button
                onClick={() => {
                  handlePdfUpload({ target: { files: [new File(['dummy'], 'SBI_PO_Prelims_Official_2023.pdf', { type: 'application/pdf' })] } } as any);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-300 transition flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Load Sample Banking Mock Paper</span>
              </button>
            </div>

            {uploadedFile && (
              <p className="text-xs text-emerald-700 font-semibold mt-3">
                Selected: {uploadedFile.name}
              </p>
            )}
          </div>

          {/* Processing Spinner */}
          {isProcessingPdf && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow text-center space-y-3">
              <RefreshCw className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
              <p className="font-bold text-slate-800 text-sm">Processing PDF with Intelligent Banking OCR Engine...</p>
              <p className="text-xs text-slate-500">Detecting grouped comprehension passages, mathematical equations, and 5-option patterns...</p>
            </div>
          )}

          {/* REVIEW SCREEN: Side-by-Side Review of Extracted Questions */}
          {extractedDrafts.length > 0 && !isProcessingPdf && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Review & Verification Queue ({extractedDrafts.length} Questions Extracted)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Rule 3 Enforcement: Never silently publish extracted questions. Verify statements, options, and group links before publishing.
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-300">
                    Confidence: {extractionConfidence}%
                  </span>

                  <button
                    onClick={publishApprovedQuestions}
                    className="bg-[#2e7d32] hover:bg-[#256628] text-white font-bold text-xs px-4 py-2 rounded-lg shadow transition flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Publish Approved to Question Bank</span>
                  </button>
                </div>
              </div>

              {/* Split Screen: Left List, Right Inspector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Queue List */}
                <div className="lg:col-span-5 space-y-3">
                  {extractedDrafts.map(d => (
                    <div
                      key={d.tempId}
                      onClick={() => setSelectedDraftId(d.tempId)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition bg-white shadow-sm ${
                        selectedDraftId === d.tempId
                          ? 'border-[#1f3f6c] ring-1 ring-[#1f3f6c]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                          Q.{d.questionNumber} ({d.subject})
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold">
                            {d.topic}
                          </span>
                          {d.isApproved ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center space-x-0.5">
                              <Check className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                              Pending Review
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-800 line-clamp-2">{d.statement}</p>
                    </div>
                  ))}
                </div>

                {/* Right Question Editor & Approver */}
                {selectedDraft && (
                  <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <h4 className="font-bold text-slate-800 text-sm">
                        Inspect & Edit Question #{selectedDraft.questionNumber}
                      </h4>
                      <button
                        onClick={() => approveDraft(selectedDraft.tempId)}
                        className={`text-xs font-bold px-3 py-1.5 rounded transition flex items-center space-x-1 ${
                          selectedDraft.isApproved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{selectedDraft.isApproved ? 'Approved ✓' : 'Approve Question'}</span>
                      </button>
                    </div>

                    {/* Shared Group info */}
                    {selectedDraft.groupPassage && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-1">
                        <span className="font-bold text-blue-900 block">
                          Grouped Context: {selectedDraft.groupTitle}
                        </span>
                        <p className="text-slate-700 whitespace-pre-line text-[11px] leading-relaxed">
                          {selectedDraft.groupPassage}
                        </p>
                      </div>
                    )}

                    {/* Question Statement */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Question Statement:</label>
                      <textarea
                        value={selectedDraft.statement}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExtractedDrafts(prev => prev.map(d => d.tempId === selectedDraft.tempId ? { ...d, statement: val } : d));
                        }}
                        rows={3}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    {/* 5 Options */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">5 Multiple Choice Options (A - E):</label>
                      <div className="space-y-2">
                        {selectedDraft.options.map((opt, i) => (
                          <div key={opt.key} className="flex items-center space-x-2 text-xs">
                            <span className={`w-6 h-6 flex items-center justify-center rounded font-bold ${
                              opt.key === selectedDraft.correctOptionKey ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {opt.key}
                            </span>
                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => {
                                const newOpts = [...selectedDraft.options];
                                newOpts[i].text = e.target.value;
                                setExtractedDrafts(prev => prev.map(d => d.tempId === selectedDraft.tempId ? { ...d, options: newOpts } : d));
                              }}
                              className="flex-1 p-2 border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 focus:outline-none text-xs"
                            />
                            <button
                              onClick={() => {
                                setExtractedDrafts(prev => prev.map(d => d.tempId === selectedDraft.tempId ? { ...d, correctOptionKey: opt.key } : d));
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-bold ${
                                opt.key === selectedDraft.correctOptionKey
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              }`}
                            >
                              {opt.key === selectedDraft.correctOptionKey ? 'Correct Key ✓' : 'Set as Key'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed Solution */}
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Explanation & Vedic/Shortcut Method:</label>
                      <textarea
                        value={selectedDraft.detailedSolution}
                        onChange={(e) => {
                          const val = e.target.value;
                          setExtractedDrafts(prev => prev.map(d => d.tempId === selectedDraft.tempId ? { ...d, detailedSolution: val } : d));
                        }}
                        rows={2}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTION BANK */}
      {activeTab === 'QUESTION_BANK' && (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Search & Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search banking questions by topic, statement, or exam..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <select
                value={selectedSubjectFilter}
                onChange={e => setSelectedSubjectFilter(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Subjects</option>
                <option value="QUANTITATIVE_APTITUDE">Quantitative Aptitude</option>
                <option value="REASONING_ABILITY">Reasoning Ability</option>
                <option value="ENGLISH_LANGUAGE">English Language</option>
                <option value="GENERAL_AWARENESS">General Awareness</option>
                <option value="COMPUTER_APTITUDE">Computer Aptitude</option>
              </select>

              <button
                onClick={() => {
                  const exportData = JSON.stringify(bankQuestions, null, 2);
                  const blob = new Blob([exportData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'banking_question_bank_export.json';
                  a.click();
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-lg border border-slate-300 flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Bulk Export (JSON)</span>
              </button>
            </div>
          </div>

          {/* Question Bank Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="min-w-full text-xs text-left divide-y divide-slate-200">
              <thead className="bg-[#1f3f6c] text-white">
                <tr>
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-4">Subject & Topic</th>
                  <th className="py-3 px-6">Question Statement</th>
                  <th className="py-3 px-3 text-center">Difficulty</th>
                  <th className="py-3 px-3 text-center">Correct Key</th>
                  <th className="py-3 px-3 text-center">Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bankQuestions
                  .filter(q => {
                    if (selectedSubjectFilter !== 'ALL' && q.subject !== selectedSubjectFilter) return false;
                    if (searchQuery && !q.statement.toLowerCase().includes(searchQuery.toLowerCase()) && !q.topic.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                    return true;
                  })
                  .map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-50 font-medium">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-2.5 px-4">
                        <span className="font-bold text-slate-800 block">{q.topic}</span>
                        <span className="text-[10px] text-slate-400">{q.subject}</span>
                      </td>
                      <td className="py-2.5 px-6 max-w-md">
                        <p className="line-clamp-2 text-slate-700 font-normal">{q.statement}</p>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                        ({q.correctOptionKey})
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="text-emerald-600 font-bold">✓ Verified</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXAM MANAGER */}
      {activeTab === 'EXAM_MANAGER' && (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Examination Notification & Pattern Manager</h3>
              <p className="text-xs text-slate-500">Configure sectional timing, negative marking, and cut-off benchmarks</p>
            </div>
            <button
              onClick={() => alert('New Exam Pattern Creator modal ready!')}
              className="bg-[#1f3f6c] hover:bg-[#163054] text-white font-bold text-xs px-4 py-2 rounded-lg shadow flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Banking Mock Exam</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleExams.map(ex => (
              <div key={ex.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {ex.category} - {ex.subCategory}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">Active Status</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{ex.title}</h4>
                <p className="text-xs text-slate-600">{ex.description}</p>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Duration:</span>
                    <strong className="text-slate-800">{ex.durationMinutes} Mins</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Marks:</span>
                    <strong className="text-slate-800">{ex.totalMarks} Marks</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Sectional Timing:</span>
                    <strong className="text-emerald-700">{ex.hasSectionalTiming ? 'Strict 20m' : 'Free'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
