-- Eternity AI Schema Migration

-- 1. Create a table for Public Profiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text
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
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Storage Buckets (Memories and Avatars)
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('memories', 'memories', false) on conflict do nothing;

-- Storage Policies for Avatars
create policy "Avatar images are publicly accessible." on storage.objects for select using (bucket_id = 'avatars');
create policy "Anyone can upload an avatar." on storage.objects for insert with check (bucket_id = 'avatars');

-- Storage Policies for Memories (User Private)
create policy "Users can view their own uploaded memories." on storage.objects for select using (bucket_id = 'memories' and auth.uid() = owner);
create policy "Users can upload memories." on storage.objects for insert with check (bucket_id = 'memories' and auth.uid() = owner);
