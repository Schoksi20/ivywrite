export interface QuestionnaireAnswers {
  // Test scores (structured)
  greVerbal?: string;
  greQuant?: string;
  toeflReading?: string;
  toeflListening?: string;
  toeflSpeaking?: string;
  toeflWriting?: string;
  ieltsListening?: string;
  ieltsReading?: string;
  ieltsWriting?: string;
  ieltsSpeaking?: string;

  // Major category selection
  majorCategory?: string;
  programsApplying: string;

  // Universal identity questions
  originStory: string;
  intellectualDNA: string;
  authenticContradiction: string;
  drivingQuestion: string;
  transformationFailure: string;
  beliefShift: string;
  surpriseAchievement: string;

  // Business/Management Q10-Q13
  leadershipImpact?: string;
  analyticalThinking?: string;
  crossFunctionalExperience?: string;
  industryExposure?: string;

  // Data/Tech/Quant Q10-Q13
  technicalProject?: string;
  appliedProblemSolving?: string;
  collaborativeTechnicalWork?: string;
  continuousLearning?: string;

  // Engineering Q10-Q13
  designBuildExperience?: string;
  problemSolvingMethodology?: string;
  realWorldApplication?: string;
  interdisciplinaryIntegration?: string;

  // Pure Sciences/Math Q10-Q13
  researchExperience?: string;
  abstractToConcreteTranslation?: string;
  collaborativeDiscovery?: string;
  fieldApplications?: string;

  // Interdisciplinary Q10-Q13
  combinedSkillsProject?: string;
  crossDisciplineMethods?: string;
  crossBackgroundCollaboration?: string;
  uniqueInterdisciplinaryPerspective?: string;

  // Universal future & fit
  uniquePosition: string;
  perfectAlignment: string;
  fiveYearVision: string;
  legacyContribution: string;
  additionalInfo?: string;

  // Legacy single-field score (kept for backward compat with old orders)
  englishTestScore?: string;
}

export type PaymentStatus = "pending" | "paid" | "failed";

export type SopStatus =
  | "awaiting_payment"
  | "paid"
  | "generating"
  | "delivered"
  | "revision_requested"
  | "revision_delivered";

export interface Order {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  university: string;
  program: string;
  degree_type: string;
  questionnaire_answers: QuestionnaireAnswers;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_status: PaymentStatus;
  amount_paid: number | null;
  sop_status: SopStatus;
  sop_content: string | null;
  sop_generated_at: string | null;
  sop_delivered_at: string | null;
  admin_notes: string | null;
  coupon_code: string | null;
  discount_amount: number | null;
  generation_cost_usd: number | null;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CreateOrderPayload {
  name: string;
  email: string;
  phone?: string;
  university: string;
  program: string;
  degree_type?: string;
  questionnaire_answers: QuestionnaireAnswers;
}
