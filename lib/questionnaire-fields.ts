export interface QuestionField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "select";
  required: boolean;
  options?: string[];
}

export interface QuestionStep {
  title: string;
  description: string;
  fields: QuestionField[];
}

export const questionnaireSteps: QuestionStep[] = [
  {
    title: "Personal Information",
    description: "Basic details so we can deliver your SOP and stay in touch.",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Aditya Sharma", type: "text", required: true },
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
        key: "degree_type",
        label: "Degree Type",
        placeholder: "Select degree type",
        type: "select",
        required: true,
        options: ["MS", "MBA", "PhD", "MA", "MFA", "MPH", "LLM", "MEng", "Other"],
      },
      { key: "englishTestScore", label: "English Test Score (GRE Verbal / GMAT Verbal / IELTS / TOEFL)", placeholder: "e.g. GRE Verbal 165, TOEFL 110", type: "text", required: true },
      { key: "programsApplying", label: "All Programs You Are Applying To", placeholder: "e.g. Stanford MS CS, MIT MS CS, CMU MS CS", type: "textarea", required: true },
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
      },
      {
        key: "intellectualDNA",
        label: "How do you naturally approach problems differently than others? Give a specific example",
        placeholder: "Describe your unique thinking style and a time it led to an unexpected solution or insight...",
        type: "textarea",
        required: true,
      },
      {
        key: "authenticContradiction",
        label: "What is the most surprising or unexpected combination about you that relates to your field?",
        placeholder: "What contradiction or unexpected pairing defines your unique perspective?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    title: "Curiosity & Growth",
    description: "What drives you intellectually and how you have evolved.",
    fields: [
      {
        key: "drivingQuestion",
        label: "What question about your field keeps you intellectually curious?",
        placeholder: "What genuinely puzzles you that drives your career decisions?",
        type: "textarea",
        required: true,
      },
      {
        key: "transformationFailure",
        label: "Describe a time you failed in something related to your field",
        placeholder: "What went wrong? How did it change your approach? What strength did you discover?",
        type: "textarea",
        required: true,
      },
      {
        key: "beliefShift",
        label: "What belief about yourself or your field did you have to abandon?",
        placeholder: "How did this shift change your trajectory?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    title: "Achievements & Leadership",
    description: "Your accomplishments and how you create impact.",
    fields: [
      {
        key: "surpriseAchievement",
        label: "When did you achieve something that shocked even you?",
        placeholder: "What did this reveal about your potential?",
        type: "textarea",
        required: true,
      },
      {
        key: "leadershipImpact",
        label: "Describe a situation where you led a team, managed a project, or created impact",
        placeholder: "Include numbers and outcomes if possible...",
        type: "textarea",
        required: true,
      },
      {
        key: "analyticalThinking",
        label: "Give an example where you used data or analysis to solve a problem or make a strategic decision",
        placeholder: "What tools or methods did you use?",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    title: "Experience & Positioning",
    description: "Your cross-functional experience and unique strengths.",
    fields: [
      {
        key: "crossFunctionalExperience",
        label: "How have you worked across different departments, functions, or disciplines?",
        placeholder: "What did this teach you about complexity in your field?",
        type: "textarea",
        required: true,
      },
      {
        key: "industryExposure",
        label: "What specific industry experience has shaped your understanding of your target career?",
        placeholder: "Internships, projects, competitions, work experience...",
        type: "textarea",
        required: true,
      },
      {
        key: "uniquePosition",
        label: "What problem in your field are you uniquely positioned to solve?",
        placeholder: "Because of your specific combination of experiences and perspectives...",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    title: "Vision & Program Fit",
    description: "Why this program and where you are heading.",
    fields: [
      {
        key: "perfectAlignment",
        label: "Why this specific program, at this specific school, right now?",
        placeholder: "Be specific about faculty, resources, culture, and opportunities that make this the ideal fit...",
        type: "textarea",
        required: true,
      },
      {
        key: "fiveYearVision",
        label: "Where do you see yourself in 5-10 years?",
        placeholder: "What specific impact do you want to make? How will you measure success?",
        type: "textarea",
        required: true,
      },
      {
        key: "legacyContribution",
        label: "What do you want to contribute to your field that was not there before?",
        placeholder: "What story do you want your career to tell?",
        type: "textarea",
        required: true,
      },
    ],
  },
];
