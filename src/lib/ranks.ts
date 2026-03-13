export interface Rank {
  level: number;
  title: string;
  emoji: string;
  minLessons: number;
}

export const RANKS: Rank[] = [
  { level: 1, title: "Initiate", emoji: "🔰", minLessons: 0 },
  { level: 2, title: "Apprentice", emoji: "📜", minLessons: 3 },
  { level: 3, title: "Scribe", emoji: "✒️", minLessons: 8 },
  { level: 4, title: "Journeyman", emoji: "🗺️", minLessons: 15 },
  { level: 5, title: "Analyst", emoji: "📊", minLessons: 25 },
  { level: 6, title: "Senior Analyst", emoji: "🏅", minLessons: 40 },
  { level: 7, title: "Guild Strategist", emoji: "👑", minLessons: 60 },
];

export function getRank(completedCount: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (completedCount >= rank.minLessons) current = rank;
  }
  return current;
}

export function getNextRank(completedCount: number): Rank | null {
  const current = getRank(completedCount);
  return RANKS.find((r) => r.level === current.level + 1) || null;
}
