import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface FlashcardQuestionProps {
  question: string;
  flashcardBack: string;
  onAnswer: (correct: boolean) => void;
}

export function FlashcardQuestion({ question, flashcardBack, onAnswer }: FlashcardQuestionProps) {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleFlip = () => {
    if (!flipped) setFlipped(true);
  };

  const handleSelfGrade = (knew: boolean) => {
    setAnswered(true);
    onAnswer(knew);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-muted-foreground text-center">Tap the card to flip</p>

      <motion.div
        onClick={handleFlip}
        className="relative mx-auto w-full max-w-sm cursor-pointer perspective-1000"
        style={{ perspective: 1000 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative h-56"
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-primary/30 bg-card p-6 text-center backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-primary mb-3">Term</p>
            <h3 className="text-xl font-black text-foreground">{question}</h3>
            <RotateCcw className="mt-4 h-5 w-5 text-muted-foreground animate-pulse" />
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border-2 border-accent/30 bg-accent/5 p-6 text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-accent mb-3">Definition</p>
            <p className="text-base font-semibold text-foreground leading-relaxed">{flashcardBack}</p>
          </div>
        </motion.div>
      </motion.div>

      {flipped && !answered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3"
        >
          <motion.button
            onClick={() => handleSelfGrade(false)}
            className="flex-1 rounded-xl border-2 border-destructive/30 bg-destructive/5 p-4 text-center font-bold text-destructive transition-colors hover:bg-destructive/10"
            whileTap={{ scale: 0.98 }}
          >
            Didn't know 😔
          </motion.button>
          <motion.button
            onClick={() => handleSelfGrade(true)}
            className="flex-1 rounded-xl border-2 border-success/30 bg-success/5 p-4 text-center font-bold text-success transition-colors hover:bg-success/10"
            whileTap={{ scale: 0.98 }}
          >
            Knew it! 🎉
          </motion.button>
        </motion.div>
      )}

      {answered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-muted-foreground"
        >
          Response recorded ✓
        </motion.div>
      )}
    </div>
  );
}
