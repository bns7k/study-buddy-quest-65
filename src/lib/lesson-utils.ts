import { Lesson } from "@/types/course";

export function getLessonType(lesson: Lesson, index: number, total: number): string {
  if (lesson.type) return lesson.type;
  if (index === 0) return "concept";
  if (index === total - 1 && total > 2) return "recap";
  return "quiz";
}

export function getLessonDuration(lesson: Lesson): number {
  return lesson.duration || Math.max(3, lesson.questions.length + 1);
}

export function getLessonXpReward(lesson: Lesson): number {
  return lesson.xpReward || lesson.questions.length * 10 + 25;
}

export function getLessonTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    concept: "Concept",
    quiz: "Quiz",
    practice: "Practice",
    recap: "Recap",
  };
  return labels[type] || "Lesson";
}

export function getLessonTypeColor(type: string): string {
  const colors: Record<string, string> = {
    concept: "bg-secondary text-secondary-foreground",
    quiz: "bg-primary/10 text-primary",
    practice: "bg-accent/10 text-accent",
    recap: "bg-muted text-muted-foreground",
  };
  return colors[type] || "bg-muted text-muted-foreground";
}
