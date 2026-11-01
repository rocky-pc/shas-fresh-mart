create extension if not exists pgcrypto;
do $$ begin create type public.product_category as enum ('fish','prawns','chicken','mutton'); exception when duplicate_object then null; end $$;
do $$ begin create type public.order_status as enum ('pending','confirmed','preparing','out_for_delivery','completed','cancelled'); exception when duplicate_object then null; end $$;
create table if not exists public.profiles(id uuid primary key references auth.users(id) on delete cascade,display_name text,role text not null default 'customer' check(role in ('customer','admin')),created_at timestamptz not null default now());
create table if not exists public.products(id text primary key,slug text unique not null,name text not null,category public.product_category not null,description text not null default '',price numeric(10,2) not null check(price>=0),unit text not null default 'kg' check(unit in ('kg','piece','pack')),image_url text,is_available boolean not null default true,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.orders(id uuid primary key default gen_random_uuid(),customer_name text not null,phone text not null,address text not null,area text,notes text,subtotal numeric(10,2) not null check(subtotal>=0),total numeric(10,2) not null check(total>=0),status public.order_status not null default 'pending',source text not null default 'website',created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.order_items(id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,product_id text references public.products(id) on delete set null,product_name text not null,quantity numeric(8,2) not null check(quantity>0 and quantity<=100),unit_price numeric(10,2) not null check(unit_price>=0),line_total numeric(10,2) not null check(line_total>=0),created_at timestamptz not null default now());
create index if not exists products_category_available_idx on public.products(category,is_available);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_status_idx on public.orders(status);
create index if not exists order_items_order_id_idx on public.order_items(order_id);
alter table public.profiles enable row level security;alter table public.products enable row level security;alter table public.orders enable row level security;alter table public.order_items enable row level security;
drop policy if exists "Anyone can view available products" on public.products;
create policy "Anyone can view available products" on public.products for select to anon,authenticated using(is_available=true);
drop policy if exists "Admins can view all products" on public.products;
create policy "Admins can view all products" on public.products for select to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert to authenticated with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Visitors can submit orders" on public.orders;
create policy "Visitors can submit orders" on public.orders for insert to anon,authenticated with check(length(trim(customer_name)) between 2 and 120 and length(regexp_replace(phone,'[^0-9]','','g')) between 8 and 15 and length(trim(address)) between 5 and 500 and subtotal>=0 and total>=0 and status='pending');
drop policy if exists "Admins can view orders" on public.orders;
create policy "Admins can view orders" on public.orders for select to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Visitors can add order items" on public.order_items;
create policy "Visitors can add order items" on public.order_items for insert to anon,authenticated with check(quantity>0 and quantity<=100 and unit_price>=0 and line_total>=0);
drop policy if exists "Admins can view order items" on public.order_items;
create policy "Admins can view order items" on public.order_items for select to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Admins can update order items" on public.order_items;
create policy "Admins can update order items" on public.order_items for update to authenticated using(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin')) with check(exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role='admin'));
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile" on public.profiles for select to authenticated using(id=(select auth.uid()));
drop policy if exists "Users can create own profile" on public.profiles;
create policy "Users can create own profile" on public.profiles for insert to authenticated with check(id=(select auth.uid()) and role='customer');
grant select on public.products to anon,authenticated;
grant insert on public.orders,public.order_items to anon,authenticated;
grant select,insert,update,delete on public.products to authenticated;
grant select,update on public.orders,public.order_items to authenticated;
grant select,insert on public.profiles to authenticated;
insert into public.products(id,slug,name,category,description,price,unit,image_url) values
('sankara-big','sankara-big','Big Sankara','fish','Freshly sourced red snapper',500,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('vanjiram','vanjiram','Vanjiram','fish','Premium seer fish cuts',1200,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('sankara-medium','sankara-medium','Medium Sankara','fish','A family favourite',430,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('sankara-small','sankara-small','Small Sankara','fish','Fresh catch, great value',350,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('paara-medium','paara-medium','Medium Paara','fish','Cleaned on request',450,'kg','https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=85'),
('nethili','nethili','Nethili','fish','Perfect for a crispy fry',450,'kg','https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=85'),
('seela-small','seela-small','Small Seela','fish','Fresh sea fish',350,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('seela-medium','seela-medium','Medium Seela','fish','Carefully selected',500,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('sura','sura','Sura','fish','Great for curry and fry',450,'kg','https://images.unsplash.com/photo-1535399831218-d5bd36d1a6b3?auto=format&fit=crop&w=900&q=85'),
('vaval','vaval','Vaval','fish','Rich, delicate flavour',800,'kg','https://images.unsplash.com/photo-1510130387422-82bed34b37e9?auto=format&fit=crop&w=900&q=85'),
('kadama-medium','kadama-medium','Medium Kadama','prawns','Fresh squid',480,'kg','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85'),
('kadama-big','kadama-big','Big Kadama','prawns','Large-size seafood',600,'kg','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85'),
('prawn-medium','prawn-medium','Medium Prawns','prawns','Juicy and versatile',550,'kg','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85'),
('prawn-big','prawn-big','Big Prawns','prawns','Large, premium prawns',680,'kg','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=900&q=85'),
('crab-medium','crab-medium','Medium Crab','prawns','Fresh coastal crab',600,'kg','https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=900&q=85'),
('chicken','chicken','Chicken','chicken','Fresh cuts for every meal',300,'kg','https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85'),
('marinated-chicken','marinated-chicken','Marinated Chicken','chicken','Ready-to-cook flavour',450,'kg','https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=900&q=85'),
('mutton','mutton','Mutton','mutton','Tender, carefully selected cuts',850,'kg','https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=85')
on conflict(id) do nothing;