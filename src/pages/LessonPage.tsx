import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizView } from "@/components/QuizView";
import { LessonIntro } from "@/components/LessonIntro";
import { LessonComplete } from "@/components/LessonComplete";
import { useProgress } from "@/hooks/useProgress";
import { getCourseById } from "@/data/courses";
import { getLessonXpReward } from "@/lib/lesson-utils";
import { allBadges } from "@/data/badges";

type LessonPhase = "intro" | "quiz" | "complete";

export default function LessonPage() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { progress, completeLesson, recordAnswer } = useProgress();
  const [phase, setPhase] = useState<LessonPhase>("intro");
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number } | null>(null);

  const course = getCourseById(courseId || "");
  const moduleIndex = course?.modules.findIndex((m) => m.id === moduleId) ?? -1;
  const module = course?.modules[moduleIndex];
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  // Count badges before completion for detecting new ones
  const previousBadgeCount = useMemo(
    () => allBadges.filter((b) => b.condition(progress)).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (!course || !module || !lesson) return <div className="p-8 text-center text-muted-foreground">Lesson not found</div>;

  const xpReward = getLessonXpReward(lesson);

  // Find next lesson in current module
  const currentLessonIndex = module.lessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentLessonIndex < module.lessons.length - 1 ? module.lessons[currentLessonIndex + 1] : null;

  // Find next module (when this is the last lesson)
  const isLastLesson = currentLessonIndex === module.lessons.length - 1;
  const nextModule = isLastLesson && moduleIndex < course.modules.length - 1
    ? course.modules[moduleIndex + 1]
    : null;

  const handleQuizComplete = (correct: number, total: number) => {
    completeLesson(lesson.id, correct, total);
    setQuizResult({ correct, total });
    setPhase("complete");
  };

  const handleRetry = () => {
    setQuizResult(null);
    setPhase("intro");
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      navigate(`/course/${courseId}/module/${moduleId}/lesson/${nextLesson.id}`);
      setPhase("intro");
      setQuizResult(null);
    }
  };

  const handleNextModule = () => {
    if (nextModule) {
      navigate(`/course/${courseId}/module/${nextModule.id}`);
    }
  };

  const showMinimalHeader = phase === "quiz";

  return (
    <div className="min-h-screen bg-background">
      {showMinimalHeader ? (
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
              className="shrink-0 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
            <Progress value={0} className="h-2.5 flex-1" />
            <div className="flex items-center gap-1 rounded-lg bg-xp/10 px-2 py-1">
              <Zap className="h-3.5 w-3.5 text-xp fill-xp" />
              <span className="text-xs font-bold text-xp">{xpReward}</span>
            </div>
          </div>
        </header>
      ) : (
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
              className="rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
            <span className="text-sm font-bold text-muted-foreground">{lesson.title}</span>
            <div className="w-10" />
          </div>
        </header>
      )}

      <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
        {phase === "intro" && (
          <LessonIntro
            lesson={lesson}
            moduleName={module.title}
            weekNumber={module.weekNumber}
            onStart={() => setPhase("quiz")}
          />
        )}

        {phase === "quiz" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <QuizView
              questions={lesson.questions}
              onComplete={handleQuizComplete}
              onAnswer={(qId, correct) => recordAnswer(qId, lesson.id, courseId || "", correct)}
            />
          </motion.div>
        )}

        {phase === "complete" && quizResult && (
          <LessonComplete
            correctCount={quizResult.correct}
            totalCount={quizResult.total}
            xpEarned={quizResult.correct * 10 + (quizResult.correct === quizResult.total ? 25 : 0)}
            streak={progress.streak}
            progress={progress}
            previousBadgeCount={previousBadgeCount}
            onNextLesson={nextLesson ? handleNextLesson : undefined}
            onNextModule={nextModule ? handleNextModule : undefined}
            nextModuleName={nextModule?.title}
            onRetry={handleRetry}
            onBackToModule={() => navigate(`/course/${courseId}/module/${moduleId}`)}
          />
        )}
      </main>
    </div>
  );
}
