-- Migration 005: Fix quotation statuses and profile trigger
-- Run this in your Supabase SQL Editor

-- 1. Allow 'advance_paid' and 'fully_paid' statuses on quotations
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_status_check;
ALTER TABLE public.quotations ADD CONSTRAINT quotations_status_check 
  CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'advance_paid', 'fully_paid'));

-- 2. Fix the handle_new_user() trigger to handle Google OAuth users
-- Google OAuth stores the name as 'name' or 'full_name' in raw_user_meta_data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'role',
      CASE 
        WHEN (SELECT count(*) FROM public.profiles) = 0 THEN 'admin'
        ELSE 'client'
      END
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Backfill: Create profiles for any auth.users that don't have one
-- This fixes the root cause of the foreign key error for existing users
INSERT INTO public.profiles (id, full_name, email, role)
SELECT 
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ) AS full_name,
  u.email,
  'client' AS role
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 4. Add missing RLS policies for quotations
-- (Quotations RLS was enabled in 001 but no policies were added)
CREATE POLICY "Clients can view own quotations" ON public.quotations 
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admin can manage all quotations" ON public.quotations 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
