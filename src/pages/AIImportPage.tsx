import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, FileText, Sparkles, Eye, Pencil, Save, Loader2, AlertCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminData } from "@/hooks/useAdminData";
import { parseTextToContent } from "@/lib/ai-parser";
import type { Lesson, QuizQuestion, ConceptCard } from "@/types/course";
import { toast } from "sonner";

type ImportStep = "upload" | "parsing" | "preview" | "edit" | "saved";

interface GeneratedContent {
  moduleSummary: string;
  lessons: Lesson[];
}

const AIImportPage = () => {
  const navigate = useNavigate();
  const { data, addModule, addLesson, addQuestion } = useAdminData();
  const [step, setStep] = useState<ImportStep>("upload");
  const [inputMode, setInputMode] = useState<"pdf" | "text">("text");
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileText, setFileText] = useState("");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [targetCourse, setTargetCourse] = useState(data.courses[0]?.id || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    // Read text from file (txt, md, csv)
    if (file.type.startsWith("text/") || file.name.match(/\.(txt|md|csv|tsv)$/i)) {
      const text = await file.text();
      setFileText(text);
    } else {
      // For PDF, we extract text (basic approach)
      setFileText("");
      toast.info("PDF parsing is limited locally. For best results, paste your text directly.");
    }
  };

  const handleGenerate = () => {
    const sourceText = inputMode === "text" ? pastedText : fileText;
    if (!sourceText.trim()) {
      toast.error("Please provide some text content to generate from.");
      return;
    }
    if (sourceText.trim().length < 50) {
      toast.error("Please provide at least 50 characters for meaningful content generation.");
      return;
    }

    setStep("parsing");

    // Simulate slight delay for UX, then parse
    setTimeout(() => {
      try {
        const result = parseTextToContent(sourceText);
        setGenerated(result);
        setStep("preview");
        toast.success(`Generated ${result.lessons.length} lessons with ${result.lessons.reduce((a, l) => a + l.questions.length, 0)} questions!`);
      } catch {
        toast.error("Failed to parse content. Try restructuring your text with headings.");
        setStep("upload");
      }
    }, 1500);
  };

  const handleSave = () => {
    if (!generated || !targetCourse) {
      toast.error("Select a target course first.");
      return;
    }

    // Create a new module with generated lessons
    const moduleId = `mod-ai-${Date.now()}`;
    addModule(targetCourse, {
      id: moduleId,
      title: `AI Import – ${new Date().toLocaleDateString()}`,
      description: generated.moduleSummary,
      weekNumber: (data.courses.find((c) => c.id === targetCourse)?.modules.length || 0) + 1,
      lessons: [],
    });

    // Add each lesson
    generated.lessons.forEach((lesson) => {
      addLesson(targetCourse, moduleId, lesson);
    });

    setStep("saved");
    toast.success("Content saved to course!");
  };

  const removeLesson = (lessonId: string) => {
    if (!generated) return;
    setGenerated({
      ...generated,
      lessons: generated.lessons.filter((l) => l.id !== lessonId),
    });
  };

  const removeQuestion = (lessonId: string, questionId: string) => {
    if (!generated) return;
    setGenerated({
      ...generated,
      lessons: generated.lessons.map((l) =>
        l.id === lessonId ? { ...l, questions: l.questions.filter((q) => q.id !== questionId) } : l
      ),
    });
  };

  const updateLessonField = (lessonId: string, field: string, value: string) => {
    if (!generated) return;
    setGenerated({
      ...generated,
      lessons: generated.lessons.map((l) =>
        l.id === lessonId ? { ...l, [field]: value } : l
      ),
    });
  };

  const stepIndex = ["upload", "parsing", "preview", "edit", "saved"].indexOf(step);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="rounded-xl p-1.5 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-lg font-black text-foreground">AI Import</h1>
          <Badge variant="secondary" className="ml-auto gap-1">
            <Sparkles className="h-3 w-3" /> Beta
          </Badge>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="flex items-center gap-2">
          {["Upload", "Parsing", "Preview", "Edit", "Save"].map((label, i) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              <span className={`hidden text-xs font-bold sm:inline ${i <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}>
                {label}
              </span>
              {i < 4 && <div className={`h-0.5 flex-1 rounded-full ${i < stepIndex ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-foreground">Import Your Content</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Paste lecture notes or text — the parser will extract sections, generate concept cards and quiz questions.
                  </p>
                </div>

                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "pdf" | "text")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="text" className="flex-1 gap-1.5">
                      <FileText className="h-4 w-4" /> Paste Notes
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex-1 gap-1.5">
                      <Upload className="h-4 w-4" /> Upload File
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-4">
                    <Textarea
                      placeholder={"Paste your lecture notes here...\n\nTip: Use headings (# Heading or 1. Section) to get better lesson structure.\n\nExample:\n# Introduction to Bonds\nA bond is a fixed-income instrument that represents a loan.\n\n# Bond Pricing\nBond prices are determined by discounting future cash flows..."}
                      className="min-h-[240px] resize-none font-mono text-sm"
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {pastedText.length} characters · {pastedText.split(/\n\s*\n/).filter(Boolean).length} paragraphs · Min 50 chars
                    </p>
                  </TabsContent>

                  <TabsContent value="pdf" className="mt-4">
                    <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 transition-colors hover:border-primary/50 hover:bg-muted/50">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground">
                        {fileName || "Click to upload .txt, .md, or .csv"}
                      </span>
                      <span className="text-xs text-muted-foreground">Text files work best for local parsing</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.md,.csv,.tsv,.pdf"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    {fileText && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        ✓ {fileText.length} characters loaded from {fileName}
                      </p>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Target course selector */}
                <div>
                  <Label className="font-bold text-sm">Save to Course</Label>
                  <Select value={targetCourse} onValueChange={setTargetCourse}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select target course" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.emoji} {c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-bold text-foreground">The parser will generate:</p>
                      <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                        <li>• Module summary from your content</li>
                        <li>• Lessons structured by headings/sections</li>
                        <li>• Concept cards from definitions</li>
                        <li>• Quiz questions from key statements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={inputMode === "text" ? pastedText.trim().length < 50 : !fileText.trim()}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate Content
                </Button>
              </div>
            </motion.div>
          )}

          {step === "parsing" && (
            <motion.div key="parsing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-4 py-16"
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-xl font-black text-foreground">Parsing your content...</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Extracting sections, building concept cards, and generating questions.
              </p>
              <div className="mt-4 flex gap-2">
                {["Extracting topics", "Building lessons", "Creating questions"].map((t, i) => (
                  <motion.div key={t} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.4, duration: 0.5 }}>
                    <Badge variant="outline">{t}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === "preview" && generated && (
            <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-foreground">Generated Content</h2>
                    <p className="text-sm text-muted-foreground mt-1">Review and edit before saving</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setStep("edit")}>
                    <Pencil className="h-3.5 w-3.5" /> Edit All
                  </Button>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Module Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{generated.moduleSummary}</p>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {generated.lessons.length} Lessons Generated
                  </h3>
                  {generated.lessons.map((lesson, i) => (
                    <Card key={lesson.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                {i + 1}
                              </span>
                              <h4 className="font-bold text-foreground text-sm">{lesson.title}</h4>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{lesson.explanation}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {lesson.type && <Badge variant="secondary" className="text-[10px]">{lesson.type}</Badge>}
                              {lesson.duration && <Badge variant="outline" className="text-[10px]">{lesson.duration} min</Badge>}
                              {lesson.xpReward && <Badge variant="outline" className="text-[10px]">{lesson.xpReward} XP</Badge>}
                              <Badge variant="outline" className="text-[10px]">{lesson.questions.length} questions</Badge>
                              {lesson.conceptCards && <Badge variant="outline" className="text-[10px]">{lesson.conceptCards.length} cards</Badge>}
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}>
                              {expandedLesson === lesson.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeLesson(lesson.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>

                        {expandedLesson === lesson.id && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2">
                            <Separator />
                            {lesson.conceptCards?.map((card, ci) => (
                              <div key={ci} className="rounded-lg bg-muted/50 p-2.5">
                                <p className="text-xs font-bold text-foreground">{card.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{card.content}</p>
                              </div>
                            ))}
                            {lesson.questions.map((q, qi) => (
                              <div key={q.id} className="rounded-lg border p-2.5">
                                <div className="flex items-start justify-between">
                                  <p className="text-xs font-bold text-foreground">Q{qi + 1}: {q.question}</p>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => removeQuestion(lesson.id, q.id)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="mt-1.5 space-y-0.5">
                                  {q.options.map((opt, oi) => (
                                    <div key={oi} className={`text-[11px] px-2 py-1 rounded ${oi === q.correctIndex ? "bg-success/10 text-success font-bold" : "text-muted-foreground"}`}>
                                      {oi === q.correctIndex ? "✓" : "○"} {opt}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Lessons", value: generated.lessons.length },
                    { label: "Questions", value: generated.lessons.reduce((a, l) => a + l.questions.length, 0) },
                    { label: "Concept Cards", value: generated.lessons.reduce((a, l) => a + (l.conceptCards?.length || 0), 0) },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl border bg-card p-3 text-center">
                      <div className="text-2xl font-black text-primary">{s.value}</div>
                      <div className="text-xs font-bold text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("upload")}>
                    Start Over
                  </Button>
                  <Button className="flex-1 gap-1.5" onClick={handleSave}>
                    <Save className="h-4 w-4" /> Save to Course
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "edit" && generated && (
            <motion.div key="edit" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-foreground">Edit Before Saving</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fine-tune titles, explanations, and remove unwanted content</p>
                </div>

                <div className="space-y-3">
                  <Label className="font-bold">Module Summary</Label>
                  <Textarea
                    value={generated.moduleSummary}
                    onChange={(e) => setGenerated({ ...generated, moduleSummary: e.target.value })}
                    className="min-h-[80px]"
                  />
                </div>

                {generated.lessons.map((lesson, i) => (
                  <Card key={lesson.id}>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-muted-foreground">Lesson {i + 1}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-destructive" onClick={() => removeLesson(lesson.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLessonField(lesson.id, "title", e.target.value)}
                        className="font-bold"
                      />
                      <Textarea
                        value={lesson.explanation}
                        onChange={(e) => updateLessonField(lesson.id, "explanation", e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Separator />
                      <p className="text-xs font-bold text-muted-foreground">
                        {lesson.questions.length} questions · {lesson.conceptCards?.length || 0} cards
                      </p>
                      {lesson.questions.map((q, qi) => (
                        <div key={q.id} className="rounded-lg border bg-muted/30 p-3">
                          <div className="flex items-start justify-between">
                            <p className="text-sm font-bold text-foreground">Q{qi + 1}: {q.question}</p>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeQuestion(lesson.id, q.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="mt-1.5 space-y-1">
                            {q.options.map((opt, oi) => (
                              <div key={oi} className={`text-xs px-2 py-1 rounded ${oi === q.correctIndex ? "bg-success/10 text-success font-bold" : "text-muted-foreground"}`}>
                                {oi === q.correctIndex ? "✓" : "○"} {opt}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("preview")}>
                    Back to Preview
                  </Button>
                  <Button className="flex-1 gap-1.5" onClick={handleSave}>
                    <Save className="h-4 w-4" /> Save to Course
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "saved" && (
            <motion.div key="saved" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-16 text-center"
            >
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
              >
                <Save className="h-10 w-10 text-success" />
              </motion.div>
              <h2 className="text-xl font-black text-foreground">Content Saved!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your generated content has been added as a new module to the selected course.
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => { setStep("upload"); setGenerated(null); setPastedText(""); setFileName(""); setFileText(""); }}>
                  Import More
                </Button>
                <Button onClick={() => navigate("/admin")}>
                  Go to Admin
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default AIImportPage;
