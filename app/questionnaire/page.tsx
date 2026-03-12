"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  buildSteps,
  MAJOR_OPTIONS,
  type MajorCategory,
} from "@/lib/questionnaire-fields";
import { HintTooltip } from "@/components/ui/hint-tooltip";

const STORAGE_KEY = "ivywrite_draft";

function loadDraft(): { formData: Record<string, string>; step: number } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.formData === "object" && typeof parsed.step === "number") {
      return parsed;
    }
  } catch {}
  return null;
}

function saveDraft(formData: Record<string, string>, step: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ formData, step }));
  } catch {}
}

function clearDraftStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setFormData(draft.formData);
      setStep(draft.step);
      setRestored(true);
    }
  }, []);

  const persistDraft = useCallback(
    (data: Record<string, string>, s: number) => {
      saveDraft(data, s);
      setSaved(true);
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    },
    []
  );

  const majorCategory = (formData.majorCategory || "") as MajorCategory | "";
  const steps = useMemo(() => buildSteps(majorCategory), [majorCategory]);
  const totalSteps = steps.length;
  const currentStep = steps[step] || steps[0];

  function handleChange(key: string, value: string) {
    const next = { ...formData, [key]: value };
    setFormData(next);
    persistDraft(next, step);
    if (errors[key]) {
      setErrors((prev) => {
        const e = { ...prev };
        delete e[key];
        return e;
      });
    }
  }

  function validateStep(): boolean {
    const newErrors: Record<string, string> = {};

    for (const field of currentStep.fields) {
      if (field.required && !formData[field.key]?.trim()) {
        newErrors[field.key] = "This field is required";
      }
      if (field.key === "email" && formData[field.key]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.key])) {
          newErrors[field.key] = "Please enter a valid email address";
        }
      }
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (!validateStep()) return;
    const nextStep = step + 1;
    if (nextStep < totalSteps) {
      setStep(nextStep);
      persistDraft(formData, nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      persistDraft(formData, prevStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleClearDraft() {
    clearDraftStorage();
    setFormData({});
    setStep(0);
    setErrors({});
    setRestored(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);

    try {
      const { name, email, phone, university, program, ...answers } = formData;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          university,
          program,
          degree_type: "MS",
          questionnaire_answers: answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      const { orderId } = await res.json();
      clearDraftStorage();
      router.push(`/payment?orderId=${orderId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const hasAnyData = Object.values(formData).some((v) => v.trim());

  // DEV ONLY: auto-fill all fields except personal info (Step 1)
  function devAutoFill() {
    const sample: Record<string, string> = {
      university: "MIT",
      program: "MS Computer Science",
      majorCategory: "data_tech",
      originStory: "During my second year internship at a fintech startup in Bangalore, I was tasked with debugging a recommendation engine that had been underperforming for months. The senior engineers had focused on tuning model hyperparameters, but I noticed something everyone else had missed: the training data pipeline was silently dropping 15% of transactions from a specific payment gateway due to a timezone mismatch. Fixing that single upstream issue improved model accuracy more than six months of algorithmic tuning. That moment fundamentally changed how I see computer science. I realized the most impactful work often isn't about building smarter models but about understanding the messy, real-world systems that feed them.",
      intellectualDNA: "I approach problems by working backwards from the data infrastructure rather than the algorithm. When my team was struggling to improve our fraud detection system, everyone was experimenting with more complex neural architectures. I instead mapped the entire data lineage from source to model input and discovered we were losing critical temporal features during our batch processing step. By switching to a streaming pipeline, we improved detection rates by 23% without changing the model at all. My instinct is always to question the plumbing before upgrading the fixtures.",
      authenticContradiction: "I am a competitive classical pianist who builds machine learning systems. Music taught me that the most technically perfect performance can still feel lifeless if it lacks interpretation, and this shapes how I think about AI. I don't just optimize for accuracy metrics. I obsess over whether the system's outputs make intuitive sense to the humans who use them. This combination of artistic sensibility and engineering rigor is unusual in ML, but it's why my user-facing models consistently score higher on qualitative feedback than technically superior alternatives.",
      drivingQuestion: "The question that keeps me up at night is: why do ML systems that perform brilliantly on benchmarks so often fail catastrophically in production? I've seen this pattern repeatedly. A model achieves state-of-the-art results in the lab, gets deployed, and within weeks starts producing absurd outputs because the real-world data distribution shifted in ways the training set never captured. I'm obsessed with closing this gap between research performance and production reliability.",
      transformationFailure: "In my junior year, I led a team of four to build an automated grading system for our university's programming assignments. I was so focused on the NLP model for parsing code comments that I completely neglected the infrastructure. On demo day, the system crashed under load because I had designed it for single-user testing, not the 200 concurrent submissions we received. The professor gave us a failing grade. That failure taught me that engineering isn't just about the clever algorithm. It's about building systems that work reliably at scale. Since then, I design for production constraints from day one, not as an afterthought.",
      beliefShift: "I used to believe that the best engineers were those who could write the most elegant code. I spent hours refactoring functions to be shorter and more clever. Then I joined a production team where my beautifully abstracted code was nearly impossible for others to debug at 3 AM during an outage. My tech lead told me: 'Clever code is a liability. Boring, obvious code keeps systems alive.' I abandoned my pursuit of elegance in favor of clarity, and it made me a dramatically better engineer. Now I optimize for readability and debuggability over cleverness.",
      surpriseAchievement: "At a hackathon organized by Google in Hyderabad, I built a real-time sign language translator using my phone's camera and a lightweight TensorFlow model in 36 hours. I expected to place somewhere in the middle. Instead, we won first place out of 120 teams, and a Google engineer asked to feature our approach in an internal tech talk. What surprised me wasn't the win but the feedback: the judges said our solution was the only one that felt like a real product rather than a demo. That revealed that my strength isn't just technical. It's the ability to think about end-user experience even under extreme time pressure.",
      technicalProject: "I built a distributed anomaly detection system for monitoring microservices at my internship. The existing solution used static thresholds that generated hundreds of false alerts daily. I implemented an LSTM-based approach that learned each service's normal behavior patterns and flagged true anomalies with 94% precision, reducing false alerts by 78%. Built with Python, PyTorch, Apache Kafka for real-time streaming, and Grafana for visualization. The system monitored 40+ services processing 2M events per hour and was adopted as the default monitoring tool across the engineering org.",
      appliedProblemSolving: "A local NGO working with farmers in Maharashtra approached our college asking for help predicting crop disease from leaf images. I built a mobile-first image classification pipeline using transfer learning on MobileNetV2, optimized for low-bandwidth conditions. The key challenge was that farmers had phones with limited storage and spotty internet. I quantized the model to run inference on-device and built an offline-first app that synced results when connectivity was available. The tool achieved 89% accuracy and was piloted across 50 farms.",
      collaborativeTechnicalWork: "During my internship, I worked closely with the product and business teams to redesign our customer churn prediction pipeline. The data science team had built a model with 91% AUC, but the business team couldn't act on it because the predictions came as raw probability scores with no explanation. I bridged this gap by integrating SHAP values into the output and building a dashboard that showed the top 3 reasons each customer was likely to churn in plain language. Customer success managers could finally use the model, and intervention rates increased by 40%.",
      continuousLearning: "Over the past year, I taught myself Rust specifically to contribute to the Polars dataframe library, because I was frustrated with pandas performance on large datasets at work. I started by reading the Rust Book cover to cover, then worked through the library's codebase, and eventually submitted two merged pull requests improving string parsing performance. This wasn't required by anyone. I did it because I believe the future of data tooling is in compiled languages, and I wanted to understand that future from the inside rather than reading about it.",
      uniquePosition: "My combination of production ML engineering experience, deep interest in data infrastructure, and user-empathy from my design background positions me uniquely to work on the reliability gap between ML research and deployment. Most ML researchers have never operated a model in production. Most MLOps engineers don't deeply understand model internals. I sit at the intersection, having built models from scratch and also been paged at 2 AM when they failed in production.",
      perfectAlignment: "MIT CSAIL's Machine Learning Systems group under Professor Song Han directly addresses my core interest in making ML models production-ready. His work on efficient inference and model compression aligns with my experience building lightweight models for resource-constrained environments. The MIT SuperCloud infrastructure would let me experiment at scales impossible in industry internships. Beyond the lab, MIT's culture of building things that work, embodied in the motto 'Mens et Manus', matches my conviction that the best research solves real problems.",
      fiveYearVision: "In 5 years, I want to be leading the ML platform team at a company building AI for healthcare diagnostics, specifically ensuring that models trained on Western hospital data perform reliably when deployed in Indian district hospitals where data quality, equipment, and patient demographics are fundamentally different. In 10 years, I want to have built and open-sourced a framework that makes production ML reliability as standard as unit testing is for software. I'll measure success by adoption: if ML teams at 100+ companies use the tools I build, I'll know I've moved the needle.",
      legacyContribution: "I want to build the 'testing infrastructure' layer for machine learning that the field currently lacks. Software engineering has decades of established practices for testing, monitoring, and debugging. ML has almost nothing comparable. I want my career to tell the story of someone who helped make ML engineering as rigorous and reliable as traditional software engineering, so that AI systems can be trusted in domains where failure isn't an option: medicine, transportation, and public safety.",
      additionalInfo: "Published a paper at a regional ACM conference on efficient data augmentation techniques for low-resource NLP tasks. Active open-source contributor to the Hugging Face Transformers library with 3 merged PRs. Volunteer CS instructor at a coding bootcamp for underprivileged students in Pune.",
    };
    setFormData((prev) => {
      const merged = { ...prev };
      for (const [key, value] of Object.entries(sample)) {
        if (!merged[key]?.trim()) merged[key] = value;
      }
      persistDraft(merged, step);
      return merged;
    });
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-bg/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-[17px] font-extrabold tracking-tight text-heading">
            ivy<span className="text-accent">write</span>
          </Link>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="text-[11px] text-accent font-medium animate-fade-up">
                Draft saved
              </span>
            )}
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={devAutoFill}
                className="text-[10px] text-muted2 hover:text-accent border border-border rounded px-2 py-0.5 transition-colors"
              >
                Auto-fill
              </button>
            )}
            <span className="text-sm text-muted">
              Step {step + 1} of {totalSteps}
            </span>
          </div>
        </div>
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Restored banner */}
      {restored && (
        <div className="max-w-2xl mx-auto px-5 mt-6">
          <div className="bg-accent-dim border border-accent-mid rounded-lg px-4 py-3 flex items-center justify-between gap-4">
            <p className="text-xs text-accent font-medium">
              We restored your previous draft. Pick up where you left off.
            </p>
            <button
              onClick={() => setRestored(false)}
              className="text-accent/60 hover:text-accent text-xs shrink-0"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="mb-8">
          <div className="text-[11px] tracking-[2.5px] uppercase text-accent font-bold mb-2">
            {currentStep.title}
          </div>
          <p className="text-sm text-muted">{currentStep.description}</p>
        </div>

        <div className="space-y-6">
          {currentStep.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-semibold text-heading mb-2">
                {field.label}
                {field.required && <span className="text-accent ml-1">*</span>}
                {field.hint && <HintTooltip guidance={field.hint.guidance} bullets={field.hint.bullets} example={field.hint.example} />}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={5}
                  className={`w-full bg-card border rounded-lg px-4 py-3 text-sm text-heading placeholder:text-muted2 outline-none transition-colors resize-y min-h-[120px] ${
                    errors[field.key]
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-accent"
                  }`}
                />
              ) : field.type === "select" ? (
                field.key === "majorCategory" ? (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={`w-full bg-card border rounded-lg px-4 py-3 text-sm text-heading outline-none transition-colors ${
                      errors[field.key]
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-accent"
                    }`}
                  >
                    <option value="">Select your major category</option>
                    {MAJOR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={formData[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className={`w-full bg-card border rounded-lg px-4 py-3 text-sm text-heading outline-none transition-colors ${
                      errors[field.key]
                        ? "border-red-500 focus:border-red-500"
                        : "border-border focus:border-accent"
                    }`}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )
              ) : (
                <input
                  type={field.key === "email" ? "email" : "text"}
                  value={formData[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full bg-card border rounded-lg px-4 py-3 text-sm text-heading placeholder:text-muted2 outline-none transition-colors ${
                    errors[field.key]
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-accent"
                  }`}
                />
              )}

              {errors[field.key] && (
                <p className="text-red-500 text-xs mt-1.5">{errors[field.key]}</p>
              )}
            </div>
          ))}

        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className="text-sm font-medium text-muted hover:text-heading disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Back
            </button>
            {hasAnyData && (
              <button
                onClick={handleClearDraft}
                className="text-xs text-muted2 hover:text-red-500 transition-colors"
              >
                Clear draft
              </button>
            )}
          </div>

          {step < totalSteps - 1 ? (
            <button
              onClick={handleNext}
              className="bg-accent text-white dark:text-black text-sm font-bold px-8 py-3 rounded-lg hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all"
            >
              Continue &rarr;
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-accent text-white dark:text-black text-sm font-bold px-8 py-3 rounded-lg hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit & Pay \u20B91,499"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
