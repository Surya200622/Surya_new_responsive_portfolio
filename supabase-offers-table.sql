-- IMPORTANT: You must also create a public storage bucket named "offers" in the Supabase Dashboard
-- Create the offers table
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    discount_percentage INTEGER DEFAULT 0,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can view active offers
CREATE POLICY "Anyone can view active offers"
    ON public.offers
    FOR SELECT
    USING (is_active = true AND valid_until > now());

-- Only authenticated users (admins) can insert/update/delete
CREATE POLICY "Admins can manage offers"
    ON public.offers
    FOR ALL
    USING (auth.role() = 'authenticated');
