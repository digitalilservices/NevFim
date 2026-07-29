-- NEVFIM STAGE 2
alter table public.orders add column if not exists admin_hidden boolean not null default false;
create index if not exists orders_admin_hidden_idx on public.orders(admin_hidden);
