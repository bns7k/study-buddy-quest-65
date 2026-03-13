import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { Course, Lesson } from "@/types/course";
import { UserProgress } from "@/types/course";
import { MapBackground } from "@/components/MapBackground";
import { MapAvatar } from "@/components/MapAvatar";
import { AvatarGender } from "@/lib/avatars";

interface MapNode {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  status: "completed" | "current" | "locked";
}

function getPathX(index: number): number {
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
  avatarGender: AvatarGender;
  rankLevel: number;
  moduleFilter?: string[];
  onLessonClick: (courseId: string, moduleId: string, lessonId: string) => void;
}

function BuildingLabel({ name }: { name: string }) {
  return (
    <div className="relative mt-1">
      <svg className="absolute -left-2 -right-2 -top-0.5 -bottom-0.5 h-[calc(100%+4px)] w-[calc(100%+16px)]" viewBox="0 0 100 24" preserveAspectRatio="none">
        <path
          d="M8 2h84l6 10-6 10H8L2 12 8 2z"
          fill="hsl(var(--card))"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
          opacity="0.85"
        />
      </svg>
      <span className="relative z-10 block px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-accent whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function LearningMap({ course, progress, avatarGender, rankLevel, moduleFilter, onLessonClick }: LearningMapProps) {
  const nodes: MapNode[] = [];

  let foundCurrent = false;
  for (const mod of course.modules) {
    if (mod.isBonus) continue;
    if (moduleFilter && !moduleFilter.includes(mod.id)) continue;
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

  const nodeSpacing = 90;
  const mapHeight = nodes.length * nodeSpacing + 200;

  return (
    <div className="relative mx-auto w-full max-w-sm rounded-2xl border border-accent/10 overflow-hidden" style={{ height: mapHeight }}>
      <MapBackground />

      {/* Golden SVG path */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`-120 0 240 ${mapHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <linearGradient id="path-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(38, 90%, 60%)" />
            <stop offset="100%" stopColor="hsl(32, 80%, 45%)" />
          </linearGradient>
          <filter id="path-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {nodes.map((_, i) => {
          if (i === 0) return null;
          const x1 = getPathX(i - 1);
          const y1 = (i - 1) * nodeSpacing + 40;
          const x2 = getPathX(i);
          const y2 = i * nodeSpacing + 40;
          const midY = (y1 + y2) / 2;
          const isCompleted = nodes[i - 1].status === "completed";
          return (
            <path
              key={`path-${i}`}
              d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
              fill="none"
              stroke={isCompleted ? "url(#path-gold)" : "hsl(var(--muted))"}
              strokeWidth={isCompleted ? 4 : 3}
              strokeDasharray={isCompleted ? "none" : "6 4"}
              opacity={isCompleted ? 0.8 : 0.3}
              filter={isCompleted ? "url(#path-glow)" : undefined}
            />
          );
        })}
      </svg>



      {/* Lesson nodes */}
      {nodes.map((node, i) => {
        const x = getPathX(i);
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
              <MapAvatar gender={avatarGender} rankLevel={rankLevel} />
            )}
            <motion.button
              onClick={() => {
                if (!isLocked) {
                  onLessonClick(node.courseId, node.moduleId, node.lesson.id);
                }
              }}
              disabled={isLocked}
              className={`relative flex h-13 w-13 items-center justify-center rounded-full border-[3px] text-sm font-black transition-all ${
                isCompleted
                  ? "border-success bg-success/20 text-success shadow-[0_0_12px_hsl(var(--success)/0.3)]"
                  : isCurrent
                  ? "border-accent bg-accent/20 text-accent shadow-[0_0_16px_hsl(var(--accent)/0.4)]"
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
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}

              {/* Sparkle particles for completed */}
              {isCompleted && (
                <motion.div
                  className="absolute -inset-1 rounded-full"
                  style={{
                    background: "radial-gradient(circle, hsl(var(--success) / 0.1) 0%, transparent 70%)",
                  }}
                />
              )}
            </motion.button>

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
