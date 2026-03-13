import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { QuizQuestion } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrueFalseQuestion } from "@/components/questions/TrueFalseQuestion";
import { MatchPairsQuestion } from "@/components/questions/MatchPairsQuestion";
import { FillBlankQuestion } from "@/components/questions/FillBlankQuestion";
import { OrderStepsQuestion } from "@/components/questions/OrderStepsQuestion";
import { NumericQuestion } from "@/components/questions/NumericQuestion";
import { FlashcardQuestion } from "@/components/questions/FlashcardQuestion";

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (correctCount: number, totalCount: number) => void;
  onAnswer?: (questionId: string, wasCorrect: boolean) => void;
}

export function QuizView({ questions, onComplete, onAnswer }: QuizViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [specialAnswered, setSpecialAnswered] = useState(false);
  const [correctBounce, setCorrectBounce] = useState(false);

  const question = questions[currentIndex];
  const qType = question?.questionType || "multiple_choice";
  const isCorrect = selectedOption === question?.correctIndex;
  const progressPercent = ((currentIndex + (showFeedback || specialAnswered ? 1 : 0)) / questions.length) * 100;

  const handleSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    const correct = idx === question.correctIndex;
    if (correct) {
      setCorrectCount((c) => c + 1);
      setCorrectBounce(true);
      setTimeout(() => setCorrectBounce(false), 600);
    }
    onAnswer?.(question.id, correct);
  };

  const handleSpecialAnswer = (correct: boolean) => {
    setSpecialAnswered(true);
    if (correct) {
      setCorrectCount((c) => c + 1);
      setCorrectBounce(true);
      setTimeout(() => setCorrectBounce(false), 600);
    }
    onAnswer?.(question.id, correct);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setSpecialAnswered(false);
    } else {
      onComplete(correctCount, questions.length);
    }
  };

  const isSpecialType = ["true_false", "match_pairs", "fill_blank", "order_steps", "numeric", "flashcard"].includes(qType);
  const showNextButton = isSpecialType ? specialAnswered : showFeedback;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <motion.span
            animate={correctBounce ? { scale: [1, 1.4, 1], y: [0, -8, 0] } : {}}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-success font-black"
          >
            {correctCount} correct
          </motion.span>
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
          {/* True / False */}
          {qType === "true_false" && (
            <TrueFalseQuestion
              question={question.question}
              correctIndex={question.correctIndex}
              explanation={question.explanation}
              onAnswer={handleSpecialAnswer}
            />
          )}

          {/* Match Pairs */}
          {qType === "match_pairs" && question.matchPairs && (
            <MatchPairsQuestion
              question={question.question}
              pairs={question.matchPairs}
              explanation={question.explanation}
              onAnswer={handleSpecialAnswer}
            />
          )}

          {/* Fill in the Blank */}
          {qType === "fill_blank" && question.blankAnswer && (
            <FillBlankQuestion
              question={question.question}
              blankAnswer={question.blankAnswer}
              explanation={question.explanation}
              onAnswer={handleSpecialAnswer}
            />
          )}

          {/* Order Steps */}
          {qType === "order_steps" && question.correctOrder && (
            <OrderStepsQuestion
              question={question.question}
              correctOrder={question.correctOrder}
              explanation={question.explanation}
              onAnswer={handleSpecialAnswer}
            />
          )}

          {/* Numeric Input */}
          {qType === "numeric" && question.numericAnswer !== undefined && (
            <NumericQuestion
              question={question.question}
              numericAnswer={question.numericAnswer}
              tolerance={question.numericTolerance}
              explanation={question.explanation}
              onAnswer={handleSpecialAnswer}
            />
          )}

          {/* Flashcard */}
          {qType === "flashcard" && question.flashcardBack && (
            <FlashcardQuestion
              question={question.question}
              flashcardBack={question.flashcardBack}
              onAnswer={handleSpecialAnswer}
            />
          )}

          {/* Multiple Choice (default) */}
          {(qType === "multiple_choice" || !isSpecialType) && (
            <>
              <h3 className="text-lg font-extrabold text-foreground">{question.question}</h3>

              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  let borderClass = "border-border/60 hover:border-accent/40";
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
                    borderClass = "border-accent";
                    bgClass = "bg-accent/5";
                  }

                  return (
                    <motion.button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      className={`w-full rounded-2xl border p-4 text-left font-semibold transition-all shadow-sm ${borderClass} ${bgClass}`}
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
            </>
          )}

          {showNextButton && (
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
