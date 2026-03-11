import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";

interface NumericQuestionProps {
  question: string;
  numericAnswer: number;
  tolerance?: number;
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

export function NumericQuestion({ question, numericAnswer, tolerance = 0.01, explanation, onAnswer }: NumericQuestionProps) {
  const [userInput, setUserInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const userValue = parseFloat(userInput.replace(/,/g, ""));
  const isCorrect = !isNaN(userValue) && Math.abs(userValue - numericAnswer) <= tolerance;

  const handleSubmit = () => {
    if (!userInput.trim() || showFeedback || isNaN(userValue)) return;
    setShowFeedback(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-foreground">{question}</h3>

      <div className="flex items-center gap-3 rounded-2xl border-2 border-border bg-card p-4">
        <Calculator className="h-6 w-6 text-primary shrink-0" />
        <div className="flex-1">
          {!showFeedback ? (
            <div className="flex gap-2">
              <Input
                type="text"
                inputMode="decimal"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter numeric answer..."
                className="flex-1 rounded-xl text-lg font-bold text-center border-0 bg-transparent focus-visible:ring-0"
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                autoFocus
              />
            </div>
          ) : (
            <div className="text-center">
              <p className={`text-2xl font-black ${isCorrect ? "text-success" : "text-destructive"}`}>
                {userInput}
              </p>
              {!isCorrect && (
                <p className="text-sm text-muted-foreground mt-1">
                  Correct: <span className="font-bold text-foreground">{numericAnswer}</span>
                  {tolerance > 0 && <span> (±{tolerance})</span>}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {!showFeedback && (
        <Button
          onClick={handleSubmit}
          disabled={!userInput.trim() || isNaN(parseFloat(userInput.replace(/,/g, "")))}
          className="w-full rounded-xl font-bold h-12 text-base"
        >
          Check Answer
        </Button>
      )}

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
