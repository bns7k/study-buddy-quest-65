import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrueFalseQuestionProps {
  question: string;
  correctIndex: number; // 0 = True, 1 = False (maps to options[0]="True", options[1]="False")
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

export function TrueFalseQuestion({ question, correctIndex, explanation, onAnswer }: TrueFalseQuestionProps) {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswer = correctIndex === 0;
  const isCorrect = selected === correctAnswer;

  const handleSelect = (value: boolean) => {
    if (showFeedback) return;
    setSelected(value);
    setShowFeedback(true);
    onAnswer(value === correctAnswer);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-foreground">{question}</h3>

      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((value) => {
          let borderClass = "border-border hover:border-primary/40";
          let bgClass = "bg-card";
          if (showFeedback) {
            if (value === correctAnswer) {
              borderClass = "border-success";
              bgClass = "bg-success/10";
            } else if (value === selected && !isCorrect) {
              borderClass = "border-destructive";
              bgClass = "bg-destructive/10";
            } else {
              borderClass = "border-border opacity-50";
            }
          } else if (value === selected) {
            borderClass = "border-primary";
            bgClass = "bg-primary/5";
          }

          return (
            <motion.button
              key={String(value)}
              onClick={() => handleSelect(value)}
              className={`rounded-2xl border-2 p-6 text-center font-black text-xl transition-all ${borderClass} ${bgClass}`}
              whileHover={!showFeedback ? { scale: 1.02 } : {}}
              whileTap={!showFeedback ? { scale: 0.98 } : {}}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl">{value ? "✓" : "✗"}</span>
                <span>{value ? "True" : "False"}</span>
                {showFeedback && value === correctAnswer && (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
                {showFeedback && value === selected && !isCorrect && (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className={`text-sm font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
            {isCorrect ? "Correct! 🎉" : "Not quite! 🤔"}
          </p>
          <p className="mt-1 text-sm text-foreground">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
