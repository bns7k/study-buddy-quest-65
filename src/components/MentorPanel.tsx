import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

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
          <div className="relative flex items-end gap-3 rounded-xl border border-accent/20 bg-card/95 p-3 shadow-2xl backdrop-blur-lg overflow-hidden">
            {/* Parchment texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.03] to-transparent pointer-events-none" />
            
            {/* Mentor avatar */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
              <span className="text-3xl">🧙‍♂️</span>
              <BookOpen className="absolute -bottom-1 -right-1 h-4 w-4 text-accent opacity-60" />
            </div>
            <div className="relative flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-xs font-black text-accent">Professor Aldric</p>
                <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">Guild Mentor</span>
              </div>
              <p className="text-sm text-foreground leading-snug italic">"{message}"</p>
            </div>

            {/* Decorative corner */}
            <svg className="absolute top-0 right-0 h-6 w-6 text-accent opacity-10" viewBox="0 0 24 24" fill="none">
              <path d="M24 0v8c0 4-2 6-6 6H0" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
