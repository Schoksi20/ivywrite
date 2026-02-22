import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ivywrite",
  description: "Privacy Policy for ivywrite — SOPs written by Ivy League students.",
};

const EFFECTIVE_DATE = "1 February 2026";
const CONTACT_EMAIL = "hello@ivywrite.in";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-body font-sans">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 md:px-12 bg-bg/80 backdrop-blur-xl border-b border-border">
        <Link href="/" className="text-xl font-bold tracking-tight text-heading">
          ivy<span className="text-accent">write</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-32 pb-24">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-heading leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed">

          <section>
            <p>
              ivywrite (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your
              privacy. This Privacy Policy explains what personal information we collect, how we use it,
              and your rights with respect to it when you use the ivywrite website and services
              (collectively, &ldquo;Service&rdquo;). By using the Service you consent to the practices
              described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">1. Information We Collect</h2>

            <h3 className="text-sm font-semibold text-heading mt-4 mb-2">Information you provide directly</h3>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong>Contact and identity details</strong> — your full name and email address, collected
                at checkout.
              </li>
              <li>
                <strong>Application details</strong> — the university, program, and degree type you are
                applying to.
              </li>
              <li>
                <strong>Questionnaire responses</strong> — your academic background, work and research
                experience, career goals, personal stories, and any other information you choose to share
                in the SOP questionnaire.
              </li>
              <li>
                <strong>Payment information</strong> — payment is processed entirely by Razorpay. We do
                not store your card number, UPI ID, or any other sensitive payment credentials.
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-heading mt-5 mb-2">Information collected automatically</h3>
            <ul className="list-disc list-outside ml-5 space-y-2">
              <li>
                <strong>Usage data</strong> — page views, session duration, and general interaction
                patterns, collected via Vercel Analytics in aggregated, anonymised form.
              </li>
              <li>
                <strong>Technical data</strong> — IP address, browser type, and device information,
                collected automatically by our hosting infrastructure for security and performance purposes.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect solely to:</p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2">
              <li>Process your order and communicate its status to you.</li>
              <li>
                Share your questionnaire responses with the writer assigned to your order so they can
                draft your SOP.
              </li>
              <li>Deliver your completed SOP to your email address.</li>
              <li>Respond to enquiries or support requests you send to us.</li>
              <li>Detect and prevent fraud, abuse, or violations of our Terms of Service.</li>
              <li>Improve the performance and reliability of our platform using aggregated analytics.</li>
            </ul>
            <p className="mt-3">
              We do not use your personal information for advertising, profiling, or any purpose unrelated
              to fulfilling your order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">3. How We Share Your Information</h2>
            <p>
              We do not sell, rent, or trade your personal information. We share it only in the following
              limited circumstances:
            </p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2">
              <li>
                <strong>Assigned writer</strong> — your questionnaire responses and application details
                are shared with the writer matched to your order. Writers are bound by confidentiality
                obligations.
              </li>
              <li>
                <strong>Service providers</strong> — we use Razorpay for payment processing, Supabase
                for database hosting, Resend for transactional email, and Vercel for website hosting.
                Each processes data only as necessary to deliver their service and under their own
                privacy policies.
              </li>
              <li>
                <strong>Legal obligations</strong> — we may disclose information if required to do so by
                law or in response to valid legal process.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">4. Data Retention</h2>
            <p>
              We retain your order details, contact information, and questionnaire responses for as long
              as reasonably necessary to fulfil our service obligations and comply with legal requirements.
              If you would like your data deleted, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              and we will action your request within 30 days, subject to any legal retention obligations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">5. Data Security</h2>
            <p>
              We take reasonable technical and organisational measures to protect your personal information
              from unauthorised access, loss, or misuse. All data is stored on encrypted infrastructure.
              Payment data is handled entirely by Razorpay, which is PCI-DSS compliant. However, no
              method of transmission over the internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">6. Cookies</h2>
            <p>
              We use a minimal number of cookies necessary for the operation of the Service, including a
              session cookie used solely for authentication in the admin panel. We do not use third-party
              advertising or tracking cookies. Vercel Analytics uses privacy-preserving, cookieless
              measurement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2">
              <li>Request access to the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>
                Request deletion of your personal data, subject to legal retention requirements.
              </li>
              <li>Withdraw consent for any processing based solely on your consent.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">8. Children&apos;s Privacy</h2>
            <p>
              The Service is intended for individuals aged 16 and above. We do not knowingly collect
              personal information from children under 16. If you believe we have inadvertently collected
              such information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">9. Third-Party Links</h2>
            <p>
              The Service may contain links to third-party websites. We have no control over and accept
              no responsibility for the content or privacy practices of those sites. We encourage you to
              review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the
              effective date at the top of this page. Continued use of the Service after any changes
              constitutes your acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">11. Contact</h2>
            <p>
              For any privacy-related questions or requests, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 text-sm text-muted">
          <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
          <Link href="/" className="hover:text-heading transition-colors">← Back to ivywrite</Link>
        </div>
      </main>
    </div>
  );
}
