import { motion } from "framer-motion";
import { ArrowLeft, Moon, Sun, Globe, Bell, Calendar, Clock, Target, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { useSettings } from "@/hooks/useSettings";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  const navigate = useNavigate();
  const { settings, updateSetting, resetSettings } = useSettings();

  const studyTimes = [
    { value: "morning", label: "🌅 Morning (6–12)" },
    { value: "afternoon", label: "☀️ Afternoon (12–17)" },
    { value: "evening", label: "🌆 Evening (17–21)" },
    { value: "night", label: "🌙 Night (21–2)" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-xl p-1.5 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-black text-foreground">Settings</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {/* Appearance */}
        <SettingsSection title="Appearance" delay={0}>
          <SettingsRow icon={settings.darkMode ? Moon : Sun} label="Dark Mode" description="Switch between light and dark theme">
            <Switch checked={settings.darkMode} onCheckedChange={(v) => updateSetting("darkMode", v)} />
          </SettingsRow>
          <SettingsRow icon={Globe} label="Language" description="Interface language">
            <Select value={settings.language} onValueChange={(v) => updateSetting("language", v as "en" | "hu")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hu">Magyar</SelectItem>
              </SelectContent>
            </Select>
          </SettingsRow>
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection title="Notifications" delay={0.05}>
          <SettingsRow icon={Bell} label="Study Reminders" description="Get notified when it's time to study">
            <Switch checked={settings.notifications} onCheckedChange={(v) => updateSetting("notifications", v)} />
          </SettingsRow>
        </SettingsSection>

        {/* Study Preferences */}
        <SettingsSection title="Study Preferences" delay={0.1}>
          <SettingsRow icon={Target} label="Daily XP Goal" description={`${settings.dailyGoalXp} XP per day`}>
            <div className="w-32">
              <Slider
                value={[settings.dailyGoalXp]}
                onValueChange={([v]) => updateSetting("dailyGoalXp", v)}
                min={10}
                max={200}
                step={10}
              />
            </div>
          </SettingsRow>
          <SettingsRow icon={Clock} label="Preferred Study Time" description="When do you study best?">
            <Select value={settings.preferredStudyTime} onValueChange={(v) => updateSetting("preferredStudyTime", v as any)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {studyTimes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SettingsRow>
          <SettingsRow icon={Calendar} label="Exam Date" description="Set your target exam date">
            <Input
              type="date"
              value={settings.examDate}
              onChange={(e) => updateSetting("examDate", e.target.value)}
              className="w-40"
            />
          </SettingsRow>
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account" delay={0.15}>
          <div className="rounded-xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Account management will be available when you connect Lovable Cloud for authentication.
            </p>
          </div>
        </SettingsSection>

        {/* Reset */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive" onClick={resetSettings}>
            <RotateCcw className="h-4 w-4" />
            Reset All Settings
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
            onClick={() => {
              if (window.confirm("This will erase ALL progress, settings, and restart the tutorial. Are you sure?")) {
                localStorage.clear();
                window.location.href = "/";
              }
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset All Progress & Restart Tutorial
          </Button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
};

function SettingsSection({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="divide-y divide-border rounded-2xl border bg-card">{children}</div>
    </motion.div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  description,
  children,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
          <Icon className="h-4.5 w-4.5 text-foreground" />
        </div>
        <div>
          <Label className="text-sm font-bold text-foreground">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default SettingsPage;
