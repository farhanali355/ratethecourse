
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Public profile for users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  full_name text,
  username text,
  bio text,
  avatar_url text,
  anonymous_posting boolean default false,
  email_notifications boolean default true,
  is_admin boolean default false,
  role text default 'student',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Handle new user signup automatically (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. COACHES TABLE
create table public.coaches (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  website_url text,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  submitted_by uuid references public.profiles(id),
  average_rating numeric default 0,
  total_reviews int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for coaches
alter table public.coaches enable row level security;

-- Policies for coaches
create policy "Approved coaches are viewable by everyone"
  on public.coaches for select
  using ( status = 'approved' );

create policy "Users can insert coaches (pending approval)"
  on public.coaches for insert
  with check ( auth.role() = 'authenticated' );

-- 3. COURSES TABLE
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  title text not null,
  description text,
  url text,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for courses
alter table public.courses enable row level security;

-- Policies for courses
create policy "Approved courses are viewable by everyone"
  on public.courses for select
  using ( status = 'approved' );

create policy "Users can insert courses"
  on public.courses for insert
  with check ( auth.role() = 'authenticated' );


-- 4. REVIEWS TABLE
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  coach_id uuid references public.coaches(id) on delete cascade not null,
  user_id uuid references public.profiles(id),
  rating int check (rating >= 1 and rating <= 5) not null,
  difficulty int check (difficulty >= 1 and difficulty <= 5) not null,
  comment text,
  is_anonymous boolean default false,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for reviews
alter table public.reviews enable row level security;

-- Policies for reviews
create policy "Approved reviews are viewable by everyone"
  on public.reviews for select
  using ( status = 'approved' );

create policy "Authenticated users can create reviews"
  on public.reviews for insert
  with check ( auth.role() = 'authenticated' );
