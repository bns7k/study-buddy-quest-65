import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Zap, Flame, Star, ArrowRight, RotateCcw, ArrowLeft, FastForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allBadges } from "@/data/badges";
import { UserProgress } from "@/types/course";
import confetti from "canvas-confetti";
import { SupportDialog, shouldShowSupportPrompt } from "@/components/SupportDialog";

interface LessonCompleteProps {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  streak: number;
  progress: UserProgress;
  previousBadgeCount: number;
  onNextLesson?: () => void;
  onNextModule?: () => void;
  nextModuleName?: string;
  onRetry: () => void;
  onBackToModule: () => void;
}

export function LessonComplete({
  correctCount,
  totalCount,
  xpEarned,
  streak,
  progress,
  previousBadgeCount,
  onNextLesson,
  onNextModule,
  nextModuleName,
  onRetry,
  onBackToModule,
}: LessonCompleteProps) {
  const pct = Math.round((correctCount / totalCount) * 100);
  const currentBadges = allBadges.filter((b) => b.condition(progress));
  const newBadges = currentBadges.slice(previousBadgeCount);
  const [showSupport, setShowSupport] = useState(false);

  // Check if we should show support prompt (very rarely)
  useEffect(() => {
    if (shouldShowSupportPrompt()) {
      const timer = setTimeout(() => setShowSupport(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Confetti on lesson complete
  useEffect(() => {
    const duration = 2000;
    const end = Date.now() + duration;
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#A855F7", "#F97316"];
    
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex flex-col items-center gap-5 rounded-3xl border-2 border-primary/20 bg-card p-8 text-center overflow-hidden"
    >
      {/* Glow effect */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl animate-pulse" style={{
        background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
      }} />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-primary/10" style={{ animationDuration: "2s" }} />
        <Trophy className="h-12 w-12 text-primary" />
      </motion.div>

      <h2 className="text-2xl font-black text-foreground">
        {pct === 100 ? "Perfect! 🎉" : pct >= 70 ? "Great Job! 🌟" : "Keep Going! 💪"}
      </h2>

      <p className="text-5xl font-black text-primary">{pct}%</p>
      <p className="text-muted-foreground font-semibold">
        {correctCount}/{totalCount} correct
      </p>

      <div className="flex items-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1.5 rounded-xl bg-xp/10 px-4 py-2"
        >
          <Zap className="h-5 w-5 text-xp fill-xp" />
          <span className="text-lg font-black text-xp">+{xpEarned} XP</span>
        </motion.div>

        {streak > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 rounded-xl bg-streak/10 px-4 py-2"
          >
            <Flame className="h-5 w-5 text-streak fill-streak" />
            <span className="text-lg font-black text-streak">{streak} day</span>
          </motion.div>
        )}
      </div>

      {newBadges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", delay: 0.5, stiffness: 200 }}
          className="w-full rounded-2xl border-2 border-accent/30 bg-accent/5 p-4"
        >
          <p className="mb-2 text-sm font-bold text-accent">New Badge{newBadges.length > 1 ? "s" : ""} Unlocked!</p>
          <div className="flex items-center justify-center gap-3">
            {newBadges.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.7 + i * 0.15, stiffness: 260, damping: 15 }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-3xl">{badge.emoji}</span>
                <span className="text-xs font-bold text-foreground">{badge.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-2 flex w-full flex-col gap-2">
        {onNextLesson && (
          <Button onClick={onNextLesson} className="w-full gap-2 rounded-xl font-bold h-12 text-base">
            Next Lesson <ArrowRight className="h-4 w-4" />
          </Button>
        )}
        {!onNextLesson && onNextModule && (
          <Button onClick={onNextModule} className="w-full gap-2 rounded-xl font-bold h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90">
            <FastForward className="h-4 w-4" /> Next Module{nextModuleName ? `: ${nextModuleName}` : ""}
          </Button>
        )}
        <div className="flex gap-2">
          <Button onClick={onRetry} variant="outline" className="flex-1 gap-2 rounded-xl font-bold">
            <RotateCcw className="h-4 w-4" /> Retry
          </Button>
          <Button onClick={onBackToModule} variant="ghost" className="flex-1 gap-2 rounded-xl font-bold">
            <ArrowLeft className="h-4 w-4" /> Module
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
