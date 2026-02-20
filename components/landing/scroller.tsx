const universities = [
  { name: "Harvard University", domain: "harvard.edu" },
  { name: "MIT", domain: "mit.edu" },
  { name: "Yale University", domain: "yale.edu" },
  { name: "Stanford University", domain: "stanford.edu" },
  { name: "Princeton University", domain: "princeton.edu" },
  { name: "Columbia University", domain: "columbia.edu" },
  { name: "University of Chicago", domain: "uchicago.edu" },
  { name: "Wharton (UPenn)", domain: "upenn.edu" },
  { name: "Cornell University", domain: "cornell.edu" },
  { name: "Dartmouth College", domain: "dartmouth.edu" },
  { name: "Northwestern University", domain: "northwestern.edu" },
  { name: "UC Berkeley", domain: "berkeley.edu" },
  { name: "Duke University", domain: "duke.edu" },
  { name: "Johns Hopkins", domain: "jhu.edu" },
  { name: "Kellogg (Northwestern)", domain: "kellogg.northwestern.edu" },
  { name: "UC San Diego", domain: "ucsd.edu" },
  { name: "UT Austin", domain: "utexas.edu" },
  { name: "CMU", domain: "cmu.edu" },
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
              className="flex items-center gap-2.5 px-8 text-sm font-medium text-body whitespace-nowrap cursor-default hover:text-accent transition-colors"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${uni.domain}&sz=32`}
                alt={uni.name}
                width={18}
                height={18}
                className="rounded-sm shrink-0"
              />
              {uni.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
