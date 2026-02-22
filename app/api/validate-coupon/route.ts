import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

const BASE_PRICE = 1499 * 100; // paise

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data: coupon } = await supabase
      .from("coupon_codes")
      .select("*")
      .eq("code", code.toUpperCase().trim())
      .eq("is_active", true)
      .single();

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ error: "Coupon has reached its usage limit" }, { status: 400 });
    }

    const discountAmount =
      coupon.discount_type === "percent"
        ? Math.round((BASE_PRICE * coupon.discount_value) / 100)
        : coupon.discount_value * 100;

    const finalAmount = Math.max(100, BASE_PRICE - discountAmount);

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      discountAmount,
      finalAmount,
    });
  } catch (err) {
    console.error("Coupon validation error:", err);
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
