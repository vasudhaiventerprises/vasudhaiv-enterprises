-- FIX FOR INFINITE RECURSION IN RLS

-- 1. Create a SECURITY DEFINER function to fetch the role bypassing RLS
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Drop the recursive custom policies we just added so they don't break things
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 3. Replace with safe policies that use the function
CREATE POLICY "Admins can view all leads" ON public.leads
    FOR ALL USING (
        public.get_user_role() IN ('admin', 'staff', 'co_admin')
    );

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        public.get_user_role() IN ('admin', 'staff', 'co_admin')
    );
