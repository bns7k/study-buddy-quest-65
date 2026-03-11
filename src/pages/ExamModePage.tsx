import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap, ArrowLeft, Shuffle, Timer, BookOpen, Brain,
  AlertTriangle, ChevronRight, Zap, Target, Clock, FlaskConical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { getCourseById } from "@/data/courses";
import { getFormulasForCourse } from "@/data/formulas";
import { ExamPlayer } from "@/components/ExamPlayer";
import { BottomNav } from "@/components/BottomNav";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion } from "@/types/course";

type ExamView = "hub" | "exam" | "formulas";

interface ExamConfig {
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number;
}

export default function ExamModePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { progress, completeLesson, getModuleProgress } = useProgress();
  const [view, setView] = useState<ExamView>("hub");
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);

  const course = getCourseById(courseId || "");
  const formulas = getFormulasForCourse(courseId || "");

  // Gather all questions from the course
  const allQuestions = useMemo(() =>
    course?.modules.flatMap((m) =>
      m.lessons.flatMap((l) => l.questions)
    ) || [], [course]);

  // Analyze weak modules
  const moduleAnalysis = useMemo(() => {
    if (!course) return [];
    return course.modules.map((m) => {
      const lessonIds = m.lessons.map((l) => l.id);
      const completedCount = lessonIds.filter((id) => progress.completedLessons.includes(id)).length;
      const scores = lessonIds
        .map((id) => progress.lessonScores[id])
        .filter((s): s is number => s !== undefined);
      const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const prog = getModuleProgress(lessonIds);
      return {
        module: m,
        completedCount,
        totalLessons: lessonIds.length,
        avgScore,
        progress: prog,
        isWeak: (scores.length > 0 && avgScore < 75) || (prog > 0 && prog < 100),
        questionCount: m.lessons.reduce((sum, l) => sum + l.questions.length, 0),
      };
    });
  }, [course.modules, progress, getModuleProgress]);

  const weakModules = moduleAnalysis.filter((m) => m.isWeak);
  const wrongQuestionIds = useMemo(() => {
    // Questions from lessons where score < 100
    return course.modules.flatMap((m) =>
      m.lessons
        .filter((l) => {
          const score = progress.lessonScores[l.id];
          return score !== undefined && score < 100;
        })
        .flatMap((l) => l.questions)
    );
  }, [course.modules, progress.lessonScores]);

  // Shuffle helper
  const shuffle = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const startExam = (config: ExamConfig) => {
    setExamConfig(config);
    setView("exam");
  };

  const handleExamComplete = (correct: number, total: number, _timeUsed: number) => {
    // Award XP for exam mode
    completeLesson(`exam-${courseId}-${Date.now()}`, correct, total);
  };

  if (view === "exam" && examConfig) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-2xl px-4 py-6 pb-20">
          <ExamPlayer
            questions={examConfig.questions}
            timeLimit={examConfig.timeLimit}
            title={examConfig.title}
            onComplete={handleExamComplete}
            onExit={() => { setView("hub"); setExamConfig(null); }}
          />
        </main>
      </div>
    );
  }

  if (view === "formulas") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FlaskConical className="h-5 w-5" />
              </div>
              <span className="text-lg font-black text-foreground">Formula Review</span>
            </div>
            <Button variant="ghost" onClick={() => setView("hub")} className="font-bold">Done</Button>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6 space-y-4">
          {formulas.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No formulas available for this course yet.</p>
          ) : (
            formulas.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border-2 border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{f.moduleName}</span>
                    <h3 className="font-extrabold text-foreground">{f.name}</h3>
                  </div>
                </div>
                <div className="mt-3 rounded-xl bg-muted p-4">
                  <p className="text-center text-lg font-black text-foreground tracking-wide">{f.formula}</p>
                </div>
                <p className="mt-3 text-sm text-foreground/70">{f.description}</p>
              </motion.div>
            ))
          )}
        </main>
        <BottomNav />
      </div>
    );
  }

  // Hub view
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-foreground">Exam Mode</span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        <Button variant="ghost" onClick={() => navigate(`/course/${courseId}`)} className="gap-2 rounded-xl font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to {course.title}
        </Button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-4xl mb-2">🎯</div>
          <h1 className="text-2xl font-black text-foreground">Exam Preparation</h1>
          <p className="mt-1 text-muted-foreground">{course.title} — {allQuestions.length} questions available</p>
        </motion.div>

        {/* Exam Options */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Practice Modes</h3>

          {/* Random Mixed Quiz */}
          <ExamOptionCard
            icon={Shuffle}
            title="Random Mixed Quiz"
            description="20 random questions from all modules"
            meta="~10 min"
            color="bg-primary/10 text-primary"
            onClick={() => startExam({
              title: "Random Mixed Quiz",
              questions: shuffle(allQuestions).slice(0, 20),
            })}
          />

          {/* Timed Mock Exam */}
          <ExamOptionCard
            icon={Timer}
            title="Timed Mock Exam"
            description="30 questions, 15-minute time limit"
            meta="15 min"
            color="bg-destructive/10 text-destructive"
            onClick={() => startExam({
              title: "Timed Mock Exam",
              questions: shuffle(allQuestions).slice(0, 30),
              timeLimit: 15 * 60,
            })}
          />

          {/* Quick Sprint */}
          <ExamOptionCard
            icon={Zap}
            title="Quick Sprint"
            description="10 questions, 5-minute time limit"
            meta="5 min"
            color="bg-xp/10 text-xp"
            onClick={() => startExam({
              title: "Quick Sprint",
              questions: shuffle(allQuestions).slice(0, 10),
              timeLimit: 5 * 60,
            })}
          />

          {/* Wrong Answers Only */}
          <ExamOptionCard
            icon={AlertTriangle}
            title="Wrong Answers Cram"
            description={`Review ${wrongQuestionIds.length} questions you got wrong`}
            meta={`${wrongQuestionIds.length} Qs`}
            color="bg-streak/10 text-streak"
            disabled={wrongQuestionIds.length === 0}
            onClick={() => startExam({
              title: "Wrong Answers Cram",
              questions: shuffle(wrongQuestionIds).slice(0, 25),
            })}
          />

          {/* Formula Review */}
          <ExamOptionCard
            icon={FlaskConical}
            title="Formula Review"
            description={`${formulas.length} key formulas to memorize`}
            meta={`${formulas.length} formulas`}
            color="bg-secondary text-secondary-foreground"
            onClick={() => setView("formulas")}
          />
        </div>

        {/* Module-Based Practice */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground">Module Practice</h3>
          {course.modules.map((m, i) => {
            const analysis = moduleAnalysis[i];
            const questions = m.lessons.flatMap((l) => l.questions);
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group cursor-pointer rounded-2xl border-2 border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
                onClick={() => startExam({
                  title: `Week ${m.weekNumber}: ${m.title}`,
                  questions: shuffle(questions),
                })}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                    analysis.avgScore >= 80 ? "bg-success/10 text-success" :
                    analysis.avgScore >= 50 ? "bg-accent/10 text-accent" :
                    analysis.progress > 0 ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    W{m.weekNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate text-sm">{m.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{analysis.questionCount} Qs</span>
                      {analysis.avgScore > 0 && (
                        <span className={analysis.avgScore >= 75 ? "text-success font-bold" : "text-destructive font-bold"}>
                          Avg: {analysis.avgScore}%
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Revision Plan */}
        {weakModules.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4 text-destructive" /> Recommended Revision
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-destructive/20 bg-destructive/5 p-5 space-y-4"
            >
              <p className="text-sm text-foreground/80">
                Focus on these {weakModules.length} weak module{weakModules.length > 1 ? "s" : ""} to improve your exam readiness:
              </p>
              {weakModules.map((wm) => (
                <div key={wm.module.id} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-xs font-black text-destructive">
                    W{wm.module.weekNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{wm.module.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Progress value={wm.avgScore} className="h-1.5 flex-1 max-w-24" />
                      <span className="text-[10px] font-bold text-destructive">{wm.avgScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                className="w-full gap-2 rounded-xl font-bold"
                onClick={() => {
                  const weakQs = weakModules.flatMap((wm) =>
                    wm.module.lessons.flatMap((l) => l.questions)
                  );
                  startExam({
                    title: "Weak Areas Review",
                    questions: shuffle(weakQs).slice(0, 25),
                  });
                }}
              >
                <Brain className="h-4 w-4" /> Practice Weak Areas
              </Button>
            </motion.div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

// Sub-component for exam option cards
function ExamOptionCard({
  icon: Icon,
  title,
  description,
  meta,
  color,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  meta: string;
  color: string;
  disabled?: boolean;
  onClick: () => void;
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
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] font-bold text-muted-foreground">{meta}</span>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      </div>
    </motion.div>
  );
}
