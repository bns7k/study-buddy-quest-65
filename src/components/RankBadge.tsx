import { getRank } from "@/lib/ranks";
import { motion } from "framer-motion";

interface RankBadgeProps {
  completedCount: number;
}

export function RankBadge({ completedCount }: RankBadgeProps) {
  const rank = getRank(completedCount);
  return (
    <motion.div
      className="flex items-center gap-1.5 rounded-xl bg-accent/15 px-3 py-1.5 font-bold text-accent"
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-sm">{rank.emoji}</span>
      <span className="text-xs">{rank.title}</span>
    </motion.div>
  );
}
