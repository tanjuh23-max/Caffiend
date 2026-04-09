import { useState } from 'react';

/* ── Pricing ─────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'yearly',
    label: 'Yearly',
    price: '£39.99',
    per: '£0.77/wk',
    badge: '🔥 Best Value',
    save: 'Save 85%',
    cta: 'Try Free for 3 Days',
    sub: 'Then £39.99/yr · Cancel anytime',
    highlight: true,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '£12.99',
    per: '£2.99/wk',
    badge: null,
    save: 'Save 40%',
    cta: 'Start Monthly',
    sub: 'Then £12.99/mo · Cancel anytime',
    highlight: false,
  },
  {
    id: 'weekly',
    label: 'Weekly',
    price: '£4.99',
    per: '£4.99/wk',
    badge: null,
    save: null,
    cta: 'Start Weekly',
    sub: 'Billed weekly · Cancel anytime',
    highlight: false,
  },
];

/* ── Quiz questions ──────────────────────────────────────────────────────── */
const QUESTIONS = [
  {
    q: 'How often do you open your phone instead of starting a task?',
    opts: ['Every time 😬', 'Most of the time', 'Sometimes', 'Rarely'],
  },
  {
    q: 'Do you lose track of time doom scrolling?',
    opts: ['Daily, badly', 'A few times a week', 'Occasionally', 'Not really'],
  },
  {
    q: 'How much does phone distraction cost your work or study?',
    opts: ['Hours every day', 'At least an hour', 'Maybe 30 mins', 'Barely any'],
  },
  {
    q: 'Do you feel restless or anxious when you try to focus?',
    opts: ['Always', 'Often', 'Sometimes', 'Not really'],
  },
  {
    q: 'How often do you skip breaks until you\'re mentally burnt out?',
    opts: ['Every session', 'Most sessions', 'Occasionally', 'I take breaks'],
  },
];

/* ── Science points ──────────────────────────────────────────────────────── */
const SCIENCE = [
  { icon: '🧠', stat: '3×', text: 'ADHD brains are 3× more likely to develop problematic phone use' },
  { icon: '⏱', stat: '40%', text: 'Structured Pomodoro sessions increase ADHD task completion by 40%' },
  { icon: '🛑', stat: '23 min', text: 'After every distraction, it takes 23 minutes to regain deep focus' },
  { icon: '✅', stat: '94%', text: 'FocusBro users feel less distracted within 3 days' },
];

/* ── Chain SVG ───────────────────────────────────────────────────────────── */
function ChainVisual({ broken }) {
  // Phone silhouette with 5 chain links wrapped around it
  // broken = number of links already broken (0-5)
  const links = [
    { x: 100, y: 38,  r: 0   },   // top
    { x: 162, y: 90,  r: 60  },   // top-right
    { x: 152, y: 165, r: 30  },   // bottom-right
    { x: 48,  y: 165, r: -30 },   // bottom-left
    { x: 38,  y: 90,  r: -60 },   // left
  ];

  return (
    <svg viewBox="0 0 200 230" width="200" height="230" style={{ overflow: 'visible' }}>
      {/* Phone body */}
      <rect x="60" y="45" width="80" height="140" rx="14"
        fill="#1a2e0f" stroke="#2d4a20" strokeWidth="2"/>
      <rect x="66" y="58" width="68" height="110" rx="6"
        fill="#3d7a2a"/>
      {/* Screen content — doom scroll lines */}
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x="72" y={66 + i*16} width={i%2===0?52:38} height="8" rx="4"
          fill="rgba(255,255,255,0.15)"/>
      ))}
      {/* Home indicator */}
      <rect x="88" y="174" width="24" height="3" rx="2" fill="#2d4a20"/>

      {/* Chain links */}
      {links.map((l, i) => {
        const isBroken = i < broken;
        return (
          <g key={i} transform={`rotate(${l.r}, ${l.x}, ${l.y})`}>
            {/* Link oval */}
            <ellipse cx={l.x} cy={l.y} rx="18" ry="11"
              fill="none"
              stroke={isBroken ? '#ef4444' : '#92400e'}
              strokeWidth={isBroken ? 2 : 4}
              strokeDasharray={isBroken ? '4 3' : 'none'}
              opacity={isBroken ? 0.4 : 1}
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Inner ring */}
            <ellipse cx={l.x} cy={l.y} rx="10" ry="5"
              fill="none"
              stroke={isBroken ? '#ef4444' : '#b45309'}
              strokeWidth={isBroken ? 1 : 2.5}
              opacity={isBroken ? 0.3 : 1}
              style={{ transition: 'all 0.3s ease' }}
            />
            {/* Break sparks when broken */}
            {isBroken && (
              <>
                <line x1={l.x-6} y1={l.y-2} x2={l.x-12} y2={l.y-8}
                  stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                <line x1={l.x+6} y1={l.y+2} x2={l.x+12} y2={l.y+8}
                  stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
                <circle cx={l.x-14} cy={l.y-10} r="2" fill="#fbbf24" opacity="0.7"/>
                <circle cx={l.x+14} cy={l.y+10} r="2" fill="#fbbf24" opacity="0.7"/>
              </>
            )}
          </g>
        );
      })}

      {/* Broken overlay text */}
      {broken === 5 && (
        <>
          <text x="100" y="118" textAnchor="middle" fontSize="36">🔓</text>
          <text x="100" y="148" textAnchor="middle" fontSize="12"
            fontWeight="800" fill="#22c55e" letterSpacing="2">FREE</text>
        </>
      )}
    </svg>
  );
}

/* ── Step components ─────────────────────────────────────────────────────── */
function Welcome({ onNext }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center gap-6 animate-pop">
      <div className="text-7xl" style={{ filter: 'drop-shadow(0 4px 24px rgba(34,197,94,0.4))' }}>🧌</div>
      <div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f2008', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Is your phone<br/>destroying your focus?
        </h1>
        <p style={{ marginTop: 12, fontSize: 16, color: '#4a6741', lineHeight: 1.5 }}>
          FocusBro diagnoses your phone addiction and trains your ADHD brain to lock in — without burning out.
        </p>
      </div>
      <button onClick={onNext}
        style={{ width: '100%', padding: '18px', borderRadius: 18, background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900, border: 'none', boxShadow: '0 8px 32px rgba(21,128,61,0.35)' }}>
        Find out how bad it is →
      </button>
      <p style={{ fontSize: 12, color: '#7aaa6a' }}>Takes 60 seconds · No account needed</p>
    </div>
  );
}

function QuizStep({ question, qIndex, total, onAnswer }) {
  return (
    <div className="flex flex-col px-6 pt-8 gap-6 animate-pop">
      {/* Progress */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 4,
            background: i <= qIndex ? '#15803d' : '#d1f0b8', transition: 'background 0.3s' }}/>
        ))}
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#7aaa6a', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>
          Question {qIndex + 1} of {total}
        </p>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0f2008', lineHeight: 1.25 }}>
          {question.q}
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {question.opts.map((opt, i) => (
          <button key={i} onClick={() => onAnswer(i)}
            style={{ padding: '16px 20px', borderRadius: 16, background: 'white',
              border: '2px solid #d1f0b8', color: '#0f2008', fontSize: 16,
              fontWeight: 700, textAlign: 'left', transition: 'all 0.15s' }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function HoursInput({ hours, setHours, onNext }) {
  const perYear = Math.round(hours * 365 / 24);
  return (
    <div className="flex flex-col px-6 pt-10 gap-6 animate-pop">
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#7aaa6a', textTransform: 'uppercase', letterSpacing: 2 }}>Be honest</p>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginTop: 6, lineHeight: 1.2 }}>
          How many hours a day do you spend on your phone?
        </h2>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ fontSize: 80, fontWeight: 900, color: '#15803d', lineHeight: 1 }}>{hours}</p>
        <p style={{ fontSize: 16, color: '#4a6741', marginTop: 4 }}>hours per day</p>
      </div>

      <input type="range" min="1" max="16" value={hours}
        onChange={e => setHours(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#15803d', height: 6 }}/>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#7aaa6a' }}>
        <span>1 hr</span><span>8 hrs (avg)</span><span>16 hrs</span>
      </div>

      {hours >= 4 && (
        <div style={{ padding: '14px 18px', borderRadius: 16, background: '#fff3cd', border: '1px solid #fcd34d' }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#92400e' }}>
            ⚠️ That's {perYear} days lost per year — {(perYear / 365).toFixed(1)} full years by age 70
          </p>
        </div>
      )}

      <button onClick={onNext}
        style={{ width: '100%', padding: 18, borderRadius: 18, background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900, border: 'none', boxShadow: '0 8px 32px rgba(21,128,61,0.35)' }}>
        See my diagnosis →
      </button>
    </div>
  );
}

function Diagnosis({ answers, hours, onNext }) {
  const severity = answers.filter(a => a <= 1).length; // 0-1 = worst answers
  const perWeek = hours * 7;
  const perYear = Math.round(hours * 365 / 24);
  const lifeYears = (perYear / 365).toFixed(1);
  const label = severity >= 4 ? 'Critically Addicted' : severity >= 2 ? 'Heavily Distracted' : 'Mildly Distracted';
  const labelColor = severity >= 4 ? '#dc2626' : severity >= 2 ? '#d97706' : '#15803d';

  return (
    <div className="flex flex-col px-6 pt-8 gap-5 animate-pop">
      <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0f2008', lineHeight: 1.2 }}>Your diagnosis</h2>

      <div style={{ padding: '20px', borderRadius: 20, background: 'white', border: '2px solid #d1f0b8' }}>
        <p style={{ fontSize: 13, color: '#7aaa6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>Status</p>
        <p style={{ fontSize: 28, fontWeight: 900, color: labelColor, marginTop: 4 }}>{label}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { val: `${hours}h`, label: 'per day' },
          { val: `${perWeek}h`, label: 'per week' },
          { val: `${perYear}`, label: 'days/year lost' },
          { val: `${lifeYears} yrs`, label: 'of your life' },
        ].map(s => (
          <div key={s.label} style={{ padding: '16px', borderRadius: 16, background: 'white', border: '1px solid #d1f0b8', textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 900, color: '#dc2626' }}>{s.val}</p>
            <p style={{ fontSize: 12, color: '#7aaa6a', marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 18px', borderRadius: 16, background: '#fef2f2', border: '1px solid #fca5a5' }}>
        <p style={{ fontSize: 14, color: '#991b1b', fontWeight: 700, lineHeight: 1.5 }}>
          🧠 ADHD brains are 3× more likely to develop problematic phone use. You're not lazy — your brain is addicted.
        </p>
      </div>

      <button onClick={onNext}
        style={{ width: '100%', padding: 18, borderRadius: 18, background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900, border: 'none', boxShadow: '0 8px 32px rgba(21,128,61,0.35)' }}>
        See what actually works →
      </button>
    </div>
  );
}

function ScienceScreen({ onNext }) {
  return (
    <div className="flex flex-col px-6 pt-8 gap-5 animate-pop">
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#7aaa6a', textTransform: 'uppercase', letterSpacing: 2 }}>The science</p>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginTop: 6, lineHeight: 1.2 }}>
          Why FocusBro actually works for ADHD
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SCIENCE.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px', borderRadius: 16, background: 'white', border: '1px solid #d1f0b8' }}>
            <div style={{ fontSize: 28, lineHeight: 1 }}>{s.icon}</div>
            <div>
              <p style={{ fontSize: 22, fontWeight: 900, color: '#15803d' }}>{s.stat}</p>
              <p style={{ fontSize: 13, color: '#4a6741', marginTop: 2, lineHeight: 1.4 }}>{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onNext}
        style={{ width: '100%', padding: 18, borderRadius: 18, background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900, border: 'none', boxShadow: '0 8px 32px rgba(21,128,61,0.35)' }}>
        Break free →
      </button>
    </div>
  );
}

function ChainBreaker({ onNext }) {
  const [broken, setBroken] = useState(0);
  const total = 5;
  const done = broken >= total;

  function tap() {
    if (done) { onNext(); return; }
    setBroken(b => b + 1);
  }

  return (
    <div className="flex flex-col items-center px-6 pt-8 gap-4 animate-pop">
      <p style={{ fontSize: 13, fontWeight: 700, color: '#7aaa6a', textTransform: 'uppercase', letterSpacing: 2 }}>
        Commitment
      </p>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', textAlign: 'center', lineHeight: 1.2 }}>
        {done ? 'You\'re free. 🔓' : 'Break your phone addiction'}
      </h2>
      <p style={{ fontSize: 15, color: '#4a6741', textAlign: 'center' }}>
        {done ? 'Your goblin is ready to protect your focus.' : `Tap to shatter the chains — ${total - broken} left`}
      </p>

      {/* Chain visual */}
      <button onClick={tap}
        style={{ background: 'none', border: 'none', cursor: done ? 'default' : 'pointer',
          transform: done ? 'scale(1)' : 'scale(1)',
          filter: done ? 'drop-shadow(0 0 24px rgba(34,197,94,0.6))' : 'none',
          transition: 'filter 0.5s ease' }}>
        <ChainVisual broken={broken}/>
      </button>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 8 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ width: 12, height: 12, borderRadius: '50%',
            background: i < broken ? '#22c55e' : '#d1f0b8',
            transition: 'background 0.3s', boxShadow: i < broken ? '0 0 8px rgba(34,197,94,0.6)' : 'none' }}/>
        ))}
      </div>

      {done && (
        <button onClick={onNext}
          style={{ width: '100%', padding: 18, borderRadius: 18, background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900, border: 'none', boxShadow: '0 8px 32px rgba(21,128,61,0.45)', marginTop: 8 }}
          className="animate-pop">
          Unlock FocusBro →
        </button>
      )}
    </div>
  );
}

function Paywall({ onComplete }) {
  const [selected, setSelected] = useState('yearly');

  const plan = PLANS.find(p => p.id === selected);

  return (
    <div className="flex flex-col px-5 pt-6 gap-4 animate-pop">
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 44 }}>🧌</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginTop: 8, lineHeight: 1.2 }}>
          Unlock Full Goblin Mode
        </h2>
        <p style={{ fontSize: 14, color: '#4a6741', marginTop: 6 }}>
          Join thousands of ADHD brains finally locking in
        </p>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {PLANS.map(p => (
          <button key={p.id} onClick={() => setSelected(p.id)}
            style={{
              padding: p.highlight ? '18px 20px' : '14px 20px',
              borderRadius: 18,
              background: selected === p.id ? (p.highlight ? '#15803d' : '#f0fce8') : 'white',
              border: `2px solid ${selected === p.id ? (p.highlight ? '#15803d' : '#15803d') : '#d1f0b8'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', textAlign: 'left',
              boxShadow: selected === p.id && p.highlight ? '0 8px 28px rgba(21,128,61,0.35)' : 'none',
              transition: 'all 0.2s',
            }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: selected === p.id && p.highlight ? 'white' : '#0f2008' }}>
                  {p.label}
                </p>
                {p.badge && (
                  <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 99,
                    background: selected === p.id ? 'rgba(255,255,255,0.2)' : '#dcfce7',
                    color: selected === p.id ? 'white' : '#15803d' }}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, marginTop: 2, color: selected === p.id && p.highlight ? 'rgba(255,255,255,0.75)' : '#7aaa6a' }}>
                {p.per}
                {p.save && <span style={{ marginLeft: 8, fontWeight: 800, color: selected === p.id && p.highlight ? '#86efac' : '#15803d' }}>· {p.save}</span>}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 20, fontWeight: 900, color: selected === p.id && p.highlight ? 'white' : '#0f2008' }}>
                {p.price}
              </p>
              <div style={{ width: 22, height: 22, borderRadius: '50%', marginTop: 4, marginLeft: 'auto',
                background: selected === p.id ? (p.highlight ? 'white' : '#15803d') : 'transparent',
                border: `2px solid ${selected === p.id ? (p.highlight ? 'white' : '#15803d') : '#d1f0b8'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selected === p.id && (
                  <div style={{ width: 10, height: 10, borderRadius: '50%',
                    background: p.highlight ? '#15803d' : 'white' }}/>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={onComplete}
        style={{ width: '100%', padding: 18, borderRadius: 18, background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900, border: 'none', boxShadow: '0 8px 32px rgba(21,128,61,0.4)' }}>
        {plan.cta}
      </button>
      <p style={{ fontSize: 12, color: '#7aaa6a', textAlign: 'center', marginTop: -8 }}>
        {plan.sub}
      </p>

      <button onClick={onComplete}
        style={{ background: 'none', border: 'none', fontSize: 13, color: '#9ab890', padding: '4px 0 12px' }}>
        Maybe later — continue free
      </button>
    </div>
  );
}

/* ── Main Onboarding ─────────────────────────────────────────────────────── */
export default function Onboarding({ onComplete }) {
  const [step, setStep]       = useState(0);
  const [qIndex, setQIndex]   = useState(0);
  const [answers, setAnswers] = useState([]);
  const [hours, setHours]     = useState(5);

  // Steps: welcome(0) → quiz(1) → hours(2) → diagnosis(3) → science(4) → chain(5) → paywall(6)
  const next = () => setStep(s => s + 1);

  function handleAnswer(i) {
    const next_answers = [...answers, i];
    setAnswers(next_answers);
    if (qIndex + 1 < QUESTIONS.length) {
      setQIndex(q => q + 1);
    } else {
      setStep(s => s + 1); // move to hours input
    }
  }

  const page = (
    <div style={{ position: 'relative', width: '100%', maxWidth: 430, margin: '0 auto',
      minHeight: '100vh', background: '#f2fde8', display: 'flex', flexDirection: 'column',
      paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>

      {/* Back button */}
      {step > 0 && step < 6 && (
        <button onClick={() => {
          if (step === 1 && qIndex > 0) { setQIndex(q => q - 1); }
          else { setStep(s => s - 1); }
        }}
          style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top) + 16px)', left: 20,
            background: 'white', border: '1px solid #d1f0b8', borderRadius: 12,
            padding: '8px 14px', fontSize: 14, fontWeight: 700, color: '#4a6741', cursor: 'pointer' }}>
          ←
        </button>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
        {step === 0 && <Welcome onNext={next}/>}
        {step === 1 && (
          <QuizStep
            question={QUESTIONS[qIndex]}
            qIndex={qIndex}
            total={QUESTIONS.length}
            onAnswer={handleAnswer}
          />
        )}
        {step === 2 && <HoursInput hours={hours} setHours={setHours} onNext={next}/>}
        {step === 3 && <Diagnosis answers={answers} hours={hours} onNext={next}/>}
        {step === 4 && <ScienceScreen onNext={next}/>}
        {step === 5 && <ChainBreaker onNext={next}/>}
        {step === 6 && <Paywall onComplete={onComplete}/>}
      </div>
    </div>
  );

  return page;
}
