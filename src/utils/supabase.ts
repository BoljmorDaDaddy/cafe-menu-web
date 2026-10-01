import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fhuzzbgehqvxwmohmvgz.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_2y1bjOuSI65upwNX3bW58w_QN21szzn';

export const supabase = createClient(supabaseUrl, supabaseKey);
