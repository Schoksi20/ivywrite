const footerCols = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "Our writers", href: "#writers" },
      { label: "Pricing", href: "#cta" },
      { label: "Get a SOP", href: "/questionnaire" },
    ],
  },
  {
    title: "Students",
    links: [
      { label: "Success stories", href: "#testimonials" },
      { label: "FAQ", href: "#faq" },
      { label: "Free resources", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-6 md:px-12 pt-20 pb-10 bg-bg border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start pb-12 border-b border-border gap-12">
          <div>
            <div className="text-xl font-bold tracking-tight text-heading mb-3">
              ivy<span className="text-accent">write</span>
            </div>
            <div className="text-sm text-body max-w-xs leading-relaxed">
              SOPs written by Ivy League students. Delivered to your inbox in 72 hours.
            </div>
          </div>
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {footerCols.map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-semibold tracking-wider uppercase text-muted mb-4">{col.title}</h4>
                <ul className="list-none space-y-3">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="text-body text-sm hover:text-accent transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 text-sm text-muted gap-2">
          <span>&copy; {new Date().getFullYear()} ivywrite. All rights reserved.</span>
          <span>Built for serious applicants.</span>
        </div>
      </div>
    </footer>
  );
}
