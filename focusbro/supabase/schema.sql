-- Brainfog Supabase Schema
-- Run this in your Supabase project → SQL Editor

-- 1. User profiles (extends Supabase auth.users)
create table if not exists profiles (
  id                  uuid references auth.users primary key,
  email               text,
  subscription_status text not null default 'free',  -- 'free' | 'active' | 'trialing' | 'cancelled'
  stripe_customer_id  text,
  created_at          timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile when user signs up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- 2. Goblin state (HP, streak — synced across devices)
create table if not exists goblin_state (
  user_id           uuid references auth.users primary key,
  hp                integer not null default 60,
  streak            integer not null default 0,
  last_session_date text,
  updated_at        timestamptz not null default now()
);
alter table goblin_state enable row level security;
create policy "Users can read own goblin"   on goblin_state for select using (auth.uid() = user_id);
create policy "Users can upsert own goblin" on goblin_state for all    using (auth.uid() = user_id);

-- 3. Focus sessions log
create table if not exists focus_sessions (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users not null,
  work_s     integer not null,
  ended_at   timestamptz not null default now()
);
alter table focus_sessions enable row level security;
create policy "Users can read own sessions"   on focus_sessions for select using (auth.uid() = user_id);
create policy "Users can insert own sessions" on focus_sessions for insert with check (auth.uid() = user_id);
