-- ============================================
-- VASUDHAIV SOLAR: AUTH & ROLE MANAGEMENT
-- Run this ENTIRE block in Supabase SQL Editor
-- ============================================

-- 1. Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    'user'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Bulletproof role checker (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'role', COALESCE(p.role, 'user'),
    'full_name', COALESCE(p.full_name, ''),
    'exists', (p.id IS NOT NULL)
  ) INTO result
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.id = auth.uid();

  IF result IS NULL OR (result->>'exists')::boolean = false THEN
    INSERT INTO public.profiles (id, full_name, role)
    SELECT auth.uid(), 
           split_part((SELECT email FROM auth.users WHERE id = auth.uid()), '@', 1),
           'user'
    ON CONFLICT (id) DO NOTHING;
    
    result := json_build_object('role', 'user', 'full_name', '', 'exists', true);
  END IF;

  RETURN result;
END;
$$;

-- 3. Phone number to email lookup (for phone login)
CREATE OR REPLACE FUNCTION public.get_email_by_phone(phone_input text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  found_email text;
BEGIN
  SELECT u.email INTO found_email
  FROM auth.users u
  JOIN public.profiles p ON p.id = u.id
  WHERE p.phone = phone_input
  LIMIT 1;

  RETURN found_email;
END;
$$;

-- 4. Admin: list all users (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role text;
  result json;
BEGIN
  -- Verify caller is admin
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT json_agg(row_to_json(t)) INTO result
  FROM (
    SELECT p.id, p.full_name, p.phone, p.city, p.role, u.email, p.created_at
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    ORDER BY p.created_at DESC
  ) t;

  RETURN COALESCE(result, '[]'::json);
END;
$$;

-- 5. Admin: promote/demote user role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_set_user_role(target_user_id uuid, new_role text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role text;
BEGIN
  -- Verify caller is admin
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: only admins can change roles';
  END IF;

  -- Validate role value
  IF new_role NOT IN ('user', 'staff', 'co_admin', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Prevent admin from demoting themselves
  IF target_user_id = auth.uid() AND new_role != 'admin' THEN
    RAISE EXCEPTION 'Cannot demote yourself';
  END IF;

  UPDATE public.profiles SET role = new_role WHERE id = target_user_id;

  RETURN json_build_object('success', true, 'new_role', new_role);
END;
$$;

-- 6. Admin: Update user profile (bypasses RLS)
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id uuid,
  new_name text,
  new_phone text,
  new_city text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role text;
BEGIN
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE public.profiles 
  SET full_name = new_name,
      phone = new_phone,
      city = new_city
  WHERE id = target_user_id;

  RETURN json_build_object('success', true);
END;
$$;

-- 7. Admin: Toggle user status (is_active)
CREATE OR REPLACE FUNCTION public.admin_set_user_status(target_user_id uuid, active_status boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller_role text;
BEGIN
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot deactivate yourself';
  END IF;

  UPDATE public.profiles SET is_active = active_status WHERE id = target_user_id;

  RETURN json_build_object('success', true, 'is_active', active_status);
END;
$$;

-- 8. Admin: Delete User (Permanent - USE WITH CAUTION)
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  caller_role text;
BEGIN
  -- 1. Check if caller is admin
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- 2. Prevent self-deletion
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot delete yourself';
  END IF;

  -- 3. Delete from public schema tables (Profiles, Leads, Referrals, etc.)
  -- Note: Service requests, leads etc. should be handled by ON DELETE CASCADE or manually
  DELETE FROM public.referrals WHERE referrer_id = target_user_id;
  DELETE FROM public.service_requests WHERE client_id = target_user_id;
  DELETE FROM public.profiles WHERE id = target_user_id;

  -- 4. Finally delete from auth.users (requires service role / superuser level)
  -- Since we are SECURITY DEFINER as a database user, we can delete from auth if granted.
  -- Most Supabase projects allow this if the function is set up correctly.
  DELETE FROM auth.users WHERE id = target_user_id;

  RETURN json_build_object('success', true);
END;
$$;

-- 9. Add missing columns to profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'is_active') THEN
    ALTER TABLE public.profiles ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'city') THEN
    ALTER TABLE public.profiles ADD COLUMN city TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'address') THEN
    ALTER TABLE public.profiles ADD COLUMN address TEXT;
  END IF;
END $$;

-- 10. Ensure master admin
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Admin', 'admin' 
FROM auth.users 
WHERE email = 'vasudhaiventerprises001@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- 11. Policies
DROP POLICY IF EXISTS "user_insert_own_profile" ON public.profiles;
CREATE POLICY "user_insert_own_profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "user_insert_requests" ON public.service_requests;
CREATE POLICY "user_insert_requests" ON public.service_requests FOR INSERT WITH CHECK (auth.uid() = client_id);
