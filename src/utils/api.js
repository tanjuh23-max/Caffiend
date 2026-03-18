const SUPABASE_URL = 'https://lgcvivyrsdigtoqquxwr.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnY3Zpdnlyc2RpZ3RvcXF1eHdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NTg1MTAsImV4cCI6MjA4OTMzNDUxMH0.kT9rJE5P1EyM92JYcA_T8h4zrBR5gLs8fDnZX5voDv0';

/**
 * Calls the verify-pro Edge Function.
 * Returns { isPro: true, expiresAt: '...' } or { isPro: false }
 */
export async function verifyProEmail(email) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/verify-pro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
    },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}
