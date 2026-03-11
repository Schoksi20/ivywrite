"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface HintTooltipProps {
  guidance: string;
  bullets?: string[];
  example?: string;
}

export function HintTooltip({ guidance, bullets, example }: HintTooltipProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);

  const reposition = useCallback(() => {
    const btn = btnRef.current;
    const tip = tipRef.current;
    if (!btn || !tip) return;

    const btnRect = btn.getBoundingClientRect();
    const tipW = tip.offsetWidth;
    const tipH = tip.offsetHeight;
    const pad = 8;

    // Try below the button first, fallback to above
    let top = btnRect.bottom + pad;
    if (top + tipH > window.innerHeight - pad) {
      top = btnRect.top - tipH - pad;
    }
    if (top < pad) top = pad;

    // Center horizontally on the button, but clamp to viewport
    let left = btnRect.left + btnRect.width / 2 - tipW / 2;
    if (left + tipW > window.innerWidth - pad) {
      left = window.innerWidth - tipW - pad;
    }
    if (left < pad) left = pad;

    tip.style.top = `${top}px`;
    tip.style.left = `${left}px`;
  }, []);

  useEffect(() => {
    if (!open) return;
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, reposition]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    function handleDown(e: MouseEvent) {
      if (
        btnRef.current?.contains(e.target as Node) ||
        tipRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex ml-1.5 align-middle w-4 h-4 rounded-full bg-border text-muted hover:bg-accent-mid hover:text-accent items-center justify-center text-[10px] font-bold transition-colors cursor-help shrink-0"
        aria-label="Hint"
      >
        i
      </button>

      {open && (
        <div
          ref={tipRef}
          className="fixed z-[100] w-[min(360px,calc(100vw-32px))] bg-card border border-border2 rounded-xl shadow-xl p-4"
          style={{ top: 0, left: 0 }}
        >
          <p className="text-[10px] uppercase tracking-[1.5px] text-accent font-bold mb-2">Writing tip</p>
          <p className="text-[13px] text-body leading-relaxed">{guidance}</p>

          {bullets && bullets.length > 0 && (
            <ul className="mt-2.5 space-y-1">
              {bullets.map((b, i) => (
                <li key={i} className="flex gap-2 text-[13px] text-body leading-relaxed">
                  <span className="text-accent mt-px shrink-0">&#8226;</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {example && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-[10px] uppercase tracking-[1.5px] text-accent font-bold mb-1.5">Example</p>
              <p className="text-xs text-muted leading-relaxed italic">{example}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
