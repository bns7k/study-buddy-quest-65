import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Module } from "@/types/course";
import { useNavigate } from "react-router-dom";

interface ModuleCardProps {
  module: Module;
  courseId: string;
  index: number;
  progressPercent: number;
  isUnlocked: boolean;
}

export function ModuleCard({ module, courseId, index, progressPercent, isUnlocked }: ModuleCardProps) {
  const navigate = useNavigate();
  const isComplete = progressPercent === 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-2xl border-2 p-4 md:p-5 transition-all cursor-pointer ${
        isComplete
          ? "border-success/40 bg-success/5"
          : isUnlocked
          ? "border-primary/20 bg-card hover:border-primary/50 hover:shadow-lg"
          : "border-border bg-muted/50 opacity-60 cursor-not-allowed"
      }`}
      onClick={() => isUnlocked && navigate(`/course/${courseId}/module/${module.id}`)}
      whileHover={isUnlocked ? { scale: 1.01 } : {}}
      whileTap={isUnlocked ? { scale: 0.99 } : {}}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black ${
            isComplete
              ? "bg-success text-success-foreground"
              : isUnlocked
              ? "bg-primary text-primary-foreground"
              : "bg-locked text-muted-foreground"
          }`}
        >
          {isComplete ? <CheckCircle2 className="h-6 w-6" /> : isUnlocked ? module.weekNumber : <Lock className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Week {module.weekNumber}
          </p>
          <h3 className="font-extrabold text-foreground truncate">{module.title}</h3>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={progressPercent} className="h-2 flex-1" />
            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{progressPercent}%</span>
          </div>
        </div>
        {isUnlocked && (
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        )}
      </div>
    </motion.div>
  );
}
