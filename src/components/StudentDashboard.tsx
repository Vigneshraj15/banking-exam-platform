import React, { useState } from 'react';
import { 
  Award, Play, CheckCircle, Clock, BookOpen, 
  BarChart2, ChevronRight, Search, Upload, Calendar, 
  Trash2, Sparkles, Pause, ArrowRight, Check, Star, 
  ShieldCheck, Cpu, Landmark, TrendingUp, Compass, 
  HelpCircle, User, SlidersHorizontal, AlertCircle,
  Monitor, Download, ExternalLink, X, Laptop, CheckSquare
} from 'lucide-react';
import { Exam, ExamCategoryCode, SavedAttempt, PausedExamSession } from '../types';
import { sampleExams } from '../data/mockExams';
import { sbiPoPrelimsFull100Q, ibpsPoMainsFullMock } from '../data/fullExamBank';
import { visualDiMockExam } from '../data/visualDiExam';
import { getSavedAttempts, deleteSavedAttempt } from '../data/mockStudentData';
import { TimerConfigModal } from './TimerConfigModal';

interface StudentDashboardProps {
  onStartExam: (exam: Exam, customDurationMinutes?: number) => void;
  onOpenAnalytics: () => void;
  onOpenSolutions: (exam: Exam, responses?: any) => void;
  onOpenPdfUpload: () => void;
  onSwitchToAdmin: () => void;
  userExams: Exam[];
  pausedSession?: PausedExamSession | null;
  onResumeExam?: (session: PausedExamSession) => void;
  onDiscardPausedSession?: () => void;
}

type DiscoveryCategory = 'ALL' | 'ENGINEERING_MEDICAL' | 'CIVIL_SERVICES' | 'MANAGEMENT_APTITUDE' | 'BANKING_GOVT';

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onStartExam,
  onOpenAnalytics,
  onOpenSolutions,
  onOpenPdfUpload,
  onSwitchToAdmin,
  userExams,
  pausedSession,
  onResumeExam,
  onDiscardPausedSession
}) => {
  const [selectedDiscovery, setSelectedDiscovery] = useState<DiscoveryCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedAttempts, setSavedAttempts] = useState<SavedAttempt[]>(() => getSavedAttempts());

  // Timer config modal state for custom preset durations (5, 10, 15, 20, 25, 30, 35)
  const [selectedExamForTimer, setSelectedExamForTimer] = useState<Exam | null>(null);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState<boolean>(false);

  // Study plan builder modal state
  const [isPlanBuilderOpen, setIsPlanBuilderOpen] = useState<boolean>(false);
  const [targetExamChoice, setTargetExamChoice] = useState<string>('SBI PO 2026');
  const [studyHoursPerDay, setStudyHoursPerDay] = useState<number>(3);
  const [targetTimelineWeeks, setTargetTimelineWeeks] = useState<number>(8);
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);

  // Desktop Application & PWA Installation State
  const [isAppExportModalOpen, setIsAppExportModalOpen] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);

  React.useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Reload saved attempts when user exams change or after healing
  React.useEffect(() => {
    setSavedAttempts(getSavedAttempts());
  }, [userExams]);

  const allAvailableExams = [...userExams, ...sampleExams];

  // Filter exams according to Discovery Category & search query
  const filteredExams = allAvailableExams.filter(exam => {
    if (selectedDiscovery !== 'ALL') {
      if (selectedDiscovery === 'BANKING_GOVT') {
        const isBanking = ['SBI', 'IBPS', 'RBI', 'NABARD', 'BANKING_GOVT', 'CUSTOM'].includes(exam.category);
        if (!isBanking) return false;
      } else if (exam.category !== selectedDiscovery) {
        return false;
      }
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = exam.title.toLowerCase().includes(q);
      const matchDesc = exam.description.toLowerCase().includes(q);
      const matchSub = (exam.subCategory || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }
    return true;
  });

  const handleDeleteAttempt = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this attempt record?')) {
      const updated = deleteSavedAttempt(id);
      setSavedAttempts(updated);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartExamWithConfig = (exam: Exam) => {
    setSelectedExamForTimer(exam);
    setIsTimerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#262626] font-sans selection:bg-[#DCE5D8] selection:text-[#262626] pb-24">
      
      {/* ========================================================================= */}
      {/* 1. STICKY MINIMAL HEADER                                                 */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-40">
        {/* Top Announcement Bar in Muted Sage (#DCE5D8) with charcoal text */}
        <div className="bg-[#DCE5D8] text-[#262626] text-xs font-semibold py-2 px-4 text-center border-b border-[#262626]/10 flex items-center justify-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-700 animate-pulse"></span>
          <span>New 2026 Full-Length Mock Series Live — Try 1 Free Test</span>
          <span className="hidden sm:inline text-[#262626]/40">•</span>
          <button 
            onClick={() => {
              const el = document.getElementById('mock-grid');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline underline hover:text-black font-bold cursor-pointer"
          >
            Explore 2026 Editions →
          </button>
        </div>

        {/* Clean Navigation Bar with Left-Aligned Brand Wordmark */}
        <header className="bg-[#FAF9F6]/95 backdrop-blur-md px-6 py-3.5 border-b border-[#262626]/10 shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left Brand Wordmark */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#262626] text-[#FAF9F6] flex items-center justify-center font-serif font-black text-base shadow-xs">
                P
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-serif font-black text-xl tracking-tight text-[#262626]">
                  PARIKSHA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#262626] bg-[#DCE5D8] px-2 py-0.5 rounded-full border border-[#262626]/15">
                  Editorial Mock Portal
                </span>
              </div>
            </div>

            {/* Middle Nav Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold text-[#5E5E5E]">
              <button 
                onClick={() => {
                  const el = document.getElementById('browse-categories');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#262626] transition cursor-pointer"
              >
                Browse Exams
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('mock-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#262626] transition cursor-pointer"
              >
                Mock Series
              </button>
              <button 
                onClick={() => onStartExam(allAvailableExams[0])}
                className="hover:text-[#262626] transition cursor-pointer flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#262626]" />
                <span>Diagnostic Quiz</span>
              </button>
              <button 
                onClick={onOpenAnalytics}
                className="hover:text-[#262626] transition cursor-pointer flex items-center space-x-1"
              >
                <BarChart2 className="w-3.5 h-3.5 text-[#262626]" />
                <span>Performance Analytics</span>
              </button>
            </nav>

            {/* Right Actions: PDF Upload, Desktop App & Pill Student Login */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (installPrompt) {
                    installPrompt.prompt();
                  } else {
                    setIsAppExportModalOpen(true);
                  }
                }}
                className="bg-[#D5DCE8] hover:bg-[#c6d0df] text-[#262626] border border-[#262626]/20 font-bold text-xs px-3.5 py-1.5 rounded-full transition flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Export or run ParikshaBank as a dedicated Desktop Application"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desktop App</span>
                <span className="sm:hidden">App</span>
              </button>

              <button
                onClick={onOpenPdfUpload}
                className="bg-[#DCE5D8] hover:bg-[#cddac8] text-[#262626] border border-[#262626]/20 font-bold text-xs px-3.5 py-1.5 rounded-full transition flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
                title="Upload PDF Question Paper to auto-generate exam"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Upload PDF Paper</span>
                <span className="sm:hidden">Upload</span>
              </button>

              <button
                onClick={() => alert('Logged in as Candidate: Vicky Kumar (Roll: 240189021)')}
                className="rounded-full border border-[#262626] px-4 py-1.5 text-xs font-bold text-[#262626] hover:bg-[#262626] hover:text-[#FAF9F6] transition flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                <span>Candidate Portal</span>
              </button>

              <button
                onClick={onSwitchToAdmin}
                className="hidden xl:flex text-[11px] font-semibold text-[#5E5E5E] hover:text-[#262626] px-2 py-1 rounded transition"
              >
                Admin
              </button>
            </div>
          </div>
        </header>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-10">

        {/* ========================================================================= */}
        {/* PAUSED EXAM BANNER (CORE USER REQUEST: "continue exam in homepage")      */}
        {/* ========================================================================= */}
        {pausedSession && onResumeExam && (
          <div className="bg-[#F2EFE9] border-2 border-[#262626] rounded-2xl p-5 sm:p-6 shadow-sm animate-fadeIn relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#D5DCE8]/30 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1.5 bg-[#DCE5D8] border border-[#262626]/20 text-[#262626] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                    <span>Exam In Progress • Paused</span>
                  </span>
                  <span className="text-xs text-[#5E5E5E]">
                    Paused at {pausedSession.pausedAt}
                  </span>
                </div>

                <h3 className="font-serif font-black text-xl sm:text-2xl text-[#262626] tracking-tight">
                  {pausedSession.examTitle}
                </h3>

                <p className="text-xs text-[#5E5E5E] max-w-xl">
                  Your question answers, review flags, and countdown clock were safely preserved. You can continue right from where you paused without losing any progress.
                </p>

                {/* Progress bar and stats */}
                <div className="flex items-center space-x-4 pt-1 text-xs text-[#262626]">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{pausedSession.attemptedCount} / {pausedSession.totalQuestions} Questions Answered</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1.5 font-bold font-mono">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>{formatSeconds(pausedSession.remainingSeconds)} Remaining</span>
                  </div>
                </div>

                <div className="w-full sm:max-w-md bg-white rounded-full h-2 border border-[#262626]/10 overflow-hidden mt-1">
                  <div 
                    className="bg-[#262626] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(5, (pausedSession.attemptedCount / Math.max(1, pausedSession.totalQuestions)) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons: Continue Exam & Discard */}
              <div className="flex items-center space-x-3 shrink-0">
                {onDiscardPausedSession && (
                  <button
                    onClick={onDiscardPausedSession}
                    className="px-4 py-2.5 text-xs font-bold text-[#5E5E5E] hover:text-red-700 hover:bg-red-50 rounded-full transition flex items-center space-x-1 cursor-pointer"
                    title="Clear paused test session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Discard</span>
                  </button>
                )}

                <button
                  onClick={() => onResumeExam(pausedSession)}
                  className="bg-[#262626] hover:bg-black text-[#FAF9F6] font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition flex items-center space-x-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Continue Exam</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. SPLIT EDITORIAL HERO                                                   */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
          {/* Left Column: Bold Headline & Editorial Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-[#DCE5D8] text-[#262626] border border-[#262626]/15 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Calm Focus • Real Exam Calibration</span>
            </div>

            <h1 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#262626] tracking-tight leading-[1.08]">
              Practice Smarter, <br className="hidden sm:inline" />
              Walk In Ready
            </h1>

            <p className="text-sm sm:text-base text-[#5E5E5E] leading-relaxed max-w-xl font-normal">
              A distraction-free, approachable examination portal with authentic sectional clocks, verified mathematical formulas, and diagnostic score insights designed to build genuine exam-day composure.
            </p>

            {/* Direct 1-Click Launch CTAs: Prelims (100 Qs), Visual DI Charts (15 Qs) & Mains */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onStartExam(sbiPoPrelimsFull100Q)}
                className="bg-[#262626] hover:bg-black text-[#FAF9F6] rounded-full px-7 py-3.5 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-sm cursor-pointer active:scale-95"
              >
                <span>Take Full Prelims Mock (100 Qs)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStartExam(visualDiMockExam)}
                className="bg-[#D5DCE8] hover:bg-[#c5d0e0] text-[#1e293b] border border-[#262626]/20 rounded-full px-6 py-3.5 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-xs cursor-pointer active:scale-95"
                title="15 Visual DI Questions with Bar Graph, Pie Chart & Line Graph"
              >
                <BarChart2 className="w-4 h-4 text-blue-700" />
                <span>Take Visual DI Mock (15 Qs)</span>
              </button>

              <button
                onClick={() => onStartExam(ibpsPoMainsFullMock)}
                className="bg-[#DCE5D8] hover:bg-[#ccd7c7] text-[#262626] border border-[#262626]/20 rounded-full px-6 py-3.5 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-xs cursor-pointer active:scale-95"
              >
                <Landmark className="w-4 h-4 text-[#262626]" />
                <span>Take Full Mains Mock</span>
              </button>

              <button
                onClick={onOpenPdfUpload}
                className="border border-[#262626]/30 text-[#262626] bg-transparent hover:bg-[#F2EFE9] rounded-full px-5 py-3.5 font-bold text-xs sm:text-sm transition flex items-center space-x-2 cursor-pointer active:scale-95"
                title="Optional: Upload your own PDF if you have custom mock papers"
              >
                <Upload className="w-4 h-4" />
                <span>Upload PDF (Optional)</span>
              </button>
            </div>

            {/* Reassurance Tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#5E5E5E] pt-2">
              <span className="flex items-center space-x-1.5 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>100% Pre-Loaded Library — No PDF Upload Needed</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Strict 20-min Sectional Timers</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>Full step-by-step solutions</span>
              </span>
            </div>
          </div>

          {/* Right Column: Rounded Lifestyle Card with Exam Interface Preview & Doodles */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#F2EFE9] border border-[#262626]/20 p-6 shadow-sm relative overflow-hidden space-y-4">
              {/* Minimal Line-Art Doodles Overlay (Stars & Focus Rings) */}
              <div className="absolute top-3 right-4 flex items-center space-x-1 text-[#262626]/30">
                <Star className="w-4 h-4 fill-current text-amber-500/40" />
                <Star className="w-3 h-3 fill-current text-amber-500/30" />
              </div>

              {/* Lifestyle Card Header */}
              <div className="flex items-center justify-between border-b border-[#262626]/10 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <span className="font-serif font-bold text-xs text-[#262626]">Live TCS iON Exam Engine</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-white border border-[#262626]/15 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-[#262626]">
                  <Clock className="w-3 h-3 text-amber-700" />
                  <span>28:15 Remaining</span>
                </div>
              </div>

              {/* Question Preview Snippet */}
              <div className="bg-white rounded-xl p-4 border border-[#262626]/10 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-[11px] text-[#5E5E5E]">
                  <span className="font-bold text-[#262626]">Question 14 • Quantitative Aptitude</span>
                  <span className="bg-[#DCE5D8] text-[#262626] font-bold px-2 py-0.5 rounded text-[10px]">+1.0 / -0.25</span>
                </div>

                <p className="font-serif font-bold text-sm text-[#262626] leading-snug">
                  1769.97 ÷ 5.03 + √? = 16² + 7.99 × 13.02
                </p>

                {/* Option Pills */}
                <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center space-x-2">
                    <span className="font-bold">A</span> <span>64</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center space-x-2">
                    <span className="font-bold">B</span> <span>16</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center space-x-2">
                    <span className="font-bold">C</span> <span>49</span>
                  </div>
                  <div className="p-2 rounded-lg border-2 border-emerald-700 bg-emerald-50 text-emerald-950 font-bold flex items-center space-x-2">
                    <span className="bg-emerald-700 text-white px-1 rounded text-[10px]">D</span> <span>36 [Selected]</span>
                  </div>
                </div>
              </div>

              {/* Minimal Line-Art Doodles Footnote */}
              <div className="flex items-center justify-between pt-1 text-xs text-[#5E5E5E]">
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span className="font-medium">100% Calibrated Mathematical Formulas</span>
                </div>
                <span className="font-serif italic font-bold text-xs text-[#262626]">
                  Confidence Index: 94%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EXAM CATEGORY DISCOVERY BAR (TEXTURE-STYLE SELECTOR)                  */}
        {/* ========================================================================= */}
        <section id="browse-categories" className="space-y-4 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif font-black text-2xl text-[#262626] tracking-tight">
                Exam Category Discovery
              </h2>
              <p className="text-xs text-[#5E5E5E]">
                Select a target domain to explore tailored mock series and calibrated question banks.
              </p>
            </div>

            {/* Quick reset to ALL */}
            {selectedDiscovery !== 'ALL' && (
              <button
                onClick={() => setSelectedDiscovery('ALL')}
                className="text-xs font-bold text-[#262626] underline hover:text-black cursor-pointer"
              >
                View All Categories ({allAvailableExams.length})
              </button>
            )}
          </div>

          {/* 4 Interactive Selector Cards using soft pastel fills (#DCE5D8 and #D5DCE8) with crisp 1px charcoal borders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Category 1: Banking & Govt (Muted Sage #DCE5D8) */}
            <div
              onClick={() => setSelectedDiscovery('BANKING_GOVT')}
              className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                selectedDiscovery === 'BANKING_GOVT'
                  ? 'bg-[#DCE5D8] border-2 border-[#262626] shadow-sm scale-[1.02]'
                  : 'bg-[#DCE5D8]/70 hover:bg-[#DCE5D8] border border-[#262626]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/70 border border-[#262626]/10 flex items-center justify-center text-[#262626]">
                  <Award className="w-5 h-5" />
                </div>
                {selectedDiscovery === 'BANKING_GOVT' && (
                  <span className="bg-[#262626] text-[#FAF9F6] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626] mb-1">
                Banking & Govt
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed mb-3">
                SBI PO, IBPS Clerk, RBI Grade B & RRB Officer preliminary & mains mocks.
              </p>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold text-[#262626]">
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">SBI PO</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">IBPS Clerk</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">RBI Grade B</span>
              </div>
            </div>

            {/* Category 2: Management & Aptitude (Dusty Periwinkle #D5DCE8) */}
            <div
              onClick={() => setSelectedDiscovery('MANAGEMENT_APTITUDE')}
              className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                selectedDiscovery === 'MANAGEMENT_APTITUDE'
                  ? 'bg-[#D5DCE8] border-2 border-[#262626] shadow-sm scale-[1.02]'
                  : 'bg-[#D5DCE8]/70 hover:bg-[#D5DCE8] border border-[#262626]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/70 border border-[#262626]/10 flex items-center justify-center text-[#262626]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                {selectedDiscovery === 'MANAGEMENT_APTITUDE' && (
                  <span className="bg-[#262626] text-[#FAF9F6] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626] mb-1">
                Management & Aptitude
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed mb-3">
                CAT, XAT, SNAP & executive placement quantitative agility tests.
              </p>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold text-[#262626]">
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">CAT 2026</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">Data Interp.</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">Quants</span>
              </div>
            </div>

            {/* Category 3: Civil Services (Muted Sage #DCE5D8) */}
            <div
              onClick={() => setSelectedDiscovery('CIVIL_SERVICES')}
              className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                selectedDiscovery === 'CIVIL_SERVICES'
                  ? 'bg-[#DCE5D8] border-2 border-[#262626] shadow-sm scale-[1.02]'
                  : 'bg-[#DCE5D8]/70 hover:bg-[#DCE5D8] border border-[#262626]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/70 border border-[#262626]/10 flex items-center justify-center text-[#262626]">
                  <Landmark className="w-5 h-5" />
                </div>
                {selectedDiscovery === 'CIVIL_SERVICES' && (
                  <span className="bg-[#262626] text-[#FAF9F6] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626] mb-1">
                Civil Services
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed mb-3">
                UPSC CSE CSAT Paper II analytical deduction & reading comprehension.
              </p>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold text-[#262626]">
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">UPSC CSAT</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">State PSC</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">Paper II</span>
              </div>
            </div>

            {/* Category 4: Engineering & Medical (Dusty Periwinkle #D5DCE8) */}
            <div
              onClick={() => setSelectedDiscovery('ENGINEERING_MEDICAL')}
              className={`rounded-2xl p-5 border cursor-pointer transition-all ${
                selectedDiscovery === 'ENGINEERING_MEDICAL'
                  ? 'bg-[#D5DCE8] border-2 border-[#262626] shadow-sm scale-[1.02]'
                  : 'bg-[#D5DCE8]/70 hover:bg-[#D5DCE8] border border-[#262626]/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/70 border border-[#262626]/10 flex items-center justify-center text-[#262626]">
                  <Cpu className="w-5 h-5" />
                </div>
                {selectedDiscovery === 'ENGINEERING_MEDICAL' && (
                  <span className="bg-[#262626] text-[#FAF9F6] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626] mb-1">
                Engineering & Medical
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed mb-3">
                JEE Main, NEET UG & GATE general analytical problem-solving foundation.
              </p>
              <div className="flex flex-wrap gap-1 text-[10px] font-bold text-[#262626]">
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">JEE General</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">GATE Aptitude</span>
                <span className="bg-white/80 px-2 py-0.5 rounded-full border border-[#262626]/10">STEM Logic</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BENEFIT-LED MOCK TEST GRID (4-COLUMN CARDS ON #F2EFE9)                */}
        {/* ========================================================================= */}
        <section id="mock-grid" className="space-y-4 pt-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#262626]/10 pb-3">
            <div>
              <h2 className="font-serif font-black text-2xl text-[#262626] tracking-tight">
                Curated Mock Series ({filteredExams.length})
              </h2>
              <p className="text-xs text-[#5E5E5E]">
                Calibrated timing presets, official negative marking, and instant step-by-step solutions.
              </p>
            </div>

            {/* Search Filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#5E5E5E] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mock exams..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#262626]/20 rounded-full focus:outline-none focus:border-[#262626] placeholder-[#5E5E5E]/60"
              />
            </div>
          </div>

          {/* 4-Column Grid on #F2EFE9 Surfaces */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="bg-[#F2EFE9] border border-[#262626]/15 hover:border-[#262626] rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Subject Badge & Price/Free Tag */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#DCE5D8] border border-[#262626]/15 text-[#262626]">
                      {exam.subCategory || 'Mock Series'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full">
                      Free Demo
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-base text-[#262626] group-hover:text-black line-clamp-2 leading-snug">
                    {exam.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[#5E5E5E] line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>

                  {/* Small Pill Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold bg-white border border-[#262626]/10 px-2 py-0.5 rounded-md text-[#5E5E5E]">
                      {exam.durationMinutes} Mins
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-[#262626]/10 px-2 py-0.5 rounded-md text-[#5E5E5E]">
                      {exam.totalQuestions} Questions
                    </span>
                    <span className="text-[10px] font-semibold bg-white border border-[#262626]/10 px-2 py-0.5 rounded-md text-[#5E5E5E]">
                      Detailed Solutions
                    </span>
                  </div>

                  {/* Rating & Difficulty */}
                  <div className="flex items-center justify-between text-xs pt-1 text-[#5E5E5E]">
                    <div className="flex items-center space-x-1 text-amber-700 font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>4.9</span>
                      <span className="text-[#5E5E5E] font-normal">(1.4k)</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#5E5E5E]">
                      Moderate Level
                    </span>
                  </div>
                </div>

                {/* Subtle Outline CTA Button that fills with charcoal on hover */}
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => onStartExam(exam)}
                    className="flex-1 border border-[#262626] text-[#262626] group-hover:bg-[#262626] group-hover:text-[#FAF9F6] font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Start Free Demo</span>
                  </button>

                  <button
                    onClick={() => handleStartExamWithConfig(exam)}
                    className="p-2.5 border border-[#262626]/30 text-[#262626] hover:bg-[#262626]/10 rounded-xl transition cursor-pointer"
                    title="Configure custom timer duration (5 to 35 mins)"
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Custom PDF Upload Tile inside the grid */}
            <div 
              onClick={onOpenPdfUpload}
              className="bg-[#DCE5D8]/50 hover:bg-[#DCE5D8] border-2 border-dashed border-[#262626]/30 hover:border-[#262626] rounded-2xl p-6 flex flex-col justify-between transition-all cursor-pointer space-y-4 group"
            >
              <div className="space-y-2 text-center pt-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#262626]/15 mx-auto flex items-center justify-center text-[#262626] group-hover:scale-110 transition shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#262626]">
                  Upload Your Own Paper
                </h3>
                <p className="text-xs text-[#5E5E5E] leading-relaxed max-w-xs mx-auto">
                  Drop any Coaching Mock, Previous Year Paper, or Practice PDF to instantly generate an interactive test with verified keys.
                </p>
              </div>

              <div className="pt-2">
                <span className="w-full bg-[#262626] text-[#FAF9F6] font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-xs">
                  <span>Import PDF Test</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. INTERACTIVE STUDY PLAN BUILDER BANNER                                   */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-[#D5DCE8] border border-[#262626]/20 p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-[#FAF9F6] text-[#262626] text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-[#262626]/15 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Structured Preparation Flow</span>
              </div>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-[#262626] tracking-tight">
                3-Step Confidence Building Plan
              </h2>
              <p className="text-xs sm:text-sm text-[#5E5E5E] max-w-xl">
                Replace anxious cramming with a structured, step-by-step diagnostic regimen.
              </p>
            </div>

            <button
              onClick={() => setIsPlanBuilderOpen(true)}
              className="bg-[#262626] hover:bg-black text-[#FAF9F6] font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition flex items-center space-x-2 shadow-sm shrink-0 cursor-pointer active:scale-95"
            >
              <span>Build My Prep Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-Step Visual Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-[#262626]/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[#262626] bg-[#DCE5D8] px-2 py-0.5 rounded-full">
                  Step 01
                </span>
                <HelpCircle className="w-4 h-4 text-[#5E5E5E]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626]">
                Diagnose Weak Areas
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed">
                Take a rapid 15-minute diagnostic test to pinpoint negative marking traps and low-accuracy topics before starting full mocks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-[#262626]/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[#262626] bg-[#D5DCE8] px-2 py-0.5 rounded-full">
                  Step 02
                </span>
                <Clock className="w-4 h-4 text-[#5E5E5E]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626]">
                Timed Full Mocks
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed">
                Build exam-hall stamina under real 20-minute sectional clocks. Practice pause & resume strategies without feeling rushed.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#FAF9F6] rounded-2xl p-5 border border-[#262626]/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-xs text-[#262626] bg-[#DCE5D8] px-2 py-0.5 rounded-full">
                  Step 03
                </span>
                <BarChart2 className="w-4 h-4 text-[#5E5E5E]" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#262626]">
                AI Score Analysis
              </h3>
              <p className="text-xs text-[#5E5E5E] leading-relaxed">
                Inspect authentic attempt radar reports, section cutoffs, and step-by-step mathematical shortcuts to plug preparation gaps.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. PREVIOUS SAVED ATTEMPTS SECTION                                        */}
        {/* ========================================================================= */}
        <section className="bg-[#F2EFE9] rounded-3xl border border-[#262626]/15 p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-serif font-black text-xl sm:text-2xl text-[#262626] tracking-tight flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#262626]" />
                <span>My Saved Previous Attempts ({savedAttempts.length})</span>
              </h2>
              <p className="text-xs text-[#5E5E5E]">
                Click "Analyze Solutions" on any completed mock to review step-by-step shortcuts and answer keys.
              </p>
            </div>

            {savedAttempts.length > 0 && (
              <button
                onClick={onOpenAnalytics}
                className="text-xs font-bold text-[#262626] underline hover:text-black flex items-center space-x-1 cursor-pointer"
              >
                <span>View Full Diagnostic Breakdown</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {savedAttempts.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-2xl border border-[#262626]/10 shadow-xs">
              <table className="min-w-full text-xs text-left divide-y divide-[#262626]/10">
                <thead className="bg-[#FAF9F6] text-[#262626] font-bold">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Test Title</th>
                    <th className="py-3 px-4 text-center">Score</th>
                    <th className="py-3 px-4 text-center">Accuracy %</th>
                    <th className="py-3 px-4 text-center">Attempted</th>
                    <th className="py-3 px-4 text-center">Correct / Wrong</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {savedAttempts.map((att) => (
                    <tr key={att.id} className="hover:bg-[#FAF9F6] transition">
                      <td className="py-3 px-4 text-[#5E5E5E] whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#5E5E5E]/60" />
                          <span>{att.date}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-[#262626]">{att.examTitle}</td>
                      <td className="py-3 px-4 text-center font-bold text-[#262626] text-sm">
                        {att.score} <span className="text-[10px] text-[#5E5E5E] font-normal">/ {att.maxMarks}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-800">
                        {att.accuracy}%
                      </td>
                      <td className="py-3 px-4 text-center text-[#5E5E5E]">
                        {att.attempted} / {att.totalQuestions}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-emerald-800 font-bold">{att.correct}</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <span className="text-red-700 font-bold">{att.incorrect}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onOpenSolutions(att.exam, att.responses)}
                            className="bg-[#262626] hover:bg-black text-[#FAF9F6] font-bold text-xs px-3.5 py-1.5 rounded-lg transition flex items-center space-x-1.5 cursor-pointer shadow-xs active:scale-95"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Analyze Solutions</span>
                          </button>

                          <button
                            onClick={(e) => handleDeleteAttempt(e, att.id)}
                            className="text-slate-400 hover:text-red-700 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                            title="Remove attempt record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-[#FAF9F6] border-2 border-dashed border-[#262626]/20 rounded-2xl p-8 text-center space-y-2">
              <Clock className="w-9 h-9 text-[#5E5E5E]/60 mx-auto" />
              <h4 className="font-serif font-bold text-[#262626] text-sm">No Previous Attempts Recorded Yet</h4>
              <p className="text-xs text-[#5E5E5E] max-w-sm mx-auto">
                Begin a mock exam above or upload a custom question paper PDF. Completed tests and their question-by-question solutions will be stored here safely.
              </p>
            </div>
          )}
        </section>

      </div>

      {/* ========================================================================= */}
      {/* TIMER PRESET CONFIGURATION MODAL (5 TO 35 MINS)                          */}
      {/* ========================================================================= */}
      {selectedExamForTimer && (
        <TimerConfigModal
          isOpen={isTimerModalOpen}
          examTitle={selectedExamForTimer.title}
          defaultDurationMinutes={selectedExamForTimer.durationMinutes}
          onClose={() => {
            setIsTimerModalOpen(false);
            setSelectedExamForTimer(null);
          }}
          onConfirm={(customMinutes) => {
            setIsTimerModalOpen(false);
            onStartExam(selectedExamForTimer, customMinutes);
            setSelectedExamForTimer(null);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE STUDY PLAN BUILDER MODAL                                     */}
      {/* ========================================================================= */}
      {isPlanBuilderOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#FAF9F6] rounded-3xl max-w-lg w-full shadow-2xl border border-[#262626]/20 overflow-hidden">
            <div className="bg-[#D5DCE8] px-6 py-4 flex items-center justify-between border-b border-[#262626]/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#262626]" />
                <h3 className="font-serif font-black text-lg text-[#262626]">Build My 2026 Preparation Plan</h3>
              </div>
              <button
                onClick={() => {
                  setIsPlanBuilderOpen(false);
                  setPlanGenerated(false);
                }}
                className="text-[#262626] hover:bg-black/10 p-1.5 rounded-full transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!planGenerated ? (
                <>
                  <p className="text-xs text-[#5E5E5E] leading-relaxed">
                    Customize your target examination and timeline to receive an optimal weekly mock testing and diagnostic routine.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[#262626] mb-1">Target Examination:</label>
                      <select
                        value={targetExamChoice}
                        onChange={(e) => setTargetExamChoice(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#262626]/20 rounded-xl font-medium focus:outline-none focus:border-[#262626]"
                      >
                        <option value="SBI PO 2026">SBI PO Prelims & Mains 2026</option>
                        <option value="IBPS Clerk 2026">IBPS Clerk 2026</option>
                        <option value="RBI Grade B">RBI Grade B Phase 1</option>
                        <option value="CAT 2026">CAT & Management Aptitude 2026</option>
                        <option value="UPSC CSAT">UPSC Civil Services CSAT Paper II</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[#262626] mb-1">Study Hours / Day:</label>
                        <select
                          value={studyHoursPerDay}
                          onChange={(e) => setStudyHoursPerDay(Number(e.target.value))}
                          className="w-full p-2.5 bg-white border border-[#262626]/20 rounded-xl font-medium focus:outline-none focus:border-[#262626]"
                        >
                          <option value={2}>2 Hours</option>
                          <option value={3}>3 Hours (Recommended)</option>
                          <option value={4}>4 Hours</option>
                          <option value={6}>6+ Hours</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-[#262626] mb-1">Target Timeline:</label>
                        <select
                          value={targetTimelineWeeks}
                          onChange={(e) => setTargetTimelineWeeks(Number(e.target.value))}
                          className="w-full p-2.5 bg-white border border-[#262626]/20 rounded-xl font-medium focus:outline-none focus:border-[#262626]"
                        >
                          <option value={4}>4 Weeks (Crash Mode)</option>
                          <option value={8}>8 Weeks (Balanced)</option>
                          <option value={12}>12 Weeks (Comprehensive)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#DCE5D8]/50 border border-[#DCE5D8] rounded-xl p-3 text-xs text-[#262626] flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span>Includes 2 weekly timed full mocks, topic-level error radar, and pause-resume flexibility.</span>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => setIsPlanBuilderOpen(false)}
                      className="px-4 py-2 border border-[#262626]/20 text-[#5E5E5E] font-bold text-xs rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setPlanGenerated(true)}
                      className="px-5 py-2 bg-[#262626] text-[#FAF9F6] hover:bg-black font-bold text-xs rounded-xl transition"
                    >
                      Generate My Schedule →
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-[#DCE5D8] border border-[#262626]/15 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-black text-sm text-[#262626]">Your {targetExamChoice} Blueprint</span>
                      <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-[#262626]/15">{targetTimelineWeeks} Weeks</span>
                    </div>
                    <ul className="text-xs text-[#262626] space-y-1.5 pt-1">
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>Mondays & Thursdays:</strong> 1 Full-Length Timed Mock ({studyHoursPerDay} hrs study slot).</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>Tuesdays & Fridays:</strong> Analyze Solutions & practice Weakness Radar topics.</span>
                      </li>
                      <li className="flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span><strong>Weekends:</strong> Speed drill simplification & quadratic equations.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-2 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setIsPlanBuilderOpen(false);
                        setPlanGenerated(false);
                        onStartExam(allAvailableExams[0]);
                      }}
                      className="w-full py-2.5 bg-[#262626] text-[#FAF9F6] hover:bg-black font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start First Mock Now</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DESKTOP APPLICATION EXPORT & INSTALLATION MODAL                           */}
      {/* ========================================================================= */}
      {isAppExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF9F6] border-2 border-[#262626] rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#262626]/10 pb-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#262626] text-[#FAF9F6] flex items-center justify-center font-serif font-black text-2xl shadow-sm border border-[#383838]">
                  P
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-[#262626] leading-tight">
                    ParikshaBank Desktop Application
                  </h3>
                  <p className="text-xs text-[#5E5E5E]">
                    Run as a dedicated, distraction-free application on your PC
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAppExportModalOpen(false)}
                className="text-[#5E5E5E] hover:text-[#262626] p-1.5 rounded-full hover:bg-[#F2EFE9] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Application Modes */}
            <div className="space-y-4">
              {/* Option 1: 1-Click Native Desktop App Install (PWA) */}
              <div className="bg-[#DCE5D8] border border-[#262626]/20 rounded-2xl p-4.5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Laptop className="w-4 h-4 text-[#262626]" />
                    <span className="font-bold text-xs uppercase tracking-wider text-[#262626]">
                      Option 1: Browser Native App Install (PWA)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#262626] text-[#FAF9F6] px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>

                <p className="text-xs text-[#262626] leading-relaxed">
                  Install ParikshaBank directly into your Windows Start Menu, Taskbar, and Desktop with zero installation files. Runs in a dedicated app window without address bars or browser tabs.
                </p>

                {installPrompt ? (
                  <button
                    onClick={() => {
                      installPrompt.prompt();
                      setIsAppExportModalOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#262626] hover:bg-black text-[#FAF9F6] font-bold text-xs rounded-xl shadow transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>Install ParikshaBank as Windows App Now</span>
                  </button>
                ) : (
                  <div className="bg-white/80 border border-[#262626]/10 rounded-xl p-3 text-xs text-[#262626] space-y-1.5">
                    <p className="font-semibold flex items-center space-x-1.5 text-emerald-800">
                      <Check className="w-3.5 h-3.5" />
                      <span>Ready to install from Microsoft Edge or Google Chrome:</span>
                    </p>
                    <ol className="list-decimal pl-4 space-y-1 text-[11px] text-[#5E5E5E]">
                      <li>Look at your browser's address bar for the <strong>Install App</strong> icon (or click the three dots menu <code>...</code>).</li>
                      <li>Select <strong>Apps</strong> → <strong>Install ParikshaBank</strong> (or <em>Install this site as an app</em>).</li>
                      <li>Click <strong>Install</strong>. ParikshaBank will immediately open in its own desktop window!</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Option 2: Windows Standalone Launchers */}
              <div className="bg-[#F2EFE9] border border-[#262626]/15 rounded-2xl p-4.5 space-y-3 shadow-xs">
                <div className="flex items-center space-x-2">
                  <Monitor className="w-4 h-4 text-[#262626]" />
                  <span className="font-bold text-xs uppercase tracking-wider text-[#262626]">
                    Option 2: Standalone Windows Launchers (In Project Folder)
                  </span>
                </div>

                <p className="text-xs text-[#5E5E5E] leading-relaxed">
                  Direct executable batch and script files located inside the application directory:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-[#262626]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#262626] block">Launch-ParikshaBank-Silent.vbs</span>
                      <span className="text-[11px] text-[#5E5E5E]">Launches standalone app window silently with zero console popups</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#DCE5D8] text-[#262626] px-2 py-0.5 rounded border border-[#262626]/10">1-Click</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#262626]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#262626] block">Install-Desktop-Shortcut.bat</span>
                      <span className="text-[11px] text-[#5E5E5E]">Creates an official ParikshaBank icon shortcut on your Windows Desktop</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#D5DCE8] text-[#262626] px-2 py-0.5 rounded border border-[#262626]/10">Shortcut</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-[#262626]/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-[#262626] block">Launch-ParikshaBank.bat</span>
                      <span className="text-[11px] text-[#5E5E5E]">Standard launcher with server health check & Edge/Chrome app engine</span>
                    </div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">Launcher</span>
                  </div>
                </div>
              </div>

              {/* Option 3: Exported Distribution Bundle */}
              <div className="bg-white border border-[#262626]/15 rounded-2xl p-4 space-y-2 text-xs">
                <span className="font-bold text-[#262626] block">Exported Distribution Bundle:</span>
                <p className="text-[11px] text-[#5E5E5E] leading-relaxed">
                  The complete production application has been bundled into:
                  <code className="block bg-slate-100 p-1.5 rounded mt-1 font-mono text-[10px] text-slate-800 break-all select-all">
                    banking-exam-platform\exported-application
                  </code>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsAppExportModalOpen(false)}
                className="px-5 py-2 bg-[#262626] text-[#FAF9F6] hover:bg-black font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
