-- =========================================================
-- NEVFIM ORDERS + ADMIN
-- Выполнить один раз в Supabase SQL Editor
-- =========================================================

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  order_number text not null unique,
  status text not null default 'open'
    check (status in ('open', 'closed')),

  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,

  country text not null,
  city text not null,
  address text not null,
  comment text,

  total_price numeric(12, 2) not null default 0,

  created_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null
    references public.orders(id)
    on delete cascade,

  source text not null
    check (source in ('2d', 'catalog')),

  category_id text,
  category_name text,

  model_id text not null,
  model_name text not null,
  image_url text,

  width_mm integer,
  height_mm integer,
  depth_mm integer,

  material text,
  color text,
  fabric text,
  customer_prompt text,

  price numeric(12, 2) not null default 0,
  quantity integer not null default 1
    check (quantity > 0),

  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Users can view own orders" on public.orders;
drop policy if exists "Users can create own orders" on public.orders;
drop policy if exists "Admin can view all orders" on public.orders;
drop policy if exists "Admin can update all orders" on public.orders;
drop policy if exists "Users can view own order items" on public.order_items;
drop policy if exists "Users can create own order items" on public.order_items;
drop policy if exists "Admin can view all order items" on public.order_items;

create policy "Users can view own orders"
on public.orders
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create own orders"
on public.orders
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Admin can view all orders"
on public.orders
for select
to authenticated
using (
  (select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com'
);

create policy "Admin can update all orders"
on public.orders
for update
to authenticated
using (
  (select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com'
)
with check (
  (select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com'
);

create policy "Users can view own order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "Users can create own order items"
on public.order_items
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "Admin can view all order items"
on public.order_items
for select
to authenticated
using (
  (select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com'
);

create index if not exists orders_user_id_idx
on public.orders(user_id);

create index if not exists orders_status_idx
on public.orders(status);

create index if not exists orders_created_at_idx
on public.orders(created_at desc);

create index if not exists order_items_order_id_idx
on public.order_items(order_id);
