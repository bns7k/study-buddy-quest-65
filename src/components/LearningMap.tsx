import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Check } from "lucide-react";
import { Course, Lesson, Module } from "@/types/course";
import { UserProgress } from "@/types/course";

interface AcademyBuilding {
  name: string;
  emoji: string;
  afterNodeIndex: number;
}

interface MapNode {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  status: "completed" | "current" | "locked";
}

const BUILDINGS: AcademyBuilding[] = [
  { name: "Lecture Hall", emoji: "🏛️", afterNodeIndex: 3 },
  { name: "Guild Library", emoji: "📚", afterNodeIndex: 9 },
  { name: "Market Yard", emoji: "🏪", afterNodeIndex: 18 },
  { name: "Risk Observatory", emoji: "🔭", afterNodeIndex: 30 },
];

function getPathX(index: number, total: number): number {
  // Zigzag pattern
  const amplitude = 60;
  const segment = index % 4;
  if (segment === 0) return 0;
  if (segment === 1) return amplitude;
  if (segment === 2) return 0;
  return -amplitude;
}

interface LearningMapProps {
  course: Course;
  progress: UserProgress;
  onLessonClick: (courseId: string, moduleId: string, lessonId: string) => void;
}

export function LearningMap({ course, progress, onLessonClick }: LearningMapProps) {
  const nodes: MapNode[] = [];

  // Flatten all lessons into a linear path
  let foundCurrent = false;
  for (const mod of course.modules) {
    if (mod.isBonus) continue;
    for (const lesson of mod.lessons) {
      const completed = progress.completedLessons.includes(lesson.id);
      let status: MapNode["status"];
      if (completed) {
        status = "completed";
      } else if (!foundCurrent) {
        status = "current";
        foundCurrent = true;
      } else {
        status = "locked";
      }
      nodes.push({ lesson, moduleId: mod.id, courseId: course.id, status });
    }
  }

  // If all completed, no current
  if (!foundCurrent && nodes.length > 0 && nodes.every((n) => n.status === "completed")) {
    // all done
  }

  const nodeSpacing = 90;
  const mapHeight = nodes.length * nodeSpacing + 200;

  return (
    <div className="relative mx-auto w-full max-w-sm" style={{ height: mapHeight }}>
      {/* SVG path connecting nodes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`-120 0 240 ${mapHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {nodes.map((node, i) => {
          if (i === 0) return null;
          const x1 = getPathX(i - 1, nodes.length);
          const y1 = (i - 1) * nodeSpacing + 40;
          const x2 = getPathX(i, nodes.length);
          const y2 = i * nodeSpacing + 40;
          const midY = (y1 + y2) / 2;
          const isCompleted = nodes[i - 1].status === "completed";
          return (
            <path
              key={`path-${i}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke={isCompleted ? "hsl(var(--success))" : "hsl(var(--muted))"}
              strokeWidth="3"
              strokeDasharray={isCompleted ? "none" : "6 4"}
              opacity={isCompleted ? 0.6 : 0.3}
            />
          );
        })}
      </svg>

      {/* Buildings */}
      {BUILDINGS.map((building) => {
        if (building.afterNodeIndex >= nodes.length) return null;
        const y = building.afterNodeIndex * nodeSpacing + 40;
        const side = building.afterNodeIndex % 2 === 0 ? 1 : -1;
        return (
          <motion.div
            key={building.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute flex flex-col items-center gap-1"
            style={{
              top: y - 20,
              left: `calc(50% + ${side * 90}px)`,
              transform: "translateX(-50%)",
            }}
          >
            <span className="text-2xl">{building.emoji}</span>
            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
              {building.name}
            </span>
          </motion.div>
        );
      })}

      {/* Lesson nodes */}
      {nodes.map((node, i) => {
        const x = getPathX(i, nodes.length);
        const y = i * nodeSpacing + 40;
        const isCurrent = node.status === "current";
        const isCompleted = node.status === "completed";
        const isLocked = node.status === "locked";

        return (
          <motion.div
            key={node.lesson.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 20 }}
            className="absolute flex flex-col items-center"
            style={{
              top: y - 24,
              left: `calc(50% + ${x}px)`,
              transform: "translateX(-50%)",
            }}
          >
            {/* Avatar on current node */}
            {isCurrent && (
              <motion.div
                animate={{ y: [-4, 0, -4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mb-1 text-lg"
              >
                🧑‍🎓
              </motion.div>
            )}
            <motion.button
              onClick={() => {
                if (!isLocked) {
                  onLessonClick(node.courseId, node.moduleId, node.lesson.id);
                }
              }}
              disabled={isLocked}
              className={`relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] text-sm font-black shadow-lg transition-all ${
                isCompleted
                  ? "border-success bg-success/20 text-success"
                  : isCurrent
                  ? "border-accent bg-accent/20 text-accent"
                  : "border-muted bg-muted/30 text-muted-foreground cursor-not-allowed"
              }`}
              whileHover={!isLocked ? { scale: 1.15 } : undefined}
              whileTap={!isLocked ? { scale: 0.95 } : undefined}
            >
              {isCompleted ? (
                <Check className="h-5 w-5" />
              ) : isLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <span className="text-base">⭐</span>
              )}

              {/* Glow ring for current */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>

            {/* Lesson title */}
            <p
              className={`mt-1.5 max-w-[100px] text-center text-[10px] font-bold leading-tight ${
                isLocked ? "text-muted-foreground/50" : "text-foreground/80"
              }`}
            >
              {node.lesson.title}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
