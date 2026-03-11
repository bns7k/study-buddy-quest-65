import { useState, useEffect, useCallback } from "react";
import { UserProgress } from "@/types/course";

const STORAGE_KEY = "studyapp-progress";
const XP_PER_CORRECT = 10;
const XP_BONUS_PERFECT = 25;

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { xp: 0, streak: 0, lastActiveDate: "", completedLessons: [], lessonScores: {}, weeklyXp: {} };
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const updateStreak = useCallback(() => {
    const today = getToday();
    setProgress((prev) => {
      if (prev.lastActiveDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const newStreak = prev.lastActiveDate === yStr ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastActiveDate: today };
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, correctCount: number, totalCount: number) => {
    updateStreak();
    setProgress((prev) => {
      const today = getToday();
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const earnedXP = correctCount * XP_PER_CORRECT + (correctCount === totalCount ? XP_BONUS_PERFECT : 0);
      const prevScore = prev.lessonScores[lessonId] ?? 0;
      const scorePercent = Math.round((correctCount / totalCount) * 100);
      const prevWeeklyXp = prev.weeklyXp || {};
      return {
        ...prev,
        xp: prev.xp + earnedXP,
        completedLessons: alreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId],
        lessonScores: { ...prev.lessonScores, [lessonId]: Math.max(prevScore, scorePercent) },
        weeklyXp: { ...prevWeeklyXp, [today]: (prevWeeklyXp[today] || 0) + earnedXP },
      };
    });
  }, [updateStreak]);

  const isLessonCompleted = useCallback((lessonId: string) => progress.completedLessons.includes(lessonId), [progress.completedLessons]);
  const getLessonScore = useCallback((lessonId: string) => progress.lessonScores[lessonId] ?? null, [progress.lessonScores]);
  const getModuleProgress = useCallback((lessonIds: string[]) => {
    const completed = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
    return lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0;
  }, [progress.completedLessons]);

  return { progress, completeLesson, isLessonCompleted, getLessonScore, getModuleProgress };
}
