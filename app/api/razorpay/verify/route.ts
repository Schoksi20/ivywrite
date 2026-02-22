import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getServiceClient } from "@/lib/supabase";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data: order } = await supabase
      .from("orders")
      .select("id, name, email, university, program, payment_status, coupon_code, amount_paid")
      .eq("id", orderId)
      .single();

    if (order && order.payment_status !== "paid") {
      await supabase
        .from("orders")
        .update({
          razorpay_payment_id,
          payment_status: "paid",
          sop_status: "paid",
        })
        .eq("id", orderId);

      // Increment coupon usage if one was applied
      if (order.coupon_code) {
        await supabase.rpc("increment_coupon_usage", { coupon_code_val: order.coupon_code });
      }

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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Payment verification error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
