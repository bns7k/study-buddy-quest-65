import { Home, BarChart3, Award, RotateCcw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/review", icon: RotateCcw, label: "Review" },
  { path: "/progress", icon: BarChart3, label: "Progress" },
  { path: "/achievements", icon: Award, label: "Badges" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getDueQuestions } = useProgress();
  const dueCount = getDueQuestions().length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const showBadge = tab.path === "/review" && dueCount > 0;
          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <tab.icon className={`h-5 w-5 ${isActive ? "fill-accent/20" : ""}`} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {dueCount > 9 ? "9+" : dueCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -top-px h-0.5 w-8 rounded-full bg-accent"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
