import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthModal({ onClose, onAuth }) {
  const [mode,  setMode]  = useState('signup'); // 'signup' | 'signin' | 'magic'
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [busy,  setBusy]  = useState(false);
  const [msg,   setMsg]   = useState(null);   // { type: 'ok'|'err', text }

  if (!supabase) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        setMsg({ type: 'ok', text: 'Magic link sent! Check your email.' });
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password: pass });
        if (error) throw error;
        if (data.user?.identities?.length === 0) {
          setMsg({ type: 'err', text: 'Account already exists. Try signing in.' });
        } else {
          setMsg({ type: 'ok', text: 'Account created! Check email to confirm.' });
          onAuth(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
        if (error) throw error;
        onAuth(data.user);
        onClose();
      }
    } catch (err) {
      setMsg({ type: 'err', text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      background: 'rgba(15,32,8,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'flex-end', padding: '0 0 env(safe-area-inset-bottom)',
    }}>
      <div style={{
        width: '100%', maxWidth: 430, margin: '0 auto',
        background: 'white', borderRadius: '24px 24px 0 0',
        padding: '24px 24px 32px',
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: '#d1f0b8', margin: '0 auto 20px' }}/>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f2008', marginBottom: 4 }}>
          {mode === 'signup' ? 'Create account' : mode === 'signin' ? 'Welcome back' : 'Magic link'}
        </h2>
        <p style={{ fontSize: 13, color: '#7aaa6a', marginBottom: 20 }}>
          Sync your goblin HP and streak across devices
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email" placeholder="Email address" value={email}
            onChange={e => setEmail(e.target.value)} required
            style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid #d1f0b8',
              fontSize: 15, fontWeight: 500, outline: 'none', fontFamily: 'inherit' }}
          />
          {mode !== 'magic' && (
            <input
              type="password" placeholder="Password" value={pass} minLength={6}
              onChange={e => setPass(e.target.value)} required
              style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid #d1f0b8',
                fontSize: 15, fontWeight: 500, outline: 'none', fontFamily: 'inherit' }}
            />
          )}

          {msg && (
            <div style={{ padding: '10px 14px', borderRadius: 12,
              background: msg.type === 'ok' ? '#f0fce8' : '#fef2f2',
              border: `1px solid ${msg.type === 'ok' ? '#22c55e' : '#fca5a5'}` }}>
              <p style={{ fontSize: 13, color: msg.type === 'ok' ? '#15803d' : '#dc2626', margin: 0, fontWeight: 600 }}>
                {msg.text}
              </p>
            </div>
          )}

          <button type="submit" disabled={busy}
            style={{ width: '100%', padding: 16, borderRadius: 16, background: busy ? '#7aaa6a' : '#15803d',
              color: 'white', fontSize: 16, fontWeight: 900, border: 'none', cursor: busy ? 'default' : 'pointer',
              boxShadow: '0 6px 24px rgba(21,128,61,0.3)' }}>
            {busy ? '...' : mode === 'signup' ? 'Create account →' : mode === 'signin' ? 'Sign in →' : 'Send magic link →'}
          </button>
        </form>

        {/* Mode switcher */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
          {mode !== 'signup' && (
            <button onClick={() => { setMode('signup'); setMsg(null); }}
              style={{ background: 'none', border: 'none', fontSize: 13, color: '#15803d', fontWeight: 700, cursor: 'pointer' }}>
              Create account
            </button>
          )}
          {mode !== 'signin' && (
            <button onClick={() => { setMode('signin'); setMsg(null); }}
              style={{ background: 'none', border: 'none', fontSize: 13, color: '#15803d', fontWeight: 700, cursor: 'pointer' }}>
              Sign in
            </button>
          )}
          {mode !== 'magic' && (
            <button onClick={() => { setMode('magic'); setMsg(null); }}
              style={{ background: 'none', border: 'none', fontSize: 13, color: '#7aaa6a', fontWeight: 600, cursor: 'pointer' }}>
              Magic link
            </button>
          )}
        </div>

        <button onClick={onClose}
          style={{ display: 'block', margin: '12px auto 0', background: 'none', border: 'none',
            fontSize: 13, color: '#7aaa6a', cursor: 'pointer' }}>
          Maybe later
        </button>
      </div>
    </div>
  );
}
