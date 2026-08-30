-- NEVFIM: remove legacy 3D source from future order items
-- Run once in Supabase SQL Editor after deploying the 2D-only version.

update public.order_items
set source = '2d'
where source = '3d';

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'public.order_items'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%source%';

  if constraint_name is not null then
    execute format('alter table public.order_items drop constraint %I', constraint_name);
  end if;
end $$;

alter table public.order_items
  add constraint order_items_source_check
  check (source in ('2d', 'catalog'));
