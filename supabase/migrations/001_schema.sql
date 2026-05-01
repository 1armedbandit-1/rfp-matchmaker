-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('fighter','trainer','manager','promoter','matchmaker','provider');
create type discipline as enum ('boxing','mma','kickboxing','muay_thai','bjj','wrestling','other');
create type weight_class as enum ('strawweight','flyweight','bantamweight','featherweight','lightweight','welterweight','middleweight','light_heavyweight','heavyweight','super_heavyweight');
create type contact_method as enum ('email','phone','instagram','facebook','signal','whatsapp','in_app');
create type fighter_status as enum ('active','inactive','retired');
create type am_or_pro as enum ('amateur','professional','both');
create type provider_service_type as enum ('cutman','sports_medicine','physical_therapy','nutrition','sports_law','sponsorship','media','other');

-- users (base profile)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  profile_photo_url text,
  primary_role user_role not null,
  secondary_roles user_role[] default '{}',
  city text,
  state_region text,
  country text default 'USA',
  short_bio text check (char_length(short_bio) <= 500),
  preferred_contact_method contact_method,
  preferred_contact_value text,
  is_profile_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- fighter_profiles
create table public.fighter_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  discipline discipline[] default '{}',
  status fighter_status default 'active',
  am_or_pro am_or_pro default 'amateur',
  weight_lbs numeric,
  weight_class weight_class,
  record_pro_w int default 0,
  record_pro_l int default 0,
  record_pro_d int default 0,
  record_pro_kos int default 0,
  record_am_w int default 0,
  record_am_l int default 0,
  record_am_d int default 0,
  boxrec_url text,
  tapology_url text,
  sherdog_url text,
  mma_junkie_url text,
  other_registry_url text,
  looking_for text[] default '{}',
  gym_affiliation text
);

-- trainer_profiles
create table public.trainer_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  gym_name text,
  gym_address text,
  disciplines discipline[] default '{}',
  specialties text,
  years_experience int,
  accepting_new_fighters boolean default true,
  looking_for text[] default '{}'
);

-- manager_profiles
create table public.manager_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  company_name text,
  current_roster_size int default 0,
  disciplines discipline[] default '{}',
  looking_for text[] default '{}'
);

-- promoter_profiles
create table public.promoter_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  organization_name text,
  events_per_year int,
  sanctioning_bodies text[] default '{}',
  disciplines discipline[] default '{}',
  looking_for text[] default '{}'
);

-- matchmaker_profiles
create table public.matchmaker_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  organizations_worked_with text[] default '{}',
  disciplines discipline[] default '{}',
  looking_for text[] default '{}'
);

-- provider_profiles
create table public.provider_profiles (
  user_id uuid primary key references public.users(id) on delete cascade,
  service_type provider_service_type not null,
  credentials text,
  service_area_radius_miles int,
  looking_for text[] default '{}'
);

-- posts
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(body) <= 2000),
  media_url text,
  created_at timestamptz default now()
);

-- post_likes
create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

-- post_comments
create table public.post_comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  body text not null check (char_length(body) <= 1000),
  created_at timestamptz default now()
);

-- contact_reveals
create table public.contact_reveals (
  id uuid primary key default uuid_generate_v4(),
  viewer_id uuid not null references public.users(id) on delete cascade,
  target_id uuid not null references public.users(id) on delete cascade,
  viewed_at timestamptz default now()
);

-- match_requests (AI match cache)
create table public.match_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  request_payload jsonb,
  response_payload jsonb,
  created_at timestamptz default now()
);

-- Indexes
create index posts_user_id_idx on public.posts(user_id);
create index posts_created_at_idx on public.posts(created_at desc);
create index post_likes_post_id_idx on public.post_likes(post_id);
create index post_comments_post_id_idx on public.post_comments(post_id);
create index users_primary_role_idx on public.users(primary_role);
create index users_state_region_idx on public.users(state_region);
create index match_requests_user_created_idx on public.match_requests(user_id, created_at desc);

-- updated_at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger users_updated_at before update on public.users
  for each row execute function public.handle_updated_at();

-- Auto-create user row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Only insert if display_name metadata exists (set during signup)
  if new.raw_user_meta_data->>'display_name' is not null then
    insert into public.users (id, display_name, primary_role)
    values (
      new.id,
      new.raw_user_meta_data->>'display_name',
      (new.raw_user_meta_data->>'primary_role')::user_role
    );
  end if;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.users enable row level security;
alter table public.fighter_profiles enable row level security;
alter table public.trainer_profiles enable row level security;
alter table public.manager_profiles enable row level security;
alter table public.promoter_profiles enable row level security;
alter table public.matchmaker_profiles enable row level security;
alter table public.provider_profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.contact_reveals enable row level security;
alter table public.match_requests enable row level security;

-- users policies
create policy "users_read_all" on public.users for select using (auth.role() = 'authenticated');
create policy "users_update_own" on public.users for update using (auth.uid() = id);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);

-- role profile policies (all same pattern)
create policy "fp_read_all" on public.fighter_profiles for select using (auth.role() = 'authenticated');
create policy "fp_write_own" on public.fighter_profiles for all using (auth.uid() = user_id);
create policy "tp_read_all" on public.trainer_profiles for select using (auth.role() = 'authenticated');
create policy "tp_write_own" on public.trainer_profiles for all using (auth.uid() = user_id);
create policy "mp_read_all" on public.manager_profiles for select using (auth.role() = 'authenticated');
create policy "mp_write_own" on public.manager_profiles for all using (auth.uid() = user_id);
create policy "pp_read_all" on public.promoter_profiles for select using (auth.role() = 'authenticated');
create policy "pp_write_own" on public.promoter_profiles for all using (auth.uid() = user_id);
create policy "mkp_read_all" on public.matchmaker_profiles for select using (auth.role() = 'authenticated');
create policy "mkp_write_own" on public.matchmaker_profiles for all using (auth.uid() = user_id);
create policy "prvp_read_all" on public.provider_profiles for select using (auth.role() = 'authenticated');
create policy "prvp_write_own" on public.provider_profiles for all using (auth.uid() = user_id);

-- posts policies
create policy "posts_read_all" on public.posts for select using (auth.role() = 'authenticated');
create policy "posts_insert_own" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update using (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete using (auth.uid() = user_id);

-- likes / comments
create policy "likes_read_all" on public.post_likes for select using (auth.role() = 'authenticated');
create policy "likes_write_own" on public.post_likes for all using (auth.uid() = user_id);
create policy "comments_read_all" on public.post_comments for select using (auth.role() = 'authenticated');
create policy "comments_insert_own" on public.post_comments for insert with check (auth.uid() = user_id);
create policy "comments_delete_own" on public.post_comments for delete using (auth.uid() = user_id);

-- contact reveals
create policy "reveals_insert_own" on public.contact_reveals for insert with check (auth.uid() = viewer_id);
create policy "reveals_read_own" on public.contact_reveals for select using (auth.uid() = viewer_id);

-- match requests
create policy "match_read_own" on public.match_requests for select using (auth.uid() = user_id);
create policy "match_insert_own" on public.match_requests for insert with check (auth.uid() = user_id);
