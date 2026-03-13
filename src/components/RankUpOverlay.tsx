import { motion, AnimatePresence } from "framer-motion";
import { Rank } from "@/lib/ranks";

interface RankUpOverlayProps {
  rank: Rank | null;
  show: boolean;
  onClose: () => void;
}

export function RankUpOverlay({ rank, show, onClose }: RankUpOverlayProps) {
  if (!rank) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-accent/30 bg-card p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, repeat: 2 }}
              className="text-6xl"
            >
              {rank.emoji}
            </motion.div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">New Rank Unlocked</p>
            <p className="text-2xl font-black text-foreground">{rank.title}</p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
