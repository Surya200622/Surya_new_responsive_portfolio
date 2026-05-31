-- Migration 002: Add Invoices, Payments, and Project Enhancements

-- 1. Add Reference Code to Quotations and Projects
ALTER TABLE public.quotations 
ADD COLUMN reference_code TEXT UNIQUE;

ALTER TABLE public.projects
ADD COLUMN reference_code TEXT UNIQUE,
ADD COLUMN progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100);

-- Drop the old constraint first so we can update the rows
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_status_check;

-- Map existing lowercase statuses to the new capitalized ones
UPDATE public.projects SET status = 'Pending' WHERE status = 'pending';
UPDATE public.projects SET status = 'Completed' WHERE status = 'completed';
UPDATE public.projects SET status = 'Cancelled' WHERE status = 'cancelled';
UPDATE public.projects SET status = 'Review Phase' WHERE status = 'review';
UPDATE public.projects SET status = 'Development Phase' WHERE status = 'in_progress';

-- Add the new check constraint for project status
ALTER TABLE public.projects ADD CONSTRAINT projects_status_check 
CHECK (status IN (
  'Waiting for Payment',
  'Requirements Gathering',
  'Design Phase',
  'Development Phase',
  'Testing Phase',
  'Review Phase',
  'Completed',
  'Pending',
  'Cancelled'
));

-- 2. Create Invoices Table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'partially_paid', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  items JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Payments Table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_id TEXT,
  payment_type TEXT CHECK (payment_type IN ('advance', 'final', 'installment')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verification_pending', 'completed', 'failed')),
  payment_method TEXT DEFAULT 'upi',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Project Files Table (for Client Upload System)
CREATE TABLE public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general' CHECK (category IN ('requirements', 'document', 'image', 'logo', 'payment_screenshot', 'general')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- Policies for Invoices
CREATE POLICY "Clients can view own invoices" ON public.invoices 
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Admin can view and manage all invoices" ON public.invoices 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policies for Payments
CREATE POLICY "Clients can view own payments" ON public.payments 
  FOR SELECT USING (client_id = auth.uid());

CREATE POLICY "Clients can insert own payments" ON public.payments 
  FOR INSERT WITH CHECK (client_id = auth.uid());

CREATE POLICY "Admin can view and manage all payments" ON public.payments 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Policies for Project Files
CREATE POLICY "Clients can view files for own projects" ON public.project_files 
  FOR SELECT USING (
    uploaded_by = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Clients can upload files for own projects" ON public.project_files 
  FOR INSERT WITH CHECK (
    uploaded_by = auth.uid() AND
    EXISTS (SELECT 1 FROM public.projects WHERE id = project_id AND client_id = auth.uid())
  );

CREATE POLICY "Admin can view and manage all project files" ON public.project_files 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Helper function to generate reference codes
CREATE OR REPLACE FUNCTION generate_reference_code(prefix TEXT) 
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  seq_val INT;
  result TEXT;
BEGIN
  year := to_char(CURRENT_DATE, 'YYYY');
  
  -- Use a simple sequence for demonstration, ideally you'd use a real sequence per type
  -- Here we will just generate a random 4 digit number for simplicity, 
  -- but a real sequence generator is better for production.
  seq_val := floor(random() * 9000 + 1000)::int;
  
  result := prefix || '-' || year || '-' || lpad(seq_val::text, 4, '0');
  RETURN result;
END;
$$ LANGUAGE plpgsql;
