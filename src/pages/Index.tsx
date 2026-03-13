import { motion } from "framer-motion";
import { GraduationCap, Settings, Shield, Heart } from "lucide-react";
import { StatsBar } from "@/components/StatsBar";
import { RankBadge } from "@/components/RankBadge";
import { LearningMap } from "@/components/LearningMap";
import { MentorPanel } from "@/components/MentorPanel";
import { RankUpOverlay } from "@/components/RankUpOverlay";
import { useProgress } from "@/hooks/useProgress";
import { getAllCourses } from "@/data/courses";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { SupportDialog } from "@/components/SupportDialog";
import { useState, useEffect, useRef } from "react";
import { getRank } from "@/lib/ranks";

const MENTOR_DIALOGUES: Record<number, string> = {
  0: "Welcome to the Foundation Academy. Let us begin with how analysts think.",
  3: "You've reached the Lecture Hall. Theory is the foundation of every great analyst.",
  9: "The Guild Library awaits. Here you'll find deeper knowledge of valuation.",
  18: "The Market Yard — where theory meets practice. Apply what you've learned.",
  30: "The Risk Observatory. From here, you'll learn to see danger before it arrives.",
};

function getMentorMessage(completedCount: number): string {
  const keys = Object.keys(MENTOR_DIALOGUES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const key of keys) {
    if (completedCount >= key) return MENTOR_DIALOGUES[key];
  }
  return MENTOR_DIALOGUES[0];
}

const Index = () => {
  const { progress } = useProgress();
  const navigate = useNavigate();
  const courses = getAllCourses();
  const [supportOpen, setSupportOpen] = useState(false);
  const [showMentor, setShowMentor] = useState(true);
  const [rankUp, setRankUp] = useState<{ show: boolean }>({ show: false });
  const prevRankRef = useRef(getRank(progress.completedLessons.length));

  // Check for rank up
  useEffect(() => {
    const currentRank = getRank(progress.completedLessons.length);
    if (currentRank.level > prevRankRef.current.level) {
      setRankUp({ show: true });
    }
    prevRankRef.current = currentRank;
  }, [progress.completedLessons.length]);

  // Use first course as the main learning path
  const mainCourse = courses[0];
  if (!mainCourse) return null;

  const mentorMessage = getMentorMessage(progress.completedLessons.length);
  const currentRank = getRank(progress.completedLessons.length);

  const handleLessonClick = (courseId: string, moduleId: string, lessonId: string) => {
    navigate(`/course/${courseId}/module/${moduleId}/lesson/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-foreground hidden sm:inline">Foundation Academy</span>
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-center">
          <h1 className="text-2xl font-black text-foreground">Foundation Academy</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mainCourse.title} · {progress.completedLessons.length} lessons completed
          </p>
        </motion.div>

        <LearningMap
          course={mainCourse}
          progress={progress}
          onLessonClick={handleLessonClick}
        />
      </main>

      <MentorPanel message={mentorMessage} show={showMentor} />

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
