import Link from "next/link";

export function Hero() {
  return (
    <section className="pt-32 md:pt-40 pb-24 px-6 md:px-12 flex flex-col items-center text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_70%)] pointer-events-none" />

      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight max-w-4xl text-heading animate-fade-up">
        Your SOP. Written by{" "}
        <span className="text-accent">Ivy League</span> minds.
      </h1>

      <p className="text-lg md:text-xl text-body max-w-2xl leading-relaxed mt-6 animate-fade-up" style={{animationDelay: '0.1s', opacity: 0}}>
        Answer a few questions. A real Ivy League student writes your Statement
        of Purpose and sends it to your inbox within 72 hours. No consultancy. No
        fluff. Just a great SOP.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 animate-fade-up" style={{animationDelay: '0.2s', opacity: 0}}>
        <Link
          href="/questionnaire"
          className="bg-accent text-white text-base font-semibold px-8 py-3.5 rounded-lg hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
        >
          Start for &#8377;999
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <a
          href="#testimonials"
          className="text-heading text-base font-semibold px-8 py-3.5 rounded-lg border border-border2 hover:border-accent hover:bg-surface transition-colors inline-flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polygon points="6,4 12,8 6,12" fill="currentColor"/>
          </svg>
          See results
        </a>
      </div>
    </section>
  );
}
