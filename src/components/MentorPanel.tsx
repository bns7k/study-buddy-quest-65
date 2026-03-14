import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import professorImg from "@/assets/professor-aldric.png";

interface MentorPanelProps {
  message: string;
  show: boolean;
}

export function MentorPanel({ message, show }: MentorPanelProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [show]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-16 left-1/2 z-40 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2"
        >
          <div className="relative flex items-end gap-3 rounded-2xl border border-border/60 bg-card p-3.5 shadow-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.03] to-transparent pointer-events-none" />
            
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
              <span className="text-2xl">🧙‍♂️</span>
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs font-black text-accent">Professor Aldric</p>
              </div>
              <p className="text-sm text-foreground leading-snug">"{message}"</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
