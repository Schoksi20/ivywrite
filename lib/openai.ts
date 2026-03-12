import Anthropic from "@anthropic-ai/sdk";
import type { QuestionnaireAnswers } from "./types";

// ─── Model Configuration ────────────────────────────────────────────────────
const GENERATION_MODEL = "claude-opus-4-5-20251101";
const FACTCHECK_MODEL  = "claude-opus-4-5-20251101";

// ─── Pricing (USD per million tokens) — Claude Opus 4.5 ─────────────────────
const INPUT_COST_PER_M  = 5.00;   // $ per million input tokens
const OUTPUT_COST_PER_M = 25.00;  // $ per million output tokens

// ─── Client ─────────────────────────────────────────────────────────────────
let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
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

• Length: 800–1500 words. Every sentence earns its place.
• Person: First person throughout.
• Tense: Mix of past tense (experiences) and present/future (identity, goals).
• Never use bullet points, headers, or section labels in the final SOP.
• The SOP must feel like a single, unbroken narrative — not a collection of paragraphs each answering a different question.
• NEVER use em dashes (—) or en dashes (–) as connectors between clauses or sentences. Use a comma, semicolon, or period instead. Hyphens in compound words (e.g. "self-driven", "cross-functional") are fine.
• NEVER use these filler phrases: "furthermore", "moreover", "in conclusion", "it is worth noting", "it is important to note", "needless to say", "that being said", "having said that", "delve into", "testament to", "underpinned by", "grounded in the belief", "with that in mind".
• NEVER invent or fabricate faculty names, lab names, course names, or research center names. Only use specific names if the student explicitly provided them in their questionnaire answers. If the student did not name specific faculty or labs, write about the program's strengths in general terms.`;

// ─── Fact-Checker System Prompt ──────────────────────────────────────────────
const FACTCHECK_SYSTEM_PROMPT = `You are a meticulous fact-checker and editor reviewing a Statement of Purpose for graduate school admission. Your sole job is to ensure every specific claim in the SOP is consistent with, and grounded in, the student's original questionnaire responses.

WHAT YOU CHECK:
1. Factual consistency — Does every specific claim (numbers, dates, project outcomes, titles, tools, institutions) match what the student actually provided in their questionnaire?
2. No fabrication — Flag and correct any achievement, metric, or experience that was not mentioned by the student or cannot reasonably be inferred from their answers.
3. Plausibility — Are any claims exaggerated beyond what the evidence supports? Correct them to be accurate but still strong.
4. Internal consistency — Does the SOP contradict itself anywhere?
5. Specificity gaps — If the SOP makes a vague claim where the student provided a specific detail, insert the specific detail.
6. AI-ism removal — Replace any em dash (—) or en dash (–) used as a clause connector with a comma, semicolon, or period as appropriate. Hyphens inside compound words (e.g. "self-driven") must be kept. Remove filler phrases such as "furthermore", "moreover", "in conclusion", "it is worth noting", "needless to say", "that being said", "delve into", "testament to" — rewrite the sentence naturally without them.

7. Fabricated names — If the SOP mentions a specific faculty member, lab, course, or research center that the student did NOT explicitly name in their questionnaire, remove it and replace with a general reference to the program's strengths.

WHAT YOU DO NOT CHANGE:
• The narrative structure, arc, or paragraph order.
• The writing style, tone, or voice — unless a sentence is factually wrong.
• Any claim that IS accurate and consistent with the questionnaire answers.
• Grammar, phrasing, and word choice — unless correcting a factual error forces a rewrite.

OUTPUT RULES:
• Return ONLY the final corrected SOP — no commentary, no explanation, no list of changes.
• If no corrections are needed, return the SOP exactly as provided.
• Preserve all paragraph breaks and formatting of the original.`;

// ─── Helper: determine major category ────────────────────────────────────────
function getMajorCategory(answers: QuestionnaireAnswers, program: string, degreeType: string): string {
  const explicit = answers.majorCategory;
  if (explicit) {
    const map: Record<string, string> = {
      business: "Business/Management",
      data_tech: "Data/Tech/Quant",
      engineering: "Engineering",
      pure_sciences: "Pure Sciences/Math",
      interdisciplinary: "Interdisciplinary/Other",
    };
    return map[explicit] || "Interdisciplinary/Other";
  }
  const text = `${program} ${degreeType}`.toLowerCase();
  if (/mba|finance|marketing|management|accounting|business analytics|strategy/.test(text)) return "Business/Management";
  if (/data science|computer science|cs|ai|artificial intelligence|statistics|information systems|mqf|quantitative/.test(text)) return "Data/Tech/Quant";
  if (/engineering|biomedical|biotechnology|civil|mechanical|electrical|chemical|industrial|agricultural/.test(text)) return "Engineering";
  if (/mathematics|math|physics|chemistry|biology|biochemistry|neuroscience/.test(text)) return "Pure Sciences/Math";
  return "Interdisciplinary/Other";
}

// ─── Helper: format test scores from structured fields ───────────────────────
function formatTestScores(a: QuestionnaireAnswers): string {
  const parts: string[] = [];

  if (a.greVerbal || a.greQuant) {
    const gre = [`GRE`];
    if (a.greVerbal) gre.push(`Verbal: ${a.greVerbal}/170`);
    if (a.greQuant) gre.push(`Quant: ${a.greQuant}/170`);
    parts.push(gre.join(" "));
  }
  if (a.toeflReading || a.toeflListening || a.toeflSpeaking || a.toeflWriting) {
    const t = ["TOEFL"];
    if (a.toeflReading) t.push(`R:${a.toeflReading}`);
    if (a.toeflListening) t.push(`L:${a.toeflListening}`);
    if (a.toeflSpeaking) t.push(`S:${a.toeflSpeaking}`);
    if (a.toeflWriting) t.push(`W:${a.toeflWriting}`);
    const total = [a.toeflReading, a.toeflListening, a.toeflSpeaking, a.toeflWriting]
      .filter(Boolean).map(Number).reduce((s, n) => s + n, 0);
    if (total) t.push(`(Total: ${total}/120)`);
    parts.push(t.join(" "));
  }
  if (a.ieltsListening || a.ieltsReading || a.ieltsWriting || a.ieltsSpeaking) {
    const i = ["IELTS"];
    if (a.ieltsListening) i.push(`L:${a.ieltsListening}`);
    if (a.ieltsReading) i.push(`R:${a.ieltsReading}`);
    if (a.ieltsWriting) i.push(`W:${a.ieltsWriting}`);
    if (a.ieltsSpeaking) i.push(`S:${a.ieltsSpeaking}`);
    parts.push(i.join(" "));
  }

  if (a.englishTestScore) parts.push(a.englishTestScore);

  return parts.length > 0 ? parts.join(" | ") : "Not provided";
}

// ─── Helper: extract Q10-Q13 answers based on major ──────────────────────────
function getMajorSpecificAnswers(a: QuestionnaireAnswers, major: string): string {
  switch (major) {
    case "Business/Management":
      return `Leadership/Impact Moment (Q10): ${a.leadershipImpact || "Not provided"}

Analytical/Strategic Thinking (Q11): ${a.analyticalThinking || "Not provided"}

Cross-Functional Experience (Q12): ${a.crossFunctionalExperience || "Not provided"}

Industry Exposure (Q13): ${a.industryExposure || "Not provided"}`;

    case "Data/Tech/Quant":
      return `Technical Project (Q10): ${a.technicalProject || "Not provided"}

Applied Problem-Solving (Q11): ${a.appliedProblemSolving || "Not provided"}

Collaborative Technical Work (Q12): ${a.collaborativeTechnicalWork || "Not provided"}

Continuous Learning (Q13): ${a.continuousLearning || "Not provided"}`;

    case "Engineering":
      return `Design/Build Experience (Q10): ${a.designBuildExperience || "Not provided"}

Problem-Solving Methodology (Q11): ${a.problemSolvingMethodology || "Not provided"}

Real-World Application (Q12): ${a.realWorldApplication || "Not provided"}

Interdisciplinary Integration (Q13): ${a.interdisciplinaryIntegration || "Not provided"}`;

    case "Pure Sciences/Math":
      return `Research Experience (Q10): ${a.researchExperience || "Not provided"}

Abstract-to-Concrete Translation (Q11): ${a.abstractToConcreteTranslation || "Not provided"}

Collaborative Discovery (Q12): ${a.collaborativeDiscovery || "Not provided"}

Field Applications (Q13): ${a.fieldApplications || "Not provided"}`;

    default:
      return `Combined Skills Project (Q10): ${a.combinedSkillsProject || "Not provided"}

Cross-Discipline Methods (Q11): ${a.crossDisciplineMethods || "Not provided"}

Cross-Background Collaboration (Q12): ${a.crossBackgroundCollaboration || "Not provided"}

Unique Interdisciplinary Perspective (Q13): ${a.uniqueInterdisciplinaryPerspective || "Not provided"}`;
  }
}

// ─── Sanitizer: remove AI-isms that slip past the LLM ────────────────────────
function sanitize(text: string): string {
  return text
    .replace(/ [—–] /g, ", ")
    .replace(/([a-z])[—–]([A-Z])/g, "$1. $2")
    .replace(/[—–]/g, ", ");
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
  const anthropic = getClient();
  const majorCategory = getMajorCategory(answers, program, degreeType);
  const majorAnswers = getMajorSpecificAnswers(answers, majorCategory);

  const userPrompt = `Write a Statement of Purpose for ${studentName} applying to ${program} (${degreeType}) at ${university}.

MAJOR CATEGORY: ${majorCategory}

═══ STUDENT QUESTIONNAIRE RESPONSES ═══

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
${majorAnswers}

─── FUTURE & FIT ───
Unique Position (problem only they can solve): ${answers.uniquePosition}

Why This Specific Program (faculty, labs, courses, culture): ${answers.perfectAlignment}

5–10 Year Vision: ${answers.fiveYearVision}

Legacy Contribution: ${answers.legacyContribution}

─── ADDITIONAL INFORMATION ───
${answers.additionalInfo ? answers.additionalInfo : "None provided"}

═══════════════════════════════════════

INSTRUCTIONS:
• Apply the ${majorCategory} major-specific priorities from your guidelines.
• Select the 3–4 most powerful moments — do NOT mention every answer.
• The SOP should feel like one unified story, not a questionnaire answered in paragraph form.
• 800–1500 words. No headers. No bullet points. First person.`;

  const response = await anthropic.messages.create({
    model: GENERATION_MODEL,
    max_tokens: 3000,
    system: GENERATION_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.7,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const costUsd = calcCost(response.usage.input_tokens, response.usage.output_tokens);

  return { content: text, costUsd };
}

// ─── Pass 2: Fact-Check & Polish ─────────────────────────────────────────────
async function factCheck(
  draft: string,
  answers: QuestionnaireAnswers,
  university: string,
  program: string,
  studentName: string
): Promise<{ content: string; costUsd: number }> {
  const anthropic = getClient();

  const majorCategory = getMajorCategory(answers, program, "MS");
  const majorAnswers = getMajorSpecificAnswers(answers, majorCategory);

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
${majorAnswers}
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

  const response = await anthropic.messages.create({
    model: FACTCHECK_MODEL,
    max_tokens: 3000,
    system: FACTCHECK_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
    temperature: 0.3,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : draft;
  const costUsd = calcCost(response.usage.input_tokens, response.usage.output_tokens);

  return { content: text, costUsd };
}

// ─── Input Sanitizer (Sonnet — cheap/fast typo correction) ───────────────────
const SANITIZE_MODEL = "claude-sonnet-4-20250514";

export async function sanitizeStudentInputs(
  name: string,
  university: string,
  program: string
): Promise<{ name: string; university: string; program: string; costUsd: number }> {
  const anthropic = getClient();

  const response = await anthropic.messages.create({
    model: SANITIZE_MODEL,
    max_tokens: 200,
    temperature: 0,
    system: `You fix typos and capitalization in student form inputs. Return ONLY valid JSON with exactly three keys: "name", "university", "program". Fix obvious spelling errors (e.g. "Stanofrd" → "Stanford", "Harvrad" → "Harvard", "compter science" → "Computer Science"). Correct capitalization to proper title case. If the input looks correct, return it unchanged. No explanation, no markdown, just the JSON object.`,
    messages: [{
      role: "user",
      content: `{"name": ${JSON.stringify(name)}, "university": ${JSON.stringify(university)}, "program": ${JSON.stringify(program)}}`,
    }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cost = calcCost(response.usage.input_tokens, response.usage.output_tokens);

  try {
    const parsed = JSON.parse(text);
    return {
      name: parsed.name || name,
      university: parsed.university || university,
      program: parsed.program || program,
      costUsd: cost,
    };
  } catch {
    return { name, university, program, costUsd: cost };
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function generateSOP(
  answers: QuestionnaireAnswers,
  university: string,
  program: string,
  degreeType: string,
  studentName: string
): Promise<{ content: string; costUsd: number }> {
  const { content: draft, costUsd: cost1 } = await generateDraft(answers, university, program, degreeType, studentName);
  const { content: final, costUsd: cost2 } = await factCheck(draft, answers, university, program, studentName);

  return { content: sanitize(final), costUsd: cost1 + cost2 };
}
