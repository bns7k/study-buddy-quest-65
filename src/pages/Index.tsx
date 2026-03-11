import { motion } from "framer-motion";
import { GraduationCap, Settings, Shield } from "lucide-react";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { getAllCourses } from "@/data/courses";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/BottomNav";

const Index = () => {
  const { progress, getModuleProgress } = useProgress();
  const navigate = useNavigate();
  const courses = getAllCourses();

  const getCourseProgress = (course: typeof courses[0]) => {
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    return getModuleProgress(allLessonIds);
  };

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
          <div className="flex gap-1">
            <button onClick={() => navigate("/admin")} className="rounded-xl p-1.5 hover:bg-muted">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/settings")} className="rounded-xl p-1.5 hover:bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-black text-foreground md:text-3xl">Your Courses</h1>
          <p className="mt-1 text-muted-foreground">Choose a course to start learning</p>
        </motion.div>

        <div className="space-y-4">
          {courses.map((course, index) => {
            const courseProg = getCourseProgress(course);
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="group cursor-pointer overflow-hidden rounded-2xl border-2 border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                onClick={() => navigate(`/course/${course.id}`)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                    {course.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-extrabold text-foreground">{course.title}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <Progress value={courseProg} className="h-2 flex-1" />
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{courseProg}%</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {course.modules.length} modules · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Index;
