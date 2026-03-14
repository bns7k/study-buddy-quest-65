import { motion } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
import { Course, Module } from "@/types/course";
import { UserProgress } from "@/types/course";
import { MapBackground } from "@/components/MapBackground";
import { LectureHallIcon, LibraryIcon, MarketYardIcon, ObservatoryIcon } from "@/components/icons/AcademyBuildings";
import { ComponentType, SVGProps } from "react";

export interface BuildingArea {
  id: string;
  name: string;
  subtitle: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  moduleIds: string[];
}

export const ACADEMY_BUILDINGS: BuildingArea[] = [
  { id: "lecture-hall", name: "Lecture Hall", subtitle: "Foundations & Governance", Icon: LectureHallIcon, moduleIds: ["week-1", "week-2", "week-3"] },
  { id: "guild-library", name: "Guild Library", subtitle: "Valuation & Decisions", Icon: LibraryIcon, moduleIds: ["week-4", "week-5", "week-6"] },
  { id: "market-yard", name: "Market Yard", subtitle: "Risk & Capital", Icon: MarketYardIcon, moduleIds: ["week-7", "week-8", "week-9"] },
  { id: "risk-observatory", name: "Risk Observatory", subtitle: "Policy & Strategy", Icon: ObservatoryIcon, moduleIds: ["week-11", "week-12", "week-13"] },
];

interface BuildingsViewProps {
  course: Course;
  progress: UserProgress;
  onBuildingClick: (buildingId: string) => void;
}

function getBuildingProgress(building: BuildingArea, course: Course, progress: UserProgress) {
  const modules = course.modules.filter((m) => building.moduleIds.includes(m.id));
  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completed = modules.reduce(
    (acc, m) => acc + m.lessons.filter((l) => progress.completedLessons.includes(l.id)).length,
    0
  );
  return { totalLessons, completed, modules };
}

function isBuildingUnlocked(buildingIndex: number, course: Course, progress: UserProgress): boolean {
  if (buildingIndex === 0) return true;
  const prevBuilding = ACADEMY_BUILDINGS[buildingIndex - 1];
  const { completed } = getBuildingProgress(prevBuilding, course, progress);
  return completed > 0;
}

export function BuildingsView({ course, progress, onBuildingClick }: BuildingsViewProps) {
  return (
    <div className="relative">
      <MapBackground />
      <div className="relative grid gap-4 sm:grid-cols-2">
        {ACADEMY_BUILDINGS.map((building, index) => {
          const { totalLessons, completed } = getBuildingProgress(building, course, progress);
          const unlocked = isBuildingUnlocked(index, course, progress);
          const isComplete = completed === totalLessons && totalLessons > 0;
          const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
          const BuildingIcon = building.Icon;

          return (
            <motion.button
              key={building.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", damping: 20 }}
              onClick={() => unlocked && onBuildingClick(building.id)}
              disabled={!unlocked}
              title={!unlocked ? "Unlock by completing previous hall" : undefined}
              className={`group relative flex flex-col items-center gap-2.5 rounded-2xl border p-4 text-center transition-all shadow-sm sm:gap-3 sm:p-6 ${
                isComplete
                  ? "border-success/30 bg-card shadow-success/5"
                  : unlocked
                  ? "border-border/60 bg-card hover:border-accent/40 hover:shadow-md hover:shadow-accent/5"
                  : "border-border/30 bg-muted/30 cursor-not-allowed opacity-50"
              }`}
              whileHover={unlocked ? { scale: 1.02, y: -2 } : undefined}
              whileTap={unlocked ? { scale: 0.98 } : undefined}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                  isComplete
                    ? "bg-success/10"
                    : unlocked
                    ? "bg-accent/10"
                    : "bg-muted/50"
                }`}
              >
                {unlocked ? (
                  <BuildingIcon className={`h-10 w-10 ${isComplete ? "text-success" : "text-accent"}`} />
                ) : (
                  <Lock className="h-6 w-6 text-muted-foreground" />
                )}
              </div>

              <div>
                <h3 className={`text-sm font-black ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {building.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{building.subtitle}</p>
                {!unlocked && (
                  <p className="mt-1 text-[10px] font-bold text-accent/80">Unlock by completing previous hall</p>
                )}
              </div>

              {unlocked && (
                <div className="w-full space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isComplete ? "bg-success" : "bg-accent"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground">
                    {completed}/{totalLessons} lessons
                  </p>
                </div>
              )}

              {unlocked && !isComplete && (
                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent/30 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              {isComplete && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground text-xs font-black shadow-md"
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
