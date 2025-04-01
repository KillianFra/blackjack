import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '$env/static/private';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase URL or API key missing. Check your .env file");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
