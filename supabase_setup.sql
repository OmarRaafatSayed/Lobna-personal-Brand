-- ============================================
-- Lobna Portfolio - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  password text not null,
  role text not null default 'admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- PROFILES TABLE
-- ============================================
create table if not exists profiles (
  id uuid primary key default uuid_generate_v4(),
  name text default 'لبنى',
  title text default 'خبيرة المبيعات والتطوير المهني',
  bio text default '',
  avatar text default '',
  cv_file text default '',
  hero_tagline text default 'تقديم الدعم بالحب',
  hero_subtitle text default 'بناء جسور الثقة مع مجتمع المبيعات',
  stats_clients int default 0,
  stats_experience int default 0,
  stats_companies int default 0,
  stats_success_rate int default 0,
  previous_companies jsonb default '[]',
  testimonials jsonb default '[]',
  social_linkedin text default '',
  social_instagram text default '',
  social_twitter text default '',
  social_whatsapp text default '',
  social_facebook text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- JOBS TABLE
-- ============================================
create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  company text not null,
  location text not null,
  type text not null,
  description text not null,
  requirements text[] default '{}',
  salary text default '',
  apply_link text not null,
  image text default '',
  is_active boolean default true,
  deadline timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- BLOG_POSTS TABLE
-- ============================================
create table if not exists blog_posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  cover_image text default '',
  tags text[] default '{}',
  is_published boolean default false,
  read_time int default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- TOOLS TABLE
-- ============================================
create table if not exists tools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text not null,
  category text not null,
  link text default '',
  icon text default '',
  is_active boolean default true,
  "order" int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- WORKING_HOURS TABLE
-- ============================================
create table if not exists working_hours (
  id uuid primary key default uuid_generate_v4(),
  day_of_week int unique not null,
  is_active boolean default false,
  slots jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  whatsapp text not null,
  job_status text not null,
  message text not null,
  date text not null,
  time text not null,
  platform text not null,
  meeting_link text default '',
  status text default 'pending',
  whatsapp_notified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- SEED DEFAULT DATA
-- ============================================

-- Default profile
insert into profiles (name, title, bio, hero_tagline, hero_subtitle, stats_clients, stats_experience, stats_companies, stats_success_rate)
values ('لبنى', 'خبيرة المبيعات والتطوير المهني', 'أساعدك في بناء مسيرتك المهنية في المبيعات بخبرة تمتد لسنوات في كبرى الشركات.', 'تقديم الدعم بالحب', 'بناء جسور الثقة مع مجتمع المبيعات', 150, 8, 12, 95)
on conflict do nothing;

-- Default working hours (Mon-Thu active 9-12)
insert into working_hours (day_of_week, is_active, slots) values
(0, false, '[]'),
(1, true,  '[{"start":"09:00","end":"12:00"}]'),
(2, true,  '[{"start":"09:00","end":"12:00"}]'),
(3, true,  '[{"start":"09:00","end":"12:00"}]'),
(4, true,  '[{"start":"09:00","end":"12:00"}]'),
(5, false, '[]'),
(6, false, '[]')
on conflict (day_of_week) do nothing;

-- ============================================
-- DISABLE ROW LEVEL SECURITY (use service role)
-- ============================================
alter table users disable row level security;
alter table profiles disable row level security;
alter table jobs disable row level security;
alter table blog_posts disable row level security;
alter table tools disable row level security;
alter table working_hours disable row level security;
alter table bookings disable row level security;
