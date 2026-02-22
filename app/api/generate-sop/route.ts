import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { generateSOP } from "@/lib/openai";
import { sendSOPDelivery } from "@/lib/email";
import type { QuestionnaireAnswers } from "@/lib/types";

export const maxDuration = 120;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getServiceClient();
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("payment_status", "paid")
    .eq("sop_status", "paid")
    .lt("created_at", cutoff)
    .limit(5); // Process max 5 per run to stay within execution limits

  if (error) {
    console.error("Error fetching orders for SOP generation:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ message: "No orders to process", processed: 0 });
  }

  let processed = 0;
  const errors: string[] = [];

  for (const order of orders) {
    try {
      await supabase
        .from("orders")
        .update({ sop_status: "generating" })
        .eq("id", order.id);

      const answers = order.questionnaire_answers as QuestionnaireAnswers;

      const sopContent = await generateSOP(
        answers,
        order.university,
        order.program,
        order.degree_type,
        order.name
      );

      const now = new Date().toISOString();

      await supabase
        .from("orders")
        .update({
          sop_content: sopContent,
          sop_status: "delivered",
          sop_generated_at: now,
          sop_delivered_at: now,
        })
        .eq("id", order.id);

      try {
        await sendSOPDelivery(
          order.email,
          order.name,
          order.university,
          order.program,
          sopContent
        );
      } catch (emailErr) {
        console.error(`Failed to email SOP for order ${order.id}:`, emailErr);
      }

      processed++;
    } catch (err) {
      console.error(`Failed to generate SOP for order ${order.id}:`, err);
      errors.push(order.id);

      await supabase
        .from("orders")
        .update({ sop_status: "paid" })
        .eq("id", order.id);
    }
  }

  return NextResponse.json({
    message: `Processed ${processed} orders`,
    processed,
    errors: errors.length > 0 ? errors : undefined,
  });
}
