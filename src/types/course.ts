export type LessonType = "concept" | "quiz" | "practice" | "recap";

export interface ConceptCard {
  title: string;
  content: string;
  formula?: string;
  example?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  interval: number; // days until next review
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
