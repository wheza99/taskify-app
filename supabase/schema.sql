-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create tasks table
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  completed boolean default false not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security
alter table public.tasks enable row level security;

-- Create policies
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists tasks_user_id_idx on public.tasks(user_id);
