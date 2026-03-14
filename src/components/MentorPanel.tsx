import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import professorImg from "@/assets/professor-aldric.png";
import { speakMumble, resumeAudio } from "@/lib/professor-voice";

interface MentorPanelProps {
  message: string;
  show: boolean;
}

export function MentorPanel({ message, show }: MentorPanelProps) {
  const [visible, setVisible] = useState(false);
  const [minimized, setMinimized] = useState(false);
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

  useEffect(() => {
    if (!show) {
      setMinimized(false);
    }
  }, [show]);

  // Typewriter + voice effect
  useEffect(() => {
    if (!visible || minimized || !message || message === prevMessageRef.current) return;
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
  }, [visible, message, minimized]);

  return (
    <AnimatePresence>
      {visible && (
        minimized ? (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => setMinimized(false)}
            className="fixed bottom-20 left-4 z-40 flex items-center gap-2 rounded-xl border border-accent/25 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm"
            aria-label="Expand mentor panel"
          >
            <img src={professorImg} alt="Professor Aldric" className="h-8 w-8 rounded-lg object-cover object-top" />
            <span className="text-xs font-bold text-accent">Mentor</span>
            <Maximize2 className="h-3.5 w-3.5 text-muted-foreground" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, x: -40, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -40, y: 20 }}
            transition={{ type: "spring", damping: 18, stiffness: 200 }}
            className="fixed bottom-20 left-1/2 z-40 flex w-[min(96vw,740px)] -translate-x-1/2 items-end justify-start gap-0 px-1 sm:px-0"
          >
            {/* Professor image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, -4, 0, -2, 0],
                rotate: [0, -1, 0, 1, 0],
              }}
              transition={{
                delay: 0.1,
                type: "spring",
                damping: 15,
                y: { delay: 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { delay: 0.5, duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative z-10 -mr-2 shrink-0"
            >
              <div className="h-28 w-28 overflow-hidden rounded-2xl border-2 border-accent/30 bg-card shadow-xl sm:h-36 sm:w-36 md:h-44 md:w-44">
                <img
                  src={professorImg}
                  alt="Professor Aldric"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              {/* Speaking indicator */}
              {isTyping && (
                <motion.div
                  className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-accent"
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
              className="relative ml-1 min-w-0 flex-1 max-w-[520px] sm:max-w-[560px]"
            >
              {/* Bubble tail */}
              <div className="absolute bottom-4 left-0 -ml-2 hidden h-4 w-4 rotate-45 border-b border-l border-border/60 bg-card sm:block" />

              <div className="relative rounded-2xl border border-border/60 bg-card p-4 shadow-lg">
                <button
                  onClick={() => setMinimized(true)}
                  className="absolute right-2 top-2 z-10 rounded-md p-1 text-muted-foreground hover:bg-muted"
                  aria-label="Minimize mentor panel"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                </button>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.04] to-transparent" />
                <p className="relative mb-1.5 text-[10px] font-black uppercase tracking-wider text-accent">
                  Professor Aldric
                </p>
                <p className="relative pr-6 text-sm leading-relaxed text-foreground">
                  "{displayedText}"
                  {isTyping && (
                    <motion.span
                      className="ml-0.5 inline-block h-4 w-0.5 align-middle bg-accent"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
