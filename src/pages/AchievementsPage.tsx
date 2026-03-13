import { motion } from "framer-motion";
import { GraduationCap, Lock } from "lucide-react";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { allBadges } from "@/data/badges";
import { BottomNav } from "@/components/BottomNav";

export default function AchievementsPage() {
  const { progress } = useProgress();
  const unlockedCount = allBadges.filter((b) => b.condition(progress)).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <span className="text-lg font-black text-foreground">Achievements</span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Your Badges</h1>
          <p className="mt-1 text-muted-foreground">
            {unlockedCount} of {allBadges.length} unlocked
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {allBadges.map((badge, i) => {
            const unlocked = badge.condition(progress);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all shadow-sm ${
                  unlocked
                    ? "border-accent/30 bg-card shadow-accent/5"
                    : "border-border/40 bg-muted/20 opacity-60"
                }`}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                  unlocked ? "bg-accent/10" : "bg-muted/50"
                }`}>
                  {unlocked ? (
                    <span className="text-4xl">{badge.emoji}</span>
                  ) : (
                    <Lock className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h4 className="text-sm font-extrabold text-foreground">{badge.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-tight">{badge.description}</p>
                {unlocked && (
                  <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground font-bold shadow-sm">
                    ✓
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
