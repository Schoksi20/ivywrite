"use client";

import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-bg/80 backdrop-blur-xl border-b border-border">
      <Link href="/" className="text-xl font-bold tracking-tight text-heading">
        ivy<span className="text-accent">write</span>
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <a href="#how" className="text-body text-sm font-medium hover:text-heading transition-colors">
            How it works
          </a>
        </li>
        <li>
          <a href="#writers" className="text-body text-sm font-medium hover:text-heading transition-colors">
            Our writers
          </a>
        </li>
        <li>
          <a href="#testimonials" className="text-body text-sm font-medium hover:text-heading transition-colors">
            Success stories
          </a>
        </li>
        <li>
          <a href="#faq" className="text-body text-sm font-medium hover:text-heading transition-colors">
            FAQ
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-3">
        <Link
          href="/questionnaire"
          className="bg-accent text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Get your SOP
        </Link>
        <button
          className="md:hidden w-8 h-8 flex items-center justify-center text-muted"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-bg border-b border-border p-5 flex flex-col gap-4 md:hidden shadow-lg">
          <a href="#how" onClick={() => setOpen(false)} className="text-body text-sm font-medium hover:text-accent transition-colors">How it works</a>
          <a href="#writers" onClick={() => setOpen(false)} className="text-body text-sm font-medium hover:text-accent transition-colors">Our writers</a>
          <a href="#testimonials" onClick={() => setOpen(false)} className="text-body text-sm font-medium hover:text-accent transition-colors">Success stories</a>
          <a href="#faq" onClick={() => setOpen(false)} className="text-body text-sm font-medium hover:text-accent transition-colors">FAQ</a>
        </div>
      )}
    </nav>
  );
}
