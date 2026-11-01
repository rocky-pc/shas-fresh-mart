# Shas Fresh Mart

React + Vite storefront and Supabase-powered order/admin workflow.

## Features
- Responsive customer storefront for fish, prawns/crab, chicken and mutton
- Search, category filters, cart, quantity controls and checkout form
- Supabase catalogue, PostgreSQL orders, order items and RLS policies
- Supabase Auth admin sign-in and order dashboard at `/admin`
- WhatsApp contact: +91 6380723356

## Local development
```bash
npm install
cp .env.example .env.local
npm run dev
```
Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Never put a service-role/secret key in a browser variable.

## Database setup
Apply `supabase/migrations/202611010001_initial_store.sql` to the intended Supabase project. Create an admin account in Supabase Authentication, then set its profile role in the SQL editor:
```sql
insert into public.profiles (id, display_name, role)
select id, 'Store Admin', 'admin' from auth.users where email = 'YOUR_ADMIN_EMAIL'
on conflict (id) do update set role = 'admin';
```

## Vercel
Import `rocky-pc/shas-fresh-mart` as a Vite project. Build command: `npm run build`; output: `dist`. Add the two Supabase environment variables in Project Settings.

## Production note
Before accepting public orders at scale, move checkout into a validated Postgres RPC or Supabase Edge Function so prices and totals are calculated on the server, and add bot/rate-limit protection. Confirm availability and delivery charges before fulfilment.
