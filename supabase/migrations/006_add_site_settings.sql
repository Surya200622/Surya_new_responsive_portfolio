-- Migration: Add site_settings table for feature toggles
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'true',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the calculator toggle (enabled by default)
INSERT INTO site_settings (key, value) VALUES ('calculator_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read settings (visitors need to check if calculator is enabled)
CREATE POLICY "Public can read site_settings" ON site_settings
  FOR SELECT USING (true);

-- Allow authenticated users to update (admin check done at API level)
CREATE POLICY "Authenticated can update site_settings" ON site_settings
  FOR UPDATE USING (true);
