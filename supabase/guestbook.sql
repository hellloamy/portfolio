-- Guestbook table for the portfolio's doodle wall.
-- Paste this into the Supabase dashboard's SQL editor and run it once.

create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 20),
  -- 24x24 doodle, one character per pixel, row by row:
  -- '.' empty, 'k' black, 'g' grey, 'p' pink
  pixels text not null check (pixels ~ '^[.kgp]{576}$'),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

create policy "Anyone can read doodles"
  on public.guestbook for select
  to anon
  using (true);

create policy "Anyone can add a doodle"
  on public.guestbook for insert
  to anon
  with check (true);

-- There's deliberately no update or delete policy, so visitors can't change or
-- remove anyone's doodle. To take one down: Table Editor -> guestbook, delete the row.
