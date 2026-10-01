-- Supabase Schema for Cafe Menu, TV Slides & Settings
-- Run this in the Supabase SQL Editor: https://supabase.com/dashboard/project/fhuzzbgehqvxwmohmvgz/sql

-- 1. Create menu_items table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT,
    category TEXT NOT NULL, -- 'breakfast', 'soup', 'main', 'salad', 'coffee', 'cold_drinks', 'tea'
    type TEXT NOT NULL DEFAULT 'food', -- 'food' or 'drink'
    price NUMERIC NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    ingredients TEXT[] DEFAULT '{}',
    calories INTEGER DEFAULT 0,
    prep_time TEXT DEFAULT '10-15 мин',
    allergens TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create slides table for TV screens
CREATE TABLE IF NOT EXISTS public.slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    price_highlight TEXT,
    image_url TEXT NOT NULL,
    template TEXT NOT NULL DEFAULT 'split_promo', -- 'hero_showcase', 'split_promo', 'menu_board', 'special_offer'
    duration_seconds INTEGER DEFAULT 8,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create cafe_settings table
CREATE TABLE IF NOT EXISTS public.cafe_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    cafe_name TEXT NOT NULL DEFAULT 'Aura Artisan Cafe',
    tagline TEXT DEFAULT 'Эрүүл амт, тав тухтай орчин',
    phone TEXT DEFAULT '+976 7700 8899',
    address TEXT DEFAULT 'Сүхбаатар дүүрэг, 1-р хороо, Central Tower 1F',
    opening_hours TEXT DEFAULT 'Өдөр бүр 08:00 - 22:00',
    wifi_name TEXT DEFAULT 'AuraCafe_Guest',
    wifi_pass TEXT DEFAULT 'auracoffee2026',
    rag_api_url TEXT DEFAULT '',
    admin_pin TEXT DEFAULT '8888',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_settings ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Allow public read access to everyone (no auth needed for customers or TV)
CREATE POLICY "Allow public read access on menu_items" 
    ON public.menu_items FOR SELECT USING (true);

CREATE POLICY "Allow public all access on menu_items" 
    ON public.menu_items FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on slides" 
    ON public.slides FOR SELECT USING (true);

CREATE POLICY "Allow public all access on slides" 
    ON public.slides FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access on cafe_settings" 
    ON public.cafe_settings FOR SELECT USING (true);

CREATE POLICY "Allow public all access on cafe_settings" 
    ON public.cafe_settings FOR ALL USING (true) WITH CHECK (true);

-- 6. Enable Realtime Replication for instant TV & Menu updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.slides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cafe_settings;
