# ivywrite

Full-stack Next.js application for ivywrite — SOPs written by Ivy League students, delivered in 72 hours.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4 with light/dark mode
- **Database**: Supabase (PostgreSQL)
- **Payments**: Razorpay (UPI, cards, netbanking)
- **Email**: Resend
- **AI**: OpenAI GPT for SOP generation
- **Hosting**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase/schema.sql` in the Supabase SQL Editor
3. Copy your project URL and keys

### 3. Set up Razorpay

1. Create an account at [razorpay.com](https://razorpay.com)
2. Get your Key ID and Key Secret from the dashboard
3. Set up a webhook pointing to `https://your-domain.com/api/razorpay/webhook` for the `payment.captured` event

### 4. Set up Resend

1. Create an account at [resend.com](https://resend.com)
2. Verify your domain or use the sandbox
3. Get your API key

### 5. Configure environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  page.tsx                  - Landing page
  questionnaire/page.tsx    - Multi-step SOP questionnaire
  payment/page.tsx          - Razorpay checkout
  payment/success/page.tsx  - Payment confirmation
  payment/failure/page.tsx  - Payment failure
  admin/page.tsx            - Admin dashboard (password-gated)
  api/
    orders/                 - Create new orders
    razorpay/create/        - Create Razorpay payment order
    razorpay/verify/        - Verify payment client-side
    razorpay/webhook/       - Razorpay webhook handler
    generate-sop/           - Cron job for SOP generation
    admin/login/            - Admin authentication
    admin/orders/           - Admin order management
    admin/regenerate/       - Manual SOP regeneration
```

## User Flow

1. Student visits landing page and clicks "Get your SOP"
2. Fills in a 7-step questionnaire (17 questions)
3. Submits and is redirected to Razorpay payment (₹999)
4. On payment success, receives a confirmation email
5. After 48 hours, a cron job generates the SOP via OpenAI
6. The SOP is emailed to the student

## Admin Dashboard

Visit `/admin` and enter the `ADMIN_PASSWORD` to:

- View all orders with status filters
- See full questionnaire answers and generated SOPs
- Manually regenerate SOPs
- Email SOPs to students
- Add internal notes
- Track revenue and delivery status

## Deployment

Deploy to Vercel for automatic cron job support:

```bash
npx vercel
```

The `vercel.json` configures the SOP generation cron to run every hour.
