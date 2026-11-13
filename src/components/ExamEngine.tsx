import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, AlertTriangle, CheckCircle, HelpCircle, Eye, 
  RotateCcw, Bookmark, ChevronLeft, ChevronRight, FileText, 
  Info, Maximize2, ShieldAlert, Check, X, Award, Pause, Play,
  ZoomIn, ZoomOut, Image as ImageIcon
} from 'lucide-react';
import { 
  Exam, Question, QuestionStatus, StudentResponse, 
  SecurityViolation, ExamResult, SubjectCode, PausedExamSession 
} from '../types';

interface ExamEngineProps {
  exam: Exam;
  candidateName?: string;
  rollNumber?: string;
  customDurationMinutes?: number;
  initialSession?: PausedExamSession | null;
  onPauseExam: (session: PausedExamSession) => void;
  onSubmitExam: (result: ExamResult, responses: Record<string, StudentResponse>) => void;
  onExitExam: () => void;
}

export const ExamEngine: React.FC<ExamEngineProps> = ({
  exam,
  candidateName = 'Vicky Kumar',
  rollNumber = '240189021',
  customDurationMinutes,
  initialSession,
  onPauseExam,
  onSubmitExam,
  onExitExam
}) => {
  // 1. Flatten or locate current section & question
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(() => {
    return initialSession ? (initialSession.currentSectionIndex || 0) : 0;
  });
  const currentSection = exam.sections[currentSectionIndex] || exam.sections[0];
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    return initialSession ? (initialSession.currentQuestionIndex || 0) : 0;
  });
  const currentQuestion: Question | undefined = currentSection.questions[currentQuestionIndex];

  // 2. Server-Authoritative Timing State
  // Custom manual duration preset (5, 10, 15, 20, 25, 30, 35) or standard
  const initialDurationSeconds = customDurationMinutes 
    ? customDurationMinutes * 60 
    : (exam.hasSectionalTiming ? currentSection.durationMinutes * 60 : exam.durationMinutes * 60);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (initialSession && typeof initialSession.remainingSeconds === 'number' && initialSession.remainingSeconds > 0) {
      return initialSession.remainingSeconds;
    }
    return initialDurationSeconds;
  });
  const [timeWarning, setTimeWarning] = useState<string | null>(null);

  // 3. Question Responses State: { [qId]: StudentResponse }
  const [responses, setResponses] = useState<Record<string, StudentResponse>>(() => {
    if (initialSession && initialSession.responses) {
      return initialSession.responses;
    }
    // Try restoring from localStorage if candidate refreshed the browser
    const saved = localStorage.getItem(`exam_attempt_${exam.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved responses', e);
      }
    }
    const initial: Record<string, StudentResponse> = {};
    exam.sections.forEach(sec => {
      sec.questions.forEach((q, idx) => {
        initial[q.id] = {
          questionId: q.id,
          selectedOptionKey: null,
          status: idx === 0 && sec.order === 1 ? 'NOT_ANSWERED' : 'NOT_VISITED',
          timeSpentSeconds: 0
        };
      });
    });
    return initial;
  });

  // 4. Security Violations
  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const [showViolationBanner, setShowViolationBanner] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const wasFullscreenRef = useRef<boolean>(false);

  // Automatically activate fullscreen mode by default when exam starts
  useEffect(() => {
    const enterFullscreen = () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };
    enterFullscreen();

    // Browser user-gesture fallback: trigger on very first interaction if browser blocked auto-request
    window.addEventListener('click', enterFullscreen, { once: true });
    window.addEventListener('keydown', enterFullscreen, { once: true });
    return () => {
      window.removeEventListener('click', enterFullscreen);
      window.removeEventListener('keydown', enterFullscreen);
    };
  }, []);

  // 5. Modals (Instructions, Question Paper, Submit Confirm, Pause)
  const [showInstructionsModal, setShowInstructionsModal] = useState<boolean>(false);
  const [showQuestionPaperModal, setShowQuestionPaperModal] = useState<boolean>(false);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English');

  // 6. Image Lightbox / Zoom Modal State
  const [enlargedImage, setEnlargedImage] = useState<{ url: string; title?: string; caption?: string } | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const handleConfirmPause = () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch (e) {}

    const allQuestions = exam.sections.flatMap(s => s.questions);
    const attemptedCount = Object.values(responses).filter(r => r.selectedOptionKey !== null).length;

    const pausedSession: PausedExamSession = {
      examId: exam.id,
      examTitle: exam.title,
      exam,
      remainingSeconds,
      totalDurationSeconds: customDurationMinutes ? customDurationMinutes * 60 : exam.durationMinutes * 60,
      responses,
      visitedQuestionIds: Object.keys(responses).filter(id => responses[id].status !== 'NOT_VISITED'),
      markedForReviewIds: Object.keys(responses).filter(id => responses[id].status === 'MARKED_FOR_REVIEW' || responses[id].status === 'ANSWERED_AND_MARKED'),
      currentSectionIndex,
      currentQuestionIndex,
      attemptedCount,
      totalQuestions: allQuestions.length,
      pausedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    localStorage.setItem('parikshabank_paused_session', JSON.stringify(pausedSession));
    setShowPauseModal(false);
    onPauseExam(pausedSession);
  };

  // Question timing tracker
  const questionStartTimeRef = useRef<number>(Date.now());

  // Save responses to localStorage on change
  useEffect(() => {
    localStorage.setItem(`exam_attempt_${exam.id}`, JSON.stringify(responses));
  }, [responses, exam.id]);

  // Handle Question status transition when candidate lands on a question
  useEffect(() => {
    if (!currentQuestion) return;
    questionStartTimeRef.current = Date.now();
    setResponses(prev => {
      const existing = prev[currentQuestion.id];
      if (!existing || existing.status === 'NOT_VISITED') {
        return {
          ...prev,
          [currentQuestion.id]: {
            ...existing,
            questionId: currentQuestion.id,
            status: 'NOT_ANSWERED',
            selectedOptionKey: existing?.selectedOptionKey || null,
            timeSpentSeconds: existing?.timeSpentSeconds || 0
          }
        };
      }
      return prev;
    });
  }, [currentQuestion?.id]);

  // Server-Authoritative Countdown Timer
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          // Auto submit or move to next section
          handleTimeExpire();
          return 0;
        }

        // Warning alerts at 15m, 5m, 1m
        if (prev === 15 * 60) setTimeWarning('15 Minutes Remaining!');
        else if (prev === 5 * 60) setTimeWarning('5 Minutes Remaining! Review your answers.');
        else if (prev === 60) setTimeWarning('1 Minute Remaining! Exam will auto-submit.');

        return prev - 1;
      });

      // Increment time spent on active question
      if (currentQuestion) {
        setResponses(prev => {
          const curr = prev[currentQuestion.id];
          if (!curr) return prev;
          return {
            ...prev,
            [currentQuestion.id]: {
              ...curr,
              timeSpentSeconds: (curr.timeSpentSeconds || 0) + 1
            }
          };
        });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentQuestionIndex, currentSectionIndex]);

  // Section time expiration handler
  const handleTimeExpire = () => {
    if (exam.hasSectionalTiming && currentSectionIndex < exam.sections.length - 1) {
      alert(`Section "${currentSection.title}" time has expired! Moving automatically to the next section.`);
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setCurrentQuestionIndex(0);
      setRemainingSeconds(exam.sections[nextIndex].durationMinutes * 60);
    } else {
      alert('Examination time is over! Your answers are being submitted automatically.');
      finalizeAndSubmit();
    }
  };

  // Best-effort browser security enforcement
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('TAB_SWITCH', 'Candidate switched browser tab or minimized window.');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('FOCUS_LOST', 'Candidate shifted focus away from examination window.');
    };

    const handleFullscreenChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active && wasFullscreenRef.current) {
        recordViolation('FULLSCREEN_EXIT', 'Candidate exited full-screen mode.');
      }
      if (active) {
        wasFullscreenRef.current = true;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      recordViolation('RIGHT_CLICK_ATTEMPT', 'Right click is disabled during examination.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [violations.length]);

  const recordViolation = (type: SecurityViolation['type'], message: string) => {
    const violation: SecurityViolation = {
      id: `viol-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setViolations(prev => [...prev, violation]);
    setShowViolationBanner(true);
    setTimeout(() => setShowViolationBanner(false), 5000);
  };

  const requestFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed', err);
      });
    }
  };

  // Format HH:MM:SS
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Format MM:SS for individual question auto timer
  const formatQuestionTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Option Selection
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOptionKey: key
      }
    }));
  };

  // Button: Save & Next
  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const currentResp = responses[currentQuestion.id];
    const isAnswered = currentResp?.selectedOptionKey !== null;

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        status: isAnswered ? 'ANSWERED' : 'NOT_ANSWERED'
      }
    }));

    moveToNextQuestion();
  };

  // Button: Mark for Review & Next
  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const currentResp = responses[currentQuestion.id];
    const hasAnswer = currentResp?.selectedOptionKey !== null;

    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        status: hasAnswer ? 'ANSWERED_AND_MARKED' : 'MARKED_FOR_REVIEW'
      }
    }));

    moveToNextQuestion();
  };

  // Button: Clear Response
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        selectedOptionKey: null,
        status: 'NOT_ANSWERED'
      }
    }));
  };

  const moveToNextQuestion = () => {
    if (currentQuestionIndex < currentSection.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (!exam.hasSectionalTiming && currentSectionIndex < exam.sections.length - 1) {
      // If sectional switching is allowed and at end of section
      setCurrentSectionIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const moveToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Switch to specific question from palette
  const jumpToQuestion = (qIndex: number) => {
    setCurrentQuestionIndex(qIndex);
  };

  // Switch section (if allowed)
  const handleSectionSwitch = (secIndex: number) => {
    if (exam.hasSectionalTiming && !exam.allowSectionSwitching) {
      alert('Sectional timing is enforced. You cannot manually switch sections in this examination.');
      return;
    }
    setCurrentSectionIndex(secIndex);
    setCurrentQuestionIndex(0);
  };

  // Calculate live question status counts
  const calculateStats = () => {
    let answered = 0;
    let notAnswered = 0;
    let notVisited = 0;
    let marked = 0;
    let answeredMarked = 0;

    currentSection.questions.forEach(q => {
      const resp = responses[q.id];
      if (!resp || resp.status === 'NOT_VISITED') notVisited++;
      else if (resp.status === 'ANSWERED') answered++;
      else if (resp.status === 'NOT_ANSWERED') notAnswered++;
      else if (resp.status === 'MARKED_FOR_REVIEW') marked++;
      else if (resp.status === 'ANSWERED_AND_MARKED') answeredMarked++;
    });

    return { answered, notAnswered, notVisited, marked, answeredMarked };
  };

  const sectionStats = calculateStats();

  // Final Exam Evaluation & Result generation
  const finalizeAndSubmit = () => {
    localStorage.removeItem(`exam_attempt_${exam.id}`);

    let totalMarksScored = 0;
    let totalQuestions = 0;
    let attemptedQuestions = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let skippedQuestions = 0;

    const sectionalPerformance = exam.sections.map(sec => {
      let secMarks = 0;
      let secAttempted = 0;
      let secCorrect = 0;
      let secIncorrect = 0;
      let secTime = 0;

      sec.questions.forEach(q => {
        totalQuestions++;
        const resp = responses[q.id];
        const hasChoice = resp && resp.selectedOptionKey !== null;

        if (hasChoice) {
          attemptedQuestions++;
          secAttempted++;
          secTime += resp.timeSpentSeconds || 0;

          if (resp.selectedOptionKey === q.correctOptionKey) {
            correctAnswers++;
            secCorrect++;
            secMarks += q.positiveMarks;
            totalMarksScored += q.positiveMarks;
          } else {
            incorrectAnswers++;
            secIncorrect++;
            secMarks -= q.negativeMarks;
            totalMarksScored -= q.negativeMarks;
          }
        } else {
          skippedQuestions++;
        }
      });

      const accuracy = secAttempted > 0 ? (secCorrect / secAttempted) * 100 : 0;
      return {
        sectionName: sec.title,
        subject: sec.subject,
        marksScored: Math.max(0, Number(secMarks.toFixed(2))),
        totalMarks: sec.questions.length * sec.positiveMarksPerQuestion,
        attempted: secAttempted,
        correct: secCorrect,
        incorrect: secIncorrect,
        accuracy: Number(accuracy.toFixed(1)),
        timeSpentSeconds: secTime,
        clearedCutoff: secMarks >= sec.sectionalQualifyingMarks,
        cutoff: sec.sectionalQualifyingMarks
      };
    });

    const netScore = Math.max(0, Number(totalMarksScored.toFixed(2)));
    const overallAccuracy = attemptedQuestions > 0 ? (correctAnswers / attemptedQuestions) * 100 : 0;

    // Dynamically calculate topic breakdown from actual questions
    const topicMap: Record<string, { subject: SubjectCode; total: number; correct: number; time: number }> = {};
    exam.sections.forEach(sec => {
      sec.questions.forEach(q => {
        if (!topicMap[q.topic]) {
          topicMap[q.topic] = { subject: q.subject, total: 0, correct: 0, time: 0 };
        }
        topicMap[q.topic].total++;
        const resp = responses[q.id];
        if (resp && resp.selectedOptionKey === q.correctOptionKey) {
          topicMap[q.topic].correct++;
        }
        if (resp) {
          topicMap[q.topic].time += resp.timeSpentSeconds || 0;
        }
      });
    });

    const topicBreakdown = Object.entries(topicMap).map(([topic, stats]) => {
      const acc = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      return {
        topic,
        subject: stats.subject,
        totalQuestions: stats.total,
        correct: stats.correct,
        accuracy: Number(acc.toFixed(1)),
        avgTimePerQuestion: Math.round(stats.time / Math.max(1, stats.total)),
        status: (acc >= 80 ? 'STRONG' : acc >= 50 ? 'AVERAGE' : 'WEAK') as 'STRONG' | 'AVERAGE' | 'WEAK'
      };
    });

    const result: ExamResult = {
      attemptId: `att-${Date.now()}`,
      totalMarksScored: netScore,
      maxMarks: exam.totalMarks,
      totalQuestions,
      attemptedQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      accuracyPercentage: Number(overallAccuracy.toFixed(1)),
      totalTimeSeconds: exam.durationMinutes * 60 - remainingSeconds,
      sectionalPerformance,
      topicBreakdown,
      speedAccuracyMatrix: {
        fastAndAccurate: correctAnswers,
        slowAndAccurate: Math.max(0, correctAnswers > 2 ? 1 : 0),
        fastAndInaccurate: incorrectAnswers,
        slowAndInaccurate: 0
      },
      personalizedRecommendations: [
        'Review the detailed solution key for any questions answered incorrectly or left unattempted.',
        'Study Vedic shortcuts and case deduction tables to increase speed on reasoning and arithmetic.',
        'Consistently maintain >85% accuracy to avoid negative mark deductions.'
      ]
    };

    onSubmitExam(result, responses);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden text-slate-800 select-none">
      {/* 1. TOP EXAMINATION HEADER (TCS iON / IBPS Inspired) */}
      <header className="bg-[#32588e] text-white px-4 py-2 flex items-center justify-between shadow-md border-b-2 border-[#1f3f6c] z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-white/10 p-1.5 rounded">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base leading-tight tracking-wide">{exam.title}</h1>
            <p className="text-xs text-blue-200">Test Code: {exam.code} | IBPS / SBI Standard Exam Engine</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language selector */}
          <div className="hidden sm:flex items-center space-x-1 text-xs bg-[#244572] px-2 py-1 rounded border border-blue-400/30">
            <span className="text-blue-200">View In:</span>
            <select 
              value={language} 
              onChange={e => setLanguage(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="English" className="text-slate-800">English</option>
              <option value="Hindi" className="text-slate-800">Hindi</option>
            </select>
          </div>

          {/* Fullscreen Button */}
          {!isFullscreen && (
            <button
              onClick={requestFullscreen}
              className="hidden md:flex items-center space-x-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-2 py-1 rounded transition shadow"
              title="Full screen mode is recommended for exams"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          )}

          {/* Pause Button */}
          <button
            onClick={() => setShowPauseModal(true)}
            className="flex items-center space-x-1.5 text-xs bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded transition shadow cursor-pointer active:scale-95"
            title="Pause exam & return to homepage anytime"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>Pause</span>
          </button>

          {/* Server Countdown Timer */}
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-amber-400/40 shadow-inner">
            <Clock className={`w-4 h-4 ${remainingSeconds < 300 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider block text-slate-400 leading-none">Time Left</span>
              <span className={`font-mono text-base font-extrabold tracking-wider ${remainingSeconds < 300 ? 'text-red-400' : 'text-amber-300'}`}>
                {formatTime(remainingSeconds)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Security Violation Alert Toast */}
      {showViolationBanner && (
        <div className="bg-red-600 text-white px-4 py-1.5 text-xs flex items-center justify-between font-semibold shadow animate-bounce">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-white" />
            <span>Warning: Examination Security Alert ({violations[violations.length - 1]?.message}). Violation logged.</span>
          </div>
          <span>Violations: {violations.length}</span>
        </div>
      )}

      {/* Time Warning Toast */}
      {timeWarning && (
        <div className="bg-amber-500 text-slate-900 px-4 py-1 text-xs font-bold flex items-center justify-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{timeWarning}</span>
          <button onClick={() => setTimeWarning(null)} className="ml-2 underline text-[11px]">Dismiss</button>
        </div>
      )}

      {/* 2. SECTION TABS BAR */}
      <div className="bg-[#e9f0f8] px-4 py-1.5 border-b border-slate-300 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="font-bold text-slate-700 mr-1 uppercase tracking-wider text-[11px]">Sections:</span>
          {exam.sections.map((sec, idx) => {
            const isActive = idx === currentSectionIndex;
            return (
              <button
                key={sec.id}
                onClick={() => handleSectionSwitch(idx)}
                className={`px-3 py-1 font-bold rounded-t-sm transition-all border-b-2 flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-[#32588e] text-white border-[#1f3f6c] shadow'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border-transparent'
                }`}
              >
                <span>{sec.title}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-normal ${isActive ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  {sec.questions.length} Qs
                </span>
              </button>
            );
          })}
        </div>

        {/* Action helper buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowQuestionPaperModal(true)}
            className="flex items-center space-x-1 text-slate-700 hover:text-blue-800 bg-white border border-slate-300 px-2 py-1 rounded shadow-sm hover:bg-slate-50 transition"
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-semibold">Question Paper</span>
          </button>

          <button
            onClick={() => setShowInstructionsModal(true)}
            className="flex items-center space-x-1 text-slate-700 hover:text-blue-800 bg-white border border-slate-300 px-2 py-1 rounded shadow-sm hover:bg-slate-50 transition"
          >
            <Info className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-semibold">Instructions</span>
          </button>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: Question Pane (Left/Center) + Candidate Palette (Right) */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT/CENTER QUESTION DISPLAY AREA */}
        <div className="flex-1 min-h-0 h-full flex flex-col bg-white overflow-hidden border-r border-slate-300">
          {/* Question Sub-header with Small Auto Timer */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-slate-800 text-sm">
                Question No. {currentQuestion ? currentQuestion.questionNumber : 1}
              </span>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-medium">
                {currentQuestion?.topic || 'Quantitative Aptitude'}
              </span>
            </div>

            {/* Small Auto Question Timer */}
            {(() => {
              const qTime = responses[currentQuestion?.id || '']?.timeSpentSeconds || 0;
              const isPaceGood = qTime < 60;
              const isPaceModerate = qTime >= 60 && qTime < 90;
              const isPaceHigh = qTime >= 90;

              return (
                <div 
                  className={`flex items-center space-x-1.5 px-3 py-1 rounded-full font-mono text-xs font-bold border transition-all shadow-sm ${
                    isPaceGood
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : isPaceModerate
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-red-50 text-red-900 border-red-300 animate-pulse'
                  }`}
                  title={`Auto Timer for Question ${currentQuestion?.questionNumber || 1}. Target: ≤60s.`}
                >
                  <Clock className={`w-3.5 h-3.5 ${
                    isPaceHigh ? 'text-red-600' : isPaceModerate ? 'text-amber-600' : 'text-emerald-600'
                  }`} />
                  <span className="text-[11px] font-sans font-semibold text-slate-500">Q-Time:</span>
                  <span className="tracking-wider text-sm font-bold">{formatQuestionTime(qTime)}</span>
                  {isPaceHigh ? (
                    <span className="text-[10px] font-sans font-bold bg-red-200 text-red-900 px-1.5 py-0.2 rounded ml-1">
                      Pace Alert
                    </span>
                  ) : isPaceGood ? (
                    <span className="text-[10px] font-sans text-emerald-700 ml-1 hidden sm:inline font-normal">
                      (≤60s target)
                    </span>
                  ) : null}
                </div>
              );
            })()}

            <div className="flex items-center space-x-3 text-slate-600 font-semibold">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Marking: +{currentQuestion?.positiveMarks || 1.0}
              </span>
              <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Negative: -{currentQuestion?.negativeMarks || 0.25}
              </span>
            </div>
          </div>

          {/* Question Content Area (Scrollable with Side-by-Side Split View for Group/Passage questions) */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {currentQuestion ? (
              currentQuestion.group ? (
                /* SIDE-BY-SIDE SPLIT VIEW: DIRECTIONS & QUESTIONS/OPTIONS */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* LEFT PANE: DIRECTIONS / PASSAGE / CONTEXT (5 OF 12 COLS) */}
                  <div className="lg:col-span-5 bg-blue-50/80 border border-blue-200 rounded-lg p-4 shadow-xs flex flex-col lg:max-h-[calc(100vh-230px)] lg:sticky lg:top-0">
                    <div className="flex items-center justify-between text-blue-900 font-bold pb-2.5 mb-2.5 border-b border-blue-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-700" />
                        <span className="text-sm">{currentQuestion.group.title}</span>
                      </div>
                      <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold border border-blue-200">
                        Directions / Context
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-xs md:text-sm text-slate-800 font-sans">
                      {currentQuestion.group.content.split(/\n\s*\n+/).map((para, pIdx) => {
                        const hasListOrCode = para.includes('\n') && (/^\"[^\"]+\"\s+is\s+written/m.test(para) || /^[I|V|X]+[\.\)]/m.test(para));
                        return (
                          <p key={pIdx} className={`leading-relaxed mb-3 last:mb-0 ${hasListOrCode ? 'whitespace-pre-line' : ''}`}>
                            {hasListOrCode ? para.trim() : para.trim().replace(/\s*\n\s*/g, ' ')}
                          </p>
                        );
                      })}

                      {/* Data Interpretation Visual Image / Chart if present */}
                      {currentQuestion.group.imageUrl && (
                        <div className="my-3 rounded-lg border border-blue-200 bg-white p-2.5 shadow-xs">
                          <div 
                            className="relative group cursor-pointer overflow-hidden rounded"
                            onClick={() => {
                              setEnlargedImage({
                                url: currentQuestion.group!.imageUrl!,
                                title: currentQuestion.group!.title,
                                caption: currentQuestion.group!.imageCaption
                              });
                              setZoomLevel(1);
                            }}
                            title="Click to view chart in full screen"
                          >
                            <img 
                              src={currentQuestion.group.imageUrl} 
                              alt={currentQuestion.group.title || 'Data Interpretation Diagram'} 
                              className="w-full max-h-72 object-contain rounded mx-auto transition-transform duration-200 group-hover:scale-[1.01]" 
                            />
                            <div className="absolute inset-0 bg-blue-900/15 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                              <span className="bg-slate-900/85 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md">
                                <ZoomIn className="w-3.5 h-3.5" />
                                <span>Click to Enlarge Chart</span>
                              </span>
                            </div>
                          </div>
                          {currentQuestion.group.imageCaption && (
                            <p className="text-[11px] text-center text-slate-500 font-medium mt-1.5 italic">
                              {currentQuestion.group.imageCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Data Interpretation Structured Table Rendering if present */}
                      {currentQuestion.group.tableData && (
                        <div className="overflow-x-auto border border-blue-200 rounded bg-white shadow-inner my-2">
                          <table className="min-w-full text-xs text-left">
                            <thead className="bg-[#32588e] text-white">
                              <tr>
                                {Object.keys(currentQuestion.group.tableData[0]).map((key) => (
                                  <th key={key} className="py-2 px-3 font-semibold border-b border-blue-200">
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                              {currentQuestion.group.tableData.map((row, rIdx) => (
                                <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                  {Object.values(row).map((val, cIdx) => (
                                    <td key={cIdx} className="py-1.5 px-3 font-medium text-slate-700">
                                      {typeof val === 'number' ? val.toLocaleString('en-IN') : val}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANE: QUESTION STATEMENT & OPTIONS (7 OF 12 COLS) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* QUESTION STATEMENT */}
                    <div className="text-sm md:text-base font-semibold text-slate-900 leading-normal p-3.5 bg-slate-50 border border-slate-200 rounded-lg shadow-xs">
                      {currentQuestion.statement.includes('\n') && (/^(?:Statements?|Conclusions?|Given|Note|[I|V|X]+[\.\)]|\d+[\.\)])/m.test(currentQuestion.statement)) ? (
                        <p className="whitespace-pre-line font-sans leading-relaxed">{currentQuestion.statement}</p>
                      ) : (
                        <p className="font-sans leading-relaxed">{currentQuestion.statement.replace(/\s+/g, ' ')}</p>
                      )}
                    </div>

                    {/* Question Specific Image / Diagram if present */}
                    {currentQuestion.imageUrl && (
                      <div className="my-2.5 rounded-lg border border-slate-200 bg-white p-2.5 shadow-xs">
                        <div 
                          className="relative group cursor-pointer overflow-hidden rounded"
                          onClick={() => {
                            setEnlargedImage({
                              url: currentQuestion.imageUrl!,
                              title: `Question ${currentQuestion.questionNumber}`,
                              caption: currentQuestion.imageCaption
                            });
                            setZoomLevel(1);
                          }}
                          title="Click to view diagram in full screen"
                        >
                          <img 
                            src={currentQuestion.imageUrl} 
                            alt={`Question ${currentQuestion.questionNumber} Diagram`} 
                            className="w-full max-h-64 object-contain rounded mx-auto transition-transform duration-200 group-hover:scale-[1.01]" 
                          />
                          <div className="absolute inset-0 bg-slate-900/15 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                            <span className="bg-slate-900/85 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md">
                              <ZoomIn className="w-3.5 h-3.5" />
                              <span>Click to Enlarge</span>
                            </span>
                          </div>
                        </div>
                        {currentQuestion.imageCaption && (
                          <p className="text-[11px] text-center text-slate-500 font-medium mt-1.5 italic">
                            {currentQuestion.imageCaption}
                          </p>
                        )}
                      </div>
                    )}

                    {/* 5 OPTIONS (A, B, C, D, E) */}
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select One Option:</p>
                      {currentQuestion.options.map((opt) => {
                        const isSelected = responses[currentQuestion.id]?.selectedOptionKey === opt.key;
                        return (
                          <label
                            key={opt.id}
                            onClick={() => handleSelectOption(opt.key)}
                            className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-blue-50/80 border-[#32588e] shadow-sm text-blue-900 font-medium'
                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center h-5 mr-3">
                              <input
                                type="radio"
                                name={`question-${currentQuestion.id}`}
                                checked={isSelected}
                                onChange={() => handleSelectOption(opt.key)}
                                className="w-4 h-4 text-[#32588e] border-slate-300 focus:ring-blue-500 cursor-pointer"
                              />
                            </div>
                            <div className="flex items-baseline space-x-2 text-sm leading-relaxed">
                              <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                                isSelected ? 'bg-[#32588e] text-white' : 'bg-slate-200 text-slate-700'
                              }`}>
                                {opt.key}
                              </span>
                              <span className="font-normal">{opt.text}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* STANDALONE QUESTION: STANDARD FULL-WIDTH SINGLE COLUMN */
                <div className="max-w-4xl space-y-4">
                  {/* QUESTION STATEMENT */}
                  <div className="text-sm md:text-base font-semibold text-slate-900 leading-normal pb-2 border-b border-slate-100">
                    {currentQuestion.statement.includes('\n') && (/^(?:Statements?|Conclusions?|Given|Note|[I|V|X]+[\.\)]|\d+[\.\)])/m.test(currentQuestion.statement)) ? (
                      <p className="whitespace-pre-line font-sans leading-relaxed">{currentQuestion.statement}</p>
                    ) : (
                      <p className="font-sans leading-relaxed">{currentQuestion.statement.replace(/\s+/g, ' ')}</p>
                    )}
                  </div>

                  {/* Question Image / Diagram for Standalone Questions */}
                  {currentQuestion.imageUrl && (
                    <div className="my-2.5 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                      <div 
                        className="relative group cursor-pointer overflow-hidden rounded"
                        onClick={() => {
                          setEnlargedImage({
                            url: currentQuestion.imageUrl!,
                            title: `Question ${currentQuestion.questionNumber}`,
                            caption: currentQuestion.imageCaption
                          });
                          setZoomLevel(1);
                        }}
                        title="Click to view diagram in full screen"
                      >
                        <img 
                          src={currentQuestion.imageUrl} 
                          alt={`Question ${currentQuestion.questionNumber} Diagram`} 
                          className="w-full max-h-80 object-contain rounded mx-auto transition-transform duration-200 group-hover:scale-[1.01]" 
                        />
                        <div className="absolute inset-0 bg-slate-900/15 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <span className="bg-slate-900/85 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md">
                            <ZoomIn className="w-3.5 h-3.5" />
                            <span>Click to Enlarge</span>
                          </span>
                        </div>
                      </div>
                      {currentQuestion.imageCaption && (
                        <p className="text-[11px] text-center text-slate-500 font-medium mt-1.5 italic">
                          {currentQuestion.imageCaption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 5 OPTIONS (A, B, C, D, E) */}
                  <div className="space-y-2.5 pt-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select One Option:</p>
                    {currentQuestion.options.map((opt) => {
                      const isSelected = responses[currentQuestion.id]?.selectedOptionKey === opt.key;
                      return (
                        <label
                          key={opt.id}
                          onClick={() => handleSelectOption(opt.key)}
                          className={`flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-blue-50/80 border-[#32588e] shadow-sm text-blue-900'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center h-5 mr-3">
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              checked={isSelected}
                              onChange={() => handleSelectOption(opt.key)}
                              className="w-4 h-4 text-[#32588e] border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </div>
                          <div className="flex items-baseline space-x-2 text-sm leading-relaxed">
                            <span className={`font-bold px-1.5 py-0.5 rounded text-xs ${
                              isSelected ? 'bg-[#32588e] text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {opt.key}
                            </span>
                            <span className="font-normal">{opt.text}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-12 text-slate-500">
                <HelpCircle className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                <p>No questions found in this section.</p>
              </div>
            )}
          </div>

          {/* BOTTOM ACTION BUTTONS BAR (Matches IBPS Footer) */}
          <div className="bg-slate-100 border-t border-slate-300 px-4 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMarkForReviewAndNext}
                className="bg-[#673ab7] hover:bg-[#5e35b1] text-white font-semibold px-3 py-2 rounded shadow transition flex items-center space-x-1"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Mark for Review & Next</span>
              </button>

              <button
                onClick={handleClearResponse}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-2 rounded shadow-sm transition flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Response</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={moveToPrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-3 py-2 rounded shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                className="bg-[#2e7d32] hover:bg-[#256628] text-white font-bold px-4 py-2 rounded shadow transition flex items-center space-x-1"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT QUESTION PALETTE (MINIMAL CLEAN UI) */}
        <div className="w-full md:w-80 lg:w-96 bg-[#f0f4f8] flex flex-col border-l border-slate-300 overflow-y-auto">
          {/* OFFICIAL 5-STATE QUESTION LEGEND */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-[11px] space-y-2">
            <p className="font-bold text-slate-700 text-xs mb-1">Question Status Legend</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white text-xs rounded bg-[#27ae60] shadow-sm">
                  {sectionStats.answered}
                </span>
                <span className="text-slate-700">Answered</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white text-xs rounded bg-[#e74c3c] shadow-sm">
                  {sectionStats.notAnswered}
                </span>
                <span className="text-slate-700">Not Answered</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-slate-700 text-xs rounded bg-[#e2e8f0] border border-slate-300">
                  {sectionStats.notVisited}
                </span>
                <span className="text-slate-700">Not Visited</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white text-xs rounded-full bg-[#8e44ad] shadow-sm">
                  {sectionStats.marked}
                </span>
                <span className="text-slate-700 leading-tight">Marked for Review</span>
              </div>
            </div>

            {/* State 5: Answered and Marked for review */}
            <div className="flex items-center space-x-2 pt-1 border-t border-slate-200">
              <div className="relative">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white text-xs rounded-full bg-[#8e44ad] shadow-sm">
                  {sectionStats.answeredMarked}
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2ecc71] border border-white rounded-full"></span>
              </div>
              <span className="text-slate-700 text-[10px] leading-tight">
                Answered & Marked for Review <span className="text-emerald-700 font-semibold">(Will be evaluated)</span>
              </span>
            </div>
          </div>

          {/* PALETTE SECTION TITLE */}
          <div className="bg-[#32588e] text-white px-3 py-1.5 text-xs font-bold flex items-center justify-between">
            <span>SECTION: {currentSection.title.toUpperCase()}</span>
            <span className="text-[11px] font-normal">{currentSection.questions.length} Questions</span>
          </div>

          {/* INTERACTIVE QUESTION NUMBER BUTTONS GRID */}
          <div className="flex-1 p-3 overflow-y-auto">
            <div className="grid grid-cols-5 gap-2">
              {currentSection.questions.map((q, idx) => {
                const resp = responses[q.id];
                const status: QuestionStatus = resp ? resp.status : 'NOT_VISITED';
                const isCurrent = idx === currentQuestionIndex;

                let badgeStyle = 'bg-[#e2e8f0] text-slate-700 hover:bg-slate-300';
                if (status === 'ANSWERED') badgeStyle = 'bg-[#27ae60] text-white font-bold shadow';
                else if (status === 'NOT_ANSWERED') badgeStyle = 'bg-[#e74c3c] text-white font-bold shadow';
                else if (status === 'MARKED_FOR_REVIEW') badgeStyle = 'bg-[#8e44ad] text-white font-bold rounded-full shadow';
                else if (status === 'ANSWERED_AND_MARKED') badgeStyle = 'bg-[#8e44ad] text-white font-bold rounded-full relative shadow';

                return (
                  <button
                    key={q.id}
                    onClick={() => jumpToQuestion(idx)}
                    className={`h-9 text-xs font-semibold flex items-center justify-center transition-all ${badgeStyle} ${
                      isCurrent ? 'ring-2 ring-blue-600 ring-offset-2 scale-105 z-10' : ''
                    } rounded`}
                    title={`Question ${q.questionNumber}: ${status}`}
                  >
                    <span>{q.questionNumber}</span>
                    {status === 'ANSWERED_AND_MARKED' && (
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-[#2ecc71] rounded-full border border-white"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FINAL SUBMIT BUTTON */}
          <div className="p-3 bg-white border-t border-slate-300">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full bg-[#1976d2] hover:bg-[#1565c0] text-white font-bold py-2.5 px-4 rounded shadow-md transition flex items-center justify-center space-x-2 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Examination</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL: SUBMISSION CONFIRMATION & SUMMARY */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#32588e] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Examination Summary & Submission</span>
              </h3>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-600">
                Please verify your section-wise attempt statistics before submitting your test. Once submitted, you cannot resume or alter your responses.
              </p>

              {/* Summary Table */}
              <div className="border border-slate-200 rounded overflow-hidden">
                <table className="min-w-full text-xs text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Section Name</th>
                      <th className="py-2 px-3 text-center">Total Qs</th>
                      <th className="py-2 px-3 text-center text-emerald-700">Answered</th>
                      <th className="py-2 px-3 text-center text-red-600">Not Answered</th>
                      <th className="py-2 px-3 text-center text-purple-700">Marked</th>
                      <th className="py-2 px-3 text-center text-slate-500">Not Visited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {exam.sections.map(sec => {
                      let ans = 0, notAns = 0, mrk = 0, notVis = 0;
                      sec.questions.forEach(q => {
                        const s = responses[q.id]?.status || 'NOT_VISITED';
                        if (s === 'ANSWERED' || s === 'ANSWERED_AND_MARKED') ans++;
                        else if (s === 'NOT_ANSWERED') notAns++;
                        else if (s === 'MARKED_FOR_REVIEW') mrk++;
                        else notVis++;
                      });
                      return (
                        <tr key={sec.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-800">{sec.title}</td>
                          <td className="py-2 px-3 text-center font-bold">{sec.questions.length}</td>
                          <td className="py-2 px-3 text-center font-bold text-emerald-700">{ans}</td>
                          <td className="py-2 px-3 text-center font-bold text-red-600">{notAns}</td>
                          <td className="py-2 px-3 text-center font-bold text-purple-700">{mrk}</td>
                          <td className="py-2 px-3 text-center text-slate-500">{notVis}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {violations.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-xs text-amber-900 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Security Notice: </span>
                    {violations.length} security violation events were logged during your test session. These will be appended to your official attempt audit log.
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded hover:bg-slate-50 text-xs transition"
                >
                  Return to Exam
                </button>
                <button
                  onClick={finalizeAndSubmit}
                  className="px-5 py-2 bg-[#2e7d32] hover:bg-[#256628] text-white font-bold rounded shadow text-xs transition flex items-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Yes, Submit Final Exam</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: PAUSE EXAMINATION */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#FAF9F6] rounded-2xl max-w-md w-full shadow-2xl border border-[#262626]/20 overflow-hidden">
            <div className="bg-[#DCE5D8] px-6 py-4 flex items-center justify-between border-b border-[#262626]/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-[#262626] text-[#FAF9F6] flex items-center justify-center">
                  <Pause className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#262626]">Pause Examination</h3>
                  <p className="text-[11px] text-[#5E5E5E]">Resume seamlessly from homepage</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPauseModal(false)}
                className="text-[#262626] hover:bg-black/10 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-[#5E5E5E] leading-relaxed">
                Need a break? Pausing saves your answers, timer, and question states safely in local storage so you can resume whenever you are ready.
              </p>

              <div className="bg-[#F2EFE9] border border-[#262626]/15 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#262626]">
                  <span className="text-[#5E5E5E]">Test:</span>
                  <span className="font-bold text-right truncate max-w-[200px]">{exam.title}</span>
                </div>
                <div className="flex justify-between items-center text-[#262626]">
                  <span className="text-[#5E5E5E]">Answered:</span>
                  <span className="font-bold text-emerald-800">
                    {Object.values(responses).filter(r => r.selectedOptionKey !== null).length} / {exam.sections.flatMap(s => s.questions).length} questions
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#262626]">
                  <span className="text-[#5E5E5E]">Time Remaining:</span>
                  <span className="font-mono font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
                    {formatTime(remainingSeconds)}
                  </span>
                </div>
              </div>

              <div className="bg-[#D5DCE8]/50 border border-[#D5DCE8] rounded-xl p-3 text-[11px] text-[#262626] flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                <span>When you return to the homepage, a <strong>Continue Exam</strong> card will be pinned at the top so you can resume with 1-click.</span>
              </div>
            </div>

            <div className="bg-[#F2EFE9] px-6 py-3.5 flex items-center justify-end space-x-2.5 border-t border-[#262626]/10">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-2 border border-[#262626]/30 text-[#262626] hover:bg-[#262626]/10 font-bold rounded-lg text-xs transition"
              >
                Keep Practicing
              </button>
              <button
                onClick={handleConfirmPause}
                className="px-4 py-2 bg-[#262626] hover:bg-black text-[#FAF9F6] font-bold rounded-lg text-xs transition flex items-center space-x-1.5 shadow"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause & Exit to Homepage</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: QUESTION PAPER VIEW */}
      {showQuestionPaperModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="bg-[#32588e] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm md:text-base flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-300" />
                <span>Question Paper View - {currentSection.title}</span>
              </h3>
              <button 
                onClick={() => setShowQuestionPaperModal(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs md:text-sm">
              {currentSection.questions.map((q, idx) => (
                <div key={q.id} className="border-b border-slate-200 pb-4">
                  <div className="font-bold text-slate-800 mb-2 flex items-center space-x-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Q.{q.questionNumber}</span>
                    <span className="text-slate-500 text-xs font-normal">({q.topic})</span>
                  </div>
                  <p className="whitespace-pre-line text-slate-800 mb-3">{q.statement}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700 pl-4">
                    {q.options.map(opt => (
                      <div key={opt.id} className="flex items-center space-x-2">
                        <span className="font-bold text-slate-500">({opt.key})</span>
                        <span>{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowQuestionPaperModal(false)}
                className="px-4 py-1.5 bg-[#32588e] text-white font-semibold rounded text-xs hover:bg-[#264775]"
              >
                Close Question Paper
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: OFFICIAL INSTRUCTIONS */}
      {showInstructionsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
            <div className="bg-[#32588e] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <Info className="w-5 h-5 text-blue-300" />
                <span>Examination Instructions & Marking Scheme</span>
              </h3>
              <button 
                onClick={() => setShowInstructionsModal(false)}
                className="text-white hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs md:text-sm text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1">General Instructions:</h4>
              <ul className="list-disc pl-5 space-y-1.5">
                {exam.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>

              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 pt-2">Marking Scheme:</h4>
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1 text-xs">
                <p><span className="font-semibold text-emerald-700">+1.00 Mark</span> for each correct response.</p>
                <p><span className="font-semibold text-red-600">-0.25 Mark</span> penalty for each incorrect response (Negative marking).</p>
                <p><span className="font-semibold text-slate-600">0.00 Mark</span> for unattempted or left blank questions.</p>
              </div>

              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 pt-2">Answering a Question:</h4>
              <p>
                To select your answer, click on the button of one of the options (A, B, C, D, or E). To deselect your chosen answer, click on the <strong>Clear Response</strong> button. To change your chosen answer, click on another option button.
              </p>
              <p>
                To save your answer, you MUST click on the <strong>Save & Next</strong> button. Questions marked for review with an answered option will be considered in final evaluation.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="px-4 py-1.5 bg-[#32588e] text-white font-semibold rounded text-xs hover:bg-[#264775]"
              >
                Close Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: IMAGE LIGHTBOX / FULL-SCREEN ZOOM */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 z-50 animate-fadeIn"
          onClick={() => setEnlargedImage(null)}
        >
          {/* Top Bar with Title, Zoom Controls and Close Button */}
          <div 
            className="w-full max-w-4xl bg-slate-900/90 text-white px-5 py-3 rounded-t-xl flex items-center justify-between border-b border-slate-700/60 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <ImageIcon className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="truncate">
                <h4 className="text-xs md:text-sm font-bold text-white truncate">
                  {enlargedImage.title || 'Chart / Diagram Preview'}
                </h4>
                {enlargedImage.caption && (
                  <p className="text-[11px] text-slate-300 truncate">{enlargedImage.caption}</p>
                )}
              </div>
            </div>

            {/* Zoom Controls & Close Button */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="text-[11px] font-mono px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                title="Reset Zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-slate-700 mx-1"></div>
              <button
                onClick={() => setEnlargedImage(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-red-500/20 rounded-full transition cursor-pointer"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Image Container with Scroll & Zoom Scaling */}
          <div 
            className="w-full max-w-4xl bg-white rounded-b-xl p-4 max-h-[80vh] overflow-auto flex items-center justify-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="transition-transform duration-200 ease-out origin-center"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                src={enlargedImage.url}
                alt={enlargedImage.title || 'Enlarged Chart'}
                className="max-w-full max-h-[70vh] object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
