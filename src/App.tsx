import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Exam, ExamResult, StudentResponse, SavedAttempt, PausedExamSession } from './types';
import { sampleExams } from './data/mockExams';
import { getSavedAttempts, saveStudentAttempt } from './data/mockStudentData';
import { ExamEngine } from './components/ExamEngine';
import { ExamSolutions } from './components/ExamSolutions';
import { StudentAnalytics } from './components/StudentAnalytics';
import { AdminDashboard } from './components/AdminDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { PdfUploadModal } from './components/PdfUploadModal';
import { generateAiSolutionForQuestion, getVerifiedSolutionSync } from './utils/aiSolutionSolver';

type ViewMode = 'STUDENT_DASHBOARD' | 'EXAM_ENGINE' | 'EXAM_SOLUTIONS' | 'STUDENT_ANALYTICS' | 'ADMIN_DASHBOARD';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('STUDENT_DASHBOARD');
  const [activeExam, setActiveExam] = useState<Exam>(sampleExams[0]);
  const [activeResponses, setActiveResponses] = useState<Record<string, StudentResponse>>({});
  const [latestResult, setLatestResult] = useState<ExamResult | null>(null);
  const [customDuration, setCustomDuration] = useState<number | undefined>(undefined);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  // Paused exam session (persisted in localStorage)
  const [pausedSession, setPausedSession] = useState<PausedExamSession | null>(() => {
    try {
      const saved = localStorage.getItem('parikshabank_paused_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // User exams (including user uploaded PDF exams)
  const [userExams, setUserExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem('parikshabank_user_exams');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save user exams to localStorage
  useEffect(() => {
    localStorage.setItem('parikshabank_user_exams', JSON.stringify(userExams));
  }, [userExams]);

  // Self-Healing & Recalibration Engine:
  // Automatically fixes exams and student attempts that were corrupted by previous placeholder keys ('A' or 'C')
  useEffect(() => {
    try {
      // 1. Heal user uploaded exams
      const savedExamsRaw = localStorage.getItem('parikshabank_user_exams');
      if (savedExamsRaw) {
        const savedExams: Exam[] = JSON.parse(savedExamsRaw);
        let examsModified = false;

        const healedExams = savedExams.map(ex => {
          const healedSections = ex.sections.map(sec => {
            const healedQuestions = sec.questions.map(q => {
              // CRITICAL: If the question came with an official answer from the PDF, NEVER overwrite with AI!
              if (q.hasExplicitKey || q.isPdfOriginalKey) {
                return q;
              }
              const verified = getVerifiedSolutionSync(q.statement, q.options, q.topic);
              if (q.correctOptionKey !== verified.correctOptionKey || !q.solution || !q.solution.stepByStep || q.solution.stepByStep.length === 0) {
                examsModified = true;
                return {
                  ...q,
                  correctOptionKey: verified.correctOptionKey,
                  solution: {
                    ...q.solution,
                    stepByStep: verified.stepByStep,
                    shortcutMethod: verified.shortcutMethod,
                    keyFormula: verified.keyFormula,
                    isFacultyVerified: true,
                    verifiedBy: 'AI & Math Verified'
                  }
                };
              }
              return q;
            });
            return { ...sec, questions: healedQuestions };
          });
          return { ...ex, sections: healedSections };
        });

        if (examsModified) {
          localStorage.setItem('parikshabank_user_exams', JSON.stringify(healedExams));
          setUserExams(healedExams);
        }
      }

      // 2. Heal previous attempts (restore green status and genuine scores for student choices)
      const savedAttemptsRaw = localStorage.getItem('parikshabank_student_attempts_v1');
      if (savedAttemptsRaw) {
        const attempts: SavedAttempt[] = JSON.parse(savedAttemptsRaw);
        let attemptsModified = false;

        const healedAttempts = attempts.map(att => {
          let totalCorrect = 0;
          let totalIncorrect = 0;
          let totalAttempted = 0;
          let totalMarks = 0;

          const updatedResponses: Record<string, StudentResponse> = {};

          // Verify every question in the attempt
          const healedExam = {
            ...att.exam,
            sections: att.exam.sections.map(sec => ({
              ...sec,
              questions: sec.questions.map(q => {
                // If question has an official answer from the PDF, keep it intact!
                if (q.hasExplicitKey || q.isPdfOriginalKey) {
                  const resp = att.responses[q.id];
                  const hasSelected = resp && resp.selectedOptionKey !== null;
                  let isCorrect = false;
                  if (hasSelected) {
                    totalAttempted++;
                    isCorrect = (resp.selectedOptionKey === q.correctOptionKey);
                    if (isCorrect) {
                      totalCorrect++;
                      totalMarks += (q.positiveMarks || 1.0);
                    } else {
                      totalIncorrect++;
                      totalMarks -= (q.negativeMarks || 0.25);
                    }
                  }
                  if (resp) {
                    updatedResponses[q.id] = {
                      ...resp,
                      isCorrect
                    };
                  }
                  return q;
                }

                const verified = getVerifiedSolutionSync(q.statement, q.options, q.topic);
                const resp = att.responses[q.id];
                const hasSelected = resp && resp.selectedOptionKey !== null;

                let isCorrect = false;
                if (hasSelected) {
                  totalAttempted++;
                  isCorrect = (resp.selectedOptionKey === verified.correctOptionKey);
                  if (isCorrect) {
                    totalCorrect++;
                    totalMarks += (q.positiveMarks || 1.0);
                  } else {
                    totalIncorrect++;
                    totalMarks -= (q.negativeMarks || 0.25);
                  }
                }

                if (resp) {
                  updatedResponses[q.id] = {
                    ...resp,
                    isCorrect
                  };
                }

                return {
                  ...q,
                  correctOptionKey: verified.correctOptionKey,
                  solution: {
                    ...q.solution,
                    stepByStep: verified.stepByStep,
                    shortcutMethod: verified.shortcutMethod,
                    keyFormula: verified.keyFormula,
                    isFacultyVerified: true,
                    verifiedBy: 'AI & Math Verified'
                  }
                };
              })
            }))
          };

          const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
          attemptsModified = true;

          return {
            ...att,
            exam: healedExam,
            responses: updatedResponses,
            score: Math.max(0, parseFloat(totalMarks.toFixed(2))),
            correct: totalCorrect,
            incorrect: totalIncorrect,
            attempted: totalAttempted,
            accuracy,
            result: {
              ...att.result,
              totalMarksScored: Math.max(0, parseFloat(totalMarks.toFixed(2))),
              correctAnswers: totalCorrect,
              incorrectAnswers: totalIncorrect,
              attemptedQuestions: totalAttempted,
              accuracyPercentage: accuracy
            }
          };
        });

        if (attemptsModified) {
          localStorage.setItem('parikshabank_student_attempts_v1', JSON.stringify(healedAttempts));
        }
      }
    } catch (e) {
      console.warn('Healing failed', e);
    }
  }, []);

  // Helper to ensure an exam is fully verified with exact mathematical keys
  const ensureVerifiedExam = (exam: Exam): Exam => {
    return {
      ...exam,
      sections: exam.sections.map(sec => ({
        ...sec,
        questions: sec.questions.map(q => {
          // CRITICAL: Respect official PDF answer key — never overwrite with AI!
          if (q.hasExplicitKey || q.isPdfOriginalKey) {
            return q;
          }
          const verified = getVerifiedSolutionSync(q.statement, q.options, q.topic);
          return {
            ...q,
            correctOptionKey: verified.correctOptionKey,
            solution: {
              ...q.solution,
              stepByStep: (verified.stepByStep && verified.stepByStep.length > 0) ? verified.stepByStep : q.solution?.stepByStep || [],
              shortcutMethod: verified.shortcutMethod || q.solution?.shortcutMethod || '',
              keyFormula: verified.keyFormula || q.solution?.keyFormula || '',
              isFacultyVerified: true,
              verifiedBy: 'AI & Math Verified'
            }
          };
        })
      }))
    };
  };

  // Handler to start a mock test with optional manual timer override & verified keys
  const handleStartExam = (exam: Exam, customDurationMinutes?: number) => {
    // Automatically trigger fullscreen mode by default on exam start
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}

    // If starting a fresh exam, ensure old paused session for this specific exam is cleared
    if (pausedSession && pausedSession.examId === exam.id) {
      localStorage.removeItem('parikshabank_paused_session');
      setPausedSession(null);
    }

    const verifiedExam = ensureVerifiedExam(exam);
    setActiveExam(verifiedExam);
    setCustomDuration(customDurationMinutes);
    setViewMode('EXAM_ENGINE');
  };

  // Handler when an exam is paused by candidate
  const handlePauseExam = (session: PausedExamSession) => {
    setPausedSession(session);
    localStorage.setItem('parikshabank_paused_session', JSON.stringify(session));
    setViewMode('STUDENT_DASHBOARD');
  };

  // Handler to resume a paused exam session from homepage
  const handleResumeExam = (session: PausedExamSession) => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch (e) {}

    const verifiedExam = ensureVerifiedExam(session.exam);
    setActiveExam(verifiedExam);
    setCustomDuration(undefined);
    setViewMode('EXAM_ENGINE');
  };

  // Handler to discard a paused session
  const handleDiscardPausedSession = () => {
    if (confirm('Discard this paused exam session? Unsubmitted answers will be cleared.')) {
      localStorage.removeItem('parikshabank_paused_session');
      if (pausedSession) {
        localStorage.removeItem(`exam_attempt_${pausedSession.examId}`);
      }
      setPausedSession(null);
    }
  };

  // Handler when exam is submitted from ExamEngine
  const handleSubmitExam = (result: ExamResult, responses: Record<string, StudentResponse>) => {
    setLatestResult(result);
    setActiveResponses(responses);

    // Clear any active paused session since the exam is now finished
    localStorage.removeItem('parikshabank_paused_session');
    setPausedSession(null);

    // Save attempt to student's persistent history
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newAttempt: SavedAttempt = {
      id: `attempt-${Date.now()}`,
      examId: activeExam.id,
      examTitle: activeExam.title,
      exam: activeExam,
      date: formattedDate,
      score: result.totalMarksScored,
      maxMarks: result.maxMarks,
      totalQuestions: result.totalQuestions,
      attempted: result.attemptedQuestions,
      correct: result.correctAnswers,
      incorrect: result.incorrectAnswers,
      skipped: result.skippedQuestions,
      accuracy: result.accuracyPercentage,
      timeSpentSeconds: result.totalTimeSeconds,
      responses,
      result
    };

    saveStudentAttempt(newAttempt);

    // Fire celebration confetti!
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 }
    });

    // Move to Analytics view
    setViewMode('STUDENT_ANALYTICS');
  };

  // Handler to inspect solutions
  const handleOpenSolutions = (exam: Exam, responses?: Record<string, StudentResponse>) => {
    const verifiedExam = ensureVerifiedExam(exam);
    setActiveExam(verifiedExam);
    setActiveResponses(responses || {});
    setViewMode('EXAM_SOLUTIONS');
  };

  // Handler when an attempt is selected from Analytics to view its specific solutions
  const handleSelectAttemptForSolution = (attempt: SavedAttempt) => {
    const verifiedExam = ensureVerifiedExam(attempt.exam);
    setActiveExam(verifiedExam);
    setActiveResponses(attempt.responses);
    setViewMode('EXAM_SOLUTIONS');
  };

  // Handler when PDF question paper creates a new exam
  const handleExamCreatedFromPdf = (newExam: Exam, startImmediately: boolean, customDurationMinutes?: number) => {
    const verifiedExam = ensureVerifiedExam(newExam);
    setUserExams(prev => [verifiedExam, ...prev]);
    if (startImmediately) {
      setActiveExam(verifiedExam);
      setCustomDuration(customDurationMinutes);
      setViewMode('EXAM_ENGINE');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans text-[#262626]">
      {viewMode === 'STUDENT_DASHBOARD' && (
        <StudentDashboard
          onStartExam={handleStartExam}
          onOpenAnalytics={() => setViewMode('STUDENT_ANALYTICS')}
          onOpenSolutions={handleOpenSolutions}
          onOpenPdfUpload={() => setIsPdfModalOpen(true)}
          onSwitchToAdmin={() => setViewMode('ADMIN_DASHBOARD')}
          userExams={userExams}
          pausedSession={pausedSession}
          onResumeExam={handleResumeExam}
          onDiscardPausedSession={handleDiscardPausedSession}
        />
      )}

      {viewMode === 'EXAM_ENGINE' && (
        <ExamEngine
          exam={activeExam}
          candidateName="Vicky Kumar"
          rollNumber="240189021"
          customDurationMinutes={customDuration}
          initialSession={pausedSession && activeExam.id === pausedSession.examId ? pausedSession : null}
          onPauseExam={handlePauseExam}
          onSubmitExam={handleSubmitExam}
          onExitExam={() => setViewMode('STUDENT_DASHBOARD')}
        />
      )}

      {viewMode === 'EXAM_SOLUTIONS' && (
        <ExamSolutions
          exam={activeExam}
          responses={activeResponses}
          onBackToDashboard={() => setViewMode('STUDENT_DASHBOARD')}
        />
      )}

      {viewMode === 'STUDENT_ANALYTICS' && (
        <StudentAnalytics
          latestResult={latestResult || undefined}
          onReviewSolutions={() => setViewMode('EXAM_SOLUTIONS')}
          onTakeAnotherMock={() => setViewMode('STUDENT_DASHBOARD')}
          onSelectAttemptForSolution={handleSelectAttemptForSolution}
        />
      )}

      {viewMode === 'ADMIN_DASHBOARD' && (
        <AdminDashboard
          onBackToStudentView={() => setViewMode('STUDENT_DASHBOARD')}
        />
      )}

      {/* PROMINENT PDF QUESTION PAPER UPLOAD MODAL */}
      <PdfUploadModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        onExamCreated={handleExamCreatedFromPdf}
      />
    </div>
  );
};

export default App;
