const universities = [
  "Harvard University", "MIT", "Yale University", "Stanford University",
  "Princeton University", "Columbia University", "University of Chicago",
  "Wharton (UPenn)", "Cornell University", "Dartmouth College",
  "Northwestern University", "UC Berkeley", "Duke University",
  "Johns Hopkins", "Kellogg (Northwestern)", "UC San Diego", "UT Austin", "CMU",
];

export function Announce() {
  return (
    <div className="mt-16 bg-accent/5 border-y border-accent/10 py-3 px-5 flex items-center justify-center gap-3 text-sm text-heading">
      <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_rgba(99,102,241,0.5)] shrink-0 animate-pulse-dot" />
      <span>2,400+ students used ivywrite to get into their dream schools.</span>
      <a href="#testimonials" className="text-accent font-semibold hover:underline transition-colors">
        See real admits &rarr;
      </a>
    </div>
  );
}

export function Scroller() {
  const doubled = [...universities, ...universities];

  return (
    <div className="bg-surface border-t border-b border-border overflow-hidden py-6">
      <div className="text-center text-xs tracking-wider uppercase text-muted font-semibold pb-4">
        Students used ivywrite to get into
      </div>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee">
          {doubled.map((uni, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-8 text-sm font-medium text-body whitespace-nowrap cursor-default hover:text-accent transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
              {uni}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
