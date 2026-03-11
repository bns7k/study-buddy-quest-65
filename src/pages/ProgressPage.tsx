import { motion } from "framer-motion";
import { GraduationCap, Zap, Flame, Trophy, TrendingUp, BookOpen } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { StatsBar } from "@/components/StatsBar";
import { useProgress } from "@/hooks/useProgress";
import { getAllCourses } from "@/data/courses";
import { Progress } from "@/components/ui/progress";
import { BottomNav } from "@/components/BottomNav";

export default function ProgressPage() {
  const { progress, getModuleProgress } = useProgress();

  // Weekly XP chart data (last 7 days)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const key = date.toISOString().split("T")[0];
    const dayName = date.toLocaleDateString("en", { weekday: "short" });
    return { day: dayName, xp: progress.weeklyXp?.[key] || 0 };
  });

  const todayXp = chartData[chartData.length - 1]?.xp || 0;
  const weekTotal = chartData.reduce((sum, d) => sum + d.xp, 0);

  // Course progress
  const courseProgress = allCourses.map((course) => {
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const completed = allLessonIds.filter((id) => progress.completedLessons.includes(id)).length;
    return {
      ...course,
      completed,
      total: allLessonIds.length,
      percent: allLessonIds.length > 0 ? Math.round((completed / allLessonIds.length) * 100) : 0,
    };
  });

  // Best/worst scores
  const scores = Object.entries(progress.lessonScores);
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, [, v]) => s + v, 0) / scores.length) : 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-black text-foreground">Progress</span>
          </div>
          <StatsBar xp={progress.xp} streak={progress.streak} completedCount={progress.completedLessons.length} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Zap, label: "Total XP", value: progress.xp.toLocaleString(), color: "text-xp", bg: "bg-xp/10" },
            { icon: Flame, label: "Day Streak", value: `${progress.streak} days`, color: "text-streak", bg: "bg-streak/10" },
            { icon: Trophy, label: "Lessons Done", value: progress.completedLessons.length.toString(), color: "text-primary", bg: "bg-primary/10" },
            { icon: TrendingUp, label: "Avg Score", value: `${avgScore}%`, color: "text-accent", bg: "bg-accent/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl border-2 border-border bg-card p-4"
            >
              <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border-2 border-border bg-card p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-extrabold text-foreground">Weekly Activity</h3>
            <span className="text-sm font-bold text-xp">{weekTotal} XP this week</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", fontWeight: 700 }}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar dataKey="xp" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {todayXp > 0 && (
            <p className="mt-2 text-center text-sm font-bold text-primary">🔥 {todayXp} XP earned today!</p>
          )}
        </motion.div>

        {/* Course Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="mb-3 font-extrabold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" /> Course Progress
          </h3>
          <div className="space-y-3">
            {courseProgress.map((cp) => (
              <div key={cp.id} className="rounded-2xl border-2 border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cp.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{cp.title}</h4>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Progress value={cp.percent} className="h-2 flex-1" />
                      <span className="text-xs font-bold text-muted-foreground">{cp.percent}%</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cp.completed}/{cp.total} lessons completed
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
