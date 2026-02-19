import OpenAI from "openai";
import type { QuestionnaireAnswers } from "./types";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  }
  return client;
}

const SYSTEM_PROMPT = `You are an expert Statement of Purpose (SOP) writer who has helped thousands of students gain admission to top universities worldwide, including all Ivy League schools, MIT, Stanford, and other elite institutions.

Your writing style is:
- Deeply personal and narrative-driven, not generic or template-like
- Sophisticated yet authentic — it reads like the student wrote it at their absolute best
- Strategically structured to showcase the applicant's unique value proposition
- Tailored to what specific admissions committees look for
- Compelling from the first sentence, with a strong hook
- Shows rather than tells — uses concrete anecdotes and specific details
- Connects past experiences to future goals through a coherent narrative thread
- Demonstrates genuine passion and intellectual curiosity
- Avoids clichés, buzzwords, and overused phrases

Structure guidelines:
1. Open with a compelling hook — a specific moment, question, or insight
2. Build the narrative through key experiences that shaped the applicant
3. Show intellectual growth and self-awareness
4. Connect experiences to the specific program and its unique offerings
5. End with a forward-looking vision that ties everything together

The SOP should be 800-1000 words unless otherwise specified. Write in first person. Make every sentence count.`;

export async function generateSOP(
  answers: QuestionnaireAnswers,
  university: string,
  program: string,
  degreeType: string,
  studentName: string
): Promise<string> {
  const openai = getClient();

  const userPrompt = `Write a Statement of Purpose for ${studentName} applying to ${program} (${degreeType}) at ${university}.

Here are their questionnaire responses:

**English Test Score:** ${answers.englishTestScore}

**Programs Applying For:** ${answers.programsApplying}

**Origin Story (formative moment):** ${answers.originStory}

**Intellectual DNA (unique problem-solving approach):** ${answers.intellectualDNA}

**Authentic Contradiction (unexpected combination):** ${answers.authenticContradiction}

**Driving Question (intellectual curiosity):** ${answers.drivingQuestion}

**Transformation Through Failure:** ${answers.transformationFailure}

**Belief Shift:** ${answers.beliefShift}

**Surprise Achievement:** ${answers.surpriseAchievement}

**Leadership/Impact Moment:** ${answers.leadershipImpact}

**Analytical/Strategic Thinking:** ${answers.analyticalThinking}

**Cross-Functional Experience:** ${answers.crossFunctionalExperience}

**Industry Exposure:** ${answers.industryExposure}

**Unique Position:** ${answers.uniquePosition}

**Why This Program (perfect alignment):** ${answers.perfectAlignment}

**5-10 Year Vision:** ${answers.fiveYearVision}

**Legacy Contribution:** ${answers.legacyContribution}

Write a compelling, deeply personal SOP that weaves these elements into a cohesive narrative. Do NOT use all answers mechanically — select and synthesize the most powerful elements to tell a unified story. The SOP should feel like the student's authentic voice at their most articulate.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content ?? "";
}
