import { useState } from 'react';
import { Zap, Check, Lock, X, Mail, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STRIPE_MONTHLY = 'https://buy.stripe.com/8x28wO0Sx4kqco27I02Ji04';
const STRIPE_ANNUAL  = 'https://buy.stripe.com/aFa8wO8kZ8AG2Ns4vO2Ji05';

const PRO_FEATURES = [
  { text: 'Barcode scanner — instant product lookup' },
  { text: 'Full history — all your data, unlimited' },
  { text: 'Export data as CSV' },
  { text: 'Early access to new features' },
];

export default function ProPaywall({ featureName = 'This feature', onClose }) {
  const { verifyPro } = useApp();
  const [showVerify, setShowVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activated, setActivated] = useState(false);

  const handleUpgrade = (plan = 'monthly') => {
    const url = plan === 'annual' ? STRIPE_ANNUAL : STRIPE_MONTHLY;
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => setShowVerify(true), 1500);
  };

  const handleVerify = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await verifyPro(email.trim());
      if (result.isPro) {
        setActivated(true);
        setTimeout(() => onClose?.(), 900);
      } else {
        setError("No active subscription found for that email. Check the email you used on Stripe.");
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (activated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
          <Check size={28} className="text-green-400" />
        </div>
        <p className="text-white font-bold text-lg">Pro Activated!</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Welcome to Caffiend Pro</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-28 flex flex-col" style={{ background: '#060608' }}>
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse 80% 30% at 50% -5%, rgba(245,158,11,0.15) 0%, transparent 70%)',
      }} />

      <div className="relative z-10 px-5 pt-14 pb-2 flex items-center justify-between">
        <div />
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.07)' }}>
            <X size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        )}
      </div>

      <div className="relative z-10 flex flex-col items-center px-5 pt-4">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 8px 32px rgba(245,158,11,0.4)' }}>
          <Zap size={36} className="text-black" strokeWidth={2.5} />
        </div>

        <div className="text-center mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(245,158,11,0.8)' }}>Upgrade required</p>
          <h1 className="text-white text-3xl font-black tracking-tight mt-1">Caffiend Pro</h1>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {featureName} is a Pro feature.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full mt-3 mb-7"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}>
          <Lock size={11} style={{ color: 'rgba(255,255,255,0.35)' }} />
          <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
            FREE PLAN — UPGRADE TO UNLOCK
          </span>
        </div>

        <div className="w-full rounded-3xl p-5 mb-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'rgba(255,255,255,0.3)' }}>Everything in Pro</p>
          <div className="space-y-3.5">
            {PRO_FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                  <Check size={10} style={{ color: '#f59e0b' }} strokeWidth={3} />
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full rounded-3xl p-5 mb-6"
          style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                style={{ color: 'rgba(245,158,11,0.7)' }}>Monthly</p>
              <p className="text-white text-2xl font-black">£9.99<span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>/mo</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                style={{ color: 'rgba(245,158,11,0.7)' }}>Annual</p>
              <p className="text-white text-2xl font-black">£59.99<span className="text-sm font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>/yr</span></p>
              <p className="text-[10px] font-semibold" style={{ color: '#22c55e' }}>2 months free</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleUpgrade('annual')}
          className="w-full h-14 rounded-2xl font-black text-base text-black flex items-center justify-center gap-2 mb-3"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            boxShadow: '0 6px 28px rgba(245,158,11,0.45)',
          }}
        >
          <Zap size={18} strokeWidth={2.5} />
          Get Annual — £59.99/yr
        </button>
        <button
          onClick={() => handleUpgrade('monthly')}
          className="w-full h-11 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 mb-2"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Monthly — £9.99/mo
        </button>

        {!showVerify ? (
          <button
            onClick={() => setShowVerify(true)}
            className="text-sm font-medium py-2"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            Already subscribed? Verify your purchase
          </button>
        ) : (
          <div className="w-full">
            <p className="text-sm text-center mb-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Enter the email you used on Stripe:
            </p>
            <div className="flex items-center gap-2 rounded-2xl px-4 mb-3"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', height: 52 }}>
              <Mail size={15} style={{ color: 'rgba(255,255,255,0.3)' }} />
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleVerify()}
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-white text-sm outline-none"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-center mb-3" style={{ color: '#f87171' }}>{error}</p>
            )}
            <button
              onClick={handleVerify}
              disabled={loading || !email.trim()}
              className="w-full h-12 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{
                background: loading || !email.trim() ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.15)',
                border: `1px solid ${loading || !email.trim() ? 'rgba(255,255,255,0.1)' : 'rgba(34,197,94,0.35)'}`,
                color: loading || !email.trim() ? 'rgba(255,255,255,0.3)' : '#22c55e',
              }}
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
              {loading ? 'Verifying…' : 'Verify Purchase'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
