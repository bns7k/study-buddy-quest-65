export type LessonType = "concept" | "quiz" | "practice" | "recap";

export type QuestionType = "multiple_choice" | "true_false" | "match_pairs" | "fill_blank" | "order_steps" | "numeric" | "flashcard";

export interface ConceptCard {
  title: string;
  content: string;
  formula?: string;
  example?: string;
}

export interface MatchPair {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionType?: QuestionType; // defaults to "multiple_choice"
  // Multiple choice / True-False
  options: string[];
  correctIndex: number;
  explanation: string;
  // Match pairs
  matchPairs?: MatchPair[];
  // Fill in the blank
  blankAnswer?: string;
  // Order steps
  correctOrder?: string[];
  // Numeric input
  numericAnswer?: number;
  numericTolerance?: number; // e.g. 0.01 means ±0.01
  // Flashcard
  flashcardBack?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type?: LessonType;
  duration?: number;
  xpReward?: number;
  explanation: string;
  learningObjectives?: string[];
  conceptCards?: ConceptCard[];
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  weekNumber: number;
  title: string;
  description?: string;
  learningObjectives?: string[];
  lessons: Lesson[];
  isBonus?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  modules: Module[];
}

export interface QuestionRecord {
  questionId: string;
  lessonId: string;
  courseId: string;
  wrongCount: number;
  correctCount: number;
  lastReviewDate: string;
  nextReviewDate: string;
  interval: number;
  mastered: boolean;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  lessonScores: Record<string, number>;
  weeklyXp?: Record<string, number>;
  questionRecords?: Record<string, QuestionRecord>;
  reviewStreak?: number;
  lastReviewDate?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: (progress: UserProgress) => boolean;
}
