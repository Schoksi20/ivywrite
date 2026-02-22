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

-- Coupon tracking columns (run if upgrading an existing schema)
alter table orders add column if not exists coupon_code text;
alter table orders add column if not exists discount_amount integer default 0;

create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_sop_status on orders(sop_status);
create index if not exists idx_orders_email on orders(email);

-- Coupon codes
create table if not exists coupon_codes (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  discount_type text not null check (discount_type in ('percent', 'flat')),
  discount_value integer not null,
  max_uses integer,
  used_count integer default 0,
  expires_at timestamptz,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index if not exists idx_coupon_codes_code on coupon_codes(code);

-- Atomic increment for coupon usage (prevents race conditions)
create or replace function increment_coupon_usage(coupon_code_val text)
returns void as $$
  update coupon_codes set used_count = used_count + 1 where code = coupon_code_val;
$$ language sql;
