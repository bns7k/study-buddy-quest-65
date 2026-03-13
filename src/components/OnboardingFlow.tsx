import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { AvatarGender } from "@/lib/avatars";
import { GuildCrest } from "@/components/icons/GuildCrest";
import { BookOpen } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (gender: AvatarGender) => void;
}

type Step = "welcome" | "avatar" | "intro";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>("welcome");
  const [selectedGender, setSelectedGender] = useState<AvatarGender | null>(null);

  const handleAvatarSelect = (gender: AvatarGender) => {
    setSelectedGender(gender);
    setTimeout(() => setStep("intro"), 400);
  };

  const handleFinish = () => {
    if (selectedGender) {
      onComplete(selectedGender);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent/5" />
      <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ob-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.2" opacity="0.04" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ob-grid)" />
      </svg>

      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <WelcomeStep key="welcome" onNext={() => setStep("avatar")} />
        )}
        {step === "avatar" && (
          <AvatarStep key="avatar" onSelect={handleAvatarSelect} />
        )}
        {step === "intro" && (
          <IntroStep key="intro" gender={selectedGender!} onNext={handleFinish} />
        )}
      </AnimatePresence>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center gap-6 px-6 py-10 max-w-md w-full text-center"
    >
      {/* Mentor */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20"
      >
        <span className="text-5xl">🧙‍♂️</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <p className="text-xs font-black uppercase tracking-widest text-accent">Professor Aldric</p>
        <div className="rounded-2xl border border-accent/15 bg-card/80 p-5 shadow-lg backdrop-blur-sm">
          <TypewriterText
            text="Welcome, young analyst. I am Professor Aldric, and I'll be guiding you through your journey at the Capital Guild."
            delay={0.8}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="rounded-2xl border border-accent/15 bg-card/80 p-4 shadow-lg backdrop-blur-sm"
      >
        <p className="text-sm text-foreground/80 leading-relaxed">
          But first... let me see who I'm working with.
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4.5 }}
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-2 rounded-xl bg-accent px-8 py-3 text-sm font-black text-accent-foreground shadow-lg"
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

function AvatarStep({ onSelect }: { onSelect: (g: AvatarGender) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center gap-8 px-6 py-10 max-w-md w-full"
    >
      <GuildCrest className="h-12 w-12 text-accent opacity-40" />

      <div className="text-center">
        <h2 className="text-xl font-black text-foreground">Choose Your Analyst</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your appearance will evolve as you rank up</p>
      </div>

      <div className="flex gap-6">
        <AvatarOption gender="male" emoji="🧑‍💼" label="Male Analyst" onSelect={onSelect} delay={0.3} />
        <AvatarOption gender="female" emoji="👩‍💼" label="Female Analyst" onSelect={onSelect} delay={0.4} />
      </div>
    </motion.div>
  );
}

function AvatarOption({
  gender, emoji, label, onSelect, delay,
}: {
  gender: AvatarGender; emoji: string; label: string; onSelect: (g: AvatarGender) => void; delay: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", damping: 15 }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(gender)}
      className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-accent/15 bg-card/80 px-8 py-6 backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-accent/5"
    >
      <span className="text-5xl block">{emoji}</span>
      <span className="text-xs font-bold text-muted-foreground group-hover:text-accent transition-colors">{label}</span>
    </motion.button>
  );
}

function IntroStep({ gender, onNext }: { gender: AvatarGender; onNext: () => void }) {
  const avatarEmoji = gender === "male" ? "🧑‍💼" : "👩‍💼";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative flex flex-col items-center gap-6 px-6 py-10 max-w-md w-full text-center"
    >
      {/* Mentor + Student together */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex items-end gap-4"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
          <span className="text-4xl">🧙‍♂️</span>
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
          <span className="text-3xl">{avatarEmoji}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <p className="text-xs font-black uppercase tracking-widest text-accent">Professor Aldric</p>
        <div className="rounded-2xl border border-accent/15 bg-card/80 p-5 shadow-lg backdrop-blur-sm">
          <TypewriterText
            text="Excellent choice! Now, let me show you the Foundation Hall — this is where you'll learn everything necessary to become a true analyst."
            delay={0.7}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4.5 }}
        className="rounded-2xl border border-accent/15 bg-card/80 p-4 shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="text-xs font-bold text-accent">Your Journey Ahead</span>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          You'll explore different halls of the academy. Each one unlocks new knowledge. Ready to begin?
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 5.5 }}
        onClick={onNext}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-2 rounded-xl bg-accent px-8 py-3 text-sm font-black text-accent-foreground shadow-lg"
      >
        Enter the Academy
      </motion.button>
    </motion.div>
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");

  useState(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  });

  return (
    <p className="text-sm text-foreground leading-relaxed min-h-[3rem]">
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="text-accent"
        >
          |
        </motion.span>
      )}
    </p>
  );
}
