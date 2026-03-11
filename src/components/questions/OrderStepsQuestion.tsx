import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderStepsQuestionProps {
  question: string;
  correctOrder: string[];
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

export function OrderStepsQuestion({ question, correctOrder, explanation, onAnswer }: OrderStepsQuestionProps) {
  const [items, setItems] = useState(() =>
    [...correctOrder].sort(() => Math.random() - 0.5)
  );
  const [showFeedback, setShowFeedback] = useState(false);

  const isCorrect = items.every((item, i) => item === correctOrder[i]);

  const handleCheck = () => {
    setShowFeedback(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-foreground">{question}</h3>
      <p className="text-sm text-muted-foreground">Drag to put the steps in the correct order</p>

      <Reorder.Group axis="y" values={items} onReorder={showFeedback ? () => {} : setItems} className="space-y-2">
        {items.map((item, i) => (
          <Reorder.Item key={item} value={item} className="list-none">
            <motion.div
              className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all ${
                showFeedback
                  ? item === correctOrder[i]
                    ? "border-success bg-success/10"
                    : "border-destructive bg-destructive/10"
                  : "border-border bg-card cursor-grab active:cursor-grabbing"
              }`}
            >
              {!showFeedback && <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />}
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-black text-muted-foreground">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-foreground">{item}</span>
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {!showFeedback && (
        <Button onClick={handleCheck} className="w-full rounded-xl font-bold h-12 text-base">
          Check Order
        </Button>
      )}

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${isCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className={`text-sm font-bold ${isCorrect ? "text-success" : "text-destructive"}`}>
            {isCorrect ? "Perfect order! 🎉" : "Not quite right 🤔"}
          </p>
          {!isCorrect && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-bold text-muted-foreground">Correct order:</p>
              {correctOrder.map((step, i) => (
                <p key={i} className="text-xs text-foreground">{i + 1}. {step}</p>
              ))}
            </div>
          )}
          <p className="mt-1 text-sm text-foreground">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
