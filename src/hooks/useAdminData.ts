import { useState, useEffect, useCallback } from "react";
import type { Course, Module, Lesson, QuizQuestion } from "@/types/course";
import { defaultCourses } from "@/data/courses";

const ADMIN_KEY = "studyapp-admin-data";

export interface AdminData {
  courses: Course[];
}

function loadAdminData(): AdminData {
  try {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { courses: structuredClone(defaultCourses) };
}

export function useAdminData() {
  const [data, setData] = useState<AdminData>(loadAdminData);

  useEffect(() => {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(data));
  }, [data]);

  // ── Courses (Subjects) ──
  const addCourse = useCallback((course: Course) => {
    setData((prev) => ({ courses: [...prev.courses, course] }));
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setData((prev) => ({
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setData((prev) => ({ courses: prev.courses.filter((c) => c.id !== id) }));
  }, []);

  // ── Modules ──
  const addModule = useCallback((courseId: string, mod: Module) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId ? { ...c, modules: [...c.modules, mod] } : c
      ),
    }));
  }, []);

  const updateModule = useCallback((courseId: string, moduleId: string, updates: Partial<Module>) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? { ...c, modules: c.modules.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)) }
          : c
      ),
    }));
  }, []);

  const deleteModule = useCallback((courseId: string, moduleId: string) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId ? { ...c, modules: c.modules.filter((m) => m.id !== moduleId) } : c
      ),
    }));
  }, []);

  const reorderModules = useCallback((courseId: string, moduleIds: string[]) => {
    setData((prev) => ({
      courses: prev.courses.map((c) => {
        if (c.id !== courseId) return c;
        const sorted = moduleIds.map((id) => c.modules.find((m) => m.id === id)!).filter(Boolean);
        return { ...c, modules: sorted };
      }),
    }));
  }, []);

  const reorderLessons = useCallback((courseId: string, moduleId: string, lessonIds: string[]) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) => {
                if (m.id !== moduleId) return m;
                const sorted = lessonIds.map((id) => m.lessons.find((l) => l.id === id)!).filter(Boolean);
                return { ...m, lessons: sorted };
              }),
            }
          : c
      ),
    }));
  }, []);

  // ── Lessons ──
  const addLesson = useCallback((courseId: string, moduleId: string, lesson: Lesson) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
              ),
            }
          : c
      ),
    }));
  }, []);

  const updateLesson = useCallback((courseId: string, moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId
                  ? { ...m, lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)) }
                  : m
              ),
            }
          : c
      ),
    }));
  }, []);

  const deleteLesson = useCallback((courseId: string, moduleId: string, lessonId: string) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId ? { ...m, lessons: m.lessons.filter((l) => l.id !== lessonId) } : m
              ),
            }
          : c
      ),
    }));
  }, []);

  // ── Questions ──
  const addQuestion = useCallback((courseId: string, moduleId: string, lessonId: string, question: QuizQuestion) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId
                  ? {
                      ...m,
                      lessons: m.lessons.map((l) =>
                        l.id === lessonId ? { ...l, questions: [...l.questions, question] } : l
                      ),
                    }
                  : m
              ),
            }
          : c
      ),
    }));
  }, []);

  const updateQuestion = useCallback(
    (courseId: string, moduleId: string, lessonId: string, questionId: string, updates: Partial<QuizQuestion>) => {
      setData((prev) => ({
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? {
                ...c,
                modules: c.modules.map((m) =>
                  m.id === moduleId
                    ? {
                        ...m,
                        lessons: m.lessons.map((l) =>
                          l.id === lessonId
                            ? { ...l, questions: l.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)) }
                            : l
                        ),
                      }
                    : m
                ),
              }
            : c
        ),
      }));
    },
    []
  );

  const deleteQuestion = useCallback((courseId: string, moduleId: string, lessonId: string, questionId: string) => {
    setData((prev) => ({
      courses: prev.courses.map((c) =>
        c.id === courseId
          ? {
              ...c,
              modules: c.modules.map((m) =>
                m.id === moduleId
                  ? {
                      ...m,
                      lessons: m.lessons.map((l) =>
                        l.id === lessonId ? { ...l, questions: l.questions.filter((q) => q.id !== questionId) } : l
                      ),
                    }
                  : m
              ),
            }
          : c
      ),
    }));
  }, []);

  // ── Stats ──
  const stats = {
    courses: data.courses.length,
    modules: data.courses.reduce((a, c) => a + c.modules.length, 0),
    lessons: data.courses.reduce((a, c) => a + c.modules.reduce((b, m) => b + m.lessons.length, 0), 0),
    questions: data.courses.reduce(
      (a, c) => a + c.modules.reduce((b, m) => b + m.lessons.reduce((d, l) => d + l.questions.length, 0), 0),
      0
    ),
  };

  const resetToDefaults = useCallback(() => {
    setData({ courses: structuredClone(allCourses) });
  }, []);

  return {
    data,
    stats,
    addCourse, updateCourse, deleteCourse,
    addModule, updateModule, deleteModule, reorderModules, reorderLessons,
    addLesson, updateLesson, deleteLesson,
    addQuestion, updateQuestion, deleteQuestion,
    resetToDefaults,
  };
}
