import type { Lesson, QuizQuestion, ConceptCard } from "@/types/course";

/**
 * Simple local content parser that extracts structure from pasted text.
 * Splits by headings, generates concept cards, and creates questions from key sentences.
 */

function extractSections(text: string): { title: string; body: string }[] {
  // Split on markdown-style headings or numbered sections
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

  // If no headings found, chunk by paragraphs
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

  // Look for definition-like patterns
  for (const s of sentences) {
    const defMatch = s.match(/^(.+?)\s+(?:is|are|refers to|means|describes)\s+(.+)/i);
    if (defMatch && cards.length < 4) {
      cards.push({ title: defMatch[1].trim().slice(0, 50), content: s + "." });
    }
  }

  // If few cards, pick key sentences
  if (cards.length < 2) {
    const keyPhrases = sentences.filter((s) => s.length > 30 && s.length < 200);
    for (const kp of keyPhrases.slice(0, 3 - cards.length)) {
      cards.push({ title: kp.split(/\s+/).slice(0, 4).join(" "), content: kp + "." });
    }
  }

  return cards;
}

function generateQuestionsFromText(title: string, body: string): QuizQuestion[] {
  const sentences = body.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 20);
  if (sentences.length === 0) return [];

  const questions: QuizQuestion[] = [];

  // Pattern 1: What is X?
  for (const s of sentences) {
    const defMatch = s.match(/^(.+?)\s+(?:is|are|refers to)\s+(.+)/i);
    if (defMatch && questions.length < 3) {
      const term = defMatch[1].trim();
      const definition = defMatch[2].trim();
      const wrongAnswers = generateDistractors(definition, sentences);
      questions.push({
        id: `gen-${Date.now()}-${questions.length}`,
        question: `What ${term.toLowerCase().startsWith("the ") ? "does" : "is"} ${term}?`,
        options: shuffleWithCorrect(definition + ".", wrongAnswers),
        correctIndex: 0, // will be fixed by shuffleWithCorrect
        explanation: s + ".",
      });
    }
  }

  // Pattern 2: True/false style
  if (questions.length < 2 && sentences.length > 2) {
    const factSentence = sentences.find((s) => s.length > 30 && s.length < 150);
    if (factSentence) {
      questions.push({
        id: `gen-${Date.now()}-tf`,
        question: `Which of the following statements about ${title.toLowerCase()} is correct?`,
        options: shuffleWithCorrect(
          factSentence + ".",
          [
            `${title} has no practical applications.`,
            `${title} is only relevant in theoretical contexts.`,
            `None of the above statements are accurate.`,
          ]
        ),
        correctIndex: 0,
        explanation: factSentence + ".",
      });
    }
  }

  // Fix correctIndex after shuffle
  return questions.map((q) => {
    const ci = q.options.indexOf(q.options.find((_, i) => i === 0)!);
    return { ...q, correctIndex: ci >= 0 ? ci : 0 };
  });
}

function generateDistractors(correct: string, pool: string[]): string[] {
  const distractors = pool
    .filter((s) => s !== correct && s.length > 10)
    .map((s) => s.slice(0, 100) + (s.length > 100 ? "..." : "."))
    .slice(0, 3);

  while (distractors.length < 3) {
    distractors.push(`This is not the correct definition (option ${distractors.length + 1}).`);
  }
  return distractors;
}

function shuffleWithCorrect(correct: string, wrong: string[]): string[] {
  const all = [correct, ...wrong.slice(0, 3)];
  // Simple shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

export function parseTextToContent(text: string): {
  moduleSummary: string;
  lessons: Lesson[];
} {
  const sections = extractSections(text);
  const totalChars = text.length;

  // Module summary = first 2 sentences of input
  const firstSentences = text.split(/[.!?]+/).slice(0, 2).join(". ").trim();
  const moduleSummary = firstSentences
    ? firstSentences + "."
    : `This module covers ${sections.length} topics extracted from your content (${totalChars} characters).`;

  // Group sections into lessons (max ~3 sections per lesson)
  const SECTIONS_PER_LESSON = 3;
  const lessons: Lesson[] = [];

  for (let i = 0; i < sections.length; i += SECTIONS_PER_LESSON) {
    const group = sections.slice(i, i + SECTIONS_PER_LESSON);
    const lessonTitle = group[0].title;
    const lessonBody = group.map((s) => s.body).join("\n\n");
    const conceptCards = group.flatMap((s) => generateConceptCards(s.body));
    const questions = generateQuestionsFromText(lessonTitle, lessonBody);

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

  // If no lessons generated, create a fallback
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

    questions.push({
      id: `csv-${Date.now()}-${i}`,
      question,
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
