import OpenAI from "openai";
import type { QuestionnaireAnswers } from "./types";

// ─── Model Configuration ────────────────────────────────────────────────────
const GENERATION_MODEL = "gpt-5.2";
const FACTCHECK_MODEL  = "gpt-5.2";

// ─── Pricing (USD per million tokens) — update if OpenAI changes rates ───────
const INPUT_COST_PER_M  = 10;   // $ per million input tokens
const OUTPUT_COST_PER_M = 40;   // $ per million output tokens (incl. reasoning)

// ─── Client ─────────────────────────────────────────────────────────────────
let client: OpenAI | null = null;
function getClient(): OpenAI {
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  return client;
}

// ─── System Prompt (from Masters_SOP_Gpt.docx) ──────────────────────────────
const GENERATION_SYSTEM_PROMPT = `You are an expert admissions consultant who has personally secured admission offers from Harvard, Yale, MIT, Stanford, Wharton, Columbia, Princeton, Kellogg, Booth, and every other top-10 global university you have helped students apply to. You specialize in Statements of Purpose that are deeply personal, narrative-driven, and strategically crafted to win over the most selective admissions committees in the world.

═══════════════════════════════════════════════════
WRITING PHILOSOPHY
═══════════════════════════════════════════════════

• Every SOP tells ONE coherent story with a single unifying theme that runs from the first line to the last.
• You SHOW — never tell. Every claim is anchored in a vivid, specific, cinematic anecdote.
• You select 3–4 of the most powerful moments from the student's answers and weave them into a narrative. You do NOT mechanically recite all responses.
• The voice sounds like the student at their absolute best — articulate, authentic, and human. It must not sound like a consultant or an AI.
• You calibrate vocabulary and sentence complexity to the student's English proficiency score.
• You write as if the reader has already read 500 generic SOPs today — yours is the one they will remember.
• You NEVER use these phrases or their variants: "passionate about", "since childhood I always dreamed", "make a difference", "leverage", "synergy", "utilize", "dynamic", "embark on a journey", "in today's fast-paced world", "I am writing to express my interest".

═══════════════════════════════════════════════════
MANDATORY 5-PART STRUCTURE
═══════════════════════════════════════════════════

1. HOOK (1 paragraph)
   Open in media res. Drop the reader into the most cinematic, specific moment from the student's Origin Story or most powerful anecdote. No summaries. No "I have always been fascinated by…". Start with a scene: a place, an action, a sensory detail, a question that demands an answer.

2. IDENTITY & INTELLECTUAL DNA (1–2 paragraphs)
   Reveal who this person fundamentally is — their unique way of seeing the world (Intellectual DNA), their surprising contradiction, the driving question that haunts them. This is the "why are you the way you are" section.

3. EVIDENCE ARC (2–3 paragraphs)
   The major-specific experiences that prove capability. Use the most relevant answers from Q10–Q13 (Leadership/Technical/Research/Design experiences). Include concrete outcomes, numbers, tools, methodologies. Show growth across time — not just what they did, but what it revealed about them.

4. PROGRAM FIT (1 paragraph)
   Why THIS school, THIS program, THIS moment. Specific faculty, labs, courses, research centers, or cultural values that align with the student's exact trajectory. The student should sound like they have spent months researching this program — because they have.

5. VISION (1 paragraph)
   Where they are going in 5–10 years. The specific impact they want to create. Why this program is the essential bridge between who they are today and who they need to become. Close with a line that ties back to the opening hook — the narrative must feel complete.

═══════════════════════════════════════════════════
MAJOR-SPECIFIC PRIORITIES (apply based on student's program)
═══════════════════════════════════════════════════

BUSINESS / MANAGEMENT (MBA, MS Finance, MS Marketing, MS Management, MS Engineering Management, MS Accounting, MS Business Analytics):
• Lead with a specific leadership impact moment with quantifiable outcomes (revenue generated, cost saved, people managed, % improvement).
• Show strategic thinking through data-driven decisions — not just intuition.
• Demonstrate cross-functional collaboration: how did you bridge different teams, stakeholders, or disciplines?
• The "why MBA/MS now" must connect to a specific career inflection point — a door they cannot open without this degree.
• Q10 (Leadership/Impact) and Q11 (Analytical/Strategic Thinking) are the core of the Evidence Arc.

DATA / TECH / QUANT (Data Science, Computer Science, AI, Statistics, Information Systems, MQF):
• Lead with the most technically impactful project — state the problem, the method, the measurable result.
• Show the ability to bridge technical complexity with real-world or business value.
• Mention specific tools, languages, frameworks (Python, PyTorch, SQL, etc.) naturally within narrative — not as a list.
• Demonstrate continuous learning: what cutting-edge technique did you master recently and why?
• Q10 (Technical Project) and Q11 (Applied Problem-Solving) are the core of the Evidence Arc.

ENGINEERING (Civil, Mechanical, Electrical, Biomedical, Biotechnology, Biological & Agricultural):
• Lead with a specific design/build experience where real-world constraints forced creative engineering.
• Show systematic problem-solving: identify root cause → test hypotheses → implement solution → measure result.
• Quantify everything: accuracy %, efficiency gain, weight saved, cost reduced, time improved.
• Demonstrate interdisciplinary integration — engineering intersecting with medicine, environment, business, or society.
• Q10 (Design/Build) and Q11 (Problem-Solving Methodology) are the core of the Evidence Arc.

PURE SCIENCES / MATH (Mathematics, Physics, Chemistry, Biology):
• Lead with the research question that reveals intellectual obsession — the problem that won't let them sleep.
• Show how they translate abstract theory into insight that matters — use analogies, concrete implications.
• Highlight their unique intellectual contribution in collaborative research — not just "I was part of a team."
• Connect theoretical expertise to future real-world applications or open questions in the field.
• Q10 (Research Experience) and Q11 (Abstract-to-Concrete Translation) are the core of the Evidence Arc.

INTERDISCIPLINARY / OTHER:
• Lead with the most surprising cross-disciplinary connection they have made.
• Show how their unusual combination of fields creates unique problem-solving capacity.
• Demonstrate how methods from one discipline solved a problem in another.
• Q10 and Q11 (as given) are the core of the Evidence Arc.

═══════════════════════════════════════════════════
FINAL PARAMETERS
═══════════════════════════════════════════════════

• Length: 800–1000 words. Every sentence earns its place.
• Person: First person throughout.
• Tense: Mix of past tense (experiences) and present/future (identity, goals).
• Never use bullet points, headers, or section labels in the final SOP.
• The SOP must feel like a single, unbroken narrative — not a collection of paragraphs each answering a different question.`;

// ─── Fact-Checker System Prompt ──────────────────────────────────────────────
const FACTCHECK_SYSTEM_PROMPT = `You are a meticulous fact-checker and editor reviewing a Statement of Purpose for graduate school admission. Your sole job is to ensure every specific claim in the SOP is consistent with, and grounded in, the student's original questionnaire responses.

WHAT YOU CHECK:
1. Factual consistency — Does every specific claim (numbers, dates, project outcomes, titles, tools, institutions) match what the student actually provided in their questionnaire?
2. No fabrication — Flag and correct any achievement, metric, or experience that was not mentioned by the student or cannot reasonably be inferred from their answers.
3. Plausibility — Are any claims exaggerated beyond what the evidence supports? Correct them to be accurate but still strong.
4. Internal consistency — Does the SOP contradict itself anywhere?
5. Specificity gaps — If the SOP makes a vague claim where the student provided a specific detail, insert the specific detail.

WHAT YOU DO NOT CHANGE:
• The narrative structure, arc, or paragraph order.
• The writing style, tone, or voice — unless a sentence is factually wrong.
• Any claim that IS accurate and consistent with the questionnaire answers.
• Grammar, phrasing, and word choice — unless correcting a factual error forces a rewrite.

OUTPUT RULES:
• Return ONLY the final corrected SOP — no commentary, no explanation, no list of changes.
• If no corrections are needed, return the SOP exactly as provided.
• Preserve all paragraph breaks and formatting of the original.`;

// ─── Helper: determine major category from program string ────────────────────
function getMajorCategory(program: string, degreeType: string): string {
  const text = `${program} ${degreeType}`.toLowerCase();
  if (/mba|finance|marketing|management|accounting|business analytics|strategy/.test(text)) {
    return "Business/Management";
  }
  if (/data science|computer science|cs|ai|artificial intelligence|statistics|information systems|mqf|quantitative/.test(text)) {
    return "Data/Tech/Quant";
  }
  if (/engineering|biomedical|biotechnology|civil|mechanical|electrical|chemical|industrial|agricultural/.test(text)) {
    return "Engineering";
  }
  if (/mathematics|math|physics|chemistry|biology|biochemistry|neuroscience/.test(text)) {
    return "Pure Sciences/Math";
  }
  return "Interdisciplinary/Other";
}

// ─── Helper: calculate USD cost from token usage ─────────────────────────────
function calcCost(inputTokens: number, outputTokens: number): number {
  return (inputTokens * INPUT_COST_PER_M + outputTokens * OUTPUT_COST_PER_M) / 1_000_000;
}

// ─── Pass 1: Generate Draft SOP ──────────────────────────────────────────────
async function generateDraft(
  answers: QuestionnaireAnswers,
  university: string,
  program: string,
  degreeType: string,
  studentName: string
): Promise<{ content: string; costUsd: number }> {
  const openai = getClient();
  const majorCategory = getMajorCategory(program, degreeType);

  const userPrompt = `Write a Statement of Purpose for ${studentName} applying to ${program} (${degreeType}) at ${university}.

MAJOR CATEGORY: ${majorCategory}

═══ STUDENT QUESTIONNAIRE RESPONSES ═══

English Proficiency Score: ${answers.englishTestScore || "Not provided"}
Programs Applying For: ${answers.programsApplying || "Not provided"}

─── CORE IDENTITY ───
Origin Story (the ONE defining moment): ${answers.originStory}

Intellectual DNA (how they think differently): ${answers.intellectualDNA}

Authentic Contradiction (surprising combination): ${answers.authenticContradiction}

Driving Question (what haunts their intellectual curiosity): ${answers.drivingQuestion}

─── CONFLICT & GROWTH ───
Transformation Through Failure: ${answers.transformationFailure}

Belief Shift (a conviction they had to abandon): ${answers.beliefShift}

Surprise Achievement: ${answers.surpriseAchievement}

─── MAJOR-SPECIFIC EVIDENCE (Q10–Q13) ───
Leadership / Technical / Research Project (Q10): ${answers.leadershipImpact}

Analytical / Problem-Solving / Abstract Thinking (Q11): ${answers.analyticalThinking}

Cross-Functional / Collaborative / Interdisciplinary Work (Q12): ${answers.crossFunctionalExperience}

Industry / Research / Applied Exposure (Q13): ${answers.industryExposure}

─── FUTURE & FIT ───
Unique Position (problem only they can solve): ${answers.uniquePosition}

Why This Specific Program (faculty, labs, courses, culture): ${answers.perfectAlignment}

5–10 Year Vision: ${answers.fiveYearVision}

Legacy Contribution: ${answers.legacyContribution}

═══════════════════════════════════════

INSTRUCTIONS:
• Apply the ${majorCategory} major-specific priorities from your guidelines.
• Select the 3–4 most powerful moments — do NOT mention every answer.
• The SOP should feel like one unified story, not a questionnaire answered in paragraph form.
• Match vocabulary complexity to the student's English proficiency score.
• 800–1000 words. No headers. No bullet points. First person.`;

  const response = await openai.responses.create({
    model: GENERATION_MODEL,
    instructions: GENERATION_SYSTEM_PROMPT,
    input: userPrompt,
    reasoning: { effort: "low" },
  });

  const usage = response.usage;
  const costUsd = usage
    ? calcCost(usage.input_tokens, usage.output_tokens)
    : 0;

  return { content: response.output_text ?? "", costUsd };
}

// ─── Pass 2: Fact-Check & Polish ─────────────────────────────────────────────
async function factCheck(
  draft: string,
  answers: QuestionnaireAnswers,
  university: string,
  program: string,
  studentName: string
): Promise<{ content: string; costUsd: number }> {
  const openai = getClient();

  const userPrompt = `STUDENT: ${studentName} | PROGRAM: ${program} at ${university}

ORIGINAL QUESTIONNAIRE ANSWERS (ground truth):
---
Origin Story: ${answers.originStory}
Intellectual DNA: ${answers.intellectualDNA}
Authentic Contradiction: ${answers.authenticContradiction}
Driving Question: ${answers.drivingQuestion}
Transformation Failure: ${answers.transformationFailure}
Belief Shift: ${answers.beliefShift}
Surprise Achievement: ${answers.surpriseAchievement}
Leadership/Technical Project (Q10): ${answers.leadershipImpact}
Analytical Thinking (Q11): ${answers.analyticalThinking}
Cross-Functional Work (Q12): ${answers.crossFunctionalExperience}
Industry/Research Exposure (Q13): ${answers.industryExposure}
Unique Position: ${answers.uniquePosition}
Why This Program: ${answers.perfectAlignment}
5–10 Year Vision: ${answers.fiveYearVision}
Legacy Contribution: ${answers.legacyContribution}
---

DRAFT SOP TO FACT-CHECK:
---
${draft}
---

Fact-check the draft against the questionnaire answers above. Correct any inaccuracies. Return only the final SOP.`;

  const response = await openai.responses.create({
    model: FACTCHECK_MODEL,
    instructions: FACTCHECK_SYSTEM_PROMPT,
    input: userPrompt,
    reasoning: { effort: "low" },
  });

  const usage = response.usage;
  const costUsd = usage
    ? calcCost(usage.input_tokens, usage.output_tokens)
    : 0;

  return { content: response.output_text ?? draft, costUsd };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function generateSOP(
  answers: QuestionnaireAnswers,
  university: string,
  program: string,
  degreeType: string,
  studentName: string
): Promise<{ content: string; costUsd: number }> {
  // Pass 1: Generate narrative draft
  const { content: draft, costUsd: cost1 } = await generateDraft(answers, university, program, degreeType, studentName);

  // Pass 2: Fact-check against student's actual answers
  const { content: final, costUsd: cost2 } = await factCheck(draft, answers, university, program, studentName);

  return { content: final, costUsd: cost1 + cost2 };
}
