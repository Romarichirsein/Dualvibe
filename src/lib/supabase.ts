/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase pour DualVibe
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ezkjmpvfiukjddozjtju.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JfzaFQojjYqQg-W7gV5IEg_Y5NWM1eE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
