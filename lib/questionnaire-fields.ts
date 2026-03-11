export interface QuestionField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select" | "number";
  required: boolean;
  options?: string[];
  maxWords?: number;
  max?: number;
  min?: number;
  hint?: { guidance: string; bullets?: string[]; example?: string };
}

export interface QuestionStep {
  title: string;
  description: string;
  fields: QuestionField[];
}

export type MajorCategory =
  | "business"
  | "data_tech"
  | "engineering"
  | "pure_sciences"
  | "interdisciplinary";

export const MAJOR_OPTIONS: { value: MajorCategory; label: string }[] = [
  { value: "business", label: "Business / Management (MBA, MS Finance, Marketing, Accounting, etc.)" },
  { value: "data_tech", label: "Data / Tech / Quant (Data Science, CS, AI, Statistics, etc.)" },
  { value: "engineering", label: "Engineering (Civil, Mechanical, Electrical, Biomedical, etc.)" },
  { value: "pure_sciences", label: "Pure Sciences / Math (Mathematics, Physics, Chemistry, Biology, etc.)" },
  { value: "interdisciplinary", label: "Other / Interdisciplinary" },
];

// ─── Universal steps (shown to everyone) ─────────────────────────────────────

export const universalStepsBefore: QuestionStep[] = [
  {
    title: "Personal Information",
    description: "Basic details so we can deliver your SOP and stay in touch.",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. A. Sharma", type: "text", required: true },
      { key: "email", label: "Email Address", placeholder: "you@example.com", type: "text", required: true },
      { key: "phone", label: "Phone Number (optional)", placeholder: "+91 98765 43210", type: "text", required: false },
    ],
  },
  {
    title: "Program Details",
    description: "Tell us about the program you are targeting.",
    fields: [
      { key: "university", label: "Target University", placeholder: "e.g. Stanford University", type: "text", required: true },
      { key: "program", label: "Program Name", placeholder: "e.g. MS Computer Science", type: "text", required: true },
      {
        key: "majorCategory",
        label: "Major Category",
        placeholder: "Select your major category",
        type: "select",
        required: true,
        options: MAJOR_OPTIONS.map((m) => m.value),
      },
    ],
  },
  {
    title: "Your Origin Story",
    description: "The experiences that shaped who you are.",
    fields: [
      {
        key: "originStory",
        label: "Describe ONE specific moment or experience that fundamentally shaped how you see your field",
        placeholder: "Include where you were, what you were doing, what others missed, and how it changed your perspective...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Think of a specific, cinematic scene. Your answer should cover:",
          bullets: [
            "Where were you? What were you doing?",
            "What did you see, hear, or feel that others might have missed?",
            "How did this moment change your perspective on your field?",
          ],
          example: '"I was eight years old, lying on the beach in Rameswaram, when I saw my first rocket streak across the night sky. While my friends saw just another light, I saw a bridge between our small fishing village and the infinite cosmos above. That moment planted a question that would drive my entire life: how can we harness the power of space to serve the humblest person on Earth? In that instant, I understood that technology wasn\'t just about advancement — it was about service."',
        },
      },
      {
        key: "intellectualDNA",
        label: "How do you naturally approach problems differently than others? Give a specific example",
        placeholder: "Describe your unique thinking style and a time it led to an unexpected solution or insight...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What is your natural thinking style? Do you see patterns, connections, or analogies others miss? Give a concrete example where this unique approach led to a breakthrough or unexpected solution.",
          example: '"I naturally see patterns where others see chaos, and poetry where others see equations. This perspective helped me solve the SLV-3\'s stability problem by recognizing that the rocket\'s oscillations followed the same harmonic patterns as Quranic verses about celestial motion."',
        },
      },
      {
        key: "authenticContradiction",
        label: "What is the most surprising or unexpected combination about you that relates to your field?",
        placeholder: "What contradiction or unexpected pairing defines your unique perspective?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What two sides of you seem contradictory on the surface but actually complement each other? This could be a background, belief, interest, or skill that people wouldn't expect given your field.",
          example: '"I am a deeply religious man who builds missiles, a village boy who leads space programs. This contradiction \u2014 spiritual seeker and technical innovator \u2014 allows me to see technology as divine service rather than mere human ambition."',
        },
      },
    ],
  },
  {
    title: "Curiosity, Growth & Achievement",
    description: "What drives you intellectually, how you have evolved through failure, and a moment that revealed your potential.",
    fields: [
      {
        key: "drivingQuestion",
        label: "What question about your field keeps you intellectually curious?",
        placeholder: "What genuinely puzzles you that drives your career decisions?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What is the one question or problem in your field that you keep coming back to? Something that genuinely puzzles you and influences the decisions you make in your career.",
          example: '"The question that haunts me is: Why should advanced technology remain the privilege of wealthy nations when it could solve poverty, disease, and ignorance everywhere? This drives every decision I make."',
        },
      },
      {
        key: "transformationFailure",
        label: "Describe a time you failed in something related to your field",
        placeholder: "What went wrong? How did it change your approach? What strength did you discover?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Pick a real failure, not a disguised success. Your answer should cover:",
          bullets: [
            "What went wrong?",
            "How did it change your approach?",
            "What strength did you discover through the failure?",
          ],
          example: '"When the SLV-3\'s first launch failed in 1979, I watched months of work explode in flames on national television. Standing in the debris field at Sriharikota, facing my devastated team and disappointed nation, I had a choice: blame circumstances or take responsibility. I gathered my engineers not for recriminations, but for learning. That failure taught me that leadership isn\'t about perfection — it\'s about transforming collective setbacks into individual resilience."',
        },
      },
      {
        key: "beliefShift",
        label: "What belief about yourself or your field did you have to abandon?",
        placeholder: "How did this shift change your trajectory?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Think of a conviction you once held strongly that turned out to be wrong or incomplete. What experience shattered it? How did letting go of that belief redirect your path?",
          example: '"I once believed that technical excellence alone would guarantee project success. The repeated early failures of our missile program shattered this illusion. I learned that managing people\'s emotions and motivations was as crucial as managing technical specifications."',
        },
      },
      {
        key: "surpriseAchievement",
        label: "When did you achieve something that shocked even you?",
        placeholder: "What did this reveal about your potential?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Think of a moment where the outcome exceeded your own expectations. Not just \"I worked hard and succeeded\" but a genuine surprise that revealed a capability you didn't know you had.",
          example: '"When I successfully led India\'s nuclear tests in 1998, I surprised myself not with the technical achievement, but with my ability to coordinate such a complex, secretive operation. A village boy who once struggled with English was now briefing Prime Ministers on national security."',
        },
      },
    ],
  },
];

// ─── Major-specific steps (Q10-Q13) ──────────────────────────────────────────

export const majorSpecificSteps: Record<MajorCategory, QuestionStep> = {
  business: {
    title: "Business & Management Experience",
    description: "Your leadership, analytical, and cross-functional experiences.",
    fields: [
      {
        key: "leadershipImpact",
        label: "Describe a specific situation where you led a team, managed a project, or created business impact",
        placeholder: "Include numbers and outcomes if possible (revenue generated, cost saved, people managed, % improvement)...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Be specific. Your answer should include:",
          bullets: [
            "What was the project or situation?",
            "How many people were involved and what was your role?",
            "What was the measurable outcome? (revenue, cost saved, % improvement, people impacted)",
          ],
          example: '"When AIB was struggling with declining YouTube revenue in 2017, I led our pivot to live comedy shows and brand partnerships. I assembled a team of 8 people across content, marketing, and operations to launch our first nationwide tour. The tour sold 15,000 tickets and generated \u20B92.5 crores in revenue, proving that digital creators could successfully monetize offline experiences."',
        },
      },
      {
        key: "analyticalThinking",
        label: "Give an example where you used data or analysis to solve a business problem or make a strategic decision",
        placeholder: "What tools or methods did you use?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What data did you look at? What insight did the analysis reveal? What action did you take, and what was the result? Mention specific tools if relevant (Excel, SQL, Tableau, etc.).",
          example: '"I analyzed 18 months of analytics data and discovered our 20-minute sketches had 40% higher drop-off rates than 8-minute videos. I shifted strategy to mobile-optimized content, increasing average view duration by 35% within six months."',
        },
      },
      {
        key: "crossFunctionalExperience",
        label: "How have you worked across different departments, functions, or disciplines?",
        placeholder: "What did this teach you about business complexity?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Think about times you had to coordinate between groups with different priorities. How did you translate between their \"languages\" and find common ground?",
        },
      },
      {
        key: "industryExposure",
        label: "What specific industry experience has shaped your understanding of your target career track?",
        placeholder: "Internships, projects, competitions, work experience...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What hands-on experience gave you insight into how your target industry actually works? What did you learn that you couldn't have learned in a classroom?",
        },
      },
    ],
  },
  data_tech: {
    title: "Data, Tech & Quant Experience",
    description: "Your technical projects, problem-solving, and continuous learning.",
    fields: [
      {
        key: "technicalProject",
        label: "Describe your most impactful technical project",
        placeholder: "What problem did you solve? What tools/languages did you use? What were the measurable results?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "State the problem clearly, then describe your approach: what tools/languages/frameworks you used, and what the measurable result was (accuracy %, speed improvement, users served, etc.).",
        },
      },
      {
        key: "appliedProblemSolving",
        label: "Give an example where you used your technical skills to solve a real-world problem (not just academic)",
        placeholder: "What was your methodology?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "This should be different from your technical project above. Focus on a real-world problem (not a class assignment) and walk through your step-by-step methodology.",
        },
      },
      {
        key: "collaborativeTechnicalWork",
        label: "How have you worked with non-technical stakeholders or interdisciplinary teams?",
        placeholder: "How do you bridge technical and business needs?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Think about times you had to explain technical concepts to non-technical people, or work with designers, product managers, or business teams. How do you communicate across that gap?",
        },
      },
      {
        key: "continuousLearning",
        label: "How do you stay current with rapidly evolving technology?",
        placeholder: "What new skills or tools have you recently mastered and why?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What's a specific new technology, framework, or technique you taught yourself recently? Why did you choose it, and how did you go about learning it?",
        },
      },
    ],
  },
  engineering: {
    title: "Engineering Experience",
    description: "Your design, build, and problem-solving experiences.",
    fields: [
      {
        key: "designBuildExperience",
        label: "Describe a specific engineering project where you designed or built something tangible",
        placeholder: "What constraints did you work within? What was the impact?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Focus on a project with real-world constraints (budget, materials, time, safety). What did you design or build, what trade-offs did you make, and what was the measurable impact?" },
      },
      {
        key: "problemSolvingMethodology",
        label: "Give an example of a complex technical problem you solved",
        placeholder: "Walk through your systematic approach and the engineering principles you applied...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Walk through your process: identify root cause, test hypotheses, implement solution, measure result. Quantify the improvement (accuracy %, efficiency gain, cost reduced, etc.)." },
      },
      {
        key: "realWorldApplication",
        label: "How have you applied engineering concepts outside the classroom?",
        placeholder: "Internships, co-ops, research... What practical challenges did you encounter?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Think internships, co-ops, research labs, or personal projects. What practical challenges did you face that textbooks didn't prepare you for?" },
      },
      {
        key: "interdisciplinaryIntegration",
        label: "How have you combined engineering with other fields (business, medicine, environment, etc.)?",
        placeholder: "What unique perspective does this give you?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Engineering doesn't exist in a vacuum. How has your work intersected with medicine, business, sustainability, policy, or another domain? What insight did that intersection produce?" },
      },
    ],
  },
  pure_sciences: {
    title: "Sciences & Math Experience",
    description: "Your research, theoretical work, and collaborative discoveries.",
    fields: [
      {
        key: "researchExperience",
        label: "Describe your most significant research project or mathematical investigation",
        placeholder: "What question were you exploring? What methods did you use?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Lead with the research question that excites you most. What methods did you use? What did you discover or contribute? Highlight your unique intellectual contribution, not just \"I was part of a team.\"" },
      },
      {
        key: "abstractToConcreteTranslation",
        label: "Give an example where you applied theoretical concepts to solve practical problems or explained complex ideas to non-experts",
        placeholder: "How did you bridge the gap between abstract and practical?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "How do you make the abstract tangible? Think of a time you used analogies, visualizations, or real-world examples to make a complex idea accessible." },
      },
      {
        key: "collaborativeDiscovery",
        label: "How have you worked with others in research or academic settings?",
        placeholder: "What role do you typically play in collaborative intellectual work?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "What role do you naturally take in intellectual collaboration? The question-asker, the synthesizer, the methodologist? Give a specific example." },
      },
      {
        key: "fieldApplications",
        label: "How do you see your theoretical knowledge connecting to real-world applications or other disciplines?",
        placeholder: "What practical impact could your work have?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Connect your theoretical work to the real world. What technologies, industries, or problems could benefit from your expertise? Be specific." },
      },
    ],
  },
  interdisciplinary: {
    title: "Interdisciplinary Experience",
    description: "Your cross-disciplinary projects, methods, and perspectives.",
    fields: [
      {
        key: "combinedSkillsProject",
        label: "Describe a project where you combined skills or knowledge from multiple fields",
        placeholder: "What was the challenge, and what was the outcome?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Think of a time when your unusual combination of skills gave you an advantage. What fields did you bridge, and what was the result?" },
      },
      {
        key: "crossDisciplineMethods",
        label: "Give an example of how you applied methods from one discipline to solve a problem in another",
        placeholder: "What insight did this cross-pollination produce?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "Describe a specific transfer of methodology across fields. What technique or framework from field A did you apply to field B, and what unexpected insight emerged?" },
      },
      {
        key: "crossBackgroundCollaboration",
        label: "How have you collaborated with peers or mentors from different backgrounds?",
        placeholder: "What did you learn about bridging fields?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "What did you learn from working with people who think very differently than you? How do you communicate across disciplinary boundaries?" },
      },
      {
        key: "uniqueInterdisciplinaryPerspective",
        label: "What unique perspective do you bring because of your interdisciplinary background?",
        placeholder: "How does it prepare you for graduate study?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: { guidance: "What can you see that someone from a single discipline cannot? How does your cross-cutting background uniquely prepare you for the program you're applying to?" },
      },
    ],
  },
};

// ─── Universal steps after major-specific (shown to everyone) ────────────────

export const universalStepsAfter: QuestionStep[] = [
  {
    title: "Vision & Program Fit",
    description: "Why this program and where you are heading.",
    fields: [
      {
        key: "uniquePosition",
        label: "What problem in your field are you uniquely positioned to solve?",
        placeholder: "Because of your specific combination of experiences and perspectives...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "What specific problem can you tackle better than most people, precisely because of your unusual combination of experiences? This is where your whole story comes together.",
          example: '"Growing up in poverty while mastering advanced aerospace technology gives me a unique perspective: I understand both the technical possibilities of space science and the urgent needs of villages without electricity."',
        },
      },
      {
        key: "perfectAlignment",
        label: "Why this specific program, at this specific school, right now?",
        placeholder: "Be specific about faculty, resources, culture, and opportunities that make this the ideal fit...",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Show that you've done deep research. Be specific about:",
          bullets: [
            "Specific faculty members whose work aligns with yours",
            "Labs, research centers, or resources you want to use",
            "Courses or curriculum elements that match your goals",
            "The program's culture or values that resonate with you",
          ],
          example: '"MIT\'s aerospace program offers the perfect convergence of my scientific needs and humanitarian goals. Professor [Name]\'s work on propulsion efficiency directly relates to my interest in cost-effective space access for developing nations. The Lincoln Laboratory\'s experience in translating research into practical applications matches my philosophy of making technology serve society."',
        },
      },
      {
        key: "fiveYearVision",
        label: "Where do you see yourself in 5-10 years?",
        placeholder: "What specific impact do you want to make? How will you measure success?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Be concrete, not vague. Your vision should include:",
          bullets: [
            "What specific role or position do you see yourself in?",
            "What measurable impact do you want to create?",
            "How will you know you've succeeded?",
          ],
          example: '"In 10 years, I want to lead India\'s first successful satellite launch using entirely indigenous technology, proving that developing nations can achieve space capabilities independently. I\'ll measure success not just by technical milestones, but by how many rural schools gain access to satellite-based education and how many farmers benefit from space-based weather prediction."',
        },
      },
      {
        key: "legacyContribution",
        label: "What do you want to contribute to your field that was not there before?",
        placeholder: "What story do you want your career to tell?",
        type: "textarea",
        required: true,
        maxWords: 500,
        hint: {
          guidance: "Think beyond job titles. What gap in your field do you want to fill? What would be different about the world because of your work?",
          example: '"I want to be remembered as the scientist who proved that the most advanced technology can serve the most basic human needs."',
        },
      },
      {
        key: "additionalInfo",
        label: "Is there any other relevant information you would like to share? (optional)",
        placeholder: "Anything else that might help us write a stronger, more personalised SOP — awards, publications, extracurriculars, context behind a gap year, etc.",
        type: "textarea",
        required: false,
        maxWords: 500,
      },
    ],
  },
];

// ─── Test score field definitions (rendered as a custom section) ──────────────

export interface TestScoreGroup {
  heading: string;
  fields: { key: string; label: string; max: number }[];
}

export const testScoreGroups: TestScoreGroup[] = [
  {
    heading: "GRE",
    fields: [
      { key: "greVerbal", label: "Verbal", max: 170 },
      { key: "greQuant", label: "Quant", max: 170 },
    ],
  },
  {
    heading: "TOEFL",
    fields: [
      { key: "toeflReading", label: "Reading", max: 30 },
      { key: "toeflListening", label: "Listening", max: 30 },
      { key: "toeflSpeaking", label: "Speaking", max: 30 },
      { key: "toeflWriting", label: "Writing", max: 30 },
    ],
  },
  {
    heading: "IELTS",
    fields: [
      { key: "ieltsListening", label: "Listening", max: 9 },
      { key: "ieltsReading", label: "Reading", max: 9 },
      { key: "ieltsWriting", label: "Writing", max: 9 },
      { key: "ieltsSpeaking", label: "Speaking", max: 9 },
    ],
  },
];

// ─── Helper: build the full steps array given a major selection ───────────────

export function buildSteps(majorCategory: MajorCategory | ""): QuestionStep[] {
  const majorStep = majorCategory ? majorSpecificSteps[majorCategory] : null;
  return [
    ...universalStepsBefore,
    ...(majorStep ? [majorStep] : []),
    ...universalStepsAfter,
  ];
}
