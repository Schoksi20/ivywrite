-- ivywrite database schema
-- Run this in your Supabase SQL Editor to create the orders table

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- Student info
  name text not null,
  email text not null,
  phone text,

  -- Target program info
  university text not null,
  program text not null,
  degree_type text not null,

  -- Questionnaire answers stored as JSON for flexibility
  questionnaire_answers jsonb not null,

  -- Payment
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  amount_paid integer,

  -- SOP generation
  sop_status text default 'awaiting_payment' check (
    sop_status in ('awaiting_payment', 'paid', 'generating', 'delivered', 'revision_requested', 'revision_delivered')
  ),
  sop_content text,
  sop_generated_at timestamptz,
  sop_delivered_at timestamptz,

  -- Admin
  admin_notes text
);

create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_sop_status on orders(sop_status);
create index if not exists idx_orders_email on orders(email);
