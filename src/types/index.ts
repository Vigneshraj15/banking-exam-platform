// ====================================================================
// Indian Banking Competitive Examination Platform - TypeScript Types
// ====================================================================

export type QuestionStatus =
  | 'NOT_VISITED'
  | 'NOT_ANSWERED'
  | 'ANSWERED'
  | 'MARKED_FOR_REVIEW'
  | 'ANSWERED_AND_MARKED';

export type ExamCategoryCode = 
  | 'SBI' 
  | 'IBPS' 
  | 'RBI' 
  | 'NABARD' 
  | 'CUSTOM'
  | 'ENGINEERING_MEDICAL'
  | 'CIVIL_SERVICES'
  | 'MANAGEMENT_APTITUDE'
  | 'BANKING_GOVT';

export type SubjectCode = 
  | 'QUANTITATIVE_APTITUDE'
  | 'REASONING_ABILITY'
  | 'ENGLISH_LANGUAGE'
  | 'GENERAL_AWARENESS'
  | 'COMPUTER_APTITUDE';

export type DifficultyLevel = 'EASY' | 'MODERATE' | 'DIFFICULT';

export interface QuestionOption {
  id: string;
  key: 'A' | 'B' | 'C' | 'D' | 'E';
  text: string;
  isCorrect?: boolean;
}

export interface QuestionGroup {
  id: string;
  title: string;
  type: 'PASSAGE' | 'PUZZLE' | 'SEATING_ARRANGEMENT' | 'DATA_INTERPRETATION' | 'CASELET';
  content: string; // The shared text/dataset/rules
  tableData?: Array<Record<string, string | number>>; // Optional structured DI table
  imageUrl?: string;
  imageCaption?: string;
}

export interface Question {
  id: string;
  examId?: string;
  sectionId?: string;
  subject: SubjectCode;
  topic: string;
  subtopic?: string;
  questionNumber: number;
  type: 'MCQ_5_OPTION' | 'NUMERICAL';
  statement: string;
  imageUrl?: string;
  imageCaption?: string;
  hasMath?: boolean;
  latex?: string;
  options: QuestionOption[];
  correctOptionKey: 'A' | 'B' | 'C' | 'D' | 'E';
  hasExplicitKey?: boolean;
  isPdfOriginalKey?: boolean;
  positiveMarks: number;
  negativeMarks: number;
  difficulty: DifficultyLevel;
  source?: string;
  year?: number;
  groupId?: string;
  group?: QuestionGroup;
  solution: DetailedSolution;
}

export interface DetailedSolution {
  stepByStep: string[];
  shortcutMethod?: string;
  keyFormula?: string;
  reasoningDeductionGrid?: Array<{ step: string; deduction: string; eliminated?: string }>;
  incorrectOptionsExplanation?: Record<string, string>;
  videoSolutionUrl?: string;
  isFacultyVerified: boolean;
  verifiedBy?: string;
}

export interface ExamSection {
  id: string;
  title: string;
  subject: SubjectCode;
  order: number;
  durationMinutes: number; // e.g. 20 min in Prelims
  positiveMarksPerQuestion: number;
  negativeMarksPerQuestion: number;
  sectionalQualifyingMarks: number;
  totalQuestions: number;
  questions: Question[];
}

export interface Exam {
  id: string;
  title: string;
  category: ExamCategoryCode;
  subCategory: string; // e.g. 'SBI PO Prelims', 'IBPS RRB Officer Scale I', 'Uploaded PDF Paper'
  code: string;
  description: string;
  instructions: string[];
  durationMinutes: number; // Total exam duration
  hasSectionalTiming: boolean;
  allowSectionSwitching: boolean;
  totalMarks: number;
  totalQuestions: number;
  sections: ExamSection[];
  cutoffEstimates?: {
    general: number;
    obc: number;
    sc: number;
    st: number;
    ews: number;
  };
  isActive: boolean;
  isUserUploaded?: boolean;
}

export interface StudentResponse {
  questionId: string;
  selectedOptionKey: 'A' | 'B' | 'C' | 'D' | 'E' | null;
  status: QuestionStatus;
  timeSpentSeconds: number;
  isCorrect?: boolean;
  marksAwarded?: number;
}

export interface SecurityViolation {
  id: string;
  timestamp: string;
  type: 'FULLSCREEN_EXIT' | 'TAB_SWITCH' | 'FOCUS_LOST' | 'RIGHT_CLICK_ATTEMPT';
  message: string;
}

export interface ExamResult {
  attemptId: string;
  totalMarksScored: number;
  maxMarks: number;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  accuracyPercentage: number;
  totalTimeSeconds: number;
  sectionalPerformance: Array<{
    sectionName: string;
    subject: SubjectCode;
    marksScored: number;
    totalMarks: number;
    attempted: number;
    correct: number;
    incorrect: number;
    accuracy: number;
    timeSpentSeconds: number;
    clearedCutoff: boolean;
    cutoff: number;
  }>;
  topicBreakdown: Array<{
    topic: string;
    subject: SubjectCode;
    totalQuestions: number;
    correct: number;
    accuracy: number;
    avgTimePerQuestion: number;
    status: 'STRONG' | 'AVERAGE' | 'WEAK';
  }>;
  speedAccuracyMatrix: {
    fastAndAccurate: number;
    slowAndAccurate: number;
    fastAndInaccurate: number;
    slowAndInaccurate: number;
  };
  personalizedRecommendations: string[];
}

export interface SavedAttempt {
  id: string;
  examId: string;
  examTitle: string;
  exam: Exam;
  date: string;
  score: number;
  maxMarks: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  skipped: number;
  accuracy: number;
  timeSpentSeconds: number;
  responses: Record<string, StudentResponse>;
  result: ExamResult;
}

export interface PausedExamSession {
  examId: string;
  examTitle: string;
  exam: Exam;
  remainingSeconds: number;
  totalDurationSeconds: number;
  responses: Record<string, StudentResponse>;
  visitedQuestionIds: string[];
  markedForReviewIds: string[];
  currentSectionIndex: number;
  currentQuestionIndex: number;
  attemptedCount: number;
  totalQuestions: number;
  pausedAt: string;
  timestamp: number;
}

export interface ExtractedQuestionDraft {
  tempId: string;
  questionNumber: number;
  subject: SubjectCode;
  topic: string;
  statement: string;
  imageUrl?: string;
  imageCaption?: string;
  groupTitle?: string;
  groupPassage?: string;
  groupImageUrl?: string;
  options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[];
  correctOptionKey: 'A' | 'B' | 'C' | 'D' | 'E';
  hasExplicitKey?: boolean;
  isPdfOriginalKey?: boolean;
  detailedSolution: string;
  shortcutMethod?: string;
  difficulty: DifficultyLevel;
  positiveMarks: number;
  negativeMarks: number;
  confidenceScore: number; // 0 to 100
  isApproved: boolean;
}
