import { createClient } from '@supabase/supabase-js';

const url = __SUPABASE_URL__;
const key = __SUPABASE_ANON_KEY__;

// Returns null if Supabase isn't configured yet — app falls back to localStorage
export const supabase = (url && key) ? createClient(url, key) : null;
