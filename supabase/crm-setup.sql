-- 1. Create new lead_notes table for CRM functionality
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- 3. Lead Notes Policies
CREATE POLICY "Allow authenticated to read lead_notes" ON public.lead_notes 
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to insert lead_notes" ON public.lead_notes 
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. FIX: Critical RLS bypass for Staff and Admins on leads and profiles
-- This ensures the CRM dashboard can fetch data successfully without 403 errors
CREATE POLICY "Admins can view all leads" ON public.leads
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'co_admin')
    );

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR ALL USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'staff', 'co_admin')
    );
