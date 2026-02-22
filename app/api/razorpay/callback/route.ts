import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { getServiceClient } from "@/lib/supabase";
import { sendPaymentConfirmation } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const razorpay_order_id = formData.get("razorpay_order_id") as string;
    const razorpay_payment_id = formData.get("razorpay_payment_id") as string;
    const razorpay_signature = formData.get("razorpay_signature") as string;

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.redirect(new URL(`/payment/failure?orderId=${orderId || ""}`, req.url));
    }

    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.redirect(new URL(`/payment/failure?orderId=${orderId}`, req.url));
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

    return NextResponse.redirect(new URL(`/payment/success?orderId=${orderId}`, req.url));
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.redirect(new URL("/payment/failure", req.url));
  }
}
