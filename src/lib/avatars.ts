import maleAvatarImg from "@/assets/male-analyst-transparent.svg";

export type AvatarGender = "male" | "female";

export interface AvatarOutfit {
  rankLevel: number;
  label: string;
  male: string;
  female: string;
}

export const AVATAR_OUTFITS: AvatarOutfit[] = [
  { rankLevel: 1, label: "Apprentice Clothing", male: "👤", female: "👤" },
  { rankLevel: 2, label: "Leather Guild Outfit", male: "🧑‍💼", female: "👩‍💼" },
  { rankLevel: 3, label: "Scholar Cloak", male: "🧑‍🎓", female: "👩‍🎓" },
  { rankLevel: 4, label: "Analyst Coat", male: "🕵️", female: "🕵️‍♀️" },
  { rankLevel: 5, label: "Vest & Tablet", male: "👨‍💻", female: "👩‍💻" },
  { rankLevel: 6, label: "Business Jacket", male: "🤵", female: "🤵‍♀️" },
  { rankLevel: 7, label: "Elegant Suit", male: "👑", female: "👑" },
];

export function getAvatarForRank(gender: AvatarGender, rankLevel: number): { emoji: string; label: string; image?: string } {
  let outfit = AVATAR_OUTFITS[0];
  for (const o of AVATAR_OUTFITS) {
    if (rankLevel >= o.rankLevel) outfit = o;
  }
  return {
    emoji: gender === "male" ? outfit.male : outfit.female,
    label: outfit.label,
    image: maleAvatarImg,
  };
}
