"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailureContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-heading inline-block mb-8">
          ivy<span className="text-accent">write</span>
        </Link>

        <div className="bg-card border border-border rounded-xl p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M10 10l12 12M22 10L10 22" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-heading mb-3">Payment Failed</h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Your payment could not be processed. Don&apos;t worry, no money has been deducted from your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {orderId && (
              <Link
                href={`/payment?orderId=${orderId}`}
                className="bg-accent text-white dark:text-black text-sm font-bold px-6 py-3 rounded-lg hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all"
              >
                Try Again
              </Link>
            )}
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-heading px-6 py-3 border border-border rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      }
    >
      <FailureContent />
    </Suspense>
  );
}
