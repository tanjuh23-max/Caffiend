import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Moon, Zap, AlertTriangle, Trash2, ChevronRight, Info, Crown, Check, ExternalLink, Mail, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';

const STRIPE_URL = 'https://buy.stripe.com/8x28wO0Sx4kqco27I02Ji04';

function SettingRow({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center gap-3 py-4">
      <div className="w-9 h-9 bg-[#222] rounded-xl flex items-center justify-center shrink-0">
        <Icon size={16} className="text-brand-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-neutral-500 text-xs mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function NumberInput({ value, onChange, min, max, step = 1, suffix }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-20 bg-[#222] border border-[#333] rounded-xl px-2.5 py-1.5 text-white text-sm text-right focus:outline-none focus:border-brand-500"
      />
      {suffix && <span className="text-neutral-500 text-xs">{suffix}</span>}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#222] border border-[#333] rounded-xl px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-brand-500"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

export default function Settings() {
  const { settings, updateSettings, clearAll, isPro, proEmail, verifyPro, deactivatePro } = useApp();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  const update = (key, value) => updateSettings({ [key]: value });

  const handleClear = () => {
    if (showClearConfirm) {
      clearAll();
      setShowClearConfirm(false);
    } else {
      setShowClearConfirm(true);
      setTimeout(() => setShowClearConfirm(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-white text-2xl font-black tracking-tight">Settings</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Personalise your caffeine profile</p>
      </div>

      <div className="px-4 space-y-4">

        {/* Pro Card */}
        {isPro ? (
          <div className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 100% 0%, rgba(245,158,11,0.1) 0%, transparent 60%)' }} />
            <div className="relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
                <Crown size={20} className="text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-black text-base">Caffiend Pro</p>
                <p className="text-xs font-semibold truncate" style={{ color: 'rgba(245,158,11,0.8)' }}>
                  {proEmail ? proEmail : 'Active — all features unlocked'}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(34,197,94,0.2)' }}>
                <Check size={12} className="text-green-400" strokeWidth={3} />
              </div>
            </div>
            <div className="relative mt-4 pt-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(245,158,11,0.15)' }}>
              <a href={STRIPE_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <ExternalLink size={11} /> Manage subscription
              </a>
              <button onClick={() => deactivatePro()} className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Deactivate
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 50% at 100% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)' }} />
            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <Crown size={20} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p className="text-white font-black text-base">Caffiend Pro</p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Barcode scan · Full history · Exports</p>
              </div>
            </div>

            {!showVerify ? (
              <div className="relative flex gap-2">
                <button
                  onClick={() => { window.open(STRIPE_URL, '_blank', 'noopener,noreferrer'); setTimeout(() => setShowVerify(true), 1500); }}
                  className="flex-1 h-11 rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 20px rgba(245,158,11,0.35)' }}
                >
                  Upgrade — £9.99/mo
                </button>
                <button
                  onClick={() => setShowVerify(true)}
                  className="px-4 h-11 rounded-2xl text-xs font-semibold"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}
                >
                  Restore
                </button>
              </div>
            ) : (
              <div className="relative">
                <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Enter the email you used on Stripe:
                </p>
                <div className="flex items-center gap-2 rounded-xl px-3 mb-2"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', height: 44 }}>
                  <Mail size={13} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  <input
                    type="email"
                    value={verifyEmail}
                    onChange={e => { setVerifyEmail(e.target.value); setVerifyError(''); }}
                    onKeyDown={async e => {
                      if (e.key === 'Enter' && verifyEmail.trim()) {
                        setVerifyLoading(true); setVerifyError('');
                        try {
                          const r = await verifyPro(verifyEmail.trim());
                          if (!r.isPro) setVerifyError('No active subscription found for that email.');
                          else setShowVerify(false);
                        } catch { setVerifyError('Connection error. Try again.'); }
                        finally { setVerifyLoading(false); }
                      }
                    }}
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent text-white text-sm outline-none"
                    autoFocus
                  />
                </div>
                {verifyError && <p className="text-xs mb-2" style={{ color: '#f87171' }}>{verifyError}</p>}
                <button
                  disabled={verifyLoading || !verifyEmail.trim()}
                  onClick={async () => {
                    setVerifyLoading(true); setVerifyError('');
                    try {
                      const r = await verifyPro(verifyEmail.trim());
                      if (!r.isPro) setVerifyError('No active subscription found for that email.');
                      else setShowVerify(false);
                    } catch { setVerifyError('Connection error. Try again.'); }
                    finally { setVerifyLoading(false); }
                  }}
                  className="w-full h-11 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                  style={{
                    background: verifyLoading || !verifyEmail.trim() ? 'rgba(255,255,255,0.04)' : 'rgba(34,197,94,0.15)',
                    border: `1px solid ${verifyLoading || !verifyEmail.trim() ? 'rgba(255,255,255,0.08)' : 'rgba(34,197,94,0.3)'}`,
                    color: verifyLoading || !verifyEmail.trim() ? 'rgba(255,255,255,0.25)' : '#22c55e',
                  }}
                >
                  {verifyLoading ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                  {verifyLoading ? 'Verifying…' : 'Verify Purchase'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Profile */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl px-4 divide-y divide-[#1f1f1f]">
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider py-3">Profile</p>

          <SettingRow
            icon={User}
            label="Body weight"
            description="Used to show mg/kg ratio"
          >
            <NumberInput value={settings.weight} onChange={v => update('weight', v)} min={30} max={300} suffix="kg" />
          </SettingRow>

          <SettingRow
            icon={Moon}
            label="Target sleep time"
            description="We'll tell you when to stop drinking"
          >
            <input
              type="time"
              value={settings.sleepTime}
              onChange={e => update('sleepTime', e.target.value)}
              className="bg-[#222] border border-[#333] rounded-xl px-2.5 py-1.5 text-white text-sm focus:outline-none focus:border-brand-500"
            />
          </SettingRow>

          <SettingRow
            icon={Zap}
            label="Sensitivity"
            description="How sensitive you are to caffeine"
          >
            <SelectInput
              value={settings.sensitivity}
              onChange={v => update('sensitivity', v)}
              options={[
                { value: 'low',    label: 'Low' },
                { value: 'normal', label: 'Normal' },
                { value: 'high',   label: 'High' },
              ]}
            />
          </SettingRow>
        </div>

        {/* Limits */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl px-4 divide-y divide-[#1f1f1f]">
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider py-3">Limits</p>

          <SettingRow
            icon={AlertTriangle}
            label="Daily limit"
            description="Warning threshold on your gauge"
          >
            <NumberInput value={settings.dailyLimit} onChange={v => update('dailyLimit', v)} min={100} max={1000} step={50} suffix="mg" />
          </SettingRow>

          <SettingRow
            icon={Moon}
            label="Sleep-safe threshold"
            description="Amount below which you can sleep"
          >
            <NumberInput value={settings.sleepThreshold} onChange={v => update('sleepThreshold', v)} min={10} max={200} step={5} suffix="mg" />
          </SettingRow>
        </div>

        {/* About */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl px-4 divide-y divide-[#1f1f1f]">
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider py-3">About</p>

          <div className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#222] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Info size={16} className="text-brand-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Caffeine Metabolism Model</p>
                <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                  Caffiend uses a pharmacokinetic model based on peer-reviewed research.
                  Caffeine peaks ~45 minutes after consumption, then decays with a half-life of ~5.7 hours.
                  Individual variation may occur based on genetics, medications, and tolerance.
                </p>
              </div>
            </div>
          </div>

          <div className="py-4">
            <div className="bg-brand-500/5 border border-brand-500/20 rounded-2xl p-3 text-xs text-neutral-400 leading-relaxed">
              <strong className="text-brand-400">Recommended limits:</strong> The FDA suggests healthy adults consume no more than 400mg/day.
              Pregnant individuals should stay under 200mg/day. Always consult a healthcare provider.
            </div>
          </div>
        </div>

        {/* Data */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl px-4 divide-y divide-[#1f1f1f]">
          <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider py-3">Data</p>

          <div className="py-4">
            <button
              onClick={handleClear}
              className={`flex items-center gap-3 w-full transition-colors ${showClearConfirm ? 'text-red-400' : 'text-neutral-400 hover:text-red-400'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${showClearConfirm ? 'bg-red-500/15' : 'bg-[#222]'}`}>
                <Trash2 size={16} />
              </div>
              <span className="text-sm font-medium">
                {showClearConfirm ? 'Tap again to confirm — this cannot be undone' : 'Clear all data'}
              </span>
            </button>
          </div>
        </div>

        {/* Legal */}
        <div className="flex items-center justify-center gap-4 py-2">
          <button onClick={() => navigate('/privacy')} className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Privacy Policy</button>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
          <button onClick={() => navigate('/terms')} className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>Terms of Service</button>
        </div>

        {/* Version */}
        <div className="text-center py-4">
          <p className="text-neutral-700 text-xs">Caffiend v1.0.0</p>
          <p className="text-neutral-700 text-xs mt-0.5">Know your buzz.</p>
        </div>
      </div>
    </div>
  );
}
