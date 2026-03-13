import { Flame, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StatsBarProps {
  xp: number;
  streak: number;
  completedCount: number;
}

export function StatsBar({ xp, streak, completedCount }: StatsBarProps) {
  return (
    <div className="flex items-center gap-4 md:gap-6">
      <motion.div
        className="flex items-center gap-1.5 rounded-xl bg-xp/10 px-3 py-1.5 font-bold text-xp"
        whileHover={{ scale: 1.05 }}
      >
        <Zap className="h-4 w-4 fill-current" />
        <span className="text-sm">{xp} XP</span>
      </motion.div>
      {streak > 0 && (
        <motion.div
          className="flex items-center gap-1.5 rounded-xl bg-streak/10 px-3 py-1.5 font-bold text-streak"
          whileHover={{ scale: 1.05 }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 0], y: [0, -2, 0] }}
            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.8 }}
          >
            <Flame className="h-4 w-4 fill-current" />
          </motion.div>
          <span className="text-sm">{streak}</span>
        </motion.div>
      )}
      {streak === 0 && (
        <motion.div
          className="flex items-center gap-1.5 rounded-xl bg-streak/10 px-3 py-1.5 font-bold text-streak"
          whileHover={{ scale: 1.05 }}
        >
          <Flame className="h-4 w-4 fill-current" />
          <span className="text-sm">{streak}</span>
        </motion.div>
      )}
      <motion.div
        className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 font-bold text-primary"
        whileHover={{ scale: 1.05 }}
      >
        <Trophy className="h-4 w-4" />
        <span className="text-sm">{completedCount}</span>
      </motion.div>
    </div>
  );
}
