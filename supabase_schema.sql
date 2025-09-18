begin;

create extension if not exists "pgcrypto";

-- Profiles linked to auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text check (role in ('learner','creator','admin')) default 'learner',
  created_at timestamptz default now()
);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  track_id uuid,
  slug text unique not null,
  title text not null,
  content text not null,
  created_by uuid references auth.users(id),
  order_index int default 0,
  created_at timestamptz default now()
);

-- Questions
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid,
  user_id uuid references auth.users(id),
  body text not null check (char_length(body) between 10 and 2000),
  status text default 'open',
  created_at timestamptz default now()
);

-- Insert a profile automatically for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name) values (new.id, coalesce(new.email, ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;

-- Profiles policies
drop policy if exists profiles_read_own on public.profiles;
create policy profiles_read_own on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (auth.uid() = id);

-- Lessons: public read
drop policy if exists lessons_public_read on public.lessons;
create policy lessons_public_read on public.lessons
  for select using (true);

-- Lessons: only creators/admin can insert/update their own
drop policy if exists lessons_insert_creators on public.lessons;
create policy lessons_insert_creators on public.lessons
  for insert with check (
    auth.uid() = created_by and
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('creator','admin'))
  );

drop policy if exists lessons_update_creators on public.lessons;
create policy lessons_update_creators on public.lessons
  for update using (auth.uid() = created_by);

-- Questions open (prototype)
drop policy if exists questions_insert_any on public.questions;
create policy questions_insert_any on public.questions
  for insert with check (true);

drop policy if exists questions_select_any on public.questions;
create policy questions_select_any on public.questions
  for select using (true);

commit;
