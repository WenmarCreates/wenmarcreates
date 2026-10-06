-- ==============================================================================
-- WENMARCREATES - SUPABASE VISITORS TABLE SETUP
-- Run this script in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create the visitors table in the public schema
CREATE TABLE IF NOT EXISTS public.visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  verified BOOLEAN DEFAULT TRUE,
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  verification_type TEXT DEFAULT 'direct_backend_with_mx',
  mx_status TEXT DEFAULT 'valid_mx',
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS) on the table
ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policy to allow website visitors (anonymous and authenticated) to insert & update records
DROP POLICY IF EXISTS "Allow anonymous visitors to insert and update" ON public.visitors;

CREATE POLICY "Allow anonymous visitors to insert and update"
ON public.visitors
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Enable real-time updates (optional, for live monitoring in Supabase dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.visitors;
