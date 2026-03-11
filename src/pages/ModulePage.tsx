import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonCard } from "@/components/LessonCard";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { corporateFinanceCourse } from "@/data/corporate-finance";
import { Progress } from "@/components/ui/progress";
import { GraduationCap } from "lucide-react";

export default function ModulePage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { progress, isLessonCompleted, getLessonScore, getModuleProgress } = useProgress();

  const module = corporateFinanceCourse.modules.find((m) => m.id === moduleId);
  if (!module) return <div className="p-8 text-center text-muted-foreground">Module not found</div>;

  const lessonIds = module.lessons.map((l) => l.id);
  const moduleProg = getModuleProgress(lessonIds);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-foreground">FinLearn</span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Course
        </Button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Week {module.weekNumber}</p>
          <h1 className="text-2xl font-black text-foreground">{module.title}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Progress value={moduleProg} className="h-2.5 flex-1" />
            <span className="text-sm font-bold text-muted-foreground">{moduleProg}%</span>
          </div>
        </motion.div>

        <div className="mt-6 space-y-3">
          {module.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              moduleId={module.id}
              index={index}
              isCompleted={isLessonCompleted(lesson.id)}
              score={getLessonScore(lesson.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
