import { motion, AnimatePresence } from "framer-motion";
import { Settings, Shield, Heart, ArrowLeft } from "lucide-react";
import { GuildCrest } from "@/components/icons/GuildCrest";
import { StatsBar } from "@/components/StatsBar";
import { RankBadge } from "@/components/RankBadge";
import { LearningMap } from "@/components/LearningMap";
import { BuildingsView, ACADEMY_BUILDINGS } from "@/components/BuildingsView";
import { MentorPanel } from "@/components/MentorPanel";
import { RankUpOverlay } from "@/components/RankUpOverlay";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useProgress } from "@/hooks/useProgress";
import { useAvatar } from "@/hooks/useAvatar";
import { getAllCourses } from "@/data/courses";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { SupportDialog } from "@/components/SupportDialog";
import { useState, useEffect, useRef } from "react";
import { getRank } from "@/lib/ranks";
import { AvatarGender } from "@/lib/avatars";

const BUILDING_MENTOR: Record<string, string> = {
  "lecture-hall": "The Lecture Hall — where every great analyst begins. Master the foundations here.",
  "guild-library": "Welcome to the Guild Library. Here you'll study valuation and decision-making.",
  "market-yard": "The Market Yard — where theory meets practice. Understand risk and capital.",
  "risk-observatory": "The Risk Observatory. From here, you'll learn policy and advanced strategy.",
};

const HOME_MENTOR: Record<number, string> = {
  0: "Welcome back, analyst. Choose a hall to continue your studies.",
  5: "You're making excellent progress. Keep exploring the academy halls.",
  15: "Your knowledge grows, analyst. The Guild Library has much more to teach.",
  30: "You've come far. The advanced halls await your expertise.",
};

function getHomeMentorMessage(completedCount: number): string {
  const keys = Object.keys(HOME_MENTOR).map(Number).sort((a, b) => b - a);
  for (const key of keys) {
    if (completedCount >= key) return HOME_MENTOR[key];
  }
  return HOME_MENTOR[0];
}

const Index = () => {
  const { progress } = useProgress();
  const { avatar, chooseAvatar, completeOnboarding } = useAvatar();
  const navigate = useNavigate();
  const courses = getAllCourses();
  const [supportOpen, setSupportOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [rankUp, setRankUp] = useState<{ show: boolean }>({ show: false });
  const prevRankRef = useRef(getRank(progress.completedLessons.length));

  useEffect(() => {
    const currentRank = getRank(progress.completedLessons.length);
    if (currentRank.level > prevRankRef.current.level) {
      setRankUp({ show: true });
    }
    prevRankRef.current = currentRank;
  }, [progress.completedLessons.length]);

  const mainCourse = courses[0];
  if (!mainCourse) return null;

  const currentRank = getRank(progress.completedLessons.length);

  const handleLessonClick = (courseId: string, moduleId: string, lessonId: string) => {
    navigate(`/course/${courseId}/module/${moduleId}/lesson/${lessonId}`);
  };

  const handleOnboardingComplete = (gender: AvatarGender) => {
    chooseAvatar(gender);
    completeOnboarding();
  };

  // Show onboarding for first-time users
  if (!avatar.onboardingComplete) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  const selectedBuildingData = selectedBuilding
    ? ACADEMY_BUILDINGS.find((b) => b.id === selectedBuilding)
    : null;

  const mentorMessage = selectedBuildingData
    ? BUILDING_MENTOR[selectedBuilding!] || ""
    : getHomeMentorMessage(progress.completedLessons.length);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2.5">
            {selectedBuilding ? (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedBuilding(null)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-accent" />
              </motion.button>
            ) : (
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                <GuildCrest className="h-6 w-6 text-accent" />
              </div>
            )}
            <div className="hidden sm:block">
              <span className="text-sm font-black text-foreground tracking-tight">
                {selectedBuildingData ? selectedBuildingData.name : "Capital Guild"}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="h-px w-3 bg-accent/30" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/60">
                  {selectedBuildingData ? selectedBuildingData.subtitle : "Foundation Academy"}
                </span>
                <div className="h-px w-3 bg-accent/30" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <RankBadge completedCount={progress.completedLessons.length} />
            <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
          </div>
          <div className="flex gap-1">
            <button onClick={() => setSupportOpen(true)} className="rounded-xl p-1.5 hover:bg-muted" title="Support the project">
              <Heart className="h-5 w-5 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/admin")} className="rounded-xl p-1.5 hover:bg-muted">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </button>
            <button onClick={() => navigate("/settings")} className="rounded-xl p-1.5 hover:bg-muted">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <AnimatePresence mode="wait">
          {!selectedBuilding ? (
            <motion.div
              key="buildings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
                <h1 className="text-2xl font-black text-foreground">Foundation Academy</h1>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-accent/20" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Choose a Hall
                  </p>
                  <div className="h-px w-8 bg-accent/20" />
                </div>
                <p className="mt-1.5 text-sm text-accent font-bold">
                  {progress.completedLessons.length} lessons completed
                </p>
              </motion.div>

              <BuildingsView
                course={mainCourse}
                progress={progress}
                onBuildingClick={setSelectedBuilding}
              />

              {/* Locked Paths Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10"
              >
                <div className="mb-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="h-px w-10 bg-accent/20" />
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Specialization Paths
                    </p>
                    <div className="h-px w-10 bg-accent/20" />
                  </div>
                  <p className="text-xs text-muted-foreground/70 italic max-w-sm mx-auto leading-relaxed">
                    "Every analyst's journey leads to a crossroads — a moment to choose your path. But first, you must prove yourself at the Foundation Academy."
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { name: "Corporate Strategy", subtitle: "M&A & Advisory", emoji: "⚔️" },
                    { name: "Portfolio Management", subtitle: "Markets & Allocation", emoji: "🛡️" },
                    { name: "Quantitative Analysis", subtitle: "Models & Algorithms", emoji: "📜" },
                  ].map((path, i) => (
                    <motion.div
                      key={path.name}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 0.45, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="relative flex flex-col items-center gap-2 rounded-2xl border border-border/30 bg-card/40 p-5 text-center cursor-not-allowed select-none"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/40 text-2xl">
                        {path.emoji}
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-muted-foreground">{path.name}</h3>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{path.subtitle}</p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key={`building-${selectedBuilding}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
                <h1 className="text-xl font-black text-foreground">{selectedBuildingData?.name}</h1>
                <p className="mt-1 text-xs text-muted-foreground">{selectedBuildingData?.subtitle}</p>
              </motion.div>

              <LearningMap
                course={mainCourse}
                progress={progress}
                avatarGender={avatar.gender || "male"}
                rankLevel={currentRank.level}
                moduleFilter={selectedBuildingData?.moduleIds}
                onLessonClick={handleLessonClick}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MentorPanel message={mentorMessage} show />

      <RankUpOverlay
        rank={currentRank}
        show={rankUp.show}
        onClose={() => setRankUp({ show: false })}
      />

      <SupportDialog open={supportOpen} onOpenChange={setSupportOpen} />
      <BottomNav />
    </div>
  );
};

export default Index;
