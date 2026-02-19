"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { questionnaireSteps } from "@/lib/questionnaire-fields";

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

function clearDraft() {
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

  const currentStep = questionnaireSteps[step];
  const totalSteps = questionnaireSteps.length;

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
    clearDraft();
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
      const { name, email, phone, university, program, degree_type, ...answers } = formData;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || null,
          university,
          program,
          degree_type,
          questionnaire_answers: answers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      const { orderId } = await res.json();
      clearDraft();
      router.push(`/payment?orderId=${orderId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const hasAnyData = Object.values(formData).some((v) => v.trim());

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
            <span className="text-sm text-muted">
              Step {step + 1} of {totalSteps}
            </span>
          </div>
        </div>
        {/* Progress bar */}
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
              {submitting ? "Submitting..." : "Submit & Pay \u20B9999"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
