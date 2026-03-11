import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizView } from "@/components/QuizView";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { getCourseById } from "@/data/courses";

export default function LessonPage() {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { progress, completeLesson } = useProgress();
  const [showQuiz, setShowQuiz] = useState(false);

  const course = getCourseById(courseId || "");
  const module = course?.modules.find((m) => m.id === moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);

  if (!course || !module || !lesson) return <div className="p-8 text-center text-muted-foreground">Lesson not found</div>;

  const handleQuizComplete = (correct: number, total: number) => {
    completeLesson(lesson.id, correct, total);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-foreground">BME Finance fast track</span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
        <Button
          variant="ghost"
          onClick={() => navigate(`/course/${courseId}/module/${moduleId}`)}
          className="mb-4 gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Module
        </Button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Week {module.weekNumber} — {module.title}
          </p>
          <h1 className="text-2xl font-black text-foreground">{lesson.title}</h1>
        </motion.div>

        {!showQuiz ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-6 space-y-6"
          >
            <div className="rounded-2xl border-2 border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="font-extrabold text-foreground">Lesson</h2>
              </div>
              <p className="leading-relaxed text-foreground/90">{lesson.explanation}</p>
            </div>

            <Button
              onClick={() => setShowQuiz(true)}
              className="w-full gap-2 rounded-xl font-bold h-12 text-base"
            >
              Start Quiz <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <QuizView questions={lesson.questions} onComplete={handleQuizComplete} />
          </motion.div>
        )}
      </main>
    </div>
  );
}
