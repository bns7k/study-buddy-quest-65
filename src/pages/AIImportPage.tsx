import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Upload, FileText, Sparkles, Eye, Pencil, Save, ChevronRight, Loader2, AlertCircle } from "lucide-react";
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
import type { Lesson, QuizQuestion, ConceptCard } from "@/types/course";

type ImportStep = "upload" | "parsing" | "preview" | "edit" | "saved";

interface GeneratedContent {
  moduleSummary: string;
  lessons: Lesson[];
}

const MOCK_GENERATED: GeneratedContent = {
  moduleSummary: "This module covers the fundamentals of equity valuation, including discounted cash flow analysis, comparable company analysis, and precedent transactions. Students will learn to apply these methods to real-world scenarios.",
  lessons: [
    {
      id: "ai-gen-1",
      title: "Introduction to Equity Valuation",
      type: "concept",
      duration: 8,
      xpReward: 30,
      explanation: "Learn the three pillars of equity valuation and when to apply each method.",
      learningObjectives: ["Understand DCF fundamentals", "Compare valuation methods", "Identify appropriate use cases"],
      conceptCards: [
        { title: "Intrinsic Value", content: "The true worth of a company based on its expected future cash flows, discounted to present value." },
        { title: "Relative Valuation", content: "Comparing a company's valuation multiples (P/E, EV/EBITDA) to similar companies." },
      ],
      questions: [
        {
          id: "ai-q-1",
          question: "Which valuation method relies on future cash flow projections?",
          options: ["Comparable Company Analysis", "Discounted Cash Flow", "Precedent Transactions", "Book Value"],
          correctIndex: 1,
          explanation: "DCF valuation is based on projecting and discounting future cash flows to their present value.",
        },
      ],
    },
    {
      id: "ai-gen-2",
      title: "DCF Model Building",
      type: "practice",
      duration: 15,
      xpReward: 50,
      explanation: "Build a DCF model step by step using real financial data.",
      questions: [
        {
          id: "ai-q-2",
          question: "What is the first step in building a DCF model?",
          options: ["Calculate WACC", "Project free cash flows", "Determine terminal value", "Gather historical financials"],
          correctIndex: 3,
          explanation: "You must first gather and analyze historical financial data before projecting future cash flows.",
        },
        {
          id: "ai-q-3",
          question: "Which discount rate is typically used in a DCF for an entire firm?",
          options: ["Cost of Equity", "Risk-Free Rate", "WACC", "Cost of Debt"],
          correctIndex: 2,
          explanation: "WACC (Weighted Average Cost of Capital) is used to discount cash flows available to all capital providers.",
        },
      ],
    },
  ],
};

const AIImportPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<ImportStep>("upload");
  const [inputMode, setInputMode] = useState<"pdf" | "text">("text");
  const [pastedText, setPastedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);

  const handleUpload = () => {
    if (!pastedText.trim() && !fileName) return;
    setStep("parsing");
    // Simulate AI parsing
    setTimeout(() => {
      setGenerated(MOCK_GENERATED);
      setStep("preview");
    }, 2500);
  };

  const handleSave = () => {
    setStep("saved");
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
                    Upload lecture notes, PDFs, or paste text — AI will generate modules, lessons, and questions.
                  </p>
                </div>

                <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "pdf" | "text")}>
                  <TabsList className="w-full">
                    <TabsTrigger value="text" className="flex-1 gap-1.5">
                      <FileText className="h-4 w-4" /> Paste Notes
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex-1 gap-1.5">
                      <Upload className="h-4 w-4" /> Upload PDF
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-4">
                    <Textarea
                      placeholder="Paste your lecture notes, textbook excerpts, or any study material here..."
                      className="min-h-[200px] resize-none"
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {pastedText.length} characters · Minimum 100 recommended
                    </p>
                  </TabsContent>

                  <TabsContent value="pdf" className="mt-4">
                    <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/30 px-6 py-12 transition-colors hover:border-primary/50 hover:bg-muted/50">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground">
                        {fileName || "Click to upload PDF"}
                      </span>
                      <span className="text-xs text-muted-foreground">Max 10 MB</span>
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                      />
                    </label>
                  </TabsContent>
                </Tabs>

                <div className="rounded-xl border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                    <div>
                      <p className="text-sm font-bold text-foreground">AI will generate:</p>
                      <ul className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                        <li>• Module summary & learning objectives</li>
                        <li>• Structured lessons with concept cards</li>
                        <li>• Quiz questions with explanations</li>
                        <li>• Flashcards for spaced repetition</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleUpload}
                  disabled={!pastedText.trim() && !fileName}
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
              <h2 className="text-xl font-black text-foreground">AI is parsing your content...</h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Analyzing structure, extracting key concepts, and generating questions. This usually takes 10–30 seconds.
              </p>
              <div className="mt-4 flex gap-2">
                {["Extracting topics", "Building lessons", "Creating questions"].map((t, i) => (
                  <motion.div
                    key={t}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.8, duration: 0.5 }}
                  >
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
                    <p className="text-sm text-muted-foreground mt-1">Review what AI created from your input</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setStep("edit")}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>

                {/* Module Summary */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Module Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{generated.moduleSummary}</p>
                  </CardContent>
                </Card>

                {/* Generated Lessons */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {generated.lessons.length} Lessons Generated
                  </h3>
                  {generated.lessons.map((lesson, i) => (
                    <Card key={lesson.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                {i + 1}
                              </span>
                              <h4 className="font-bold text-foreground">{lesson.title}</h4>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{lesson.explanation}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {lesson.type && <Badge variant="secondary">{lesson.type}</Badge>}
                              {lesson.duration && <Badge variant="outline">{lesson.duration} min</Badge>}
                              {lesson.xpReward && <Badge variant="outline">{lesson.xpReward} XP</Badge>}
                              <Badge variant="outline">{lesson.questions.length} questions</Badge>
                              {lesson.conceptCards && (
                                <Badge variant="outline">{lesson.conceptCards.length} concept cards</Badge>
                              )}
                            </div>
                          </div>
                          <Eye className="h-4 w-4 shrink-0 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Stats Summary */}
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
                  <h2 className="text-xl font-black text-foreground">Edit Before Publishing</h2>
                  <p className="text-sm text-muted-foreground mt-1">Fine-tune the generated content</p>
                </div>

                <div className="space-y-3">
                  <Label className="font-bold">Module Summary</Label>
                  <Textarea defaultValue={generated.moduleSummary} className="min-h-[80px]" />
                </div>

                {generated.lessons.map((lesson, i) => (
                  <Card key={lesson.id}>
                    <CardContent className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-muted-foreground">Lesson {i + 1}</span>
                      </div>
                      <Input defaultValue={lesson.title} className="font-bold" />
                      <Textarea defaultValue={lesson.explanation} className="min-h-[60px]" />
                      <Separator />
                      <p className="text-xs font-bold text-muted-foreground">{lesson.questions.length} questions</p>
                      {lesson.questions.map((q, qi) => (
                        <div key={q.id} className="rounded-lg border bg-muted/30 p-3">
                          <p className="text-sm font-bold text-foreground">Q{qi + 1}: {q.question}</p>
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
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10"
              >
                <Save className="h-10 w-10 text-success" />
              </motion.div>
              <h2 className="text-xl font-black text-foreground">Content Saved!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Your AI-generated module has been saved. Once Lovable Cloud is enabled, content will persist in the database.
              </p>
              <div className="mt-4 flex gap-3">
                <Button variant="outline" onClick={() => { setStep("upload"); setGenerated(null); setPastedText(""); setFileName(""); }}>
                  Import More
                </Button>
                <Button onClick={() => navigate("/")}>
                  Go to Courses
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
