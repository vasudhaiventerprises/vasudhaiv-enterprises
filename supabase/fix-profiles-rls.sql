-- ============================================
-- FIX: Allow authenticated users to INSERT their own profile row
-- This is needed because when a user logs in for the first time,
-- no profile row exists yet.
-- ============================================
create policy "user_insert_own_profile" on public.profiles
  for insert with check (auth.uid() = id);

-- ============================================
-- FIX: If the admin_all_profiles policy creates circular issues,
-- ensure the basic user_select_profile policy works reliably.
-- The user_select_profile policy (auth.uid() = id) should always
-- allow a user to read their own row regardless of role.
-- ============================================
