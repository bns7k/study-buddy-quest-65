import { motion } from "framer-motion";
import { AvatarGender } from "@/lib/avatars";
import { GuildCrest } from "@/components/icons/GuildCrest";

interface AvatarSelectionProps {
  onSelect: (gender: AvatarGender) => void;
}

export function AvatarSelection({ onSelect }: AvatarSelectionProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="flex flex-col items-center gap-8 px-6 py-10 max-w-md w-full"
      >
        {/* Guild crest */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 border border-accent/20"
        >
          <GuildCrest className="h-10 w-10 text-accent" />
        </motion.div>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-foreground"
          >
            Welcome to Capital Guild
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-sm text-muted-foreground"
          >
            Choose your analyst to begin the journey
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-6"
        >
          <AvatarOption
            gender="male"
            emoji="🧑‍💼"
            label="Male Analyst"
            onSelect={onSelect}
            delay={0.7}
          />
          <AvatarOption
            gender="female"
            emoji="👩‍💼"
            label="Female Analyst"
            onSelect={onSelect}
            delay={0.8}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground/60 italic"
        >
          Your outfit will evolve as you rank up
        </motion.p>
      </motion.div>
    </div>
  );
}

function AvatarOption({
  gender,
  emoji,
  label,
  onSelect,
  delay,
}: {
  gender: AvatarGender;
  emoji: string;
  label: string;
  onSelect: (g: AvatarGender) => void;
  delay: number;
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
      <div className="relative">
        <span className="text-5xl block">{emoji}</span>
        {/* Glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-accent/10 blur-xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      </div>
      <span className="text-xs font-bold text-muted-foreground group-hover:text-accent transition-colors">
        {label}
      </span>
    </motion.button>
  );
}
