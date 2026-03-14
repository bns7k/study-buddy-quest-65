import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import professorImg from "@/assets/professor-aldric.png";
import { speakMumble, resumeAudio } from "@/lib/professor-voice";

interface MentorPanelProps {
  message: string;
  show: boolean;
}

export function MentorPanel({ message, show }: MentorPanelProps) {
  const [visible, setVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const prevMessageRef = useRef("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [show]);

  // Typewriter + voice effect
  useEffect(() => {
    if (!visible || !message || message === prevMessageRef.current) return;
    prevMessageRef.current = message;

    // Clear previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    let phraseCount = 0;
    const maxPhrases = 2 + Math.floor(Math.random() * 2); // 2-3 phrases

    // First mumble immediately
    resumeAudio();
    speakMumble();
    phraseCount++;

    intervalRef.current = setInterval(() => {
      charIndex++;
      if (charIndex >= message.length) {
        setDisplayedText(message);
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      setDisplayedText(message.slice(0, charIndex));

      // Trigger additional mumbles at intervals
      if (phraseCount < maxPhrases && charIndex % (25 + Math.floor(Math.random() * 15)) === 0) {
        resumeAudio();
        speakMumble();
        phraseCount++;
      }
    }, 28);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, message]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40, y: 20 }}
          transition={{ type: "spring", damping: 18, stiffness: 200 }}
          className="fixed bottom-20 left-3 z-40 flex items-end gap-0 sm:left-6"
        >
          {/* Professor image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", damping: 15 }}
            className="relative z-10 -mr-2 shrink-0"
          >
            <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl overflow-hidden border-2 border-accent/30 shadow-xl bg-card">
              <img
                src={professorImg}
                alt="Professor Aldric"
                className="h-full w-full object-cover object-top"
              />
            </div>
            {/* Speaking indicator */}
            {isTyping && (
              <motion.div
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </motion.div>

          {/* Speech bubble */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.2, type: "spring", damping: 20 }}
            className="relative ml-1 max-w-xs sm:max-w-sm"
          >
            {/* Bubble tail */}
            <div className="absolute left-0 bottom-4 -ml-2 h-4 w-4 rotate-45 border-l border-b border-border/60 bg-card" />
            
            <div className="relative rounded-2xl border border-border/60 bg-card p-4 shadow-lg">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.04] to-transparent pointer-events-none" />
              <p className="relative text-[10px] font-black text-accent uppercase tracking-wider mb-1.5">
                Professor Aldric
              </p>
              <p className="relative text-sm text-foreground leading-relaxed">
                "{displayedText}"
                {isTyping && (
                  <motion.span
                    className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
