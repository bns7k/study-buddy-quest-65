import { motion } from "framer-motion";
import { AvatarGender, getAvatarForRank } from "@/lib/avatars";

interface MapAvatarProps {
  gender: AvatarGender;
  rankLevel: number;
}

export function MapAvatar({ gender, rankLevel }: MapAvatarProps) {
  const { emoji, label, image } = getAvatarForRank(gender, rankLevel);

  return (
    <motion.div
      className="flex flex-col items-center mb-1"
      animate={{ y: [-4, 0, -4] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <div className="relative">
        {image ? (
          <img src={image} alt={`${label} avatar`} className="block h-12 w-12 object-contain drop-shadow-md" />
        ) : (
          <span className="text-2xl block drop-shadow-md">{emoji}</span>
        )}
        {/* Shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1.5 w-5 rounded-full bg-foreground/10 blur-sm" />
      </div>
      <span className="text-[7px] font-bold text-accent/70 mt-0.5">{label}</span>
    </motion.div>
  );
}
