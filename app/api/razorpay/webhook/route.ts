import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getServiceClient } from "@/lib/supabase";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    if (!verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;
      const razorpayPaymentId = payment.id;
      const amountPaid = payment.amount;

      const supabase = getServiceClient();

      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, name, email, university, program, payment_status")
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

      if (fetchError || !order) {
        console.error("Order not found for razorpay_order_id:", razorpayOrderId);
        return NextResponse.json({ status: "ok" });
      }

      if (order.payment_status === "paid") {
        return NextResponse.json({ status: "already_processed" });
      }

      await supabase
        .from("orders")
        .update({
          razorpay_payment_id: razorpayPaymentId,
          payment_status: "paid",
          amount_paid: amountPaid,
          sop_status: "paid",
        })
        .eq("id", order.id);

      try {
        await sendPaymentConfirmation(
          order.email,
          order.name,
          order.university,
          order.program
        );
      } catch (emailErr) {
        console.error("Failed to send confirmation email:", emailErr);
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
