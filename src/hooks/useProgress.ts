import { useState, useEffect, useCallback } from "react";
import { UserProgress, QuestionRecord } from "@/types/course";

const STORAGE_KEY = "studyapp-progress";
const XP_PER_CORRECT = 10;
const XP_BONUS_PERFECT = 25;
const INTERVAL_STEPS = [1, 3, 7, 14, 30, 60];

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    xp: 0, streak: 0, lastActiveDate: "", completedLessons: [],
    lessonScores: {}, weeklyXp: {}, questionRecords: {},
    reviewStreak: 0, lastReviewDate: "",
  };
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

  // Record individual question answer for spaced repetition
  const recordAnswer = useCallback((questionId: string, lessonId: string, courseId: string, wasCorrect: boolean) => {
    setProgress((prev) => {
      const today = getToday();
      const records = { ...(prev.questionRecords || {}) };
      const existing = records[questionId];

      if (wasCorrect) {
        const currentInterval = existing?.interval || 0;
        const stepIndex = INTERVAL_STEPS.indexOf(currentInterval);
        const nextInterval = INTERVAL_STEPS[Math.min(stepIndex + 1, INTERVAL_STEPS.length - 1)] || INTERVAL_STEPS[0];
        records[questionId] = {
          questionId, lessonId, courseId,
          wrongCount: existing?.wrongCount || 0,
          correctCount: (existing?.correctCount || 0) + 1,
          lastReviewDate: today,
          nextReviewDate: addDays(today, nextInterval),
          interval: nextInterval,
          mastered: nextInterval >= 30,
        };
      } else {
        records[questionId] = {
          questionId, lessonId, courseId,
          wrongCount: (existing?.wrongCount || 0) + 1,
          correctCount: existing?.correctCount || 0,
          lastReviewDate: today,
          nextReviewDate: addDays(today, 1),
          interval: 1,
          mastered: false,
        };
      }

      return { ...prev, questionRecords: records };
    });
  }, []);

  // Update review streak
  const completeReview = useCallback(() => {
    const today = getToday();
    setProgress((prev) => {
      if (prev.lastReviewDate === today) return prev;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().split("T")[0];
      const newStreak = prev.lastReviewDate === yStr ? (prev.reviewStreak || 0) + 1 : 1;
      return { ...prev, reviewStreak: newStreak, lastReviewDate: today };
    });
  }, []);

  // Get questions due for review today
  const getDueQuestions = useCallback(() => {
    const today = getToday();
    const records = progress.questionRecords || {};
    return Object.values(records).filter((r) => r.nextReviewDate <= today && !r.mastered);
  }, [progress.questionRecords]);

  // Get wrong questions (ever got wrong)
  const getWrongQuestions = useCallback(() => {
    const records = progress.questionRecords || {};
    return Object.values(records).filter((r) => r.wrongCount > 0);
  }, [progress.questionRecords]);

  // Get mastered questions
  const getMasteredCount = useCallback(() => {
    const records = progress.questionRecords || {};
    return Object.values(records).filter((r) => r.mastered).length;
  }, [progress.questionRecords]);

  const isLessonCompleted = useCallback((lessonId: string) => progress.completedLessons.includes(lessonId), [progress.completedLessons]);
  const getLessonScore = useCallback((lessonId: string) => progress.lessonScores[lessonId] ?? null, [progress.lessonScores]);
  const getModuleProgress = useCallback((lessonIds: string[]) => {
    const completed = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
    return lessonIds.length > 0 ? Math.round((completed / lessonIds.length) * 100) : 0;
  }, [progress.completedLessons]);

  return {
    progress, completeLesson, isLessonCompleted, getLessonScore, getModuleProgress,
    recordAnswer, completeReview, getDueQuestions, getWrongQuestions, getMasteredCount,
  };
}
