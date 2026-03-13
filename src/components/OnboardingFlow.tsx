import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { AvatarGender } from "@/lib/avatars";
import { GuildCrest } from "@/components/icons/GuildCrest";
import { LectureHallIcon, LibraryIcon, MarketYardIcon, ObservatoryIcon } from "@/components/icons/AcademyBuildings";
import { Lock, SkipForward } from "lucide-react";
import { speakMumble, resumeAudio } from "@/lib/professor-voice";

interface OnboardingFlowProps {
  onComplete: (gender: AvatarGender) => void;
}

type Scene = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// ─── Main Flow ───────────────────────────────────────────────

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [scene, setScene] = useState<Scene>(1);
  const [selectedGender, setSelectedGender] = useState<AvatarGender | null>(null);

  const next = useCallback(() => setScene((s) => Math.min(s + 1, 7) as Scene), []);

  const handleAvatarSelect = (gender: AvatarGender) => {
    setSelectedGender(gender);
    setTimeout(() => setScene(5), 500);
  };

  const handleFinish = () => {
    if (selectedGender) onComplete(selectedGender);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background overflow-y-auto overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent/5" />
      <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ob-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.2" opacity="0.04" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ob-grid)" />
      </svg>

      {/* Skip button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={() => { if (selectedGender) { handleFinish(); } else { setScene(4); } }}
        className="fixed top-4 right-4 z-20 flex items-center gap-1.5 rounded-lg border border-muted/30 bg-card/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm transition-colors hover:bg-card hover:text-foreground"
      >
        <SkipForward className="h-3 w-3" />
        Skip
      </motion.button>

      {/* Scene indicator */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7].map((s) => (
          <div
            key={s}
            className={`h-1 rounded-full transition-all duration-500 ${
              s === scene ? "w-6 bg-accent" : s < scene ? "w-3 bg-accent/40" : "w-3 bg-muted/40"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {scene === 1 && <Scene1 key="s1" onNext={next} />}
        {scene === 2 && <Scene2 key="s2" onNext={next} />}
        {scene === 3 && <Scene3 key="s3" onNext={next} />}
        {scene === 4 && <Scene4 key="s4" onSelect={handleAvatarSelect} />}
        {scene === 5 && <Scene5 key="s5" gender={selectedGender!} onNext={next} />}
        {scene === 6 && <Scene6 key="s6" onNext={next} />}
        {scene === 7 && <Scene7 key="s7" gender={selectedGender!} onFinish={handleFinish} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared Components ───────────────────────────────────────

function SceneContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className={`relative flex flex-col items-center gap-5 px-6 py-8 max-w-md w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ProfessorAvatar({ size = "lg" }: { size?: "sm" | "lg" }) {
  const s = size === "lg" ? "h-20 w-20" : "h-14 w-14";
  const emoji = size === "lg" ? "text-4xl" : "text-2xl";
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
      className={`flex ${s} items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20`}
    >
      <span className={emoji}>🧙‍♂️</span>
    </motion.div>
  );
}

function ProfLabel() {
  return <p className="text-[10px] font-black uppercase tracking-widest text-accent">Professor Aldric</p>;
}

function DialogueBubble({ children, delay = 0.5 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="w-full rounded-2xl border border-accent/15 bg-card/80 p-4 shadow-lg backdrop-blur-sm"
    >
      {children}
    </motion.div>
  );
}

function ContinueButton({ onClick, delay = 2, label = "Continue" }: { onClick: () => void; delay?: number; label?: string }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="mt-1 rounded-xl bg-accent px-8 py-3 text-sm font-black text-accent-foreground shadow-lg"
    >
      {label}
    </motion.button>
  );
}

function TypewriterText({ text, delay = 0, speed = 25, voice = true }: { text: string; delay?: number; speed?: number; voice?: boolean }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    let phraseCount = 0;
    const maxPhrases = 2 + Math.floor(Math.random() * 2); // 2-3 phrases
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          // Trigger a mumble phrase at start and roughly every 30-50 chars
          const triggerAt = phraseCount === 0 ? 0 : 30 + Math.floor(Math.random() * 20);
          if (voice && phraseCount < maxPhrases && (phraseCount === 0 || i % triggerAt === 0) && i > phraseCount * 30) {
            phraseCount++;
            resumeAudio();
            speakMumble();
          }
          i++;
        } else {
          clearInterval(interval);
        }
      }, speed);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, speed, voice]);

  return (
    <p className="text-sm text-foreground leading-relaxed">
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="text-accent">|</motion.span>
      )}
    </p>
  );
}

// ─── Scene 1: Arrival ────────────────────────────────────────

function Scene1({ onNext }: { onNext: () => void }) {
  return (
    <SceneContainer>
      {/* Campus silhouette */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.08, y: 0 }}
        transition={{ delay: 0.1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2"
      >
        <GuildCrest className="h-32 w-32 text-accent" />
      </motion.div>

      <ProfessorAvatar />
      <ProfLabel />

      <DialogueBubble delay={0.5}>
        <TypewriterText text="Ah, you must be the new analyst." delay={0.7} />
      </DialogueBubble>

      <DialogueBubble delay={2.5}>
        <TypewriterText text="Welcome to the Capital Guild." delay={2.7} />
      </DialogueBubble>

      <DialogueBubble delay={4.5}>
        <TypewriterText
          text="We train analysts who advise merchants, companies… and occasionally prevent investors from making spectacularly bad decisions."
          delay={4.7}
        />
      </DialogueBubble>

      <ContinueButton onClick={onNext} delay={9} />
    </SceneContainer>
  );
}

// ─── Scene 2: What is Capital Guild? ─────────────────────────

function Scene2({ onNext }: { onNext: () => void }) {
  return (
    <SceneContainer>
      <ProfessorAvatar size="sm" />
      <ProfLabel />

      <DialogueBubble delay={0.3}>
        <TypewriterText text="Here we study companies, markets, and economic decisions." delay={0.5} />
      </DialogueBubble>

      <DialogueBubble delay={3}>
        <TypewriterText
          text="Our analysts evaluate investments, investigate crises… and sometimes explain to CEOs why their 'brilliant idea' may not be brilliant."
          delay={3.2}
        />
      </DialogueBubble>

      {/* Buildings reveal */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 7 }}
        className="w-full grid grid-cols-2 gap-3"
      >
        {[
          { Icon: LectureHallIcon, name: "Lecture Hall", emoji: "🏛" },
          { Icon: LibraryIcon, name: "Guild Library", emoji: "📚" },
          { Icon: MarketYardIcon, name: "Market Yard", emoji: "📈" },
          { Icon: ObservatoryIcon, name: "Risk Observatory", emoji: "🔭" },
        ].map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 7.3 + i * 0.2, type: "spring" }}
            className="flex items-center gap-2.5 rounded-xl border border-accent/15 bg-card/60 p-3"
          >
            <b.Icon className="h-8 w-8 text-accent shrink-0" />
            <span className="text-xs font-black text-foreground">{b.name}</span>
          </motion.div>
        ))}
      </motion.div>

      <DialogueBubble delay={8.5}>
        <TypewriterText text="Each building teaches a different part of the analyst's craft." delay={8.7} />
      </DialogueBubble>

      <ContinueButton onClick={onNext} delay={11} />
    </SceneContainer>
  );
}

// ─── Scene 3: World Characters ───────────────────────────────

function Scene3({ onNext }: { onNext: () => void }) {
  return (
    <SceneContainer>
      <ProfessorAvatar size="sm" />
      <ProfLabel />

      <DialogueBubble delay={0.3}>
        <TypewriterText text="The Guild does not exist in isolation. Companies come to us when they need answers." delay={0.5} />
      </DialogueBubble>

      {/* Client companies */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="w-full space-y-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Mission Companies</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Ironridge Trading", emoji: "⚒️" },
            { name: "Aurora Energy", emoji: "⚡" },
            { name: "Northwind Shipping", emoji: "🚢" },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.3 + i * 0.15 }}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 p-3"
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="text-[9px] font-bold text-foreground text-center leading-tight">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <DialogueBubble delay={5.5}>
        <TypewriterText text="Some want to invest. Some want to expand. Some simply want to know if their competitors are smarter than they are." delay={5.7} />
      </DialogueBubble>

      {/* Rival firms */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 9 }}
        className="w-full space-y-2"
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Rival Firms</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { name: "Mercury Analytics", emoji: "☿️" },
            { name: "Blackstone Advisory", emoji: "🖤" },
            { name: "Atlas Capital", emoji: "🌍" },
          ].map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 9.3 + i * 0.15 }}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-destructive/15 bg-destructive/5 p-3"
            >
              <span className="text-xl">{c.emoji}</span>
              <span className="text-[9px] font-bold text-foreground text-center leading-tight">{c.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <DialogueBubble delay={10.5}>
        <TypewriterText text="They are… competent." delay={10.7} />
      </DialogueBubble>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 13 }}
        className="w-full rounded-2xl border border-accent/15 bg-card/80 p-3 shadow-lg backdrop-blur-sm text-center"
      >
        <p className="text-sm text-foreground/60 italic">Occasionally.</p>
      </motion.div>

      <ContinueButton onClick={onNext} delay={14} />
    </SceneContainer>
  );
}

// ─── Scene 4: Avatar Choice ──────────────────────────────────

function Scene4({ onSelect }: { onSelect: (g: AvatarGender) => void }) {
  return (
    <SceneContainer>
      <ProfessorAvatar size="sm" />
      <ProfLabel />

      <DialogueBubble delay={0.3}>
        <TypewriterText text="And you… You have just joined the Guild as a new analyst." delay={0.5} />
      </DialogueBubble>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="text-center"
      >
        <h2 className="text-lg font-black text-foreground">Choose your analyst</h2>
        <p className="text-xs text-muted-foreground mt-1">Your outfit evolves as you rank up</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 4 }}
        className="flex gap-6"
      >
        {(["male", "female"] as const).map((g, i) => (
          <motion.button
            key={g}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 4.2 + i * 0.15, type: "spring", damping: 15 }}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(g)}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-accent/15 bg-card/80 px-8 py-6 backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-accent/5"
          >
            <span className="text-5xl">{g === "male" ? "🧑‍💼" : "👩‍💼"}</span>
            <span className="text-xs font-bold text-muted-foreground group-hover:text-accent transition-colors">
              {g === "male" ? "Male Analyst" : "Female Analyst"}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </SceneContainer>
  );
}

// ─── Scene 5: Foundation Academy ─────────────────────────────

function Scene5({ gender, onNext }: { gender: AvatarGender; onNext: () => void }) {
  const avatarEmoji = gender === "male" ? "🧑‍💼" : "👩‍💼";

  return (
    <SceneContainer>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="flex items-end gap-3"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border-2 border-accent/20">
          <span className="text-3xl">🧙‍♂️</span>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20">
          <span className="text-2xl">{avatarEmoji}</span>
        </div>
      </motion.div>

      <ProfLabel />

      <DialogueBubble delay={0.4}>
        <TypewriterText text="Excellent. Before advising powerful organizations… you must first survive the Foundations." delay={0.6} />
      </DialogueBubble>

      {/* Lecture Hall spotlight */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 4 }}
        className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 w-full"
      >
        <LectureHallIcon className="h-12 w-12 text-accent shrink-0" />
        <div>
          <p className="text-sm font-black text-foreground">Lecture Hall</p>
          <p className="text-[10px] text-muted-foreground">Every analyst begins here</p>
        </div>
      </motion.div>

      <DialogueBubble delay={5}>
        <TypewriterText text="In the Foundations you will learn how analysts think, how companies create value, and how financial decisions are made." delay={5.2} />
      </DialogueBubble>

      <DialogueBubble delay={9}>
        <TypewriterText text="And, most importantly… how to recognize a terrible investment." delay={9.2} />
      </DialogueBubble>

      <ContinueButton onClick={onNext} delay={12} />
    </SceneContainer>
  );
}

// ─── Scene 6: Future Paths Teaser ────────────────────────────

function Scene6({ onNext }: { onNext: () => void }) {
  const futurePaths = [
    { name: "Valuation Hall", emoji: "🏛" },
    { name: "Risk Institute", emoji: "⚠️" },
    { name: "Market Exchange", emoji: "📊" },
    { name: "Strategy Council", emoji: "♟️" },
  ];

  return (
    <SceneContainer>
      <ProfessorAvatar size="sm" />
      <ProfLabel />

      <DialogueBubble delay={0.3}>
        <TypewriterText text="When you complete the Foundations… you will choose your path." delay={0.5} />
      </DialogueBubble>

      {/* Locked future buildings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
        className="w-full grid grid-cols-2 gap-3"
      >
        {futurePaths.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.8 + i * 0.2, type: "spring" }}
            className="relative flex items-center gap-2.5 rounded-xl border border-muted/20 bg-muted/5 p-3 opacity-60"
          >
            <span className="text-xl">{p.emoji}</span>
            <span className="text-xs font-black text-muted-foreground">{p.name}</span>
            <Lock className="absolute top-2 right-2 h-3 w-3 text-muted-foreground/50" />
          </motion.div>
        ))}
      </motion.div>

      <DialogueBubble delay={5.5}>
        <TypewriterText text="Some analysts value companies. Some study risk. Some master the markets. And a few become strategists." delay={5.7} />
      </DialogueBubble>

      <DialogueBubble delay={10}>
        <TypewriterText text="The Guild needs all of them." delay={10.2} />
      </DialogueBubble>

      <ContinueButton onClick={onNext} delay={12.5} />
    </SceneContainer>
  );
}

// ─── Scene 7: First Lesson ───────────────────────────────────

function Scene7({ gender, onFinish }: { gender: AvatarGender; onFinish: () => void }) {
  const avatarEmoji = gender === "male" ? "🧑‍💼" : "👩‍💼";

  return (
    <SceneContainer>
      <ProfessorAvatar size="sm" />
      <ProfLabel />

      <DialogueBubble delay={0.3}>
        <TypewriterText text="Enough talking. Let us see how you think." delay={0.5} />
      </DialogueBubble>

      {/* First lesson node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3 }}
        className="flex flex-col items-center gap-3"
      >
        {/* Avatar on node */}
        <motion.div
          animate={{ y: [-3, 0, -3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-2xl">{avatarEmoji}</span>
        </motion.div>

        <motion.div
          className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-accent bg-accent/20 shadow-[0_0_20px_hsl(var(--accent)/0.4)]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <span className="text-xl">⭐</span>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-accent"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>

        <div className="text-center">
          <p className="text-[10px] font-bold text-muted-foreground">Lesson 1</p>
          <p className="text-sm font-black text-foreground">Thinking Like an Analyst</p>
        </div>
      </motion.div>

      <DialogueBubble delay={4}>
        <TypewriterText text="Your first task is simple. A company claims its investment will generate enormous profits." delay={4.2} />
      </DialogueBubble>

      <DialogueBubble delay={8}>
        <TypewriterText text="Analysts, however, tend to prefer evidence." delay={8.2} />
      </DialogueBubble>

      <ContinueButton onClick={onFinish} delay={11} label="Let's begin" />
    </SceneContainer>
  );
}
