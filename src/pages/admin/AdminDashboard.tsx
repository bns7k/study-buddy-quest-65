import { motion } from "framer-motion";
import { BookOpen, Layers, FileText, HelpCircle, TrendingUp } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { stats, data } = useAdminData();
  const navigate = useNavigate();

  const statCards = [
    { label: "Subjects", value: stats.courses, icon: BookOpen, color: "text-primary", link: "/admin/subjects" },
    { label: "Modules", value: stats.modules, icon: Layers, color: "text-accent", link: "/admin/modules" },
    { label: "Lessons", value: stats.lessons, icon: FileText, color: "text-success", link: "/admin/lessons" },
    { label: "Questions", value: stats.questions, icon: HelpCircle, color: "text-xp", link: "/admin/questions" },
  ];

  return (
    <div className="p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your course content</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
              onClick={() => navigate(s.link)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-muted ${s.color}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-black text-foreground">{s.value}</div>
                  <div className="text-xs font-bold text-muted-foreground">{s.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Course Breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8">
        <h2 className="mb-4 text-lg font-black text-foreground">Content by Subject</h2>
        <div className="space-y-3">
          {data.courses.map((course) => {
            const moduleCount = course.modules.length;
            const lessonCount = course.modules.reduce((a, m) => a + m.lessons.length, 0);
            const questionCount = course.modules.reduce((a, m) => a + m.lessons.reduce((b, l) => b + l.questions.length, 0), 0);
            return (
              <Card key={course.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {course.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{course.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{course.description}</p>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <div className="text-sm font-black text-foreground">{moduleCount}</div>
                      <div className="text-[10px] text-muted-foreground">Modules</div>
                    </div>
                    <div>
                      <div className="text-sm font-black text-foreground">{lessonCount}</div>
                      <div className="text-[10px] text-muted-foreground">Lessons</div>
                    </div>
                    <div>
                      <div className="text-sm font-black text-foreground">{questionCount}</div>
                      <div className="text-[10px] text-muted-foreground">Questions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
