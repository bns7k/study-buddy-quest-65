import { Badge } from "@/types/course";

export const allBadges: Badge[] = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson", emoji: "🎯", condition: (p) => p.completedLessons.length >= 1 },
  { id: "five-lessons", title: "Getting Started", description: "Complete 5 lessons", emoji: "📚", condition: (p) => p.completedLessons.length >= 5 },
  { id: "ten-lessons", title: "Dedicated Learner", description: "Complete 10 lessons", emoji: "🌟", condition: (p) => p.completedLessons.length >= 10 },
  { id: "twenty-lessons", title: "Knowledge Seeker", description: "Complete 20 lessons", emoji: "🧠", condition: (p) => p.completedLessons.length >= 20 },
  { id: "fifty-lessons", title: "Scholar", description: "Complete 50 lessons", emoji: "🎓", condition: (p) => p.completedLessons.length >= 50 },
  { id: "streak-3", title: "On Fire", description: "Maintain a 3-day streak", emoji: "🔥", condition: (p) => p.streak >= 3 },
  { id: "streak-7", title: "Week Warrior", description: "Maintain a 7-day streak", emoji: "⚡", condition: (p) => p.streak >= 7 },
  { id: "streak-14", title: "Unstoppable", description: "Maintain a 14-day streak", emoji: "💪", condition: (p) => p.streak >= 14 },
  { id: "streak-30", title: "Monthly Master", description: "Maintain a 30-day streak", emoji: "💎", condition: (p) => p.streak >= 30 },
  { id: "xp-100", title: "Century Club", description: "Earn 100 XP", emoji: "💯", condition: (p) => p.xp >= 100 },
  { id: "xp-500", title: "XP Hunter", description: "Earn 500 XP", emoji: "🏆", condition: (p) => p.xp >= 500 },
  { id: "xp-1000", title: "XP Legend", description: "Earn 1,000 XP", emoji: "👑", condition: (p) => p.xp >= 1000 },
  { id: "xp-5000", title: "XP Titan", description: "Earn 5,000 XP", emoji: "🌠", condition: (p) => p.xp >= 5000 },
  { id: "perfect-score", title: "Perfectionist", description: "Score 100% on any quiz", emoji: "✨", condition: (p) => Object.values(p.lessonScores).some((s) => s === 100) },
  { id: "five-perfect", title: "Quiz Master", description: "Score 100% on 5 quizzes", emoji: "🎯", condition: (p) => Object.values(p.lessonScores).filter((s) => s === 100).length >= 5 },
  { id: "finance-beginner", title: "Finance Beginner", description: "Complete your first finance module", emoji: "📊", condition: (p) => p.completedLessons.length >= 2 },
];
