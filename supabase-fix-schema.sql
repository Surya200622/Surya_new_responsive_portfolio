-- Fix for schema collision between CRM and Portfolio
-- 1. Rename the current 'projects' table (which is actually the portfolio) to 'portfolio_projects'
ALTER TABLE IF EXISTS public.projects RENAME TO portfolio_projects;

-- Drop the old RLS policies on the renamed table so they can be recreated cleanly
DROP POLICY IF EXISTS "Projects are publicly viewable" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Admins can manage projects" ON public.portfolio_projects;

-- Re-create policies for portfolio_projects
CREATE POLICY "Portfolio projects are publicly viewable" 
ON public.portfolio_projects FOR SELECT USING (true);

CREATE POLICY "Admins can manage portfolio projects" 
ON public.portfolio_projects FOR ALL USING (
  auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
);

-- 2. Recreate the original CRM 'projects' table for the dashboard/quotation system
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
  budget DECIMAL(10,2),
  timeline TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on CRM projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients view own projects" ON public.projects 
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admin view all projects" ON public.projects 
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admin can manage projects" ON public.projects 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Only create trigger if it doesn't exist
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 3. Restore the foreign key on quotations to point to the CRM projects table
ALTER TABLE public.quotations DROP CONSTRAINT IF EXISTS quotations_project_id_fkey;
ALTER TABLE public.quotations
  ADD CONSTRAINT quotations_project_id_fkey
  FOREIGN KEY (project_id)
  REFERENCES public.projects(id)
  ON DELETE CASCADE;
