import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, HelpCircle, Eye, Shuffle, Upload, Download, FileSpreadsheet, X } from "lucide-react";
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
import { parseCSVToQuestions, CSV_TEMPLATE } from "@/lib/ai-parser";
import { toast } from "sonner";
import type { QuizQuestion, QuestionType, MatchPair } from "@/types/course";

const QUESTION_TYPES: { value: QuestionType; label: string; icon: string }[] = [
  { value: "multiple_choice", label: "Multiple Choice", icon: "🔘" },
  { value: "true_false", label: "True / False", icon: "✓✗" },
  { value: "match_pairs", label: "Match Pairs", icon: "🔗" },
  { value: "fill_blank", label: "Fill in the Blank", icon: "📝" },
  { value: "order_steps", label: "Order Steps", icon: "📋" },
  { value: "numeric", label: "Numeric Input", icon: "🔢" },
  { value: "flashcard", label: "Flashcard", icon: "🃏" },
];

const QuestionsAdmin = () => {
  const { data, addQuestion, updateQuestion, deleteQuestion } = useAdminData();
  const [selectedCourse, setSelectedCourse] = useState(data.courses[0]?.id || "");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [csvText, setCsvText] = useState("");
  const [csvPreview, setCsvPreview] = useState<{ questions: QuizQuestion[]; errors: string[] } | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formType, setFormType] = useState<QuestionType>("multiple_choice");
  const [formQuestion, setFormQuestion] = useState("");
  const [formExplanation, setFormExplanation] = useState("");
  // MC
  const [formOptions, setFormOptions] = useState(["", "", "", ""]);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  // T/F
  const [formTFCorrect, setFormTFCorrect] = useState(0); // 0=True, 1=False
  // Match pairs
  const [formPairs, setFormPairs] = useState<MatchPair[]>([{ term: "", definition: "" }, { term: "", definition: "" }]);
  // Fill blank
  const [formBlankAnswer, setFormBlankAnswer] = useState("");
  // Order steps
  const [formSteps, setFormSteps] = useState(["", "", ""]);
  // Numeric
  const [formNumericAnswer, setFormNumericAnswer] = useState("");
  const [formNumericTolerance, setFormNumericTolerance] = useState("0.01");
  // Flashcard
  const [formFlashcardBack, setFormFlashcardBack] = useState("");

  const course = data.courses.find((c) => c.id === selectedCourse);
  const modules = course?.modules || [];
  const mod = modules.find((m) => m.id === selectedModule);
  const lessons = mod?.lessons || [];
  const lesson = lessons.find((l) => l.id === selectedLesson);
  const questions = lesson?.questions || [];

  const resetForm = () => {
    setFormType("multiple_choice");
    setFormQuestion("");
    setFormExplanation("");
    setFormOptions(["", "", "", ""]);
    setFormCorrectIndex(0);
    setFormTFCorrect(0);
    setFormPairs([{ term: "", definition: "" }, { term: "", definition: "" }]);
    setFormBlankAnswer("");
    setFormSteps(["", "", ""]);
    setFormNumericAnswer("");
    setFormNumericTolerance("0.01");
    setFormFlashcardBack("");
  };

  const openNew = () => {
    setEditing(null);
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (q: QuizQuestion) => {
    setEditing(q);
    const qt = q.questionType || "multiple_choice";
    setFormType(qt);
    setFormQuestion(q.question);
    setFormExplanation(q.explanation);

    if (qt === "multiple_choice") {
      const opts = [...q.options];
      while (opts.length < 4) opts.push("");
      setFormOptions(opts);
      setFormCorrectIndex(q.correctIndex);
    } else if (qt === "true_false") {
      setFormTFCorrect(q.correctIndex);
    } else if (qt === "match_pairs") {
      setFormPairs(q.matchPairs || [{ term: "", definition: "" }, { term: "", definition: "" }]);
    } else if (qt === "fill_blank") {
      setFormBlankAnswer(q.blankAnswer || "");
    } else if (qt === "order_steps") {
      setFormSteps(q.correctOrder || ["", "", ""]);
    } else if (qt === "numeric") {
      setFormNumericAnswer(String(q.numericAnswer ?? ""));
      setFormNumericTolerance(String(q.numericTolerance ?? "0.01"));
    } else if (qt === "flashcard") {
      setFormFlashcardBack(q.flashcardBack || "");
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formQuestion.trim() || !selectedCourse || !selectedModule || !selectedLesson) return;

    const base: Partial<QuizQuestion> = {
      question: formQuestion,
      questionType: formType,
      explanation: formExplanation,
    };

    if (formType === "multiple_choice") {
      const cleanOptions = formOptions.filter((o) => o.trim());
      if (cleanOptions.length < 2) return;
      base.options = cleanOptions;
      base.correctIndex = Math.min(formCorrectIndex, cleanOptions.length - 1);
    } else if (formType === "true_false") {
      base.options = ["True", "False"];
      base.correctIndex = formTFCorrect;
    } else if (formType === "match_pairs") {
      const cleanPairs = formPairs.filter((p) => p.term.trim() && p.definition.trim());
      if (cleanPairs.length < 2) return;
      base.matchPairs = cleanPairs;
      base.options = [];
      base.correctIndex = 0;
    } else if (formType === "fill_blank") {
      if (!formBlankAnswer.trim()) return;
      base.blankAnswer = formBlankAnswer;
      base.options = [];
      base.correctIndex = 0;
    } else if (formType === "order_steps") {
      const cleanSteps = formSteps.filter((s) => s.trim());
      if (cleanSteps.length < 2) return;
      base.correctOrder = cleanSteps;
      base.options = [];
      base.correctIndex = 0;
    } else if (formType === "numeric") {
      const num = parseFloat(formNumericAnswer);
      if (isNaN(num)) return;
      base.numericAnswer = num;
      base.numericTolerance = parseFloat(formNumericTolerance) || 0.01;
      base.options = [];
      base.correctIndex = 0;
    } else if (formType === "flashcard") {
      if (!formFlashcardBack.trim()) return;
      base.flashcardBack = formFlashcardBack;
      base.options = [];
      base.correctIndex = 0;
    }

    if (editing) {
      updateQuestion(selectedCourse, selectedModule, selectedLesson, editing.id, base);
    } else {
      addQuestion(selectedCourse, selectedModule, selectedLesson, {
        id: `q-${Date.now()}`,
        question: formQuestion,
        options: [],
        correctIndex: 0,
        explanation: formExplanation,
        ...base,
      } as QuizQuestion);
    }
    setDialogOpen(false);
  };

  const randomizeOptions = () => {
    const indexed = formOptions.map((o, i) => ({ text: o, wasCorrect: i === formCorrectIndex }));
    const shuffled = [...indexed].sort(() => Math.random() - 0.5);
    setFormOptions(shuffled.map((s) => s.text));
    setFormCorrectIndex(shuffled.findIndex((s) => s.wasCorrect));
  };

  // CSV Import
  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCSVFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    setCsvPreview(parseCSVToQuestions(text));
  };

  const handleCSVParse = () => {
    if (!csvText.trim()) return;
    setCsvPreview(parseCSVToQuestions(csvText));
  };

  const handleCSVImport = () => {
    if (!csvPreview || !selectedCourse || !selectedModule || !selectedLesson) return;
    csvPreview.questions.forEach((q) => addQuestion(selectedCourse, selectedModule, selectedLesson, q));
    toast.success(`Imported ${csvPreview.questions.length} questions!`);
    setCsvDialogOpen(false);
    setCsvText("");
    setCsvPreview(null);
  };

  const getTypeLabel = (q: QuizQuestion) => {
    const t = QUESTION_TYPES.find((qt) => qt.value === (q.questionType || "multiple_choice"));
    return t ? `${t.icon} ${t.label}` : "🔘 MC";
  };

  const isFormValid = () => {
    if (!formQuestion.trim()) return false;
    if (formType === "multiple_choice") return formOptions.filter((o) => o.trim()).length >= 2;
    if (formType === "true_false") return true;
    if (formType === "match_pairs") return formPairs.filter((p) => p.term.trim() && p.definition.trim()).length >= 2;
    if (formType === "fill_blank") return !!formBlankAnswer.trim();
    if (formType === "order_steps") return formSteps.filter((s) => s.trim()).length >= 2;
    if (formType === "numeric") return !isNaN(parseFloat(formNumericAnswer));
    if (formType === "flashcard") return !!formFlashcardBack.trim();
    return false;
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-black text-foreground">Questions</h1>
          <p className="text-sm text-muted-foreground mt-1">{questions.length} questions in selected lesson</p>
        </motion.div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCsvDialogOpen(true)} className="gap-1.5" disabled={!selectedLesson}>
            <FileSpreadsheet className="h-4 w-4" /> CSV Import
          </Button>
          <Button onClick={openNew} className="gap-1.5" disabled={!selectedLesson}>
            <Plus className="h-4 w-4" /> New Question
          </Button>
        </div>
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

      {/* Question List */}
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
                        {(q.questionType === "match_pairs" && q.matchPairs) ? (
                          q.matchPairs.map((p, pi) => (
                            <div key={pi} className="text-xs px-2 py-1.5 rounded-lg bg-muted text-muted-foreground">
                              <span className="font-bold text-foreground">{p.term}</span> → {p.definition}
                            </div>
                          ))
                        ) : (q.questionType === "order_steps" && q.correctOrder) ? (
                          q.correctOrder.map((step, si) => (
                            <div key={si} className="text-xs px-2 py-1.5 rounded-lg bg-muted text-muted-foreground">
                              {si + 1}. {step}
                            </div>
                          ))
                        ) : (q.questionType === "fill_blank") ? (
                          <div className="text-xs px-2 py-1.5 rounded-lg bg-success/10 text-success font-bold">
                            Answer: {q.blankAnswer}
                          </div>
                        ) : (q.questionType === "numeric") ? (
                          <div className="text-xs px-2 py-1.5 rounded-lg bg-success/10 text-success font-bold">
                            Answer: {q.numericAnswer} (±{q.numericTolerance})
                          </div>
                        ) : (q.questionType === "flashcard") ? (
                          <div className="text-xs px-2 py-1.5 rounded-lg bg-accent/10 text-accent-foreground">
                            Back: {q.flashcardBack}
                          </div>
                        ) : (
                          q.options.map((opt, oi) => (
                            <div key={oi} className={`text-xs px-2 py-1.5 rounded-lg ${oi === q.correctIndex ? "bg-success/10 text-success font-bold" : "bg-muted text-muted-foreground"}`}>
                              {oi === q.correctIndex ? "✓" : "○"} {opt}
                            </div>
                          ))
                        )}
                        {q.explanation && <p className="mt-2 text-xs text-muted-foreground italic">{q.explanation}</p>}
                      </motion.div>
                    )}
                    <div className="mt-1.5 flex gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">{getTypeLabel(q)}</Badge>
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
              {selectedLesson ? "No questions yet. Add one or import from CSV!" : "Select a subject, module, and lesson first."}
            </p>
          </div>
        )}
      </div>

      {/* ── Question Editor Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Question" : "New Question"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 overflow-y-auto flex-1 pr-1">
            {/* Type selector */}
            <div>
              <Label className="font-bold">Question Type</Label>
              <Select value={formType} onValueChange={(v) => setFormType(v as QuestionType)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.icon} {t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Question text */}
            <div>
              <Label className="font-bold">
                {formType === "flashcard" ? "Front (Term)" : formType === "fill_blank" ? "Question (use ___ for blank)" : "Question Text"}
              </Label>
              <Textarea value={formQuestion} onChange={(e) => setFormQuestion(e.target.value)}
                placeholder={formType === "fill_blank" ? "The formula for NPV is ___" : formType === "flashcard" ? "Capital Structure" : "Enter your question..."} />
            </div>

            {/* ── Multiple Choice fields ── */}
            {formType === "multiple_choice" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="font-bold">Answer Options</Label>
                  <Button variant="ghost" size="sm" className="gap-1 text-xs h-7" onClick={randomizeOptions}>
                    <Shuffle className="h-3 w-3" /> Shuffle
                  </Button>
                </div>
                <RadioGroup value={String(formCorrectIndex)} onValueChange={(v) => setFormCorrectIndex(parseInt(v))}>
                  {formOptions.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <RadioGroupItem value={String(oi)} id={`opt-${oi}`} />
                      <Input value={opt} onChange={(e) => { const n = [...formOptions]; n[oi] = e.target.value; setFormOptions(n); }}
                        placeholder={`Option ${oi + 1}`} className={oi === formCorrectIndex ? "border-success" : ""} />
                    </div>
                  ))}
                </RadioGroup>
                <p className="mt-1 text-xs text-muted-foreground">Select the correct answer</p>
              </div>
            )}

            {/* ── True / False ── */}
            {formType === "true_false" && (
              <div>
                <Label className="font-bold">Correct Answer</Label>
                <RadioGroup value={String(formTFCorrect)} onValueChange={(v) => setFormTFCorrect(parseInt(v))} className="mt-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="0" id="tf-true" />
                    <Label htmlFor="tf-true" className="font-bold text-success">True</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="1" id="tf-false" />
                    <Label htmlFor="tf-false" className="font-bold text-destructive">False</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* ── Match Pairs ── */}
            {formType === "match_pairs" && (
              <div>
                <Label className="font-bold">Term ↔ Definition Pairs</Label>
                <div className="mt-2 space-y-2">
                  {formPairs.map((pair, pi) => (
                    <div key={pi} className="flex gap-2 items-center">
                      <Input value={pair.term} onChange={(e) => { const n = [...formPairs]; n[pi] = { ...n[pi], term: e.target.value }; setFormPairs(n); }}
                        placeholder="Term" className="flex-1" />
                      <span className="text-muted-foreground text-xs">↔</span>
                      <Input value={pair.definition} onChange={(e) => { const n = [...formPairs]; n[pi] = { ...n[pi], definition: e.target.value }; setFormPairs(n); }}
                        placeholder="Definition" className="flex-1" />
                      {formPairs.length > 2 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setFormPairs(formPairs.filter((_, i) => i !== pi))}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setFormPairs([...formPairs, { term: "", definition: "" }])}>
                    + Add Pair
                  </Button>
                </div>
              </div>
            )}

            {/* ── Fill in the Blank ── */}
            {formType === "fill_blank" && (
              <div>
                <Label className="font-bold">Correct Answer (for the blank)</Label>
                <Input value={formBlankAnswer} onChange={(e) => setFormBlankAnswer(e.target.value)}
                  placeholder="e.g. working capital" className="mt-1" />
                <p className="mt-1 text-xs text-muted-foreground">Use ___ in the question to show the blank position</p>
              </div>
            )}

            {/* ── Order Steps ── */}
            {formType === "order_steps" && (
              <div>
                <Label className="font-bold">Steps (in correct order)</Label>
                <div className="mt-2 space-y-2">
                  {formSteps.map((step, si) => (
                    <div key={si} className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-muted-foreground w-5">{si + 1}.</span>
                      <Input value={step} onChange={(e) => { const n = [...formSteps]; n[si] = e.target.value; setFormSteps(n); }}
                        placeholder={`Step ${si + 1}`} className="flex-1" />
                      {formSteps.length > 2 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setFormSteps(formSteps.filter((_, i) => i !== si))}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setFormSteps([...formSteps, ""])}>
                    + Add Step
                  </Button>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Steps will be shuffled when shown to the student</p>
              </div>
            )}

            {/* ── Numeric Input ── */}
            {formType === "numeric" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-bold">Correct Answer</Label>
                  <Input type="text" inputMode="decimal" value={formNumericAnswer} onChange={(e) => setFormNumericAnswer(e.target.value)}
                    placeholder="e.g. 300000" className="mt-1" />
                </div>
                <div>
                  <Label className="font-bold">Tolerance (±)</Label>
                  <Input type="text" inputMode="decimal" value={formNumericTolerance} onChange={(e) => setFormNumericTolerance(e.target.value)}
                    placeholder="e.g. 0.01" className="mt-1" />
                </div>
              </div>
            )}

            {/* ── Flashcard ── */}
            {formType === "flashcard" && (
              <div>
                <Label className="font-bold">Back (Definition / Answer)</Label>
                <Textarea value={formFlashcardBack} onChange={(e) => setFormFlashcardBack(e.target.value)}
                  placeholder="The meaning or explanation shown on the back of the card..." className="mt-1" />
              </div>
            )}

            {/* Explanation (not for flashcard) */}
            {formType !== "flashcard" && (
              <div>
                <Label className="font-bold">Explanation</Label>
                <Textarea value={formExplanation} onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Why is this the correct answer?" />
              </div>
            )}
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!isFormValid()}>
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── CSV Import Dialog ── */}
      <Dialog open={csvDialogOpen} onOpenChange={(open) => { setCsvDialogOpen(open); if (!open) { setCsvText(""); setCsvPreview(null); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" /> Bulk CSV Import
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={downloadTemplate}>
                <Download className="h-3.5 w-3.5" /> Download Template
              </Button>
              <label>
                <Button variant="outline" size="sm" className="gap-1.5" asChild>
                  <span><Upload className="h-3.5 w-3.5" /> Upload CSV</span>
                </Button>
                <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSVFile} />
              </label>
            </div>
            <div>
              <Label className="font-bold text-sm">Or paste CSV content</Label>
              <Textarea value={csvText} onChange={(e) => setCsvText(e.target.value)}
                placeholder={`question,option1,option2,option3,option4,correctIndex,explanation\n"What is 2+2?","3","4","5","6",1,"2+2 equals 4"`}
                className="min-h-[120px] font-mono text-xs" />
              <Button variant="secondary" size="sm" className="mt-2" onClick={handleCSVParse} disabled={!csvText.trim()}>Parse CSV</Button>
            </div>
            {csvPreview && (
              <div className="space-y-3">
                {csvPreview.errors.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-xs font-bold text-destructive mb-1">Errors:</p>
                    {csvPreview.errors.map((err, i) => <p key={i} className="text-xs text-destructive/80">• {err}</p>)}
                  </div>
                )}
                {csvPreview.questions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-foreground">✓ {csvPreview.questions.length} questions parsed</p>
                    {csvPreview.questions.slice(0, 5).map((q, i) => (
                      <div key={i} className="rounded-lg border bg-muted/30 p-2.5">
                        <p className="text-xs font-bold text-foreground">{q.question}</p>
                        <div className="mt-1 flex gap-1 flex-wrap">
                          {q.options.map((opt, oi) => (
                            <Badge key={oi} variant={oi === q.correctIndex ? "default" : "outline"} className="text-[10px]">{opt}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    {csvPreview.questions.length > 5 && <p className="text-xs text-muted-foreground">... and {csvPreview.questions.length - 5} more</p>}
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCsvDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCSVImport} disabled={!csvPreview || csvPreview.questions.length === 0} className="gap-1.5">
              <Upload className="h-4 w-4" /> Import {csvPreview?.questions.length || 0} Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionsAdmin;
