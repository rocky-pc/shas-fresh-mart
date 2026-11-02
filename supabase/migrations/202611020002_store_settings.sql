-- ============================================================================
-- Migration: Store Settings & Product Storage Configuration
-- Project: urgstkdxyeumcnyziich (Shas Fresh Mart)
-- ============================================================================

-- 1. Create store_settings table for dynamic delivery charge and banner offers
create table if not exists public.store_settings (
  id text primary key default 'main',
  delivery_charge numeric(10,2) not null default 40.00,
  free_delivery_threshold numeric(10,2) not null default 500.00,
  banner_offer_text text not null default '🔥 ROYAL FRESHNESS: Free Express Delivery on orders above ₹500! Use Code FRESH10 for 10% OFF',
  offer_enabled boolean not null default true,
  offer_code text not null default 'FRESH10',
  offer_discount_percent numeric(5,2) not null default 10.00,
  min_order_for_offer numeric(10,2) not null default 799.00,
  store_open boolean not null default true,
  contact_phone text not null default '6380723356',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.store_settings enable row level security;

-- Policies for store_settings
drop policy if exists "Public read store settings" on public.store_settings;
create policy "Public read store settings"
  on public.store_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins update store settings" on public.store_settings;
create policy "Admins update store settings"
  on public.store_settings for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

drop policy if exists "Admins insert store settings" on public.store_settings;
create policy "Admins insert store settings"
  on public.store_settings for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

grant select on public.store_settings to anon, authenticated;
grant update, insert on public.store_settings to authenticated;

-- Seed initial settings
insert into public.store_settings (
  id,
  delivery_charge,
  free_delivery_threshold,
  banner_offer_text,
  offer_enabled,
  offer_code,
  offer_discount_percent,
  min_order_for_offer,
  store_open,
  contact_phone
) values (
  'main',
  40.00,
  500.00,
  '🔥 ROYAL FRESHNESS: Free Express Delivery on orders above ₹500! Use Code FRESH10 for 10% OFF',
  true,
  'FRESH10',
  10.00,
  799.00,
  true,
  '6380723356'
) on conflict (id) do update set
  updated_at = now();

-- 2. Storage Bucket Policies (product-images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/png', 'image/jpeg', 'image/webp', 'image/jpg'])
on conflict (id) do update set public = true;

drop policy if exists "Public Access for product images" on storage.objects;
create policy "Public Access for product images"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
