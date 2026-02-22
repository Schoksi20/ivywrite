import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { getServiceClient } from "@/lib/supabase";

const BASE_PRICE = 1499 * 100; // paise

export async function POST(req: NextRequest) {
  try {
    const { orderId, couponCode } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("id, name, email, payment_status")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    // Validate coupon server-side if provided
    let discountAmount = 0;
    let validatedCouponCode: string | null = null;

    if (couponCode?.trim()) {
      const { data: coupon } = await supabase
        .from("coupon_codes")
        .select("*")
        .eq("code", couponCode.toUpperCase().trim())
        .eq("is_active", true)
        .single();

      const isExpired = coupon?.expires_at && new Date(coupon.expires_at) < new Date();
      const isMaxed = coupon?.max_uses !== null && coupon?.used_count >= coupon?.max_uses;

      if (coupon && !isExpired && !isMaxed) {
        discountAmount =
          coupon.discount_type === "percent"
            ? Math.round((BASE_PRICE * coupon.discount_value) / 100)
            : coupon.discount_value * 100;
        validatedCouponCode = coupon.code;
      }
    }

    const finalAmount = Math.max(100, BASE_PRICE - discountAmount);

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: finalAmount,
      currency: "INR",
      receipt: orderId,
      notes: {
        order_id: orderId,
        customer_name: order.name,
        customer_email: order.email,
      },
    });

    await supabase
      .from("orders")
      .update({
        razorpay_order_id: razorpayOrder.id,
        coupon_code: validatedCouponCode,
        discount_amount: discountAmount,
        amount_paid: finalAmount,
      })
      .eq("id", orderId);

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: finalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      discountAmount,
      couponApplied: validatedCouponCode,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
