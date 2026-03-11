import { Home, BarChart3, Award, FileText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/progress", icon: BarChart3, label: "Progress" },
  { path: "/achievements", icon: Award, label: "Badges" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <motion.button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`relative flex flex-col items-center gap-0.5 rounded-xl px-4 py-1.5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <tab.icon className={`h-5 w-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-[10px] font-bold">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNav"
                  className="absolute -top-px h-0.5 w-8 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
