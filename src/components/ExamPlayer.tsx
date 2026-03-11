import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight, Timer, X, Zap, Trophy, RotateCcw } from "lucide-react";
import { QuizQuestion } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ExamPlayerProps {
  questions: QuizQuestion[];
  timeLimit?: number; // seconds, undefined = untimed
  title: string;
  onComplete: (correct: number, total: number, timeUsed: number) => void;
  onExit: () => void;
}

export function ExamPlayer({ questions, timeLimit, title, onComplete, onExit }: ExamPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timeLimit || 0);
  const [timeUsed, setTimeUsed] = useState(0);
  const startTime = useRef(Date.now());

  // Timer
  useEffect(() => {
    if (!timeLimit || finished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Time's up - auto-complete
          const elapsed = Math.round((Date.now() - startTime.current) / 1000);
          setTimeUsed(elapsed);
          setFinished(true);
          onComplete(correctCount, questions.length, elapsed);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLimit, finished, correctCount, questions.length, onComplete]);

  const question = questions[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;
  const progressPercent = ((currentIndex + (showFeedback ? 1 : 0)) / questions.length) * 100;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

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
      const elapsed = Math.round((Date.now() - startTime.current) / 1000);
      setTimeUsed(elapsed);
      setFinished(true);
      onComplete(correctCount, questions.length, elapsed);
    }
  };

  if (finished) {
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-5 rounded-3xl border-2 border-primary/20 bg-card p-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-foreground">Exam Complete!</h2>
        <p className="text-5xl font-black text-primary">{pct}%</p>
        <p className="text-muted-foreground font-semibold">
          {correctCount}/{questions.length} correct
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-bold text-muted-foreground">{formatTime(timeUsed)}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-xp/10 px-3 py-2">
            <Zap className="h-4 w-4 text-xp fill-xp" />
            <span className="text-sm font-bold text-xp">+{correctCount * 10 + (pct === 100 ? 25 : 0)} XP</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {pct === 100 ? "Perfect score! You're exam-ready! 🎉" : pct >= 80 ? "Excellent work! Almost there! 🌟" : pct >= 60 ? "Good effort! Review weak areas. 💪" : "Keep studying! Focus on your weak modules. 📚"}
        </p>
        <div className="flex w-full gap-2">
          <Button onClick={onExit} variant="outline" className="flex-1 gap-2 rounded-xl font-bold">
            <ArrowRight className="h-4 w-4" /> Back
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with timer */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onExit} className="shrink-0 rounded-xl">
          <X className="h-5 w-5" />
        </Button>
        <Progress value={progressPercent} className="h-2.5 flex-1" />
        {timeLimit && (
          <div className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
            timeLeft < 60 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
          }`}>
            <Timer className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>{correctCount} correct</span>
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
