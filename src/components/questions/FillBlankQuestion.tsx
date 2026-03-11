import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FillBlankQuestionProps {
  question: string;
  blankAnswer: string;
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

export function FillBlankQuestion({ question, blankAnswer, explanation, onAnswer }: FillBlankQuestionProps) {
  const [userInput, setUserInput] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const isCorrect = userInput.trim().toLowerCase() === blankAnswer.trim().toLowerCase();

  const handleSubmit = () => {
    if (!userInput.trim() || showFeedback) return;
    setShowFeedback(true);
    onAnswer(isCorrect);
  };

  // Split question by "___" or "____" to show inline blank
  const parts = question.split(/_{3,}/);
  const hasBlank = parts.length > 1;

  return (
    <div className="space-y-4">
      {hasBlank ? (
        <h3 className="text-lg font-extrabold text-foreground">
          {parts[0]}
          <span className={`inline-block min-w-[120px] mx-1 border-b-2 px-2 py-0.5 text-center ${
            showFeedback
              ? isCorrect ? "border-success text-success" : "border-destructive text-destructive"
              : "border-primary text-primary"
          }`}>
            {showFeedback ? (isCorrect ? userInput : `${userInput} → ${blankAnswer}`) : userInput || "___"}
          </span>
          {parts[1]}
        </h3>
      ) : (
        <h3 className="text-lg font-extrabold text-foreground">{question}</h3>
      )}

      {!showFeedback && (
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer..."
            className="flex-1 rounded-xl text-base font-semibold"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <Button onClick={handleSubmit} disabled={!userInput.trim()} className="rounded-xl font-bold">
            Check
          </Button>
        </div>
      )}

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className={`text-sm font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
            {isCorrect ? "Correct! 🎉" : `Answer: ${blankAnswer}`}
          </p>
          <p className="mt-1 text-sm text-foreground">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
