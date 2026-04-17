-- This function runs with elevated privileges (SECURITY DEFINER)
-- so it bypasses RLS policies. This is safe because it only 
-- returns the role for the currently authenticated user.

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

  -- If no profile exists yet, auto-create one
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
