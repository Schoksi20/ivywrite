export interface QuestionnaireAnswers {
  englishTestScore: string;
  programsApplying: string;
  originStory: string;
  intellectualDNA: string;
  authenticContradiction: string;
  drivingQuestion: string;
  transformationFailure: string;
  beliefShift: string;
  surpriseAchievement: string;
  leadershipImpact: string;
  analyticalThinking: string;
  crossFunctionalExperience: string;
  industryExposure: string;
  uniquePosition: string;
  perfectAlignment: string;
  fiveYearVision: string;
  legacyContribution: string;
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
}

export interface CreateOrderPayload {
  name: string;
  email: string;
  phone?: string;
  university: string;
  program: string;
  degree_type: string;
  questionnaire_answers: QuestionnaireAnswers;
}
