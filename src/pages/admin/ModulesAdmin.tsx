import { useState, useCallback } from "react";
import { motion, Reorder } from "framer-motion";
import { Plus, Pencil, Trash2, GripVertical, Layers } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Module } from "@/types/course";

const ModulesAdmin = () => {
  const { data, addModule, updateModule, deleteModule, reorderModules } = useAdminData();
  const [selectedCourse, setSelectedCourse] = useState(data.courses[0]?.id || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<{ courseId: string; module: Module } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", weekNumber: 1, isBonus: false });

  const course = data.courses.find((c) => c.id === selectedCourse);
  const modules = course?.modules || [];

  const openNew = () => {
    setEditing(null);
    const nextWeek = modules.filter((m) => !m.isBonus).length + 1;
    setForm({ title: "", description: "", weekNumber: nextWeek, isBonus: false });
    setDialogOpen(true);
  };

  const openEdit = (mod: Module) => {
    setEditing({ courseId: selectedCourse, module: mod });
    setForm({ title: mod.title, description: mod.description || "", weekNumber: mod.weekNumber, isBonus: mod.isBonus || false });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !selectedCourse) return;
    if (editing) {
      updateModule(editing.courseId, editing.module.id, {
        title: form.title, description: form.description, weekNumber: form.weekNumber, isBonus: form.isBonus,
      });
    } else {
      const id = `mod-${Date.now()}`;
      addModule(selectedCourse, {
        id, title: form.title, description: form.description, weekNumber: form.weekNumber,
        isBonus: form.isBonus, lessons: [],
      });
    }
    setDialogOpen(false);
  };

  const handleReorder = useCallback((newOrder: Module[]) => {
    if (!selectedCourse) return;
    reorderModules(selectedCourse, newOrder.map((m) => m.id));
  }, [selectedCourse, reorderModules]);

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Modules</h1>
          <p className="text-sm text-muted-foreground mt-1">{modules.length} modules · drag to reorder</p>
        </motion.div>
        <Button onClick={openNew} className="gap-1.5" disabled={!selectedCourse}>
          <Plus className="h-4 w-4" /> New Module
        </Button>
      </div>

      <div className="mt-4">
        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
          <SelectTrigger className="w-72">
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {data.courses.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.emoji} {c.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        {modules.length > 0 ? (
          <Reorder.Group axis="y" values={modules} onReorder={handleReorder} className="space-y-2">
            {modules.map((mod) => (
              <Reorder.Item key={mod.id} value={mod} className="list-none">
                <Card className={`cursor-grab active:cursor-grabbing ${mod.isBonus ? "border-bonus/30" : ""}`}>
                  <CardContent className="flex items-center gap-3 p-3">
                    <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-black text-muted-foreground">
                      {mod.isBonus ? "★" : mod.weekNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-foreground truncate">{mod.title}</h3>
                        {mod.isBonus && <Badge className="bg-bonus text-bonus-foreground text-[10px]">Bonus</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{mod.lessons.length} lessons</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(mod)}>
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
                            <AlertDialogTitle>Delete "{mod.title}"?</AlertDialogTitle>
                            <AlertDialogDescription>This will delete all lessons and questions in this module.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteModule(selectedCourse, mod.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
            <Layers className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {selectedCourse ? "No modules yet. Add one!" : "Select a subject first."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Module" : "New Module"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-bold">Title</Label>
              <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="e.g. Introduction to Corporate Finance" />
            </div>
            <div>
              <Label className="font-bold">Short Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Brief module description..." />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="font-bold">Week Number</Label>
                <Input type="number" min={1} value={form.weekNumber} onChange={(e) => setForm((f) => ({ ...f, weekNumber: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch checked={form.isBonus} onCheckedChange={(v) => setForm((f) => ({ ...f, isBonus: v }))} />
                <Label className="font-bold text-sm">Bonus Module</Label>
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

export default ModulesAdmin;
