import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

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
          <div className="flex items-end gap-3 rounded-2xl border border-border bg-card/95 p-3 shadow-xl backdrop-blur-lg">
            {/* Mentor avatar */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl">
              🧙‍♂️
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-primary mb-0.5">Professor Aldric</p>
              <p className="text-sm text-foreground leading-snug">{message}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
