import { Flame, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBarProps {
  xp: number;
  streak: number;
  completedCount: number;
}

export function StatsBar({ xp, streak, completedCount }: StatsBarProps) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <motion.div
        className="flex items-center gap-1.5 rounded-xl bg-xp/10 px-2.5 py-1.5 font-bold text-xp"
        whileHover={{ scale: 1.05 }}
      >
        <Zap className="h-3.5 w-3.5 fill-current" />
        <span className="text-xs">{xp}</span>
      </motion.div>
      <motion.div
        className="flex items-center gap-1.5 rounded-xl bg-streak/10 px-2.5 py-1.5 font-bold text-streak"
        whileHover={{ scale: 1.05 }}
        animate={streak > 0 ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.5 }}
      >
        <Flame className="h-3.5 w-3.5 fill-current" />
        <span className="text-xs">{streak}</span>
      </motion.div>
      <motion.div
        className="flex items-center gap-1.5 rounded-xl bg-accent/10 px-2.5 py-1.5 font-bold text-accent"
        whileHover={{ scale: 1.05 }}
      >
        <Trophy className="h-3.5 w-3.5" />
        <span className="text-xs">{completedCount}</span>
      </motion.div>
    </div>
  );
}
