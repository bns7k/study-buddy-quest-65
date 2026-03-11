import type { Lesson, QuizQuestion, ConceptCard, MatchPair } from "@/types/course";

/**
 * Simple local content parser that extracts structure from pasted text.
 * Splits by headings, generates concept cards, and creates diverse question types.
 */

function extractSections(text: string): { title: string; body: string }[] {
  const lines = text.split("\n");
  const sections: { title: string; body: string }[] = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)/) || line.match(/^\d+[\.\)]\s+(.+)/);
    if (headingMatch) {
      if (current) sections.push({ title: current.title, body: current.lines.join("\n").trim() });
      current = { title: headingMatch[1].trim(), lines: [] };
    } else if (current) {
      current.lines.push(line);
    } else if (line.trim()) {
      current = { title: line.trim().slice(0, 60), lines: [] };
    }
  }
  if (current) sections.push({ title: current.title, body: current.lines.join("\n").trim() });

  if (sections.length === 0) {
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 20);
    paragraphs.forEach((p, i) => {
      const firstSentence = p.trim().split(/[.!?]/)[0].trim().slice(0, 60);
      sections.push({ title: firstSentence || `Section ${i + 1}`, body: p.trim() });
    });
  }

  return sections;
}

function generateConceptCards(body: string): ConceptCard[] {
  const sentences = body.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15);
  const cards: ConceptCard[] = [];

  for (const s of sentences) {
    const defMatch = s.match(/^(.+?)\s+(?:is|are|refers to|means|describes)\s+(.+)/i);
    if (defMatch && cards.length < 4) {
      cards.push({ title: defMatch[1].trim().slice(0, 50), content: s + "." });
    }
  }

  if (cards.length < 2) {
    const keyPhrases = sentences.filter((s) => s.length > 30 && s.length < 200);
    for (const kp of keyPhrases.slice(0, 3 - cards.length)) {
      cards.push({ title: kp.split(/\s+/).slice(0, 4).join(" "), content: kp + "." });
    }
  }

  return cards;
}

// Extract definitions as { term, definition } for match pairs and flashcards
function extractDefinitions(body: string): { term: string; definition: string }[] {
  const sentences = body.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15);
  const defs: { term: string; definition: string }[] = [];
  for (const s of sentences) {
    const m = s.match(/^(.+?)\s+(?:is|are|refers to|means)\s+(.+)/i);
    if (m && m[1].trim().length < 60 && m[2].trim().length > 10) {
      defs.push({ term: m[1].trim(), definition: m[2].trim() + "." });
    }
  }
  return defs;
}

// Extract numbered/bulleted lists for order_steps
function extractOrderedSteps(body: string): string[] {
  const lines = body.split("\n");
  const steps: string[] = [];
  for (const line of lines) {
    const m = line.match(/^\s*(?:\d+[\.\)]|-|\*)\s+(.+)/);
    if (m && m[1].trim().length > 5) steps.push(m[1].trim());
  }
  return steps;
}

// Extract numbers for numeric questions
function extractNumericFacts(body: string): { question: string; answer: number; context: string }[] {
  const sentences = body.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 15);
  const facts: { question: string; answer: number; context: string }[] = [];
  for (const s of sentences) {
    const m = s.match(/(\d+[\d,\.]*)\s*(%|percent|million|billion|years?|months?|days?)?/i);
    if (m) {
      const num = parseFloat(m[1].replace(/,/g, ""));
      if (!isNaN(num) && num > 0 && num < 1e12) {
        facts.push({ question: s, answer: num, context: s + "." });
      }
    }
  }
  return facts;
}

function generateDiverseQuestions(title: string, body: string): QuizQuestion[] {
  const sentences = body.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);
  if (sentences.length === 0) return [];

  const questions: QuizQuestion[] = [];
  const ts = () => `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  // 1. Multiple choice from definitions
  for (const s of sentences) {
    const defMatch = s.match(/^(.+?)\s+(?:is|are|refers to)\s+(.+)/i);
    if (defMatch && questions.length < 1) {
      const term = defMatch[1].trim();
      const definition = defMatch[2].trim();
      const distractors = sentences
        .filter((x) => x !== s && x.length > 10)
        .map((x) => x.slice(0, 100) + ".")
        .slice(0, 3);
      while (distractors.length < 3) distractors.push(`Unrelated concept (option ${distractors.length + 1}).`);
      const opts = [definition + ".", ...distractors];
      const shuffled = [...opts].sort(() => Math.random() - 0.5);
      questions.push({
        id: ts(),
        questionType: "multiple_choice",
        question: `What is ${term}?`,
        options: shuffled,
        correctIndex: shuffled.indexOf(opts[0]),
        explanation: s + ".",
      });
    }
  }

  // 2. True/False from a factual statement
  const factSentence = sentences.find((s) => s.length > 30 && s.length < 150 && !s.includes("?"));
  if (factSentence) {
    questions.push({
      id: ts(),
      questionType: "true_false",
      question: factSentence + ".",
      options: ["True", "False"],
      correctIndex: 0, // The statement is true
      explanation: `This is correct: ${factSentence}.`,
    });
  }

  // 3. Match Pairs from definitions
  const defs = extractDefinitions(body);
  if (defs.length >= 2) {
    questions.push({
      id: ts(),
      questionType: "match_pairs",
      question: `Match the following ${title.toLowerCase()} terms with their definitions:`,
      matchPairs: defs.slice(0, 4) as MatchPair[],
      options: [],
      correctIndex: 0,
      explanation: `These are key definitions from ${title}.`,
    });
  }

  // 4. Fill in the blank
  for (const s of sentences) {
    const defMatch = s.match(/^(.+?)\s+(?:is|are|refers to)\s+(.+)/i);
    if (defMatch && !questions.some((q) => q.questionType === "fill_blank")) {
      const term = defMatch[1].trim();
      questions.push({
        id: ts(),
        questionType: "fill_blank",
        question: `___ ${s.slice(defMatch[1].length)}.`,
        blankAnswer: term,
        options: [],
        correctIndex: 0,
        explanation: s + ".",
      });
    }
  }

  // 5. Order Steps from bulleted/numbered lists
  const steps = extractOrderedSteps(body);
  if (steps.length >= 3) {
    questions.push({
      id: ts(),
      questionType: "order_steps",
      question: `Put these ${title.toLowerCase()} steps in the correct order:`,
      correctOrder: steps.slice(0, 5),
      options: [],
      correctIndex: 0,
      explanation: `The correct sequence for ${title.toLowerCase()}.`,
    });
  }

  // 6. Numeric from number facts
  const numFacts = extractNumericFacts(body);
  if (numFacts.length > 0) {
    const fact = numFacts[0];
    questions.push({
      id: ts(),
      questionType: "numeric",
      question: `Based on the material: ${fact.question}. What is the numeric value mentioned?`,
      numericAnswer: fact.answer,
      numericTolerance: fact.answer * 0.01,
      options: [],
      correctIndex: 0,
      explanation: fact.context,
    });
  }

  // 7. Flashcard from first definition
  if (defs.length > 0) {
    const d = defs[0];
    questions.push({
      id: ts(),
      questionType: "flashcard",
      question: d.term,
      flashcardBack: d.definition,
      options: [],
      correctIndex: 0,
      explanation: "",
    });
  }

  return questions;
}

export function parseTextToContent(text: string): {
  moduleSummary: string;
  lessons: Lesson[];
} {
  const sections = extractSections(text);
  const totalChars = text.length;

  const firstSentences = text.split(/[.!?]+/).slice(0, 2).join(". ").trim();
  const moduleSummary = firstSentences
    ? firstSentences + "."
    : `This module covers ${sections.length} topics extracted from your content (${totalChars} characters).`;

  const SECTIONS_PER_LESSON = 3;
  const lessons: Lesson[] = [];

  for (let i = 0; i < sections.length; i += SECTIONS_PER_LESSON) {
    const group = sections.slice(i, i + SECTIONS_PER_LESSON);
    const lessonTitle = group[0].title;
    const lessonBody = group.map((s) => s.body).join("\n\n");
    const conceptCards = group.flatMap((s) => generateConceptCards(s.body));
    const questions = generateDiverseQuestions(lessonTitle, lessonBody);

    const lessonIndex = lessons.length;
    lessons.push({
      id: `ai-${Date.now()}-${lessonIndex}`,
      title: lessonTitle,
      type: lessonIndex === 0 ? "concept" : questions.length > 1 ? "quiz" : "concept",
      duration: Math.max(5, Math.round(lessonBody.length / 200)),
      xpReward: 20 + questions.length * 10,
      explanation: group[0].body.split(/[.!?]+/).slice(0, 2).join(". ").trim() + ".",
      learningObjectives: group.map((s) => `Understand ${s.title.toLowerCase()}`),
      conceptCards: conceptCards.length > 0 ? conceptCards : undefined,
      questions,
    });
  }

  if (lessons.length === 0) {
    lessons.push({
      id: `ai-${Date.now()}-0`,
      title: "Imported Content",
      type: "concept",
      duration: Math.max(5, Math.round(totalChars / 200)),
      xpReward: 30,
      explanation: moduleSummary,
      questions: [],
    });
  }

  return { moduleSummary, lessons };
}

/**
 * Parse CSV text into QuizQuestion array.
 * Expected columns: question, option1, option2, option3, option4, correctIndex (0-based), explanation
 * Optional column: type (multiple_choice, true_false, fill_blank, numeric)
 */
export function parseCSVToQuestions(csv: string): { questions: QuizQuestion[]; errors: string[] } {
  const lines = csv.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return { questions: [], errors: ["CSV must have a header row and at least one data row."] };

  const header = parseCSVLine(lines[0]).map((h) => h.toLowerCase().trim());
  const requiredCols = ["question", "option1", "option2", "correctindex", "explanation"];
  const missing = requiredCols.filter((c) => !header.includes(c));
  if (missing.length > 0) return { questions: [], errors: [`Missing columns: ${missing.join(", ")}`] };

  const colIndex = Object.fromEntries(header.map((h, i) => [h, i]));
  const questions: QuizQuestion[] = [];
  const errors: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    const question = cols[colIndex["question"]]?.trim();
    if (!question) { errors.push(`Row ${i + 1}: empty question`); continue; }

    const options = [
      cols[colIndex["option1"]]?.trim(),
      cols[colIndex["option2"]]?.trim(),
      cols[colIndex["option3"]]?.trim(),
      cols[colIndex["option4"]]?.trim(),
    ].filter(Boolean) as string[];

    if (options.length < 2) { errors.push(`Row ${i + 1}: need at least 2 options`); continue; }

    const correctIndex = parseInt(cols[colIndex["correctindex"]]) || 0;
    const explanation = cols[colIndex["explanation"]]?.trim() || "";
    const qType = colIndex["type"] !== undefined ? cols[colIndex["type"]]?.trim() : undefined;

    questions.push({
      id: `csv-${Date.now()}-${i}`,
      question,
      questionType: (qType as any) || "multiple_choice",
      options,
      correctIndex: Math.min(correctIndex, options.length - 1),
      explanation,
    });
  }

  return { questions, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export const CSV_TEMPLATE = `question,option1,option2,option3,option4,correctIndex,explanation
"What is the capital of France?","London","Paris","Berlin","Madrid",1,"Paris is the capital and largest city of France."
"Which planet is closest to the Sun?","Venus","Earth","Mercury","Mars",2,"Mercury is the closest planet to the Sun in our solar system."
"What does GDP stand for?","Gross Domestic Product","General Development Plan","Global Data Protocol","Grand Distribution Percentage",0,"GDP stands for Gross Domestic Product, a measure of economic output."`;
