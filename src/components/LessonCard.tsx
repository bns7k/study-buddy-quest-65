import { motion } from "framer-motion";
import { CheckCircle2, BookOpen, Star } from "lucide-react";
import { Lesson } from "@/types/course";
import { useNavigate } from "react-router-dom";

interface LessonCardProps {
  lesson: Lesson;
  courseId: string;
  moduleId: string;
  index: number;
  isCompleted: boolean;
  score: number | null;
}

export function LessonCard({ lesson, courseId, moduleId, index, isCompleted, score }: LessonCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className={`group cursor-pointer rounded-2xl border-2 p-4 transition-all hover:shadow-md ${
        isCompleted
          ? "border-success/30 bg-success/5 hover:border-success/50"
          : "border-border bg-card hover:border-primary/40"
      }`}
      onClick={() => navigate(`/course/${courseId}/module/${moduleId}/lesson/${lesson.id}`)}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isCompleted ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"
          }`}
        >
          {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground truncate">{lesson.title}</h4>
          <p className="text-xs text-muted-foreground">{lesson.questions.length} questions</p>
        </div>
        {score !== null && (
          <div className="flex items-center gap-1 rounded-lg bg-accent/15 px-2 py-1">
            <Star className="h-3.5 w-3.5 text-accent fill-accent" />
            <span className="text-xs font-bold text-accent">{score}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
