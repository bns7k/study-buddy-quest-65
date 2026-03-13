import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap, AlertTriangle, Brain, Clock, ChevronRight,
  Flame, Star, RotateCcw, Zap, Target, CheckCircle2, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatsBar } from "@/components/StatsBar";
import { ReviewPlayer } from "@/components/ReviewPlayer";
import { useProgress } from "@/hooks/useProgress";
import { getAllCourses } from "@/data/courses";
import { BottomNav } from "@/components/BottomNav";
import { QuizQuestion } from "@/types/course";

type ReviewView = "hub" | "session";

interface ReviewSession {
  title: string;
  subtitle?: string;
  questions: QuizQuestion[];
}

export default function ReviewPage() {
  const {
    progress, recordAnswer, completeReview,
    getDueQuestions, getWrongQuestions, getMasteredCount,
  } = useProgress();
  const [view, setView] = useState<ReviewView>("hub");
  const [session, setSession] = useState<ReviewSession | null>(null);

  const records = progress.questionRecords || {};

  // Build a map from questionId to QuizQuestion
  const questionMap = useMemo(() => {
    const map = new Map<string, { question: QuizQuestion; courseName: string; moduleName: string; lessonName: string }>();
    getAllCourses().forEach((course) =>
      course.modules.forEach((mod) =>
        mod.lessons.forEach((lesson) =>
          lesson.questions.forEach((q) =>
            map.set(q.id, { question: q, courseName: course.title, moduleName: mod.title, lessonName: lesson.title })
          )
        )
      )
    );
    return map;
  }, []);

  const dueRecords = getDueQuestions();
  const wrongRecords = getWrongQuestions();
  const masteredCount = getMasteredCount();
  const totalTracked = Object.keys(records).length;

  // Due questions resolved to QuizQuestion objects
  const dueQuestions = useMemo(
    () => dueRecords.map((r) => questionMap.get(r.questionId)?.question).filter(Boolean) as QuizQuestion[],
    [dueRecords, questionMap]
  );

  // Wrong questions resolved
  const wrongQuestions = useMemo(
    () => wrongRecords.map((r) => questionMap.get(r.questionId)?.question).filter(Boolean) as QuizQuestion[],
    [wrongRecords, questionMap]
  );

  // Weak topics: group wrong questions by module
  const weakTopics = useMemo(() => {
    const topicMap = new Map<string, { moduleName: string; courseName: string; wrongCount: number; questions: QuizQuestion[] }>();
    wrongRecords.forEach((r) => {
      const info = questionMap.get(r.questionId);
      if (!info) return;
      const key = info.moduleName;
      const existing = topicMap.get(key);
      if (existing) {
        existing.wrongCount += r.wrongCount;
        existing.questions.push(info.question);
      } else {
        topicMap.set(key, { moduleName: info.moduleName, courseName: info.courseName, wrongCount: r.wrongCount, questions: [info.question] });
      }
    });
    return Array.from(topicMap.values()).sort((a, b) => b.wrongCount - a.wrongCount);
  }, [wrongRecords, questionMap]);

  // Shuffle helper
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startSession = (s: ReviewSession) => {
    setSession(s);
    setView("session");
  };

  const handleSessionComplete = (_correct: number, _total: number) => {
    completeReview();
  };

  const handleAnswer = (questionId: string, wasCorrect: boolean) => {
    // Find which lesson/course this question belongs to
    const info = questionMap.get(questionId);
    if (info) {
      // Find courseId and lessonId
      for (const course of getAllCourses()) {
        for (const mod of course.modules) {
          for (const lesson of mod.lessons) {
            if (lesson.questions.some((q) => q.id === questionId)) {
              recordAnswer(questionId, lesson.id, course.id, wasCorrect);
              return;
            }
          }
        }
      }
    }
  };

  if (view === "session" && session) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
          <ReviewPlayer
            questions={session.questions}
            title={session.title}
            subtitle={session.subtitle}
            onAnswer={handleAnswer}
            onComplete={handleSessionComplete}
            onExit={() => { setView("hub"); setSession(null); }}
          />
        </main>
      </div>
    );
  }

  const hasActivity = totalTracked > 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <span className="text-lg font-black text-foreground">Review</span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Spaced Review</h1>
          <p className="mt-1 text-muted-foreground">
            {hasActivity ? "Review what you've learned to strengthen your memory" : "Complete some lessons first to start reviewing"}
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm">
            <Calendar className="mx-auto h-5 w-5 text-streak mb-1" />
            <p className="text-2xl font-black text-foreground">{dueQuestions.length}</p>
            <p className="text-[10px] font-bold text-muted-foreground">Due Today</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm">
            <Flame className="mx-auto h-5 w-5 text-streak mb-1" />
            <p className="text-2xl font-black text-foreground">{progress.reviewStreak || 0}</p>
            <p className="text-[10px] font-bold text-muted-foreground">Review Streak</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-sm">
            <Star className="mx-auto h-5 w-5 text-success fill-success mb-1" />
            <p className="text-2xl font-black text-foreground">{masteredCount}</p>
            <p className="text-[10px] font-bold text-muted-foreground">Mastered</p>
          </motion.div>
        </div>

        {/* Due Today - Primary CTA */}
        {dueQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-foreground">Due Today</h3>
                <p className="text-sm text-muted-foreground">{dueQuestions.length} question{dueQuestions.length > 1 ? "s" : ""} ready for review</p>
              </div>
            </div>
            <Button
              className="w-full gap-2 rounded-xl font-bold h-12 text-base"
              onClick={() => startSession({
                title: "Daily Review",
                subtitle: `${dueQuestions.length} due questions`,
                questions: shuffle(dueQuestions).slice(0, 15),
              })}
            >
              <Brain className="h-4 w-4" /> Start Daily Review
            </Button>
          </motion.div>
        )}

        {/* Quick Review Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Review Sessions</h3>

          {/* Mistakes to Review */}
          <ReviewOptionCard
            icon={AlertTriangle}
            title="Mistakes to Review"
            description={`${wrongQuestions.length} questions you've gotten wrong`}
            meta={`${wrongQuestions.length} Qs`}
            color="bg-destructive/10 text-destructive"
            disabled={wrongQuestions.length === 0}
            onClick={() => startSession({
              title: "Mistake Review",
              subtitle: "Questions you've previously gotten wrong",
              questions: shuffle(wrongQuestions).slice(0, 15),
            })}
          />

          {/* 5-Minute Quick Review */}
          <ReviewOptionCard
            icon={Clock}
            title="5-Minute Quick Review"
            description="A fast review of recent material"
            meta="~5 min"
            color="bg-xp/10 text-xp"
            disabled={totalTracked === 0}
            onClick={() => {
              const allTrackedQs = Object.keys(records)
                .map((id) => questionMap.get(id)?.question)
                .filter(Boolean) as QuizQuestion[];
              startSession({
                title: "Quick Review",
                subtitle: "5-minute rapid recall",
                questions: shuffle(allTrackedQs).slice(0, 8),
              });
            }}
          />

          {/* Incorrect Only Sprint */}
          <ReviewOptionCard
            icon={RotateCcw}
            title="Retry Incorrect Answers"
            description="Only questions you got wrong last time"
            meta={`${wrongQuestions.length} Qs`}
            color="bg-streak/10 text-streak"
            disabled={wrongQuestions.length === 0}
            onClick={() => startSession({
              title: "Incorrect Retry",
              subtitle: "Focus on your mistakes",
              questions: shuffle(wrongQuestions).slice(0, 20),
            })}
          />
        </div>

        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Weak Topics
            </h3>
            {weakTopics.slice(0, 5).map((topic, i) => (
              <motion.div
                key={topic.moduleName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group cursor-pointer rounded-2xl border-2 border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
                onClick={() => startSession({
                  title: topic.moduleName,
                  subtitle: `${topic.questions.length} weak questions from ${topic.courseName}`,
                  questions: shuffle(topic.questions),
                })}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate text-sm">{topic.moduleName}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{topic.courseName}</span>
                      <span>·</span>
                      <span className="text-destructive font-bold">{topic.wrongCount} mistakes</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Mastery Progress */}
        {totalTracked > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-border bg-card p-5"
          >
            <h3 className="font-extrabold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" /> Mastery Progress
            </h3>
            <div className="flex items-center gap-3">
              <Progress value={totalTracked > 0 ? (masteredCount / totalTracked) * 100 : 0} className="h-3 flex-1" />
              <span className="text-sm font-bold text-muted-foreground">{masteredCount}/{totalTracked}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Questions are mastered after consistently correct answers over 30+ days of spaced repetition.
            </p>
          </motion.div>
        )}

        {/* Empty State */}
        {!hasActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border-2 border-border bg-card p-8 text-center"
          >
            <Brain className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
            <h3 className="font-extrabold text-foreground mb-1">No review data yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete some lesson quizzes first — your incorrect answers and review schedule will appear here.
            </p>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

// Sub-component
function ReviewOptionCard({
  icon: Icon, title, description, meta, color, disabled, onClick,
}: {
  icon: React.ElementType; title: string; description: string;
  meta: string; color: string; disabled?: boolean; onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
      className={`group cursor-pointer rounded-2xl border-2 border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1">
          <span className="text-[10px] font-bold text-muted-foreground">{meta}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </motion.div>
  );
}
