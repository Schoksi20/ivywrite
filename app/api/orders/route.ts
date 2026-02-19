import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import type { CreateOrderPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body: CreateOrderPayload = await req.json();

    if (!body.name || !body.email || !body.university || !body.program || !body.degree_type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        university: body.university,
        program: body.program,
        degree_type: body.degree_type,
        questionnaire_answers: body.questionnaire_answers,
        payment_status: "pending",
        sop_status: "awaiting_payment",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
