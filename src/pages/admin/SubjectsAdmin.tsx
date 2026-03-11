import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Course } from "@/types/course";

const EMOJIS = ["📊", "📈", "💰", "🏦", "📉", "🧮", "💹", "🪙", "🏛️", "📋"];

const SubjectsAdmin = () => {
  const { data, addCourse, updateCourse, deleteCourse } = useAdminData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState({ title: "", description: "", emoji: "📊" });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", emoji: "📊" });
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditing(course);
    setForm({ title: course.title, description: course.description, emoji: course.emoji });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editing) {
      updateCourse(editing.id, { title: form.title, description: form.description, emoji: form.emoji });
    } else {
      const id = form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      addCourse({ id, title: form.title, description: form.description, emoji: form.emoji, modules: [] });
    }
    setDialogOpen(false);
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Subjects</h1>
          <p className="text-sm text-muted-foreground mt-1">{data.courses.length} subjects</p>
        </motion.div>
        <Button onClick={openNew} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Subject
        </Button>
      </div>

      <div className="mt-6 space-y-3">
        {data.courses.map((course, i) => {
          const moduleCount = course.modules.length;
          const lessonCount = course.modules.reduce((a, m) => a + m.lessons.length, 0);
          return (
            <motion.div key={course.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">{course.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground">{course.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{course.description}</p>
                    <div className="mt-1.5 flex gap-2">
                      <Badge variant="secondary">{moduleCount} modules</Badge>
                      <Badge variant="outline">{lessonCount} lessons</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(course)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{course.title}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the subject and all its modules, lessons, and questions.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteCourse(course.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {data.courses.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No subjects yet. Create your first one!</p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Subject" : "New Subject"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-bold">Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Corporate Finance" />
            </div>
            <div>
              <Label className="font-bold">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
            </div>
            <div>
              <Label className="font-bold">Icon</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {EMOJIS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm((f) => ({ ...f, emoji: e }))}
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all ${
                      form.emoji === e ? "bg-primary/20 ring-2 ring-primary" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.title.trim()}>
              {editing ? "Save Changes" : "Create Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectsAdmin;
