import Link from "next/link";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-heading inline-block mb-8">
          ivy<span className="text-accent">write</span>
        </Link>

        <div className="bg-card border border-accent/20 rounded-xl p-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 16l5.5 5.5L24 10" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-heading mb-3">Payment Successful!</h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Your payment of <strong className="text-heading">&#8377;1,499</strong> has been received.
            We are now crafting your Statement of Purpose.
          </p>

          <div className="bg-accent-dim border border-accent-mid rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-accent mb-1">What happens next?</p>
            <p className="text-xs text-muted leading-relaxed">
              Your personalized SOP will be delivered to your email within 72 hours. 
              You will also receive a confirmation email shortly with your order details.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            &larr; Back to ivywrite
          </Link>
        </div>
      </div>
    </div>
  );
}
