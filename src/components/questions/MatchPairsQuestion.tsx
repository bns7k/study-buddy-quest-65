import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { MatchPair } from "@/types/course";

interface MatchPairsQuestionProps {
  question: string;
  pairs: MatchPair[];
  explanation: string;
  onAnswer: (correct: boolean) => void;
}

export function MatchPairsQuestion({ question, pairs, explanation, onAnswer }: MatchPairsQuestionProps) {
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({}); // term index -> def index
  const [shuffledDefs] = useState(() => {
    const defs = pairs.map((p, i) => ({ text: p.definition, originalIndex: i }));
    return defs.sort(() => Math.random() - 0.5);
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [matchedDefIndices, setMatchedDefIndices] = useState<Set<number>>(new Set());

  const handleTermClick = (index: number) => {
    if (showFeedback || matches[index] !== undefined) return;
    setSelectedTerm(index);
  };

  const handleDefClick = useCallback((shuffledIndex: number) => {
    if (showFeedback || selectedTerm === null || matchedDefIndices.has(shuffledIndex)) return;

    const newMatches = { ...matches, [selectedTerm]: shuffledDefs[shuffledIndex].originalIndex };
    const newMatchedDefs = new Set(matchedDefIndices);
    newMatchedDefs.add(shuffledIndex);

    setMatches(newMatches);
    setMatchedDefIndices(newMatchedDefs);
    setSelectedTerm(null);

    // Check if all matched
    if (Object.keys(newMatches).length === pairs.length) {
      setShowFeedback(true);
      const allCorrect = Object.entries(newMatches).every(([termIdx, defIdx]) => Number(termIdx) === defIdx);
      onAnswer(allCorrect);
    }
  }, [showFeedback, selectedTerm, matches, matchedDefIndices, shuffledDefs, pairs, onAnswer]);

  const getMatchColor = (termIndex: number) => {
    if (!showFeedback || matches[termIndex] === undefined) return "";
    return matches[termIndex] === termIndex ? "border-success bg-success/10" : "border-destructive bg-destructive/10";
  };

  const allCorrect = showFeedback && Object.entries(matches).every(([termIdx, defIdx]) => Number(termIdx) === defIdx);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-extrabold text-foreground">{question}</h3>
      <p className="text-sm text-muted-foreground">Tap a term, then tap its matching definition</p>

      <div className="grid grid-cols-2 gap-3">
        {/* Terms */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Terms</p>
          {pairs.map((pair, i) => (
            <motion.button
              key={`term-${i}`}
              onClick={() => handleTermClick(i)}
              className={`w-full rounded-xl border-2 p-3 text-left text-sm font-semibold transition-all ${
                matches[i] !== undefined
                  ? getMatchColor(i) || "border-primary/30 bg-primary/5"
                  : selectedTerm === i
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40 bg-card"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              {pair.term}
              {showFeedback && matches[i] === i && <CheckCircle2 className="inline ml-1.5 h-4 w-4 text-success" />}
              {showFeedback && matches[i] !== undefined && matches[i] !== i && <XCircle className="inline ml-1.5 h-4 w-4 text-destructive" />}
            </motion.button>
          ))}
        </div>

        {/* Definitions */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Definitions</p>
          {shuffledDefs.map((def, si) => (
            <motion.button
              key={`def-${si}`}
              onClick={() => handleDefClick(si)}
              disabled={matchedDefIndices.has(si)}
              className={`w-full rounded-xl border-2 p-3 text-left text-sm transition-all ${
                matchedDefIndices.has(si)
                  ? "border-muted bg-muted/30 opacity-60"
                  : selectedTerm !== null
                  ? "border-primary/30 hover:border-primary bg-card cursor-pointer"
                  : "border-border bg-card"
              }`}
              whileTap={!matchedDefIndices.has(si) && selectedTerm !== null ? { scale: 0.98 } : {}}
            >
              {def.text}
            </motion.button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${allCorrect ? "bg-success/10 border border-success/30" : "bg-destructive/10 border border-destructive/30"}`}
        >
          <p className={`text-sm font-bold ${allCorrect ? "text-success" : "text-destructive"}`}>
            {allCorrect ? "All matched correctly! 🎉" : "Some matches were wrong 🤔"}
          </p>
          <p className="mt-1 text-sm text-foreground">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
}
