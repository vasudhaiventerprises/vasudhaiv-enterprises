-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.service_requests enable row level security;
alter table public.installations enable row level security;
alter table public.electricity_logs enable row level security;
alter table public.referrals enable row level security;
alter table public.client_notes enable row level security;

-- ==============================================
-- 1. Profiles
-- ==============================================
-- Users can see and update only their own profile
create policy "user_select_profile" on public.profiles
  for select using (auth.uid() = id);

create policy "user_update_profile" on public.profiles
  for update using (auth.uid() = id);

-- Admins can see and update all profiles
create policy "admin_all_profiles" on public.profiles
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- SECURITY FIX: Prevent users from escalating privileges by updating their own role
create or replace function public.check_profile_role_update()
returns trigger as $$
begin
  if old.role is distinct from new.role then
    -- Allow change if the user performing the update is an admin or using service role
    if not (
      exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
      or current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
    ) then
      raise exception 'Unauthorized to change role';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger tr_check_profile_role_update
  before update on public.profiles
  for each row
  execute function public.check_profile_role_update();

-- ==============================================
-- 2. Leads (Public Form)
-- ==============================================
-- SECURITY FIX: Added RLS for leads
-- Anyone can insert a new lead (public form)
create policy "public_insert_leads" on public.leads
  for insert with check (true);

-- Only admin and co_admin can read/update leads
create policy "admin_coadmin_manage_leads" on public.leads
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );

-- ==============================================
-- 3. Installations
-- ==============================================
-- SECURITY FIX: Added RLS for installations
-- Users can see their own installations
create policy "user_own_installations" on public.installations
  for select using (auth.uid() = client_id);

-- Admins and co_admins can manage all installations
create policy "admin_manage_installations" on public.installations
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );

-- ==============================================
-- 4. Service Requests
-- ==============================================
-- Users can see their own service requests and insert new ones
create policy "user_select_requests" on public.service_requests
  for select using (auth.uid() = client_id);

create policy "user_insert_requests" on public.service_requests
  for insert with check (auth.uid() = client_id);

-- Assigned staff can see and update service requests assigned to them
create policy "staff_assigned_requests" on public.service_requests
  for all using (auth.uid() = assigned_staff);

-- Admins and co_admins can manage all service requests
create policy "admin_coadmin_all_requests" on public.service_requests
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );

-- ==============================================
-- 5. Electricity Logs
-- ==============================================
-- Users can manage their own electricity logs
create policy "user_own_electricity" on public.electricity_logs
  for all using (auth.uid() = user_id);

-- Admins can view all electricity logs
create policy "admin_select_electricity" on public.electricity_logs
  for select using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );

-- ==============================================
-- 6. Referrals
-- ==============================================
-- Users can view their own referrals
create policy "user_own_referrals" on public.referrals
  for select using (auth.uid() = referrer_id);

create policy "admin_manage_referrals" on public.referrals
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );

-- ==============================================
-- 7. Client Notes
-- ==============================================
-- Only admin and co_admin can view/manage client notes
create policy "admin_notes" on public.client_notes
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('admin','co_admin'))
  );
