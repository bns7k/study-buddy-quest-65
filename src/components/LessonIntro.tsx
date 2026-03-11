import { motion } from "framer-motion";
import { Clock, Zap, HelpCircle, Target, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lesson } from "@/types/course";
import { getLessonDuration, getLessonXpReward } from "@/lib/lesson-utils";

interface LessonIntroProps {
  lesson: Lesson;
  moduleName: string;
  weekNumber: number;
  onStart: () => void;
}

export function LessonIntro({ lesson, moduleName, weekNumber, onStart }: LessonIntroProps) {
  const duration = getLessonDuration(lesson);
  const xpReward = getLessonXpReward(lesson);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10">
        <Target className="h-10 w-10 text-primary" />
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-primary">
        Week {weekNumber} — {moduleName}
      </p>
      <h1 className="mt-2 text-2xl font-black text-foreground">{lesson.title}</h1>

      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-bold text-muted-foreground">{duration} min</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-muted px-3 py-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-bold text-muted-foreground">{lesson.questions.length} questions</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-xp/10 px-3 py-2">
          <Zap className="h-4 w-4 text-xp fill-xp" />
          <span className="text-sm font-bold text-xp">+{xpReward} XP</span>
        </div>
      </div>

      <div className="mt-8 w-full rounded-2xl border-2 border-border bg-card p-6 text-left">
        <h3 className="mb-3 font-extrabold text-foreground">What you'll learn</h3>
        <p className="text-sm leading-relaxed text-foreground/80">{lesson.explanation}</p>
        {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
          <ul className="mt-4 space-y-2">
            {lesson.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                {obj}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        onClick={onStart}
        className="mt-8 w-full gap-2 rounded-xl font-bold h-14 text-lg"
      >
        Start Lesson <ArrowRight className="h-5 w-5" />
      </Button>
    </motion.div>
  );
}
