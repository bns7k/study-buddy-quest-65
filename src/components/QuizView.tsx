import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from "lucide-react";
import { QuizQuestion } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (correctCount: number, totalCount: number) => void;
}

export function QuizView({ questions, onComplete }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;
  const progressPercent = ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    if (idx === question.correctIndex) setCorrectCount((c) => c + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      const finalCorrect = correctCount;
      setFinished(true);
      onComplete(finalCorrect, questions.length);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 rounded-3xl border-2 border-primary/20 bg-card p-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Quiz Complete!</h2>
        <p className="text-4xl font-black text-primary">{pct}%</p>
        <p className="text-muted-foreground">
          {correctCount}/{questions.length} correct
          {pct === 100 ? " — Perfect! 🎉" : pct >= 70 ? " — Great job! 🌟" : " — Keep practicing! 💪"}
        </p>
        <p className="text-sm font-bold text-xp">
          +{correctCount * 10 + (pct === 100 ? 25 : 0)} XP earned
        </p>
        <Button onClick={handleRetry} variant="outline" className="gap-2 rounded-xl">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{correctCount} correct</span>
        </div>
        <Progress value={progressPercent} className="h-2.5" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-extrabold text-foreground">{question.question}</h3>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              let borderClass = "border-border hover:border-primary/40";
              let bgClass = "bg-card";
              if (showFeedback) {
                if (idx === question.correctIndex) {
                  borderClass = "border-success";
                  bgClass = "bg-success/10";
                } else if (idx === selectedOption && !isCorrect) {
                  borderClass = "border-destructive";
                  bgClass = "bg-destructive/10";
                } else {
                  borderClass = "border-border opacity-50";
                }
              } else if (idx === selectedOption) {
                borderClass = "border-primary";
                bgClass = "bg-primary/5";
              }

              return (
                <motion.button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full rounded-xl border-2 p-4 text-left font-semibold transition-all ${borderClass} ${bgClass}`}
                  whileHover={!showFeedback ? { scale: 1.01 } : {}}
                  whileTap={!showFeedback ? { scale: 0.99 } : {}}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-black">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                    {showFeedback && idx === question.correctIndex && (
                      <CheckCircle2 className="ml-auto h-5 w-5 text-success shrink-0" />
                    )}
                    {showFeedback && idx === selectedOption && !isCorrect && idx !== question.correctIndex && (
                      <XCircle className="ml-auto h-5 w-5 text-destructive shrink-0" />
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
              <p className="mt-1 text-sm text-foreground">{question.explanation}</p>
            </motion.div>
          )}

          {showFeedback && (
            <Button onClick={handleNext} className="w-full gap-2 rounded-xl font-bold h-12 text-base">
              {currentIndex < questions.length - 1 ? (
                <>Next <ArrowRight className="h-4 w-4" /></>
              ) : (
                "See Results"
              )}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
