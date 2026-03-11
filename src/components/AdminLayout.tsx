import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Layers, FileText, HelpCircle, Sparkles, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/admin/subjects", icon: BookOpen, label: "Subjects" },
  { to: "/admin/modules", icon: Layers, label: "Modules" },
  { to: "/admin/lessons", icon: FileText, label: "Lessons" },
  { to: "/admin/questions", icon: HelpCircle, label: "Questions" },
  { to: "/ai-import", icon: Sparkles, label: "AI Import" },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r bg-card">
        <div className="flex items-center gap-2 border-b px-4 py-4">
          <button onClick={() => navigate("/")} className="rounded-lg p-1 hover:bg-muted">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <h1 className="text-sm font-black text-foreground tracking-wide uppercase">Admin</h1>
        </div>
        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t p-3">
          <p className="text-[10px] font-bold text-muted-foreground text-center">Local Storage Mode</p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
