import { motion } from "framer-motion";
import { Lock, Check } from "lucide-react";
import { Course, Lesson } from "@/types/course";
import { UserProgress } from "@/types/course";
import { LectureHallIcon, LibraryIcon, MarketYardIcon, ObservatoryIcon } from "@/components/icons/AcademyBuildings";
import { MapBackground } from "@/components/MapBackground";
import { ComponentType, SVGProps } from "react";

interface AcademyBuilding {
  name: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  afterNodeIndex: number;
}

interface MapNode {
  lesson: Lesson;
  moduleId: string;
  courseId: string;
  status: "completed" | "current" | "locked";
}

const BUILDINGS: AcademyBuilding[] = [
  { name: "Lecture Hall", Icon: LectureHallIcon, afterNodeIndex: 3 },
  { name: "Guild Library", Icon: LibraryIcon, afterNodeIndex: 9 },
  { name: "Market Yard", Icon: MarketYardIcon, afterNodeIndex: 18 },
  { name: "Risk Observatory", Icon: ObservatoryIcon, afterNodeIndex: 30 },
];

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
  onLessonClick: (courseId: string, moduleId: string, lessonId: string) => void;
}

export function LearningMap({ course, progress, onLessonClick }: LearningMapProps) {
  const nodes: MapNode[] = [];

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

  const nodeSpacing = 90;
  const mapHeight = nodes.length * nodeSpacing + 200;

  return (
    <div className="relative mx-auto w-full max-w-sm" style={{ height: mapHeight }}>
      <MapBackground />

      {/* SVG path connecting nodes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`-120 0 240 ${mapHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {nodes.map((node, i) => {
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
              stroke={isCompleted ? "hsl(var(--success))" : "hsl(var(--muted))"}
              strokeWidth="3"
              strokeDasharray={isCompleted ? "none" : "6 4"}
              opacity={isCompleted ? 0.6 : 0.3}
            />
          );
        })}
      </svg>

      {/* Academy Buildings */}
      {BUILDINGS.map((building) => {
        if (building.afterNodeIndex >= nodes.length) return null;
        const y = building.afterNodeIndex * nodeSpacing + 40;
        const side = building.afterNodeIndex % 2 === 0 ? 1 : -1;
        const BuildingIcon = building.Icon;
        return (
          <motion.div
            key={building.name}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute flex flex-col items-center gap-1"
            style={{
              top: y - 24,
              left: `calc(50% + ${side * 90}px)`,
              transform: "translateX(-50%)",
            }}
          >
            <BuildingIcon className="h-10 w-10 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap">
              {building.name}
            </span>
          </motion.div>
        );
      })}

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

              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ repeat: Infinity, duration: 2 }}
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
