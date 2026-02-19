"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const initiated = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const initPayment = useCallback(async () => {
    if (!orderId) {
      setError("No order found. Please start from the questionnaire.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Order already paid") {
          router.replace(`/payment/success?orderId=${orderId}`);
          return;
        }
        throw new Error(data.error || "Failed to create payment");
      }

      const { razorpayOrderId, amount, currency, keyId } = data;

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: keyId,
          amount,
          currency,
          name: "ivywrite",
          description: "Statement of Purpose - Written by Ivy League Students",
          order_id: razorpayOrderId,
          callback_url: `${window.location.origin}/api/razorpay/callback?orderId=${orderId}`,
          redirect: true,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId,
                }),
              });

              if (verifyRes.ok) {
                router.push(`/payment/success?orderId=${orderId}`);
              } else {
                router.push(`/payment/failure?orderId=${orderId}`);
              }
            } catch {
              router.push(`/payment/failure?orderId=${orderId}`);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setError("Payment was cancelled. You can try again.");
            },
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#10B981",
          },
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoading(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;
    initPayment();
  }, [initPayment]);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-heading inline-block mb-8">
          ivy<span className="text-accent">write</span>
        </Link>

        {loading && !error && (
          <div>
            <div className="w-10 h-10 border-2 border-border border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted text-sm">Preparing your payment...</p>
          </div>
        )}

        {error && (
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-heading font-semibold mb-2">Payment Error</p>
            <p className="text-muted text-sm mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setError(""); setLoading(true); initiated.current = false; initPayment(); }}
                className="bg-accent text-white dark:text-black text-sm font-bold px-6 py-2.5 rounded-lg hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-heading px-6 py-2.5 border border-border rounded-lg transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-border border-t-accent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
