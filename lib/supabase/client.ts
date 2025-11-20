import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
// Ensure environment variables are set in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables are not set. Please configure .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
