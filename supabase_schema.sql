-- Eternity AI Schema Migration

-- 1. Create a table for Public Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  openai_tokens bigint default 0,
  anthropic_tokens bigint default 0,
  local_tokens bigint default 0,
  account_status text default 'Active'
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- 2. Create ai_personas table
create table if not exists public.ai_personas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  relationship text,
  system_prompt text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for ai_personas
alter table public.ai_personas enable row level security;
create policy "Users can view their own personas." on public.ai_personas for select using (auth.uid() = user_id);
create policy "Users can insert their own personas." on public.ai_personas for insert with check (auth.uid() = user_id);
create policy "Users can update their own personas." on public.ai_personas for update using (auth.uid() = user_id);
create policy "Users can delete their own personas." on public.ai_personas for delete using (auth.uid() = user_id);

-- 3. Create chats table
create table if not exists public.chats (
  id uuid default gen_random_uuid() primary key,
  persona_id uuid references public.ai_personas(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for chats
alter table public.chats enable row level security;
create policy "Users can view their own chats." on public.chats for select using (auth.uid() = user_id);
create policy "Users can insert their own chats." on public.chats for insert with check (auth.uid() = user_id);
create policy "Users can delete their own chats." on public.chats for delete using (auth.uid() = user_id);

-- 4. Create messages table
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for messages
alter table public.messages enable row level security;
create policy "Users can view messages of their chats." on public.messages for select using (
  exists (select 1 from public.chats where chats.id = messages.chat_id and chats.user_id = auth.uid())
);
create policy "Users can insert messages to their chats." on public.messages for insert with check (
  exists (select 1 from public.chats where chats.id = messages.chat_id and chats.user_id = auth.uid())
);

-- 5. Set up Auth Trigger to automatically create a profile when a new auth user registers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, openai_tokens, anthropic_tokens, local_tokens, account_status)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 0, 0, 0, 'Active');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Memorials System
create table if not exists public.memorials (
  id uuid default gen_random_uuid() primary key,
  persona_id uuid references public.ai_personas(id) on delete cascade not null,
  bio text,
  birth_date date,
  death_date date,
  candle_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for memorials
alter table public.memorials enable row level security;
create policy "Memorials are viewable by everyone." on public.memorials for select using (true);
create policy "Users can manage memorials for their personas." on public.memorials for all using (
  exists (select 1 from public.ai_personas where ai_personas.id = memorials.persona_id and ai_personas.user_id = auth.uid())
);

-- Memorial Images (Gallery)
create table if not exists public.memorial_images (
  id uuid default gen_random_uuid() primary key,
  memorial_id uuid references public.memorials(id) on delete cascade not null,
  url text not null,
  caption text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for memorial_images
alter table public.memorial_images enable row level security;
create policy "Memorial images are viewable by everyone." on public.memorial_images for select using (true);
create policy "Users can manage images for their memorials." on public.memorial_images for all using (
  exists (select 1 from public.memorials join public.ai_personas on memorials.persona_id = ai_personas.id where memorials.id = memorial_images.memorial_id and ai_personas.user_id = auth.uid())
);

-- Memorial Messages (Tributes)
create table if not exists public.memorial_messages (
  id uuid default gen_random_uuid() primary key,
  memorial_id uuid references public.memorials(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  author_name text, -- For guest messages
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for memorial_messages
alter table public.memorial_messages enable row level security;
create policy "Memorial messages are viewable by everyone." on public.memorial_messages for select using (true);
create policy "Anyone can post a memorial message." on public.memorial_messages for insert with check (true);
create policy "Users can delete their own messages." on public.memorial_messages for delete using (auth.uid() = user_id);

-- 8. Storage for Memorials
insert into storage.buckets (id, name, public) values ('memorials', 'memorials', true) on conflict do nothing;

-- Storage Policies for Memorials
create policy "Memorial photos are publicly accessible." on storage.objects for select using (bucket_id = 'memorials');
create policy "Anyone can upload to memorials." on storage.objects for insert with check (bucket_id = 'memorials');
create policy "Anyone can update their own memorial photos." on storage.objects for update using (bucket_id = 'memorials' and auth.uid() = owner);
create policy "Anyone can delete their own memorial photos." on storage.objects for delete using (bucket_id = 'memorials' and auth.uid() = owner);
