import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, Award, Target, Zap, Clock, CheckCircle, 
  XCircle, AlertTriangle, ArrowUpRight, BarChart2, 
  ChevronRight, BookOpen, Brain, Shield, Trash2, Calendar,
  Filter, Sparkles, HelpCircle, Activity, Layers, AlertOctagon, Check
} from 'lucide-react';
import { ExamResult, SavedAttempt, SubjectCode } from '../types';
import { getSavedAttempts, deleteSavedAttempt } from '../data/mockStudentData';

interface StudentAnalyticsProps {
  latestResult?: ExamResult;
  onReviewSolutions?: () => void;
  onTakeAnotherMock?: () => void;
  onSelectAttemptForSolution?: (attempt: SavedAttempt) => void;
}

interface SectionMeta {
  code: SubjectCode;
  name: string;
  shortName: string;
  description: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

const BANKING_SECTIONS: SectionMeta[] = [
  {
    code: 'ENGLISH_LANGUAGE',
    name: 'English Language',
    shortName: 'English',
    description: 'Reading Comprehension, Error Spotting, Cloze Test, Para Jumbles, Fillers, Vocabulary',
    accentColor: 'text-indigo-700',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-800',
    borderColor: 'border-indigo-200'
  },
  {
    code: 'QUANTITATIVE_APTITUDE',
    name: 'Quantitative Aptitude',
    shortName: 'Aptitude',
    description: 'Data Interpretation, Simplification, Quadratic Equations, Number Series, SI/CI, Profit & Loss',
    accentColor: 'text-blue-700',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-800',
    borderColor: 'border-blue-200'
  },
  {
    code: 'REASONING_ABILITY',
    name: 'Reasoning Ability',
    shortName: 'Reasoning',
    description: 'Syllogisms, Inequalities, Puzzles & Seating Arrangements, Coding-Decoding, Direction Sense',
    accentColor: 'text-purple-700',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-800',
    borderColor: 'border-purple-200'
  },
  {
    code: 'GENERAL_AWARENESS',
    name: 'Banking & General Awareness',
    shortName: 'Banking GK',
    description: 'RBI & Banking Regulations, Monetary Policy, Financial Terms, Current Affairs, Union Budget',
    accentColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    borderColor: 'border-emerald-200'
  },
  {
    code: 'COMPUTER_APTITUDE',
    name: 'Computer Awareness & Aptitude',
    shortName: 'Computer',
    description: 'Networking, Cyber Security, Operating Systems, DBMS Fundamentals, Shortcuts & MS Office',
    accentColor: 'text-amber-700',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    borderColor: 'border-amber-200'
  }
];

export const StudentAnalytics: React.FC<StudentAnalyticsProps> = ({
  latestResult,
  onReviewSolutions,
  onTakeAnotherMock,
  onSelectAttemptForSolution
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SECTION_ANALYSIS' | 'WEAK_AREAS' | 'SPEED_ACCURACY' | 'PROGRESSION'>('OVERVIEW');
  const [selectedSectionCode, setSelectedSectionCode] = useState<SubjectCode>('ENGLISH_LANGUAGE');
  const [savedAttempts, setSavedAttempts] = useState<SavedAttempt[]>(() => getSavedAttempts());
  const [historyScope, setHistoryScope] = useState<'ALL_ATTEMPTS' | 'LATEST_ONLY'>('ALL_ATTEMPTS');

  // Reload saved attempts upon mounting or result update
  React.useEffect(() => {
    setSavedAttempts(getSavedAttempts());
  }, [latestResult]);

  // Aggregate user attempts for authentic, 100% dynamic analytics
  const relevantAttempts = useMemo(() => {
    if (historyScope === 'LATEST_ONLY' && savedAttempts.length > 0) {
      return [savedAttempts[0]];
    }
    return savedAttempts;
  }, [savedAttempts, historyScope]);

  const totalTests = savedAttempts.length;
  const hasData = totalTests > 0 || !!latestResult;

  // Primary Metrics
  const avgScore = totalTests > 0 
    ? Number((savedAttempts.reduce((acc, a) => acc + a.score, 0) / totalTests).toFixed(2)) 
    : (latestResult?.totalMarksScored ?? 0);

  const bestScore = totalTests > 0 
    ? Math.max(...savedAttempts.map(a => a.score)) 
    : (latestResult?.totalMarksScored ?? 0);

  const avgAccuracy = totalTests > 0 
    ? Number((savedAttempts.reduce((acc, a) => acc + a.accuracy, 0) / totalTests).toFixed(1)) 
    : (latestResult?.accuracyPercentage ?? 0);

  const currentScore = latestResult?.totalMarksScored ?? (savedAttempts[0]?.score ?? 0);
  const currentMaxScore = latestResult?.maxMarks ?? (savedAttempts[0]?.maxMarks ?? 100);

  // Dynamic Cut-off Scaling based on actual exam maxMarks
  const baseMax = currentMaxScore > 0 ? currentMaxScore : 100;
  const cutoffs = useMemo(() => [
    { category: 'General (UR)', cutoff: Number((baseMax * 0.62).toFixed(1)), studentScore: currentScore, cleared: currentScore >= baseMax * 0.62 },
    { category: 'OBC (Non-Creamy)', cutoff: Number((baseMax * 0.58).toFixed(1)), studentScore: currentScore, cleared: currentScore >= baseMax * 0.58 },
    { category: 'EWS', cutoff: Number((baseMax * 0.57).toFixed(1)), studentScore: currentScore, cleared: currentScore >= baseMax * 0.57 },
    { category: 'SC', cutoff: Number((baseMax * 0.51).toFixed(1)), studentScore: currentScore, cleared: currentScore >= baseMax * 0.51 },
    { category: 'ST', cutoff: Number((baseMax * 0.47).toFixed(1)), studentScore: currentScore, cleared: currentScore >= baseMax * 0.47 }
  ], [baseMax, currentScore]);

  // Aggregate Sectional Data Across Authentic Attempts
  const sectionAnalyticsMap = useMemo(() => {
    const map: Record<SubjectCode, {
      totalQuestions: number;
      attempted: number;
      correct: number;
      incorrect: number;
      skipped: number;
      marksScored: number;
      negativeMarks: number;
      totalMarks: number;
      timeSpentSeconds: number;
      topics: Record<string, { total: number; correct: number; incorrect: number; time: number }>;
    }> = {
      ENGLISH_LANGUAGE: { totalQuestions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, marksScored: 0, negativeMarks: 0, totalMarks: 0, timeSpentSeconds: 0, topics: {} },
      QUANTITATIVE_APTITUDE: { totalQuestions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, marksScored: 0, negativeMarks: 0, totalMarks: 0, timeSpentSeconds: 0, topics: {} },
      REASONING_ABILITY: { totalQuestions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, marksScored: 0, negativeMarks: 0, totalMarks: 0, timeSpentSeconds: 0, topics: {} },
      GENERAL_AWARENESS: { totalQuestions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, marksScored: 0, negativeMarks: 0, totalMarks: 0, timeSpentSeconds: 0, topics: {} },
      COMPUTER_APTITUDE: { totalQuestions: 0, attempted: 0, correct: 0, incorrect: 0, skipped: 0, marksScored: 0, negativeMarks: 0, totalMarks: 0, timeSpentSeconds: 0, topics: {} }
    };

    relevantAttempts.forEach(att => {
      // 1. From exam questions & responses
      if (att.exam && att.exam.sections) {
        att.exam.sections.forEach(sec => {
          const sCode = sec.subject;
          if (!map[sCode]) return;

          sec.questions.forEach(q => {
            map[sCode].totalQuestions++;
            map[sCode].totalMarks += (q.positiveMarks || 1);

            const topicName = q.topic || 'General Practice';
            if (!map[sCode].topics[topicName]) {
              map[sCode].topics[topicName] = { total: 0, correct: 0, incorrect: 0, time: 0 };
            }
            map[sCode].topics[topicName].total++;

            const resp = att.responses ? att.responses[q.id] : undefined;
            if (resp && resp.selectedOptionKey !== null) {
              map[sCode].attempted++;
              const t = resp.timeSpentSeconds || 0;
              map[sCode].timeSpentSeconds += t;
              map[sCode].topics[topicName].time += t;

              if (resp.selectedOptionKey === q.correctOptionKey) {
                map[sCode].correct++;
                map[sCode].marksScored += (q.positiveMarks || 1);
                map[sCode].topics[topicName].correct++;
              } else {
                map[sCode].incorrect++;
                const neg = q.negativeMarks || 0.25;
                map[sCode].negativeMarks += neg;
                map[sCode].marksScored -= neg;
                map[sCode].topics[topicName].incorrect++;
              }
            } else {
              map[sCode].skipped++;
            }
          });
        });
      } else if (att.result && att.result.sectionalPerformance) {
        // Fallback from result sectionalPerformance
        att.result.sectionalPerformance.forEach(sp => {
          const sCode = sp.subject;
          if (map[sCode]) {
            map[sCode].attempted += sp.attempted;
            map[sCode].correct += sp.correct;
            map[sCode].incorrect += sp.incorrect;
            map[sCode].marksScored += sp.marksScored;
            map[sCode].negativeMarks += (sp.incorrect * 0.25);
            map[sCode].totalMarks += sp.totalMarks;
            map[sCode].timeSpentSeconds += sp.timeSpentSeconds;
          }
        });
      }
    });

    return map;
  }, [relevantAttempts]);

  // Aggregate All Topics across all sections to diagnose Weaknesses & Strengths
  const { weakTopics, moderateTopics, strongTopics, totalNegativePenaltyLost } = useMemo(() => {
    interface TopicStat {
      topic: string;
      subject: SubjectCode;
      subjectName: string;
      total: number;
      correct: number;
      incorrect: number;
      accuracy: number;
      negativeMarks: number;
      avgTime: number;
    }

    const allTopicStats: TopicStat[] = [];
    let totalNeg = 0;

    Object.entries(sectionAnalyticsMap).forEach(([sCode, secData]) => {
      const sMeta = BANKING_SECTIONS.find(s => s.code === sCode);
      const subjectName = sMeta ? sMeta.name : sCode;

      Object.entries(secData.topics).forEach(([topic, tStats]) => {
        if (tStats.total > 0) {
          const attempted = tStats.correct + tStats.incorrect;
          const acc = attempted > 0 ? (tStats.correct / attempted) * 100 : 0;
          const neg = tStats.incorrect * 0.25;
          totalNeg += neg;

          allTopicStats.push({
            topic,
            subject: sCode as SubjectCode,
            subjectName,
            total: tStats.total,
            correct: tStats.correct,
            incorrect: tStats.incorrect,
            accuracy: Number(acc.toFixed(1)),
            negativeMarks: Number(neg.toFixed(2)),
            avgTime: Math.round(tStats.time / Math.max(1, attempted || tStats.total))
          });
        }
      });
    });

    // Categorize
    const weak = allTopicStats.filter(t => (t.correct + t.incorrect > 0) && t.accuracy < 50)
      .sort((a, b) => a.accuracy - b.accuracy || b.negativeMarks - a.negativeMarks);

    const moderate = allTopicStats.filter(t => (t.correct + t.incorrect > 0) && t.accuracy >= 50 && t.accuracy < 75)
      .sort((a, b) => a.accuracy - b.accuracy);

    const strong = allTopicStats.filter(t => (t.correct + t.incorrect > 0) && t.accuracy >= 75)
      .sort((a, b) => b.accuracy - a.accuracy);

    return {
      weakTopics: weak,
      moderateTopics: moderate,
      strongTopics: strong,
      totalNegativePenaltyLost: Number(totalNeg.toFixed(2))
    };
  }, [sectionAnalyticsMap]);

  // Dynamic Speed vs Accuracy Matrix from authentic attempts
  const speedAccuracyData = useMemo(() => {
    let fastAccurate = 0;
    let slowAccurate = 0;
    let fastInaccurate = 0;
    let slowInaccurate = 0;

    relevantAttempts.forEach(att => {
      if (att.responses) {
        Object.values(att.responses).forEach(r => {
          if (r.selectedOptionKey !== null) {
            const time = r.timeSpentSeconds || 45;
            const isCorrect = r.isCorrect ?? false;
            const isFast = time <= 60;

            if (isCorrect && isFast) fastAccurate++;
            else if (isCorrect && !isFast) slowAccurate++;
            else if (!isCorrect && isFast) fastInaccurate++;
            else slowInaccurate++;
          }
        });
      }
    });

    const totalTracked = fastAccurate + slowAccurate + fastInaccurate + slowInaccurate;
    return {
      fastAccurate,
      slowAccurate,
      fastInaccurate,
      slowInaccurate,
      totalTracked
    };
  }, [relevantAttempts]);

  const handleDeleteAttempt = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this attempt from your history?')) {
      const updated = deleteSavedAttempt(id);
      setSavedAttempts(updated);
    }
  };

  const activeSectionMeta = BANKING_SECTIONS.find(s => s.code === selectedSectionCode) || BANKING_SECTIONS[0];
  const activeSectionStats = sectionAnalyticsMap[selectedSectionCode];
  const activeSectionAccuracy = activeSectionStats.attempted > 0 
    ? Number(((activeSectionStats.correct / activeSectionStats.attempted) * 100).toFixed(1)) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16 font-sans">
      {/* Top Header */}
      <div className="bg-[#1f3f6c] text-white pt-7 pb-11 px-4 sm:px-6 shadow-md border-b border-blue-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Authentic Performance Analytics & Improvement Diagnostic</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Self-Improvement & Sectional Diagnostic
            </h1>
            <p className="text-blue-200 text-xs md:text-sm mt-1">
              Derived 100% from your authentic test attempts with section breakdown and targeted weak area analysis
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {onReviewSolutions && (
              <button
                onClick={onReviewSolutions}
                className="bg-white hover:bg-slate-100 text-[#1f3f6c] font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-[#1f3f6c]" />
                <span>Review Test Solutions</span>
              </button>
            )}

            {onTakeAnotherMock && (
              <button
                onClick={onTakeAnotherMock}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition flex items-center space-x-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Practice Another Test</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6">
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Current Score */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Latest Test Score</p>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                {currentScore} <span className="text-sm font-normal text-slate-400">/ {currentMaxScore}</span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Net score after negative markings
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Highest Score */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Personal Best Score</p>
              <h2 className="text-3xl font-black text-emerald-700 mt-1">{bestScore}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Highest achieved benchmark
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Overall Accuracy */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Accuracy</p>
              <h2 className="text-3xl font-black text-blue-900 mt-1">{avgAccuracy}%</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Across {totalTests} saved attempt{totalTests !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Negative Marking Loss */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Negative Mark Loss</p>
              <h2 className="text-3xl font-black text-red-600 mt-1">-{totalNegativePenaltyLost}</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Lost to incorrect answers
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 mb-6 overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto text-xs font-bold bg-slate-50/50">
            {[
              { id: 'OVERVIEW', label: 'Overall Diagnostic & Cutoffs' },
              { id: 'SECTION_ANALYSIS', label: 'Section Analysis (All 5 Subjects)' },
              { id: 'WEAK_AREAS', label: `Areas to Improve & Weakness Radar (${weakTopics.length})` },
              { id: 'SPEED_ACCURACY', label: 'Speed vs Accuracy Quadrant' },
              { id: 'PROGRESSION', label: `Attempt History (${savedAttempts.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3.5 whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#1f3f6c] text-[#1f3f6c] bg-white font-extrabold shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="p-6 space-y-6">
              {/* Dynamic Target Cutoff Assessment */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-700" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      Exam Category Cutoff Target Self-Assessment (Scaled to {currentMaxScore} Marks)
                    </h3>
                  </div>
                  <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                    *Banking Cutoff Benchmarks
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {cutoffs.map(c => (
                    <div key={c.category} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs text-center">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">{c.category}</span>
                      <p className="text-base font-extrabold text-slate-800 mt-0.5">{c.cutoff} Target</p>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                        c.cleared ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.cleared ? `✓ Cleared (+${(currentScore - c.cutoff).toFixed(1)})` : `Short by ${(c.cutoff - currentScore).toFixed(1)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real Weakness Diagnostic Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Immediate Improvement Priorities */}
                <div className="bg-white border border-red-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-3">
                    <div className="flex items-center space-x-2 text-red-700 font-bold text-sm">
                      <AlertOctagon className="w-4 h-4" />
                      <span>Top Priority Improvement Areas (&lt;50% Accuracy)</span>
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">
                      {weakTopics.length} Topics
                    </span>
                  </div>

                  {weakTopics.length > 0 ? (
                    <div className="space-y-3">
                      {weakTopics.slice(0, 4).map((t, idx) => (
                        <div key={idx} className="p-3 bg-red-50/50 rounded-lg border border-red-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-red-600 tracking-wider">{t.subjectName}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{t.topic}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {t.incorrect} incorrect answers · Lost <span className="font-bold text-red-600">-{t.negativeMarks}</span> marks
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-red-700">{t.accuracy}%</span>
                            <p className="text-[10px] text-slate-400">Accuracy</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-xs font-semibold">No critical weak topics found (&lt;50% accuracy)!</p>
                      <p className="text-[11px] text-slate-400 mt-1">Keep practicing to maintain consistency.</p>
                    </div>
                  )}
                </div>

                {/* Established Scoring Fortresses */}
                <div className="bg-white border border-emerald-200 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
                    <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Established Strengths (&gt;75% Accuracy)</span>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {strongTopics.length} Topics
                    </span>
                  </div>

                  {strongTopics.length > 0 ? (
                    <div className="space-y-3">
                      {strongTopics.slice(0, 4).map((t, idx) => (
                        <div key={idx} className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">{t.subjectName}</span>
                            <h4 className="font-bold text-slate-900 text-sm">{t.topic}</h4>
                            <p className="text-xs text-slate-600 mt-0.5">
                              {t.correct} / {t.total} correct · Speed: ~{t.avgTime}s / q
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-extrabold text-emerald-700">{t.accuracy}%</span>
                            <p className="text-[10px] text-slate-400">Accuracy</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-500">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold">Complete more mock tests to build strength profiles.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Negative Marking Impact Calculator */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-xl p-5">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Negative Marking Diagnostic & Potential Score Uplift</h4>
                    <p className="text-xs text-amber-950 mt-1 leading-relaxed">
                      Across your attempts, you lost a total of <span className="font-bold text-red-600">-{totalNegativePenaltyLost} marks</span> to incorrect answers. 
                      If doubtful questions were skipped rather than guessed, your net score would have been <span className="font-bold text-emerald-800">{(currentScore + totalNegativePenaltyLost).toFixed(2)} marks</span>.
                    </p>
                    <div className="mt-3 flex items-center space-x-2 text-xs font-semibold text-amber-900">
                      <span className="bg-white px-2.5 py-1 rounded border border-amber-200">
                        Rule: Guess only when at least 2 incorrect options can be eliminated with certainty.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SECTION ANALYSIS (ALL 5 BANKING SUBJECTS) */}
          {activeTab === 'SECTION_ANALYSIS' && (
            <div className="p-6 space-y-6">
              {/* Section Selector Pills */}
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Select Section to Inspect Detailed Performance:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {BANKING_SECTIONS.map((sec) => {
                    const isSelected = selectedSectionCode === sec.code;
                    const secStats = sectionAnalyticsMap[sec.code];
                    const secAcc = secStats.attempted > 0 
                      ? Math.round((secStats.correct / secStats.attempted) * 100) 
                      : 0;

                    return (
                      <button
                        key={sec.code}
                        onClick={() => setSelectedSectionCode(sec.code)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#1f3f6c] border-[#1f3f6c] text-white shadow-sm ring-2 ring-blue-300'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : sec.accentColor}`}>
                            {sec.shortName}
                          </span>
                          {secStats.totalQuestions > 0 && (
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {secAcc}%
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-xs truncate">{sec.name}</h4>
                        <p className={`text-[10px] mt-1 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                          {secStats.totalQuestions} Questions · {secStats.attempted} Attempted
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Section Header & Detailed Performance Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${activeSectionMeta.badgeBg} ${activeSectionMeta.badgeText}`}>
                        {activeSectionMeta.shortName} Section
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-base">{activeSectionMeta.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{activeSectionMeta.description}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Section Net Score</p>
                      <p className="text-xl font-black text-blue-900">
                        {activeSectionStats.marksScored.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ {activeSectionStats.totalMarks}</span>
                      </p>
                    </div>
                    <div className="text-right pl-4 border-l border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Accuracy Rate</p>
                      <p className={`text-xl font-black ${
                        activeSectionAccuracy >= 75 ? 'text-emerald-600' : activeSectionAccuracy >= 50 ? 'text-amber-600' : 'text-red-600'
                      }`}>
                        {activeSectionAccuracy}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Vital Statistics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-200">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Attempt Rate</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">
                      {activeSectionStats.attempted} / {activeSectionStats.totalQuestions}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {activeSectionStats.totalQuestions > 0 ? Math.round((activeSectionStats.attempted / activeSectionStats.totalQuestions) * 100) : 0}% attempted
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Correct vs Wrong</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">
                      <span className="text-emerald-600">{activeSectionStats.correct}</span> / <span className="text-red-600">{activeSectionStats.incorrect}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {activeSectionStats.skipped} skipped
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Negative Penalty</span>
                    <p className="text-base font-extrabold text-red-600 mt-0.5">
                      -{activeSectionStats.negativeMarks.toFixed(2)}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Marks lost to mistakes
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Time per Question</span>
                    <p className="text-base font-extrabold text-slate-800 mt-0.5">
                      {activeSectionStats.attempted > 0 ? Math.round(activeSectionStats.timeSpentSeconds / activeSectionStats.attempted) : 0}s
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Target: 45s - 60s
                    </span>
                  </div>
                </div>

                {/* Section Topic Performance Table */}
                <div className="pt-4">
                  <h4 className="font-bold text-slate-800 text-sm mb-3">Topic Breakdown inside {activeSectionMeta.name}</h4>
                  {Object.keys(activeSectionStats.topics).length > 0 ? (
                    <div className="overflow-x-auto border border-slate-200 rounded-lg">
                      <table className="min-w-full text-xs text-left">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="py-2.5 px-3">Topic Name</th>
                            <th className="py-2.5 px-3 text-center">Questions</th>
                            <th className="py-2.5 px-3 text-center">Correct / Wrong</th>
                            <th className="py-2.5 px-3 text-center">Accuracy %</th>
                            <th className="py-2.5 px-3 text-center">Negative Lost</th>
                            <th className="py-2.5 px-3 text-center">Proficiency</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {Object.entries(activeSectionStats.topics).map(([topicName, tData]) => {
                            const att = tData.correct + tData.incorrect;
                            const acc = att > 0 ? (tData.correct / att) * 100 : 0;
                            const neg = (tData.incorrect * 0.25).toFixed(2);
                            const status = acc >= 75 ? 'STRONG' : acc >= 50 ? 'AVERAGE' : 'WEAK';

                            return (
                              <tr key={topicName} className="hover:bg-slate-50 font-medium">
                                <td className="py-2.5 px-3 font-bold text-slate-800">{topicName}</td>
                                <td className="py-2.5 px-3 text-center text-slate-600">{tData.total}</td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="text-emerald-700 font-bold">{tData.correct}</span>
                                  <span className="text-slate-400 mx-1">/</span>
                                  <span className="text-red-600 font-bold">{tData.incorrect}</span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold">
                                  <span className={acc >= 75 ? 'text-emerald-700' : acc >= 50 ? 'text-amber-700' : 'text-red-600'}>
                                    {Math.round(acc)}%
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center text-red-600 font-semibold">
                                  {tData.incorrect > 0 ? `-${neg}` : '0.00'}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                                    status === 'STRONG' ? 'bg-emerald-100 text-emerald-800' :
                                    status === 'AVERAGE' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 bg-slate-50 rounded-lg text-center text-slate-500 border border-dashed border-slate-200">
                      <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold">No questions attempted in this section yet.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Take a sectional mock test or upload a {activeSectionMeta.shortName} practice paper.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WEAK AREAS & IMPROVEMENT RADAR */}
          {activeTab === 'WEAK_AREAS' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Diagnostic Weakness Radar & Action Plan</h3>
                  <p className="text-xs text-slate-500">
                    Pinpoints exact topics dragging your score down and provides corrective strategies
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500">Scope:</span>
                  <button
                    onClick={() => setHistoryScope(historyScope === 'ALL_ATTEMPTS' ? 'LATEST_ONLY' : 'ALL_ATTEMPTS')}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded font-semibold border border-slate-300"
                  >
                    {historyScope === 'ALL_ATTEMPTS' ? 'All Saved Attempts' : 'Latest Test Only'}
                  </button>
                </div>
              </div>

              {/* Priority 1: Critical Weaknesses (< 50% Accuracy) */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Priority 1: Critical Weaknesses (&lt;50% Accuracy) — Immediate Revision Needed
                  </h4>
                </div>

                {weakTopics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weakTopics.map((item, idx) => (
                      <div key={idx} className="bg-red-50/40 border border-red-200 rounded-xl p-4 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-red-700 tracking-wider">
                              {item.subjectName}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm">{item.topic}</h5>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-black text-red-700">{item.accuracy}%</span>
                            <p className="text-[10px] text-slate-400">Accuracy</p>
                          </div>
                        </div>

                        <div className="w-full bg-red-100 h-2 rounded-full overflow-hidden mb-3">
                          <div className="h-2 rounded-full bg-red-600" style={{ width: `${Math.max(5, item.accuracy)}%` }}></div>
                        </div>

                        <div className="text-xs space-y-1.5 text-slate-700 pt-1 border-t border-red-200/60">
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Mistakes Made:</span>
                            <span className="font-bold text-red-700">{item.incorrect} / {item.total} questions</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Penalty Incurred:</span>
                            <span className="font-bold text-red-700">-{item.negativeMarks} Marks</span>
                          </div>
                          <div className="bg-white/80 p-2 rounded border border-red-200 text-[11px] text-red-950 font-medium mt-2">
                            💡 <strong>Action:</strong> Stop guessing in {item.topic}. Review theoretical rules, solve 15 untimed drills, then attempt under 50s speed.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500">
                    <CheckCircle className="w-7 h-7 text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-700">No Critical Weaknesses Detected!</p>
                    <p className="text-[11px] text-slate-400">You maintain 50%+ accuracy across all tested topics.</p>
                  </div>
                )}
              </div>

              {/* Priority 2: Moderate Focus Areas (50% - 75% Accuracy) */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Priority 2: Moderate Topics (50% - 75% Accuracy) — Solid Foundation, Needs Precision
                  </h4>
                </div>

                {moderateTopics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {moderateTopics.map((item, idx) => (
                      <div key={idx} className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 shadow-2xs">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-amber-700 tracking-wider">
                              {item.subjectName}
                            </span>
                            <h5 className="font-extrabold text-slate-900 text-sm">{item.topic}</h5>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-black text-amber-700">{item.accuracy}%</span>
                            <p className="text-[10px] text-slate-400">Accuracy</p>
                          </div>
                        </div>

                        <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden mb-3">
                          <div className="h-2 rounded-full bg-amber-500" style={{ width: `${item.accuracy}%` }}></div>
                        </div>

                        <div className="text-xs space-y-1 text-slate-700 pt-1 border-t border-amber-200/60">
                          <div className="flex items-center justify-between text-[11px]">
                            <span>Score Potential:</span>
                            <span className="font-bold text-slate-800">{item.correct} / {item.total} correct</span>
                          </div>
                          <div className="bg-white/80 p-2 rounded border border-amber-200 text-[11px] text-amber-950 font-medium mt-2">
                            💡 <strong>Action:</strong> Good grasp. Focus on eliminating tricky edge-case distractors to push accuracy beyond 80%.
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center text-slate-400 text-xs">
                    No topics currently in the moderate bracket.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SPEED VS ACCURACY QUADRANT */}
          {activeTab === 'SPEED_ACCURACY' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Speed vs Accuracy Quadrant Diagnostic</h3>
                <p className="text-xs text-slate-500">
                  Categorizes every question you answered into 4 strategic quadrants based on response time and correctness
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quadrant 1: Fast & Accurate */}
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-emerald-900 text-sm">Quadrant 1: Fast & Accurate (Scoring Fortress)</h4>
                    <span className="text-base font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300">
                      {speedAccuracyData.fastAccurate} Questions
                    </span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed mb-3">
                    Questions answered correctly in under 60 seconds (Simplification, Syllogisms, Inequalities).
                  </p>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 font-medium">
                    🎯 <strong>Strategy:</strong> Attempt these first within minutes 1-8 of each section to bank high confidence and secure initial cutoff points.
                  </div>
                </div>

                {/* Quadrant 2: Slow & Accurate */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-blue-900 text-sm">Quadrant 2: Slow & Accurate (Need Shortcuts)</h4>
                    <span className="text-base font-black text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-300">
                      {speedAccuracyData.slowAccurate} Questions
                    </span>
                  </div>
                  <p className="text-xs text-blue-950 leading-relaxed mb-3">
                    Questions answered correctly but taking &gt;60 seconds (Arithmetic, Complex RC, Seating Arrangements).
                  </p>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-blue-200 text-[11px] text-blue-900 font-medium">
                    ⚡ <strong>Strategy:</strong> Concept is clear, but time is bleeding. Learn Vedic math multiplication, fraction-to-percentage tables, and puzzle case-splitting methods.
                  </div>
                </div>

                {/* Quadrant 3: Fast & Inaccurate */}
                <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-amber-900 text-sm">Quadrant 3: Fast & Inaccurate (Rash Guessing)</h4>
                    <span className="text-base font-black text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                      {speedAccuracyData.fastInaccurate} Questions
                    </span>
                  </div>
                  <p className="text-xs text-amber-950 leading-relaxed mb-3">
                    Questions answered hastily in &lt;50 seconds that resulted in wrong options and negative marking penalties.
                  </p>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                    ⚠️ <strong>Strategy:</strong> Careless mistake danger zone! Slow down by 5-10 seconds per question to verify negative clauses ("NOT follows", "EXCEPT", "FALSE").
                  </div>
                </div>

                {/* Quadrant 4: Slow & Inaccurate */}
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-red-900 text-sm">Quadrant 4: Slow & Inaccurate (Time Trap Danger)</h4>
                    <span className="text-base font-black text-red-700 bg-white px-2 py-0.5 rounded border border-red-300">
                      {speedAccuracyData.slowInaccurate} Questions
                    </span>
                  </div>
                  <p className="text-xs text-red-950 leading-relaxed mb-3">
                    Questions that consumed over a minute and still resulted in incorrect answers, delivering maximum damage.
                  </p>
                  <div className="bg-white/90 p-2.5 rounded-lg border border-red-200 text-[11px] text-red-900 font-medium">
                    🛑 <strong>Strategy:</strong> Establish a strict 60-second cutoff rule: If a puzzle or arithmetic calculation doesn't clearly resolve by 60 seconds, mark for review and move on immediately.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MY PREVIOUS ATTEMPTS & PROGRESSION */}
          {activeTab === 'PROGRESSION' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Your Saved Previous Attempts</h3>
                  <p className="text-xs text-slate-500">Every mock test you submit is stored here so you can analyze your solutions anytime.</p>
                </div>
              </div>

              {savedAttempts.length > 0 ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="min-w-full text-xs text-left divide-y divide-slate-200">
                    <thead className="bg-[#1f3f6c] text-white">
                      <tr>
                        <th className="py-3 px-3">Date & Time</th>
                        <th className="py-3 px-4">Test Title</th>
                        <th className="py-3 px-3 text-center">Score Scored</th>
                        <th className="py-3 px-3 text-center">Accuracy %</th>
                        <th className="py-3 px-3 text-center">Attempted</th>
                        <th className="py-3 px-3 text-center">Correct / Wrong</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {savedAttempts.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50 font-medium">
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                            <div className="flex items-center space-x-1.5">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>{att.date}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-800">{att.examTitle}</td>
                          <td className="py-3 px-3 text-center font-black text-blue-900 text-sm">
                            {att.score} <span className="text-[10px] text-slate-400 font-normal">/ {att.maxMarks}</span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-emerald-700">
                            {att.accuracy}%
                          </td>
                          <td className="py-3 px-3 text-center text-slate-700">
                            {att.attempted} / {att.totalQuestions}
                          </td>
                          <td className="py-3 px-3 text-center text-xs">
                            <span className="text-emerald-700 font-bold">{att.correct}</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="text-red-600 font-bold">{att.incorrect}</span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  if (onSelectAttemptForSolution) {
                                    onSelectAttemptForSolution(att);
                                  } else if (onReviewSolutions) {
                                    onReviewSolutions();
                                  }
                                }}
                                className="bg-[#1f3f6c] hover:bg-[#163054] text-white font-bold text-xs px-3 py-1.5 rounded transition flex items-center space-x-1"
                              >
                                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                                <span>Analyze Solutions</span>
                              </button>

                              <button
                                onClick={(e) => handleDeleteAttempt(e, att.id)}
                                className="text-slate-400 hover:text-red-600 p-1.5 rounded hover:bg-slate-100 transition"
                                title="Delete Attempt"
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
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center space-y-3">
                  <Clock className="w-12 h-12 text-slate-400 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-base">No Previous Test Attempts Saved Yet</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Take your first mock examination or upload a PDF question paper. When you submit your test, it will automatically appear here with your responses, scores, and detailed solutions!
                  </p>
                  {onTakeAnotherMock && (
                    <button
                      onClick={onTakeAnotherMock}
                      className="mt-3 bg-[#1f3f6c] hover:bg-[#163054] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow transition"
                    >
                      Start Your First Test Now
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
