-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    tech_array TEXT[] NOT NULL DEFAULT '{}',
    year TEXT NOT NULL,
    link TEXT,
    buyable BOOLEAN DEFAULT false,
    hide_link BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy 1: Anyone can read projects (Publicly accessible on the homepage)
CREATE POLICY "Projects are publicly viewable" 
ON public.projects FOR SELECT 
USING (true);

-- Policy 2: Only admins can insert, update, delete
CREATE POLICY "Admins can manage projects" 
ON public.projects FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Insert initial projects data
INSERT INTO public.projects (slug, title, category, description, image, tech_array, year, link, buyable, hide_link)
VALUES 
(
  'dental-experts', 
  'DentalExperts', 
  'Healthcare CRM', 
  'Comprehensive dental clinic management system with appointment scheduling, patient records, and billing integration.', 
  '/images/project-dental.jpg', 
  ARRAY['Python', 'Django', 'HTML/CSS', 'SQLite', 'Bootstrap'], 
  '2025', 
  'https://suryacs.pythonanywhere.com', 
  true, 
  false
),
(
  'cipher-apparel', 
  'CipherApparel E-Commerce', 
  'E-Commerce Platform', 
  'Modern, fully-featured e-commerce store with cart management, secure checkout, and admin dashboard.', 
  '/images/project-ecommerce.jpg', 
  ARRAY['Python', 'Django', 'JavaScript', 'Bootstrap', 'PostgreSQL'], 
  '2025', 
  'https://cipherapparel.pythonanywhere.com', 
  true, 
  false
),
(
  'personal-portfolio', 
  'Personal Portfolio', 
  'Web Application', 
  'Modern, blazing-fast personal portfolio with 3D effects, glassmorphism UI, and smooth animations.', 
  '/images/project-portfolio.jpg', 
  ARRAY['React', 'Next.js', 'Tailwind', 'Framer Motion'], 
  '2025', 
  'https://suryacs.is-a.dev', 
  false, 
  true
);
