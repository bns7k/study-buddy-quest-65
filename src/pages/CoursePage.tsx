import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/StatsBar";
import { ModuleCard } from "@/components/ModuleCard";
import { useProgress } from "@/hooks/useProgress";
import { getCourseById } from "@/data/courses";
import { BottomNav } from "@/components/BottomNav";

export default function CoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { progress, getModuleProgress } = useProgress();

  const course = getCourseById(courseId || "");
  if (!course) return <div className="p-8 text-center text-muted-foreground">Course not found</div>;

  return (
    <div className="min-h-screen bg-background pb-20">
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

      <main className="mx-auto max-w-2xl px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4 gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All Courses
        </Button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="text-4xl mb-2">{course.emoji}</div>
          <h1 className="text-2xl font-black text-foreground md:text-3xl">{course.title}</h1>
          <p className="mt-1 text-muted-foreground">{course.description}</p>
        </motion.div>

        {/* Exam Mode Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Button
            onClick={() => navigate(`/course/${courseId}/exam`)}
            variant="outline"
            className="w-full gap-2 rounded-2xl font-bold h-14 text-base border-2 border-accent/40 bg-accent/5 text-accent hover:bg-accent/10 hover:text-accent"
          >
            <FileText className="h-5 w-5" />
            Exam Mode — Mock Tests & Formula Review
          </Button>
        </motion.div>

        <div className="space-y-3">
          {course.modules.map((module, index) => {
            const lessonIds = module.lessons.map((l) => l.id);
            const moduleProg = getModuleProgress(lessonIds);
            const prevModule = index > 0 ? course.modules[index - 1] : null;
            const prevComplete = prevModule
              ? getModuleProgress(prevModule.lessons.map((l) => l.id)) === 100
              : true;
            const isUnlocked = index === 0 || prevComplete;

            return (
              <ModuleCard
                key={module.id}
                module={module}
                courseId={course.id}
                index={index}
                progressPercent={moduleProg}
                isUnlocked={isUnlocked}
              />
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
