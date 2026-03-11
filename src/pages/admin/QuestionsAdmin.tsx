import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, HelpCircle, Eye, Shuffle } from "lucide-react";
import { useAdminData } from "@/hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { QuizQuestion } from "@/types/course";

const QuestionsAdmin = () => {
  const { data, addQuestion, updateQuestion, deleteQuestion } = useAdminData();
  const [selectedCourse, setSelectedCourse] = useState(data.courses[0]?.id || "");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const [form, setForm] = useState({
    question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "",
  });

  const course = data.courses.find((c) => c.id === selectedCourse);
  const modules = course?.modules || [];
  const mod = modules.find((m) => m.id === selectedModule);
  const lessons = mod?.lessons || [];
  const lesson = lessons.find((l) => l.id === selectedLesson);
  const questions = lesson?.questions || [];

  const openNew = () => {
    setEditing(null);
    setForm({ question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" });
    setDialogOpen(true);
  };

  const openEdit = (q: QuizQuestion) => {
    setEditing(q);
    const opts = [...q.options];
    while (opts.length < 4) opts.push("");
    setForm({ question: q.question, options: opts, correctIndex: q.correctIndex, explanation: q.explanation });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.question.trim() || !selectedCourse || !selectedModule || !selectedLesson) return;
    const cleanOptions = form.options.filter((o) => o.trim());
    if (cleanOptions.length < 2) return;

    if (editing) {
      updateQuestion(selectedCourse, selectedModule, selectedLesson, editing.id, {
        question: form.question, options: cleanOptions,
        correctIndex: Math.min(form.correctIndex, cleanOptions.length - 1), explanation: form.explanation,
      });
    } else {
      const id = `q-${Date.now()}`;
      addQuestion(selectedCourse, selectedModule, selectedLesson, {
        id, question: form.question, options: cleanOptions,
        correctIndex: Math.min(form.correctIndex, cleanOptions.length - 1), explanation: form.explanation,
      });
    }
    setDialogOpen(false);
  };

  const randomizeOptions = () => {
    const indexed = form.options.map((o, i) => ({ text: o, wasCorrect: i === form.correctIndex }));
    const shuffled = [...indexed].sort(() => Math.random() - 0.5);
    setForm((f) => ({
      ...f,
      options: shuffled.map((s) => s.text),
      correctIndex: shuffled.findIndex((s) => s.wasCorrect),
    }));
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Questions</h1>
          <p className="text-sm text-muted-foreground mt-1">{questions.length} questions in selected lesson</p>
        </motion.div>
        <Button onClick={openNew} className="gap-1.5" disabled={!selectedLesson}>
          <Plus className="h-4 w-4" /> New Question
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Select value={selectedCourse} onValueChange={(v) => { setSelectedCourse(v); setSelectedModule(""); setSelectedLesson(""); }}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent>
            {data.courses.map((c) => <SelectItem key={c.id} value={c.id}>{c.emoji} {c.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedModule} onValueChange={(v) => { setSelectedModule(v); setSelectedLesson(""); }}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Module" /></SelectTrigger>
          <SelectContent>
            {modules.map((m) => <SelectItem key={m.id} value={m.id}>{m.isBonus ? "★" : `W${m.weekNumber}`} {m.title}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedLesson} onValueChange={setSelectedLesson}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Lesson" /></SelectTrigger>
          <SelectContent>
            {lessons.map((l) => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 space-y-2">
        {questions.map((q, i) => (
          <motion.div key={q.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className={previewId === q.id ? "ring-2 ring-primary" : ""}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-black text-muted-foreground">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{q.question}</p>
                    {previewId === q.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-2 space-y-1">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className={`text-xs px-2 py-1.5 rounded-lg ${oi === q.correctIndex ? "bg-success/10 text-success font-bold" : "bg-muted text-muted-foreground"}`}>
                            {oi === q.correctIndex ? "✓" : "○"} {opt}
                          </div>
                        ))}
                        <p className="mt-2 text-xs text-muted-foreground italic">{q.explanation}</p>
                      </motion.div>
                    )}
                    <div className="mt-1.5 flex gap-1.5">
                      <Badge variant="outline" className="text-[10px]">{q.options.length} options</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreviewId(previewId === q.id ? null : q.id)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(q)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this question?</AlertDialogTitle>
                          <AlertDialogDescription>"{q.question}"</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteQuestion(selectedCourse, selectedModule, selectedLesson, q.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {questions.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <HelpCircle className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {selectedLesson ? "No questions yet. Add one!" : "Select a subject, module, and lesson first."}
            </p>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Question" : "New Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <Label className="font-bold">Question Text</Label>
              <Textarea value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} placeholder="Enter your question..." />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="font-bold">Answer Options</Label>
                <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" onClick={randomizeOptions}>
                  <Shuffle className="h-3 w-3" /> Shuffle
                </Button>
              </div>
              <RadioGroup value={String(form.correctIndex)} onValueChange={(v) => setForm((f) => ({ ...f, correctIndex: parseInt(v) }))}>
                {form.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <RadioGroupItem value={String(oi)} id={`opt-${oi}`} />
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...form.options];
                        newOpts[oi] = e.target.value;
                        setForm((f) => ({ ...f, options: newOpts }));
                      }}
                      placeholder={`Option ${oi + 1}`}
                      className={oi === form.correctIndex ? "border-success" : ""}
                    />
                  </div>
                ))}
              </RadioGroup>
              <p className="mt-1 text-xs text-muted-foreground">Select the radio button next to the correct answer</p>
            </div>
            <div>
              <Label className="font-bold">Explanation</Label>
              <Textarea value={form.explanation} onChange={(e) => setForm((f) => ({ ...f, explanation: e.target.value }))} placeholder="Why is this the correct answer?" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.question.trim() || form.options.filter((o) => o.trim()).length < 2}>
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsAdmin;
