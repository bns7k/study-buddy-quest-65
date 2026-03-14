import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { AvatarGender } from "@/lib/avatars";
import { GuildCrest } from "@/components/icons/GuildCrest";
import professorImg from "@/assets/professor-aldric.png";
import { LectureHallIcon, LibraryIcon, MarketYardIcon, ObservatoryIcon } from "@/components/icons/AcademyBuildings";
import { Lock, SkipForward } from "lucide-react";
import maleAvatarImg from "@/assets/male-analyst-transparent.svg";
import femaleAvatarImg from "@/assets/female-analyst-transparent.svg";
import { speakMumble, resumeAudio } from "@/lib/professor-voice";

interface OnboardingFlowProps {
  onComplete: (gender: AvatarGender) => void;
}

type Scene = 1 | 2 | 3 | 4 | 5 | 6 | 7;

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
    <div className="fixed inset-0 z-[200] flex flex-col bg-background overflow-hidden">
      {/* Background grid */}
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

// ─── Visual Novel Layout ─────────────────────────────────────

function VNLayout({ 
  children, 
  backgroundContent,
  showProfessor = true,
  dialogues,
  continueDelay,
  onContinue,
  continueLabel = "Continue",
}: { 
  children?: React.ReactNode;
  backgroundContent?: React.ReactNode;
  showProfessor?: boolean;
  dialogues: { text: string; delay: number }[];
  continueDelay: number;
  onContinue: () => void;
  continueLabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex h-full w-full flex-col"
    >
      {/* Background world content */}
      <div className="relative flex flex-1 items-start justify-center overflow-hidden pt-20 sm:items-center sm:pt-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-transparent" />
        {backgroundContent}
        {children}
      </div>

      {/* Bottom section: Professor + dialogue */}
      <div className="relative z-10 px-3 pb-6 sm:px-6 sm:pb-8">
        <div className="mx-auto flex w-full max-w-4xl items-end gap-2 sm:gap-4">
          {/* Professor portrait */}
          {showProfessor && (
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                y: [0, -4, 0, -2, 0],
              }}
              transition={{
                type: "spring", damping: 18, stiffness: 150,
                y: { delay: 0.5, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative z-10 hidden shrink-0 sm:block sm:-mr-2"
            >
              <div className="h-36 w-36 overflow-hidden rounded-2xl border-2 border-accent/30 bg-card shadow-2xl sm:h-48 sm:w-48">
                <img
                  src={professorImg}
                  alt="Professor Aldric"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              {/* Glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_40px_hsl(var(--accent)/0.15)]" />
            </motion.div>
          )}

          {/* Dialogue area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", damping: 20 }}
            className="relative mx-auto w-full max-w-3xl min-w-0"
          >
          {/* Bubble tail */}
          {showProfessor && (
            <div className="absolute bottom-6 left-0 -ml-2 hidden h-4 w-4 rotate-45 border-b border-l border-border/40 bg-card/95 sm:block" />
          )}
          
          <div className="rounded-2xl border border-border/40 bg-card/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/[0.03] to-transparent pointer-events-none" />
            
            {showProfessor && (
              <p className="relative text-[10px] font-black text-accent uppercase tracking-widest mb-2">
                Professor Aldric
              </p>
            )}

            <div className="relative space-y-2">
              {dialogues.map((d, i) => (
                <TypewriterText key={`${d.text}-${i}`} text={d.text} delay={d.delay} />
              ))}
            </div>
          </div>

          {/* Continue button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: continueDelay }}
              className="sticky bottom-3 z-20 mt-3 flex justify-center sm:static sm:z-auto sm:justify-end"
            >
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-xl bg-accent px-6 py-2.5 text-sm font-black text-accent-foreground shadow-lg sm:w-auto"
              >
                {continueLabel}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Shared Components ───────────────────────────────────────

function TypewriterText({ text, delay = 0, speed = 25, voice = true }: { text: string; delay?: number; speed?: number; voice?: boolean }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    let phraseCount = 0;
    const maxPhrases = 2 + Math.floor(Math.random() * 2);
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
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
    <p className="text-sm sm:text-base text-foreground leading-relaxed">
      {displayed}
      {displayed.length < text.length && displayed.length > 0 && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="text-accent">|</motion.span>
      )}
    </p>
  );
}

// ─── Scene 1: Arrival ────────────────────────────────────────

function Scene1({ onNext }: { onNext: () => void }) {
  return (
    <VNLayout
      onContinue={onNext}
      continueDelay={8}
      dialogues={[
        { text: "Ah, you must be the new analyst.", delay: 0.7 },
        { text: "Welcome to the Capital Guild.", delay: 3 },
        { text: "We train analysts who advise merchants, companies… and occasionally prevent investors from making spectacularly bad decisions.", delay: 5 },
      ]}
      backgroundContent={
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.06, scale: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <GuildCrest className="h-64 w-64 sm:h-80 sm:w-80 text-accent" />
        </motion.div>
      }
    />
  );
}

// ─── Scene 2: What is Capital Guild? ─────────────────────────

function Scene2({ onNext }: { onNext: () => void }) {
  const buildings = [
    { Icon: LectureHallIcon, name: "Lecture Hall" },
    { Icon: LibraryIcon, name: "Guild Library" },
    { Icon: MarketYardIcon, name: "Market Yard" },
    { Icon: ObservatoryIcon, name: "Risk Observatory" },
  ];

  return (
    <VNLayout
      onContinue={onNext}
      continueDelay={10}
      dialogues={[
        { text: "Here we study companies, markets, and economic decisions.", delay: 0.5 },
        { text: "Our analysts evaluate investments, investigate crises… and sometimes explain to CEOs why their 'brilliant idea' may not be brilliant.", delay: 3 },
        { text: "Each building teaches a different part of the analyst's craft.", delay: 8 },
      ]}
      backgroundContent={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.5, duration: 1 }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 grid w-[min(90vw,360px)] grid-cols-2 gap-3 sm:top-[15%] sm:w-[400px] sm:gap-6"
        >
          {buildings.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 6 + i * 0.25, type: "spring", damping: 12 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-accent/15 bg-card/70 p-4 backdrop-blur-sm shadow-lg"
            >
              <b.Icon className="h-10 w-10 sm:h-12 sm:w-12 text-accent" />
              <span className="text-[10px] sm:text-xs font-black text-foreground text-center">{b.name}</span>
            </motion.div>
          ))}
        </motion.div>
      }
    />
  );
}

// ─── Scene 3: World Characters ───────────────────────────────

function Scene3({ onNext }: { onNext: () => void }) {
  const clients = [
    { name: "Ironridge Trading", emoji: "⚒️" },
    { name: "Aurora Energy", emoji: "⚡" },
    { name: "Northwind Shipping", emoji: "🚢" },
  ];
  const rivals = [
    { name: "Mercury Analytics", emoji: "☿️" },
    { name: "Blackstone Advisory", emoji: "🖤" },
    { name: "Atlas Capital", emoji: "🌍" },
  ];

  return (
    <VNLayout
      onContinue={onNext}
      continueDelay={13}
      dialogues={[
        { text: "The Guild does not exist in isolation. Companies come to us when they need answers.", delay: 0.5 },
        { text: "Some want to invest. Some want to expand. Some simply want to know if their competitors are smarter than they are.", delay: 5 },
        { text: "They are… competent. Occasionally.", delay: 10 },
      ]}
      backgroundContent={
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex w-[min(92vw,380px)] flex-col gap-5 sm:top-[10%] sm:w-[440px] sm:gap-6">
          {/* Client companies */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            className="space-y-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Mission Companies</p>
            <div className="grid grid-cols-3 gap-2">
              {clients.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 3.3 + i * 0.15 }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border/50 bg-card/60 p-3 backdrop-blur-sm"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-[9px] font-bold text-foreground text-center leading-tight">{c.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rival firms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 8 }}
            className="space-y-2"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Rival Firms</p>
            <div className="grid grid-cols-3 gap-2">
              {rivals.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 8.3 + i * 0.15 }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-destructive/15 bg-destructive/5 p-3 backdrop-blur-sm"
                >
                  <span className="text-xl">{c.emoji}</span>
                  <span className="text-[9px] font-bold text-foreground text-center leading-tight">{c.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      }
    />
  );
}

// ─── Scene 4: Avatar Choice ──────────────────────────────────

function Scene4({ onSelect }: { onSelect: (g: AvatarGender) => void }) {
  return (
    <VNLayout
      onContinue={() => {}}
      continueDelay={999}
      dialogues={[
        { text: "And you… You have just joined the Guild as a new analyst.", delay: 0.5 },
        { text: "Show me who you are.", delay: 3 },
      ]}
      backgroundContent={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 sm:top-[15%] sm:gap-6"
        >
          <div className="text-center">
            <h2 className="text-lg font-black text-foreground">Choose your analyst</h2>
            <p className="text-xs text-muted-foreground mt-1">Your outfit evolves as you rank up</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
            {(["male", "female"] as const).map((g, i) => (
              <motion.button
                key={g}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.2 + i * 0.15, type: "spring", damping: 15 }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(g)}
                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-accent/15 bg-card/80 px-5 py-5 sm:px-8 sm:py-6 backdrop-blur-sm transition-colors hover:border-accent/40 hover:bg-accent/5"
              >
                {g === "male" ? (
                  <img src={maleAvatarImg} alt="Male analyst" className="h-20 w-20 object-contain" />
                ) : (
                  <img src={femaleAvatarImg} alt="Female analyst" className="h-20 w-20 object-contain" />
                )}
                <span className="text-xs font-bold text-muted-foreground group-hover:text-accent transition-colors">
                  {g === "male" ? "Male Analyst" : "Female Analyst"}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      }
    />
  );
}

// ─── Scene 5: Foundation Academy ─────────────────────────────

function Scene5({ gender, onNext }: { gender: AvatarGender; onNext: () => void }) {
  const avatarEmoji = gender === "male" ? "🧑‍💼" : "👩‍💼";
  const avatarImage = gender === "male" ? maleAvatarImg : femaleAvatarImg;

  return (
    <VNLayout
      onContinue={onNext}
      continueDelay={11}
      dialogues={[
        { text: "Excellent. Before advising powerful organizations… you must first survive the Foundations.", delay: 0.5 },
        { text: "In the Foundations you will learn how analysts think, how companies create value, and how financial decisions are made.", delay: 5 },
        { text: "And, most importantly… how to recognize a terrible investment.", delay: 9 },
      ]}
      backgroundContent={
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 sm:top-[15%] sm:gap-5">
          {/* Player avatar + professor side by side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-end gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/10">
              {avatarImage ? (
                <img src={avatarImage} alt="Selected analyst" className="h-12 w-12 object-contain" />
              ) : (
                <span className="text-2xl">{avatarEmoji}</span>
              )}
            </div>
          </motion.div>

          {/* Lecture Hall spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 3.5 }}
            className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4 backdrop-blur-sm w-72"
          >
            <LectureHallIcon className="h-12 w-12 text-accent shrink-0" />
            <div>
              <p className="text-sm font-black text-foreground">Lecture Hall</p>
              <p className="text-[10px] text-muted-foreground">Every analyst begins here</p>
            </div>
          </motion.div>
        </div>
      }
    />
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
    <VNLayout
      onContinue={onNext}
      continueDelay={11}
      dialogues={[
        { text: "When you complete the Foundations… you will choose your path.", delay: 0.5 },
        { text: "Some analysts value companies. Some study risk. Some master the markets. And a few become strategists.", delay: 4 },
        { text: "The Guild needs all of them.", delay: 9 },
      ]}
      backgroundContent={
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 grid w-[min(90vw,340px)] grid-cols-2 gap-3 sm:top-[12%] sm:w-[380px] sm:gap-4"
        >
          {futurePaths.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1 }}
              transition={{ delay: 3 + i * 0.2, type: "spring" }}
              className="relative flex flex-col items-center gap-2 rounded-xl border border-muted/20 bg-muted/5 p-4 backdrop-blur-sm"
            >
              <span className="text-2xl">{p.emoji}</span>
              <span className="text-xs font-black text-muted-foreground">{p.name}</span>
              <Lock className="absolute top-2 right-2 h-3 w-3 text-muted-foreground/50" />
            </motion.div>
          ))}
        </motion.div>
      }
    />
  );
}

// ─── Scene 7: First Lesson ───────────────────────────────────

function Scene7({ gender, onFinish }: { gender: AvatarGender; onFinish: () => void }) {
  const avatarEmoji = gender === "male" ? "🧑‍💼" : "👩‍💼";
  const avatarImage = gender === "male" ? maleAvatarImg : femaleAvatarImg;

  return (
    <VNLayout
      onContinue={onFinish}
      continueDelay={10}
      continueLabel="Let's begin"
      dialogues={[
        { text: "Enough talking. Let us see how you think.", delay: 0.5 },
        { text: "Your first task is simple. A company claims its investment will generate enormous profits.", delay: 3.5 },
        { text: "Analysts, however, tend to prefer evidence.", delay: 7.5 },
      ]}
      backgroundContent={
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          className="absolute top-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 sm:top-[18%]"
        >
          <motion.div
            animate={{ y: [-3, 0, -3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {avatarImage ? (
              <img src={avatarImage} alt="Selected analyst" className="h-11 w-11 object-contain" />
            ) : (
              <span className="text-2xl">{avatarEmoji}</span>
            )}
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
      }
    />
  );
}
