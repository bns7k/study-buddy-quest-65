import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
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
  const isBonus = module.isBonus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative overflow-hidden rounded-2xl border-2 p-4 md:p-5 transition-all cursor-pointer ${
        isComplete
          ? isBonus
            ? "border-bonus/40 bg-bonus/5"
            : "border-success/40 bg-success/5"
          : isUnlocked
          ? isBonus
            ? "border-bonus/25 bg-bonus/5 hover:border-bonus/50 hover:shadow-lg hover:shadow-bonus/10"
            : "border-primary/20 bg-card hover:border-primary/50 hover:shadow-lg"
          : "border-border bg-muted/50 opacity-60 cursor-not-allowed"
      }`}
      onClick={() => isUnlocked && navigate(`/course/${courseId}/module/${module.id}`)}
      whileHover={isUnlocked ? { scale: 1.01 } : {}}
      whileTap={isUnlocked ? { scale: 0.99 } : {}}
    >
      {isBonus && (
        <div className="absolute top-0 right-0 rounded-bl-xl bg-bonus px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-bonus-foreground">
          Bonus Project
        </div>
      )}
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-black ${
            isComplete
              ? isBonus
                ? "bg-bonus text-bonus-foreground"
                : "bg-success text-success-foreground"
              : isUnlocked
              ? isBonus
                ? "bg-bonus/15 text-bonus"
                : "bg-primary text-primary-foreground"
              : "bg-locked text-muted-foreground"
          }`}
        >
          {isComplete ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : isUnlocked ? (
            isBonus ? <Sparkles className="h-6 w-6" /> : module.weekNumber
          ) : (
            <Lock className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold uppercase tracking-wider ${isBonus ? "text-bonus" : "text-muted-foreground"}`}>
            {isBonus ? "Hands-on Project" : `Week ${module.weekNumber}`}
          </p>
          <h3 className="font-extrabold text-foreground truncate">{module.title}</h3>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={progressPercent} className={`h-2 flex-1 ${isBonus ? "[&>div]:bg-bonus" : ""}`} />
            <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{progressPercent}%</span>
          </div>
        </div>
        {isUnlocked && (
          <ChevronRight className={`h-5 w-5 transition-colors shrink-0 ${isBonus ? "text-bonus/50 group-hover:text-bonus" : "text-muted-foreground group-hover:text-primary"}`} />
        )}
      </div>
    </motion.div>
  );
}
