import { AnimatedSection } from "./stats";

const steps = [
  {
    badge: "Step 01",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="var(--accent)" strokeWidth="1.7" />
        <path d="M7 8h8M7 11h6M7 14h4" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: "Answer smart questions",
    desc: "Fill in our structured questionnaire about your academic background, research experience, career goals, and target program. Takes about 15 minutes to complete.",
  },
  {
    badge: "Step 02",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
        <path d="M15.5 3.5a1 1 0 0 1 1.4 0l1.6 1.6a1 1 0 0 1 0 1.4L7 18H4v-3L15.5 3.5z" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.5 5.5l3 3" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    title: "An Ivy grad writes your story",
    desc: "A real writer admitted to Harvard, Yale, MIT, Stanford or another top program personally crafts your SOP. They know exactly what admissions committees want to read.",
  },
  {
    badge: "Step 03",
    icon: (
      <svg viewBox="0 0 22 22" fill="none" className="w-[22px] h-[22px]">
        <path d="M3 5.5h16v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5.5z" stroke="var(--accent)" strokeWidth="1.7" />
        <path d="M3 5.5l8 7 8-7" stroke="var(--accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "SOP lands in your inbox",
    desc: "Within 72 hours your polished, personalized Statement of Purpose arrives by email. Ready to submit. One free revision is included with every single order.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 bg-surface" id="how">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <div className="text-xs tracking-wider uppercase text-accent font-semibold mb-4">Process</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl text-heading">
            From blank page to <span className="text-accent">brilliant SOP</span> in 72 hours
          </h2>
        </AnimatedSection>

        <AnimatedSection className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-heading mb-3">{step.title}</h3>
                <p className="text-sm text-body leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
