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
  explanation: string;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  weekNumber: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  modules: Module[];
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  lessonScores: Record<string, number>;
}
