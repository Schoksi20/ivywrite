import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay";
import { getServiceClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

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

    const razorpay = getRazorpay();
    const amount = 999 * 100; // Amount in paise

    const razorpayOrder = await razorpay.orders.create({
      amount,
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
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq("id", orderId);

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
