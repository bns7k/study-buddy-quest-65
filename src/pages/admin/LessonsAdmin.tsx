import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, Pencil, Trash2, GripVertical, FileText } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Lesson, LessonType } from "@/types/course";

const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "concept", label: "📘 Concept" },
  { value: "quiz", label: "❓ Quiz" },
  { value: "practice", label: "🏋️ Practice" },
  { value: "recap", label: "🔄 Recap" },
];

const LessonsAdmin = () => {
  const { data, addLesson, updateLesson, deleteLesson, reorderLessons } = useAdminData();
  const [selectedCourse, setSelectedCourse] = useState(data.courses[0]?.id || "");
  const [selectedModule, setSelectedModule] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [form, setForm] = useState({
    title: "", explanation: "", type: "concept" as LessonType, duration: 5, xpReward: 30,
  });

  const course = data.courses.find((c) => c.id === selectedCourse);
  const modules = course?.modules || [];
  const mod = modules.find((m) => m.id === selectedModule);
  const lessons = mod?.lessons || [];

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", explanation: "", type: "concept", duration: 5, xpReward: 30 });
    setDialogOpen(true);
  };

  const openEdit = (lesson: Lesson) => {
    setEditing(lesson);
    setForm({
      title: lesson.title, explanation: lesson.explanation,
      type: lesson.type || "concept", duration: lesson.duration || 5, xpReward: lesson.xpReward || 30,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !selectedCourse || !selectedModule) return;
    if (editing) {
      updateLesson(selectedCourse, selectedModule, editing.id, {
        title: form.title, explanation: form.explanation,
        type: form.type, duration: form.duration, xpReward: form.xpReward,
      });
    } else {
      const id = `lesson-${Date.now()}`;
      addLesson(selectedCourse, selectedModule, {
        id, title: form.title, explanation: form.explanation,
        type: form.type, duration: form.duration, xpReward: form.xpReward, questions: [],
      });
    }
    setDialogOpen(false);
  };

  const handleReorder = useCallback((newOrder: Lesson[]) => {
    if (!selectedCourse || !selectedModule) return;
    reorderLessons(selectedCourse, selectedModule, newOrder.map((l) => l.id));
  }, [selectedCourse, selectedModule, reorderLessons]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Lessons</h1>
          <p className="text-sm text-muted-foreground mt-1">{lessons.length} lessons · drag to reorder</p>
        </motion.div>
        <Button onClick={openNew} className="gap-1.5" disabled={!selectedModule}>
          <Plus className="h-4 w-4" /> New Lesson
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Select value={selectedCourse} onValueChange={(v) => { setSelectedCourse(v); setSelectedModule(""); }}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Select subject" /></SelectTrigger>
          <SelectContent>
            {data.courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.emoji} {c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedModule} onValueChange={setSelectedModule}>
          <SelectTrigger className="w-64"><SelectValue placeholder="Select module" /></SelectTrigger>
          <SelectContent>
            {modules.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.isBonus ? "★" : `W${m.weekNumber}`} {m.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {lessons.length > 0 ? (
          <Reorder.Group axis="y" values={lessons} onReorder={handleReorder} className="space-y-2">
            {lessons.map((lesson) => (
              <Reorder.Item key={lesson.id} value={lesson} className="list-none">
                <Card className="cursor-grab active:cursor-grabbing">
                  <CardContent className="flex items-center gap-3 p-3">
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm">
                      {LESSON_TYPES.find((t) => t.value === lesson.type)?.label.split(" ")[0] || "📘"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">{lesson.title}</h3>
                      <div className="mt-1 flex gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">{lesson.type || "concept"}</Badge>
                        {lesson.duration && <Badge variant="outline" className="text-[10px]">{lesson.duration} min</Badge>}
                        {lesson.xpReward && <Badge variant="outline" className="text-[10px]">{lesson.xpReward} XP</Badge>}
                        <Badge variant="outline" className="text-[10px]">{lesson.questions.length} Q</Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(lesson)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{lesson.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>This will delete all questions in this lesson.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteLesson(selectedCourse, selectedModule, lesson.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        ) : (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {selectedModule ? "No lessons yet. Add one!" : "Select a subject and module first."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Lesson" : "New Lesson"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-bold">Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Lesson title" />
            </div>
            <div>
              <Label className="font-bold">Explanation / Intro</Label>
              <Textarea value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} placeholder="Lesson introduction text..." className="min-h-[100px]" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="font-bold">Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v as LessonType }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-bold">Duration (min)</Label>
                <Input type="number" min={1} value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: parseInt(e.target.value) || 5 }))} />
              </div>
              <div>
                <Label className="font-bold">XP Reward</Label>
                <Input type="number" min={0} step={5} value={form.xpReward} onChange={(e) => setForm((f) => ({ ...f, xpReward: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>{editing ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonsAdmin;
