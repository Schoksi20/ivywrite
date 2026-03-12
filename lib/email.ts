import { Resend } from "resend";
import { jsPDF } from "jspdf";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY!);
  }
  return resendClient;
}

function generateSOPPdf(
  name: string,
  university: string,
  program: string,
  sopContent: string
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 25;
  const usable = pageWidth - margin * 2;
  let y = margin;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241);
  doc.text("ivywrite", margin, y);
  y += 10;

  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 12;

  // Student info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(`Prepared for: ${name}`, margin, y);
  y += 5;
  doc.text(`${program}, ${university}`, margin, y);
  y += 12;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 30, 30);
  doc.text("Statement of Purpose", margin, y);
  y += 10;

  // Body
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50, 50, 50);

  const paragraphs = sopContent.split(/\n\n+/);

  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para.trim(), usable);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5.5;
    }
    y += 3;
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(160, 160, 160);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 290, {
      align: "right",
    });
  }

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}

export async function sendPaymentConfirmation(
  to: string,
  name: string,
  university: string,
  program: string,
  amountPaise?: number
) {
  const resend = getResend();
  const displayAmount = amountPaise
    ? (amountPaise / 100).toLocaleString("en-IN")
    : "1,499";

  await resend.emails.send({
    from: "ivywrite <hello@ivy-write.com>",
    replyTo: "support@ivy-write.com",
    to,
    subject: "Payment Confirmed. Your SOP is being crafted",
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
        <div style="padding: 32px 0; border-bottom: 2px solid #6366f1;">
          <h1 style="font-size: 22px; font-weight: 800; margin: 0;">
            ivy<span style="color: #6366f1;">write</span>
          </h1>
        </div>
        <div style="padding: 32px 0;">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px;">
            Payment confirmed
          </h2>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Hi ${name},
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Your payment of <strong>&#8377;${displayAmount}</strong> has been received. We're now crafting your
            Statement of Purpose for <strong>${program}</strong> at <strong>${university}</strong>.
          </p>
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p style="font-size: 14px; color: #3730a3; margin: 0; font-weight: 600;">
              Expected delivery: within 72 hours
            </p>
            <p style="font-size: 13px; color: #3730a3; margin: 8px 0 0;">
              Your SOP will be sent to this email address.
            </p>
          </div>
          <p style="font-size: 14px; line-height: 1.7; color: #666;">
            If you have questions, reply to this email and we'll get back to you promptly.
          </p>
        </div>
        <div style="padding: 20px 0; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} ivywrite. All rights reserved.
        </div>
      </div>
    `,
  });
}

export async function sendSOPDelivery(
  to: string,
  name: string,
  university: string,
  program: string,
  sopContent: string
) {
  const resend = getResend();

  const pdfBuffer = generateSOPPdf(name, university, program, sopContent);
  const safeUni = university.replace(/[^a-zA-Z0-9]+/g, "_");

  await resend.emails.send({
    from: "ivywrite <hello@ivy-write.com>",
    replyTo: "support@ivy-write.com",
    to,
    subject: `Your SOP for ${university} is ready`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
        <div style="padding: 32px 0; border-bottom: 2px solid #6366f1;">
          <h1 style="font-size: 22px; font-weight: 800; margin: 0;">
            ivy<span style="color: #6366f1;">write</span>
          </h1>
        </div>
        <div style="padding: 32px 0;">
          <h2 style="font-size: 20px; font-weight: 700; margin: 0 0 16px;">
            Your SOP is ready
          </h2>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Hi ${name},
          </p>
          <p style="font-size: 15px; line-height: 1.7; color: #444;">
            Your Statement of Purpose for <strong>${program}</strong> at
            <strong>${university}</strong> has been crafted and is ready for you below.
            We've also attached it as a PDF for easy downloading.
          </p>
          <div style="background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin: 24px 0; font-size: 14px; line-height: 1.85; color: #333; white-space: pre-wrap;">
${sopContent}
          </div>
          <div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 600;">
              Important: Do not upload this document directly to your university application.
            </p>
            <p style="font-size: 13px; color: #92400e; margin: 6px 0 0;">
              Copy the content into a Google Doc or Word document, review and personalize it, then submit that version. This PDF is for your reference only.
            </p>
          </div>
          <p style="font-size: 14px; line-height: 1.7; color: #666;">
            Best of luck with your application!
          </p>
        </div>
        <div style="padding: 20px 0; border-top: 1px solid #e5e5e5; font-size: 12px; color: #999;">
          &copy; ${new Date().getFullYear()} ivywrite. All rights reserved.
        </div>
      </div>
    `,
    attachments: [
      {
        filename: `SOP_${safeUni}.pdf`,
        content: pdfBuffer,
      },
    ],
  });
}
