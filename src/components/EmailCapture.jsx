import { useState } from 'react';

// Replace these with real values from Beehiiv → Settings → Integrations → API
const BEEHIIV_PUBLICATION_ID = import.meta.env.VITE_BEEHIIV_PUBLICATION_ID || '';
const BEEHIIV_API_KEY = import.meta.env.VITE_BEEHIIV_API_KEY || '';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    setErrorMsg('');

    try {
      if (BEEHIIV_PUBLICATION_ID && BEEHIIV_API_KEY) {
        // Beehiiv API
        const res = await fetch(
          `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${BEEHIIV_API_KEY}`,
            },
            body: JSON.stringify({
              email,
              reactivate_existing: false,
              send_welcome_email: true,
              utm_source: 'caffiend-landing',
            }),
          }
        );
        if (!res.ok) throw new Error('Subscription failed');
      } else {
        // Fallback: save to Supabase until Beehiiv is connected
        const res = await fetch(
          'https://lgcvivyrsdigtoqquxwr.supabase.co/functions/v1/capture-email',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          }
        );
        if (!res.ok) throw new Error('Signup failed');
      }
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl px-6 py-5 text-center"
        style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}
      >
        <p className="text-2xl mb-1">✅</p>
        <p className="font-semibold text-white">You're in!</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Check your inbox for a welcome email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 rounded-2xl px-5 py-4 text-base text-white placeholder-white/30 outline-none focus:ring-2 focus:ring-amber-400/40"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'inherit',
        }}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-2xl px-8 py-4 font-bold text-base text-black whitespace-nowrap active:scale-95 transition-transform"
        style={{
          background: status === 'loading' ? 'rgba(251,191,36,0.5)' : 'linear-gradient(135deg, #fcd34d, #f59e0b)',
          cursor: status === 'loading' ? 'wait' : 'pointer',
        }}
      >
        {status === 'loading' ? 'Joining...' : 'Get the tips'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-sm mt-2 w-full text-left">{errorMsg}</p>
      )}
    </form>
  );
}
