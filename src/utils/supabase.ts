import { createClient } from '@supabase/supabase-js';

// Prefer the classic anon (JWT) key for DB access; fall back to the new publishable key.
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://fhuzzbgehqvxwmohmvgz.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_2y1bjOuSI65upwNX3bW58w_QN21szzn';

if (!import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn('[supabase] No API key in env — using built-in fallback key. Set VITE_SUPABASE_ANON_KEY in Vercel.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
