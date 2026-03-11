import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { StatsBar } from "@/components/StatsBar";
import { ModuleCard } from "@/components/ModuleCard";
import { useProgress } from "@/hooks/useProgress";
import { corporateFinanceCourse } from "@/data/corporate-finance";

const Index = () => {
  const { progress, getModuleProgress } = useProgress();
  const course = corporateFinanceCourse;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-foreground">​BME Finance fast track        </span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8">
          
          <div className="text-4xl mb-2">{course.emoji}</div>
          <h1 className="text-2xl font-black text-foreground md:text-3xl">{course.title}</h1>
          <p className="mt-1 text-muted-foreground">{course.description}</p>
        </motion.div>

        {/* Module List */}
        <div className="space-y-3">
          {course.modules.map((module, index) => {
            const lessonIds = module.lessons.map((l) => l.id);
            const moduleProg = getModuleProgress(lessonIds);
            // Unlock logic: first module always unlocked, others need previous module complete
            const prevModule = index > 0 ? course.modules[index - 1] : null;
            const prevComplete = prevModule ?
            getModuleProgress(prevModule.lessons.map((l) => l.id)) === 100 :
            true;
            const isUnlocked = index === 0 || prevComplete;

            return (
              <ModuleCard
                key={module.id}
                module={module}
                index={index}
                progressPercent={moduleProg}
                isUnlocked={isUnlocked} />);


          })}
        </div>
      </main>
    </div>);

};

export default Index;