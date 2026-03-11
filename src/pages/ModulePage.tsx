import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GraduationCap, Target, Lock, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonCard } from "@/components/LessonCard";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { getCourseById } from "@/data/courses";
import { Progress } from "@/components/ui/progress";
import { moduleMetadata } from "@/data/module-metadata";
import { BottomNav } from "@/components/BottomNav";

export default function ModulePage() {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { progress, isLessonCompleted, getLessonScore, getModuleProgress } = useProgress();

  const course = getCourseById(courseId || "");
  const moduleIndex = course?.modules.findIndex((m) => m.id === moduleId) ?? -1;
  const module = course?.modules[moduleIndex];
  if (!course || !module) return <div className="p-8 text-center text-muted-foreground">Module not found</div>;

  const lessonIds = module.lessons.map((l) => l.id);
  const moduleProg = getModuleProgress(lessonIds);
  const meta = module.description ? { description: module.description, learningObjectives: module.learningObjectives || [] } : moduleMetadata[module.id];

  // Next module unlock info
  const nextModule = moduleIndex < course.modules.length - 1 ? course.modules[moduleIndex + 1] : null;
  const isModuleComplete = moduleProg === 100;

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
        <Button variant="ghost" onClick={() => navigate(`/course/${courseId}`)} className="mb-4 gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground">
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

        {/* Module Description & Objectives */}
        {meta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-5 rounded-2xl border-2 border-border bg-card p-5"
          >
            <p className="text-sm leading-relaxed text-foreground/80">{meta.description}</p>
            {meta.learningObjectives.length > 0 && (
              <div className="mt-4">
                <h3 className="flex items-center gap-2 text-sm font-extrabold text-foreground">
                  <Target className="h-4 w-4 text-primary" /> Learning Objectives
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {meta.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {i + 1}
                      </span>
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Lessons */}
        <h3 className="mt-6 mb-3 text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Lessons</h3>
        <div className="space-y-3">
          {module.lessons.map((lesson, index) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              courseId={courseId!}
              moduleId={module.id}
              index={index}
              totalLessons={module.lessons.length}
              isCompleted={isLessonCompleted(lesson.id)}
              score={getLessonScore(lesson.id)}
            />
          ))}
        </div>

        {/* Module Challenge / Unlock */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 rounded-2xl border-2 p-5 ${
            isModuleComplete ? "border-success/30 bg-success/5" : "border-border bg-card"
          }`}
        >
          {isModuleComplete ? (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success text-success-foreground">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">Module Complete! 🎉</h3>
                <p className="text-sm text-muted-foreground">
                  {nextModule
                    ? `You've unlocked Week ${nextModule.weekNumber}: ${nextModule.title}`
                    : "You've completed all modules in this course!"}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                <Lock className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">Module Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  Complete all {module.lessons.length} lessons to unlock{" "}
                  {nextModule ? `Week ${nextModule.weekNumber}` : "the next module"}.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
