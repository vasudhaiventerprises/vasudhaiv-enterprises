-- 1. Completely drop the problematic recurring policies 
DROP POLICY IF EXISTS "Admins can view all leads" ON public.leads;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- 2. Define safe policies for leads 
-- (Anyone authenticated can manage leads, avoiding checking the profiles table)
CREATE POLICY "Authenticated users can manage leads" ON public.leads
    FOR ALL USING (
        auth.role() = 'authenticated'
    );

-- 3. Define safe policies for profiles
-- (Users can see their own, and authenticated users can see basic profile info)
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
    FOR SELECT USING (
        auth.role() = 'authenticated'
    );

-- 4. Enable public insert for leads so the landing page form works without login
CREATE POLICY "Anonymous can insert leads" ON public.leads
    FOR INSERT WITH CHECK (
       -- No restriction, anyone can submit the contact form
       true
    );

-- 5. Fix the Referral check on the landing page (needs to verify profile codes)
CREATE POLICY "Anonymous can read referral codes" ON public.profiles
    FOR SELECT USING (
        true
    );
