import { createClient } from '@supabase/supabase-js';

// These would normally be in .env files. 
// I'm using placeholders so the user can fill them in easily.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
