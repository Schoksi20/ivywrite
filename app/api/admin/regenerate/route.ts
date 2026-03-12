import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { generateSOP, sanitizeStudentInputs } from "@/lib/openai";
import { sendSOPDelivery } from "@/lib/email";
import type { QuestionnaireAnswers } from "@/lib/types";

function checkAuth(req: NextRequest): boolean {
  const session = req.cookies.get("admin_session")?.value;
  return session === process.env.ADMIN_PASSWORD;
}

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, sendEmail, emailOnly, sopContent } = await req.json();
    const supabase = getServiceClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // ── Email-only mode: send existing/edited SOP without regenerating ──────
    if (emailOnly) {
      const contentToSend = sopContent || order.sop_content;
      if (!contentToSend) {
        return NextResponse.json({ error: "No SOP content to send" }, { status: 400 });
      }

      const now = new Date().toISOString();
      await supabase
        .from("orders")
        .update({
          sop_content: contentToSend,
          sop_status: "delivered",
          sop_delivered_at: now,
        })
        .eq("id", orderId);

      await sendSOPDelivery(
        order.email,
        order.name,
        order.university,
        order.program,
        contentToSend
      );

      return NextResponse.json({ success: true });
    }

    // ── Full generation mode ─────────────────────────────────────────────────
    await supabase
      .from("orders")
      .update({ sop_status: "generating" })
      .eq("id", orderId);

    // Sanitize student inputs (fix typos in name, university, program)
    const sanitized = await sanitizeStudentInputs(
      order.name,
      order.university,
      order.program
    );

    if (sanitized.name !== order.name || sanitized.university !== order.university || sanitized.program !== order.program) {
      await supabase
        .from("orders")
        .update({
          name: sanitized.name,
          university: sanitized.university,
          program: sanitized.program,
        })
        .eq("id", orderId);
    }

    const answers = order.questionnaire_answers as QuestionnaireAnswers;
    const { content: sopResult, costUsd } = await generateSOP(
      answers,
      sanitized.university,
      sanitized.program,
      order.degree_type,
      sanitized.name
    );

    const now = new Date().toISOString();
    await supabase
      .from("orders")
      .update({
        sop_content: sopResult,
        sop_status: "delivered",
        sop_generated_at: now,
        sop_delivered_at: sendEmail ? now : order.sop_delivered_at,
        generation_cost_usd: costUsd,
      })
      .eq("id", orderId);

    if (sendEmail) {
      await sendSOPDelivery(
        order.email,
        sanitized.name,
        sanitized.university,
        sanitized.program,
        sopResult
      );
    }

    return NextResponse.json({ success: true, sopContent: sopResult, costUsd: costUsd + sanitized.costUsd });
  } catch (err) {
    console.error("Regeneration error:", err);
    return NextResponse.json({ error: "Failed to regenerate SOP" }, { status: 500 });
  }
}
