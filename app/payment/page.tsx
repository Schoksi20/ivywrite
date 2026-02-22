"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const BASE_PRICE = 1499;

interface OrderInfo {
  name: string;
  university: string;
  program: string;
  degree_type: string;
  payment_status: string;
}

interface CouponResult {
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const [couponInput, setCouponInput] = useState("");
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const initiated = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setError("No order found. Please start from the questionnaire.");
      setLoadingOrder(false);
      return;
    }

    fetch(`/api/orders?orderId=${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data.payment_status === "paid") {
          router.replace(`/payment/success?orderId=${orderId}`);
        } else {
          setOrderInfo(data);
        }
        setLoadingOrder(false);
      })
      .catch(() => {
        setError("Failed to load order details.");
        setLoadingOrder(false);
      });
  }, [orderId, router]);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    setCouponResult(null);

    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setCouponError(data.error || "Invalid coupon");
      } else {
        setCouponResult(data);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    }
    setApplyingCoupon(false);
  }

  function removeCoupon() {
    setCouponResult(null);
    setCouponInput("");
    setCouponError("");
  }

  const initPayment = useCallback(async () => {
    if (!orderId) return;
    setPaying(true);
    setError("");

    try {
      const res = await fetch("/api/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          couponCode: couponResult?.code || null,
        }),
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
          description: "Statement of Purpose — Ivy League Written",
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
              setPaying(false);
              initiated.current = false;
            },
          },
          prefill: {
            name: orderInfo?.name || "",
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
        setPaying(false);
      };
      document.body.appendChild(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setPaying(false);
    }
  }, [orderId, router, couponResult, orderInfo]);

  const finalPrice = couponResult ? couponResult.finalAmount / 100 : BASE_PRICE;

  if (loadingOrder) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !orderInfo) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-5">
        <div className="max-w-md w-full text-center">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-heading inline-block mb-8">
            ivy<span className="text-accent">write</span>
          </Link>
          <div className="bg-card border border-border rounded-xl p-6">
            <p className="text-heading font-semibold mb-2">Something went wrong</p>
            <p className="text-muted text-sm mb-6">{error}</p>
            <Link href="/" className="text-sm font-medium text-muted hover:text-heading px-6 py-2.5 border border-border rounded-lg transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5 py-12">
      <div className="max-w-md w-full">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-heading inline-block mb-8">
          ivy<span className="text-accent">write</span>
        </Link>

        <h1 className="text-xl font-bold text-heading mb-1">Complete your order</h1>
        <p className="text-sm text-muted mb-6">Review your details and pay securely via Razorpay.</p>

        {/* Order summary */}
        {orderInfo && (
          <div className="bg-card border border-border rounded-xl p-5 mb-5">
            <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Order Summary</div>
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted">Student</span>
                <span className="text-heading font-medium">{orderInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">University</span>
                <span className="text-heading font-medium">{orderInfo.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Program</span>
                <span className="text-heading font-medium">{orderInfo.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Degree</span>
                <span className="text-heading font-medium">{orderInfo.degree_type}</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="text-sm text-muted">SOP — 1 document</span>
              <span className="text-base font-bold text-heading">&#8377;{BASE_PRICE.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}

        {/* Coupon section */}
        <div className="bg-card border border-border rounded-xl p-5 mb-5">
          <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Coupon Code</div>

          {couponResult ? (
            <div className="flex items-center justify-between bg-accent/10 border border-accent/30 rounded-lg px-4 py-3">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wide">{couponResult.code}</span>
                <p className="text-xs text-accent/80 mt-0.5">
                  {couponResult.discountType === "percent"
                    ? `${couponResult.discountValue}% off`
                    : `₹${(couponResult.discountAmount / 100).toLocaleString("en-IN")} off`}
                  {" "}applied
                </p>
              </div>
              <button onClick={removeCoupon} className="text-xs text-muted hover:text-red-500 transition-colors font-medium">
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  setCouponError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                placeholder="Enter code"
                className="flex-1 bg-surface border border-border rounded-lg px-3 py-2.5 text-sm text-heading placeholder:text-muted2 outline-none focus:border-accent transition-colors uppercase"
              />
              <button
                onClick={applyCoupon}
                disabled={applyingCoupon || !couponInput.trim()}
                className="text-xs font-bold px-4 py-2.5 bg-surface border border-border rounded-lg text-heading hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
              >
                {applyingCoupon ? "..." : "Apply"}
              </button>
            </div>
          )}

          {couponError && (
            <p className="text-red-500 text-xs mt-2">{couponError}</p>
          )}
        </div>

        {/* Total */}
        <div className="bg-card border border-border rounded-xl p-5 mb-5">
          <div className="text-xs text-muted font-semibold uppercase tracking-wider mb-3">Total</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="text-body">&#8377;{BASE_PRICE.toLocaleString("en-IN")}</span>
            </div>
            {couponResult && (
              <div className="flex justify-between text-accent">
                <span>Discount ({couponResult.code})</span>
                <span>− &#8377;{(couponResult.discountAmount / 100).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="font-bold text-heading">Total</span>
              <span className="font-bold text-heading text-lg">&#8377;{finalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <button
          onClick={() => {
            if (initiated.current) return;
            initiated.current = true;
            initPayment();
          }}
          disabled={paying}
          className="w-full bg-accent text-white text-base font-bold px-6 py-4 rounded-xl hover:shadow-[0_4px_16px_var(--accent-glow)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {paying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Preparing payment...
            </>
          ) : (
            <>
              Pay &#8377;{finalPrice.toLocaleString("en-IN")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted mt-4">
          Secured by Razorpay · 100% refund if not delivered in 72h
        </p>
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
