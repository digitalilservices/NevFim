-- =========================================================
-- NEVFIM CONTACT MESSAGES
-- Run once in Supabase SQL Editor.
-- =========================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  status text not null default 'open'
    check (status in ('open', 'closed')),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  language text not null default 'ru'
    check (language in ('ru', 'cs', 'en')),
  created_at timestamptz not null default now(),
  closed_at timestamptz
);

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can create contact messages"
  on public.contact_messages;
drop policy if exists "Admin can view contact messages"
  on public.contact_messages;
drop policy if exists "Admin can update contact messages"
  on public.contact_messages;
drop policy if exists "Admin can delete closed contact messages"
  on public.contact_messages;

create policy "Anyone can create contact messages"
on public.contact_messages
for insert
to anon, authenticated
with check (
  status = 'open'
  and closed_at is null
  and char_length(name) between 2 and 100
  and char_length(email) between 5 and 160
  and char_length(phone) between 6 and 30
  and char_length(message) between 10 and 3000
);

create policy "Admin can view contact messages"
on public.contact_messages
for select
to authenticated
using ((select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com');

create policy "Admin can update contact messages"
on public.contact_messages
for update
to authenticated
using ((select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com')
with check ((select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com');

create policy "Admin can delete closed contact messages"
on public.contact_messages
for delete
to authenticated
using (
  (select auth.jwt() ->> 'email') = 'illypanferov15@gmail.com'
  and status = 'closed'
);

create index if not exists contact_messages_status_created_idx
on public.contact_messages(status, created_at desc);

create index if not exists contact_messages_email_idx
on public.contact_messages(email);
