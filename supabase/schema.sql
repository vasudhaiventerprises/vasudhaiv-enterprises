-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  city text,
  role text default 'user' check (role in ('user','staff','co_admin','admin')),
  referral_code text unique,
  fcm_token text,
  created_at timestamptz default now()
);

-- Leads (from public form, no login required)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  phone text not null,
  city text,
  roof_type text,
  bill_range text,
  message text,
  referral_code_used text,
  referred_by uuid references public.profiles(id),
  status text default 'new' check (status in ('new','contacted','quoted','converted','lost')),
  created_at timestamptz default now()
);

-- Installations
create table public.installations (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  system_size_kw numeric,
  install_date date,
  warranty_expiry date,
  amc_expiry date,
  amc_amount numeric,
  address text,
  payment_status text default 'pending',
  payment_due_date date,
  created_at timestamptz default now()
);

-- Service Requests
create table public.service_requests (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  installation_id uuid references public.installations(id),
  issue_type text,
  description text,
  preferred_date date,
  status text default 'pending' check (status in ('pending','assigned','in_progress','completed','cancelled')),
  assigned_staff uuid references public.profiles(id),
  completion_note text,
  completion_photo_url text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- Referrals
create table public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.profiles(id),
  lead_id uuid references public.leads(id),
  status text default 'pending' check (status in ('pending','converted','rewarded')),
  reward_amount numeric default 500,
  reward_paid boolean default false,
  created_at timestamptz default now()
);

-- Electricity Logs
create table public.electricity_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  month text not null,
  solar_units numeric,
  grid_units numeric,
  bill_amount numeric,
  savings_amount numeric generated always as (solar_units * (bill_amount / nullif(grid_units,0))) stored,
  co2_offset_kg numeric generated always as (solar_units * 0.82) stored,
  created_at timestamptz default now()
);

-- Notification Logs
create table public.notification_logs (
  id uuid default gen_random_uuid() primary key,
  type text,
  target_user uuid references public.profiles(id),
  title text,
  body text,
  delivered boolean default false,
  created_at timestamptz default now()
);

-- CRM Notes
create table public.client_notes (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references public.profiles(id),
  admin_id uuid references public.profiles(id),
  note text,
  follow_up_date date,
  created_at timestamptz default now()
);
