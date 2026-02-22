import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ivywrite",
  description: "Terms of Service for ivywrite — SOPs written by Ivy League students.",
};

const EFFECTIVE_DATE = "1 February 2026";
const CONTACT_EMAIL = "hello@ivywrite.in";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-sm text-muted">Effective date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose-custom space-y-10 text-[15px] leading-relaxed">

          <section>
            <p>
              These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the ivywrite
              platform, website, and services (collectively, &ldquo;Service&rdquo;) operated by ivywrite
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;). By placing an order or using the
              Service you agree to be bound by these Terms. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">1. The Service</h2>
            <p>
              ivywrite provides professionally written Statements of Purpose (SOPs) for graduate and
              undergraduate university applications. Each SOP is authored by a current student or recent
              graduate of a top-ranked university who is matched to the applicant&apos;s field of study.
              The Service is intended for personal, non-commercial use in connection with your own university
              applications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">2. Orders and Payment</h2>
            <p>
              All orders are placed through the ivywrite website and payment is processed via Razorpay.
              Prices are displayed in Indian Rupees (INR) inclusive of all applicable charges at the time
              of checkout. An order is confirmed only upon successful completion of payment. We reserve the
              right to refuse or cancel orders at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">3. Delivery</h2>
            <p>
              We aim to deliver your completed SOP to the email address provided at checkout within
              72 hours of receiving your completed questionnaire responses. Delivery times are targets,
              not guarantees. In the event of a delay solely caused by ivywrite that extends beyond
              72 hours, you may contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              to discuss the matter. We are not liable for delays caused by incorrect contact information,
              spam filters, or circumstances outside our control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">4. No Refunds</h2>
            <p className="font-semibold text-heading">
              All sales are final. ivywrite does not offer refunds under any circumstances once an order
              has been placed and payment has been processed.
            </p>
            <p className="mt-3">
              Because our Service involves the immediate allocation of a skilled writer&apos;s time and
              the creation of an entirely bespoke document, we are unable to reverse the work that begins
              upon order confirmation. By completing payment you acknowledge and accept this no-refund
              policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">5. No Revisions</h2>
            <p className="font-semibold text-heading">
              The delivered SOP is a completed work product. ivywrite does not offer revisions, edits,
              or rewriting of any delivered document.
            </p>
            <p className="mt-3">
              Our questionnaire is designed to capture sufficient detail for a high-quality, personalised
              SOP in a single pass. We encourage you to complete your questionnaire thoughtfully and
              thoroughly. By accepting delivery you acknowledge that the document is final and that no
              further changes will be made by ivywrite.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">6. Intellectual Property and Ownership</h2>
            <p>
              Upon delivery of your SOP, full ownership of the document transfers to you. You may use,
              submit, and adapt the SOP for your personal university applications without restriction.
              You may not resell, sublicense, publicly distribute, or represent the SOP as a product
              or service offering of your own.
            </p>
            <p className="mt-3">
              The ivywrite brand, website design, platform, and all proprietary content remain the
              exclusive intellectual property of ivywrite. You may not reproduce or use any part of the
              platform without our written permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">7. Originality and Plagiarism</h2>
            <p>
              Every SOP produced by ivywrite is written entirely from scratch based on your questionnaire
              responses. We run internal plagiarism checks prior to delivery. We represent that the
              document will not contain plagiarised content. However, we do not warrant admission outcomes
              or the acceptance of your application by any university or institution.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">8. Confidentiality</h2>
            <p>
              We treat all information you provide — including personal details, academic background, and
              questionnaire responses — as strictly confidential. This information will only be shared
              with the writer assigned to your order. We do not sell, trade, or disclose your personal
              data to third parties for marketing purposes. Please refer to our{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>{" "}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">9. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc list-outside ml-5 mt-3 space-y-2">
              <li>Provide false, misleading, or fabricated information in your questionnaire.</li>
              <li>Use the Service for any purpose other than your own personal university applications.</li>
              <li>Attempt to reverse-engineer, copy, or replicate the ivywrite platform or processes.</li>
              <li>Use the Service in violation of any applicable law or regulation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">10. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind,
              express or implied. We do not guarantee any specific admission outcome, acceptance rate, or
              result from using our Service. University admissions decisions are made solely by the
              respective institutions and are beyond our control or influence.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, ivywrite and its team members shall not
              be liable for any indirect, incidental, special, consequential, or punitive damages arising
              from your use of the Service, including but not limited to loss of application opportunities,
              admission rejections, or decisions made in reliance on the delivered document.
            </p>
            <p className="mt-3">
              Our total liability to you for any claim arising out of or in connection with these Terms
              or the Service shall not exceed the amount you paid for the specific order giving rise to
              the claim.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">12. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we will revise the effective date
              at the top of this page. Continued use of the Service after any changes constitutes your
              acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. Any disputes
              arising out of or in connection with these Terms shall be subject to the exclusive
              jurisdiction of the courts of India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-heading mb-3">14. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>.
            </p>
          </section>

        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 text-sm text-muted">
          <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
          <Link href="/" className="hover:text-heading transition-colors">← Back to ivywrite</Link>
        </div>
      </main>
    </div>
  );
}
