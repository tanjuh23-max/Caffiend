import { useState, useEffect, useCallback, useRef } from 'react';
import GoblinMascot from './components/GoblinMascot';

/* ─── Constants ───────────────────────────────────────────────────────────── */
const WORK_OPTIONS  = [
  { label: '25 min', s: 25*60, desc: 'Classic Pomodoro' },
  { label: '45 min', s: 45*60, desc: 'ADHD sweet spot'  },
  { label: '52 min', s: 52*60, desc: 'Research-backed'  },
];
const BREAK_OPTIONS = [
  { label: '5 min',  s:  5*60, desc: 'Quick reset'  },
  { label: '15 min', s: 15*60, desc: 'Recharge'     },
  { label: '17 min', s: 17*60, desc: 'Deep rest'    },
];

// Goblin health: 100 = perfect sigma, 0 = absolute brainrot
// Each completed session: +20hp (max 100)
// Each skipped break: -15hp
// Each hour without any activity: -5hp (passive decay)
// Starting hp: 60

const MAX_HP = 100;
const SESSION_HP_GAIN = 20;
const SKIP_BREAK_HP_LOSS = 15;
const OVERDUE_THRESHOLD_S = 55 * 60;

/* ─── Storage ─────────────────────────────────────────────────────────────── */
function loadState() {
  try {
    const raw = localStorage.getItem('focusbro_v2');
    if (!raw) return null;
    const s = JSON.parse(raw);
    // Only keep today's sessions
    const today = new Date().toDateString();
    s.sessions = (s.sessions || []).filter(x => new Date(x.endedAt).toDateString() === today);
    return s;
  } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem('focusbro_v2', JSON.stringify(s)); } catch {}
}
function defaultState() {
  return { sessions: [], goblinHp: 60, streak: 0, lastSessionDate: null };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}
function totalFocusMin(sessions) {
  return Math.round(sessions.reduce((a,s) => a + s.workS/60, 0));
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ─── Goblin health → mascot state ───────────────────────────────────────── */
function hpToMascotIdle(hp, sessions) {
  if (hp >= 90) return 'great';
  if (hp >= 65) return sessions.length >= 2 ? 'good' : 'idle';
  if (hp <= 20) return 'overdue';
  return 'idle';
}

/* ─── HP bar ──────────────────────────────────────────────────────────────── */
function HpBar({ hp }) {
  const pct = (hp / MAX_HP) * 100;
  const color = hp >= 70 ? '#4ade80' : hp >= 40 ? '#fbbf24' : '#f87171';
  const label = hp >= 90 ? 'SIGMA 🔥' : hp >= 70 ? 'W Goblin' : hp >= 40 ? 'Mid' : hp >= 20 ? 'Rotting...' : 'COOKED ☠️';
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[11px] uppercase tracking-widest font-bold"
          style={{ color: 'rgba(255,255,255,0.35)' }}>Goblin Health</span>
        <span className="text-[11px] font-bold" style={{ color }}>{label}</span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.07)' }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `0 0 10px ${color}80` }}/>
      </div>
      <p className="text-[10px] mt-1 text-center" style={{ color:'rgba(255,255,255,0.2)' }}>
        {hp}/100hp — {hp >= 70 ? 'locked in frfr' : hp >= 40 ? 'could be worse' : 'goblin is rotting — take breaks!'}
      </p>
    </div>
  );
}

/* ─── Progress ring ───────────────────────────────────────────────────────── */
function Ring({ progress, color, size = 200, sw = 8 }) {
  const r = (size - sw*2) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="absolute" style={{ color }}>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="currentColor" strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c*(1-progress)}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dashoffset 1s linear',
          filter:`drop-shadow(0 0 6px currentColor)` }}/>
    </svg>
  );
}

/* ─── Mode button ─────────────────────────────────────────────────────────── */
function ModeBtn({ opt, sel, onClick }) {
  return (
    <button onClick={onClick} className="flex-1 py-2.5 px-1 rounded-2xl text-center transition-all active:scale-95"
      style={{ background: sel ? 'rgba(251,191,36,0.14)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${sel ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
      <p className="text-sm font-bold" style={{ color: sel ? '#fbbf24' : 'rgba(255,255,255,0.5)' }}>{opt.label}</p>
      <p className="text-[10px] mt-0.5" style={{ color:'rgba(255,255,255,0.25)' }}>{opt.desc}</p>
    </button>
  );
}

/* ─── Session row ─────────────────────────────────────────────────────────── */
function SessionRow({ s, idx }) {
  const mins = Math.round(s.workS/60);
  const time = new Date(s.endedAt).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl animate-slide-up"
      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
          style={{ background:'rgba(251,191,36,0.12)' }}>🧌</div>
        <div>
          <p className="text-sm font-semibold text-white">Session {idx + 1}</p>
          <p className="text-xs" style={{ color:'rgba(255,255,255,0.3)' }}>{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-black" style={{ color:'#fbbf24' }}>{mins} min</p>
        <p className="text-xs" style={{ color:'rgba(255,255,255,0.25)' }}>+{SESSION_HP_GAIN}hp</p>
      </div>
    </div>
  );
}

/* ─── Upgrade banner ──────────────────────────────────────────────────────── */
function UpgradeBanner({ onDismiss }) {
  return (
    <div className="relative rounded-2xl overflow-hidden animate-slide-up"
      style={{ background:'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,146,60,0.08))',
        border:'1px solid rgba(251,191,36,0.25)' }}>
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-black text-white mb-1">🧌 Go Full Goblin Mode — Pro</p>
            <p className="text-xs leading-relaxed" style={{ color:'rgba(255,255,255,0.5)' }}>
              Unlock streak tracking, goblin outfit unlocks, advanced break science, and detailed focus analytics.
            </p>
          </div>
          <button onClick={onDismiss} className="text-xs shrink-0 mt-0.5"
            style={{ color:'rgba(255,255,255,0.25)' }}>✕</button>
        </div>
        <button className="mt-3 w-full py-2.5 rounded-xl text-sm font-black text-black active:scale-95 transition-all"
          style={{ background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
            boxShadow:'0 4px 20px rgba(251,191,36,0.35)' }}>
          Start Free Trial — £4.99/wk after
        </button>
      </div>
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
export default function App() {
  const stored = loadState() ?? defaultState();

  const [sessions, setSessions]   = useState(stored.sessions);
  const [goblinHp, setGoblinHp]   = useState(stored.goblinHp);
  const [streak, setStreak]       = useState(stored.streak);

  const [phase, setPhase]         = useState('idle'); // idle | working | break | done
  const [timeLeft, setTimeLeft]   = useState(WORK_OPTIONS[1].s);
  const [running, setRunning]     = useState(false);
  const [workIdx, setWorkIdx]     = useState(1);
  const [breakIdx, setBreakIdx]   = useState(1);
  const [workElapsed, setWorkElapsed] = useState(0);

  const [celebrateFlag, setCelebrateFlag] = useState(false);
  const [showUpgrade, setShowUpgrade]     = useState(() => sessions.length === 2);
  const [notifGranted, setNotifGranted]   = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const celebTimer   = useRef(null);
  const [caughtYou, setCaughtYou] = useState(false);
  const caughtPenaltyRef = useRef(false);

  const workS  = WORK_OPTIONS[workIdx].s;
  const breakS = BREAK_OPTIONS[breakIdx].s;

  /* Persist on every change */
  useEffect(() => {
    saveState({ sessions, goblinHp, streak });
  }, [sessions, goblinHp, streak]);

  /* Tab-switch detection — Brainrot's core mechanic */
  useEffect(() => {
    if (phase !== 'working') { setCaughtYou(false); return; }
    const handle = () => {
      if (document.hidden && !caughtPenaltyRef.current) {
        caughtPenaltyRef.current = true;
        setCaughtYou(true);
        setGoblinHp(h => clamp(h - 8, 0, MAX_HP));
      } else if (!document.hidden) {
        setCaughtYou(false);
        caughtPenaltyRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handle);
    return () => { document.removeEventListener('visibilitychange', handle); setCaughtYou(false); caughtPenaltyRef.current = false; };
  }, [phase]);

  /* Countdown */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); handlePhaseEnd(); return 0; }
        return t - 1;
      });
      if (phase === 'working') setWorkElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  const handlePhaseEnd = useCallback(() => {
    setRunning(false);
    if (phase === 'working') {
      const s = { id: Date.now(), endedAt: new Date().toISOString(), workS: workElapsed + 1 };
      const next = [...sessions, s];
      setSessions(next);
      setGoblinHp(h => clamp(h + SESSION_HP_GAIN, 0, MAX_HP));
      setWorkElapsed(0);

      // Show upgrade nudge after 2nd session
      if (next.length === 2) setShowUpgrade(true);

      // Update streak
      const today = new Date().toDateString();
      if (stored.lastSessionDate !== today) {
        setStreak(k => k + 1);
      }

      setCelebrateFlag(true);
      clearTimeout(celebTimer.current);
      celebTimer.current = setTimeout(() => setCelebrateFlag(false), 3500);
      notify('Session done! 🧌', 'Goblin earned hp. Time for a break frfr.');
      setPhase('break');
      setTimeLeft(breakS);
    } else if (phase === 'break') {
      notify('Break over ⚡', 'Back to goblin grind mode — lock in.');
      setPhase('idle');
      setTimeLeft(workS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, workElapsed, sessions, workS, breakS]);

  function startSession() {
    setPhase('working'); setTimeLeft(workS); setWorkElapsed(0); setRunning(true);
    requestNotif();
  }
  function pauseResume() { setRunning(r => !r); }
  function skipToBreak() {
    if (phase !== 'working') return;
    setRunning(false);
    const s = { id: Date.now(), endedAt: new Date().toISOString(), workS: workElapsed };
    const next = [...sessions, s];
    setSessions(next);
    setGoblinHp(h => clamp(h + Math.round(SESSION_HP_GAIN * 0.5), 0, MAX_HP));
    setWorkElapsed(0);
    setPhase('break'); setTimeLeft(breakS); setRunning(true);
  }
  function skipBreak() {
    setRunning(false);
    setGoblinHp(h => clamp(h - SKIP_BREAK_HP_LOSS, 0, MAX_HP));
    setPhase('idle'); setTimeLeft(workS);
  }
  function resetAll() {
    setRunning(false); setPhase('idle'); setTimeLeft(workS); setWorkElapsed(0);
  }
  function finishDay() {
    setRunning(false); setPhase('done'); setTimeLeft(0);
  }
  function clearData() {
    setSessions([]); setGoblinHp(60); setStreak(0);
    resetAll();
    saveState(defaultState());
  }

  function requestNotif() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default')
      Notification.requestPermission().then(p => setNotifGranted(p === 'granted'));
  }
  function notify(title, body) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted')
      new Notification(title, { body, icon: '🧌' });
  }

  /* Derived */
  const totalS    = phase === 'break' ? breakS : workS;
  const progress  = phase === 'done' ? 0 : Math.max(0, (totalS - timeLeft) / totalS);
  const focusMin  = totalFocusMin(sessions);
  const ringColor = phase === 'break' ? '#22c55e' : phase === 'done' ? '#a78bfa' : '#fbbf24';
  const isActive  = phase === 'working' || phase === 'break';
  const canStart  = phase === 'idle' || phase === 'done';

  const mascotState = celebrateFlag ? 'celebrate'
    : phase === 'working' ? (workElapsed >= OVERDUE_THRESHOLD_S ? 'overdue' : 'working')
    : phase === 'break'   ? 'break'
    : phase === 'done'    ? 'done'
    : hpToMascotIdle(goblinHp, sessions);

  return (
    <div className="min-h-screen w-full flex flex-col items-center"
      style={{ background:'linear-gradient(180deg,#07070a 0%,#0c0a12 100%)' }}>

      {/* ── Caught-you overlay (Brainrot mechanic) ── */}
      {caughtYou && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background:'rgba(7,7,10,0.96)', backdropFilter:'blur(10px)' }}>
          <GoblinMascot mascotState="overdue" size={200}/>
          <div className="mt-4 text-center">
            <p className="text-2xl font-black text-white mb-2">OI! WHERE D'YOU GO?</p>
            <p className="text-sm leading-relaxed" style={{ color:'rgba(255,255,255,0.45)' }}>
              You left mid-session — goblin lost <span style={{ color:'#f87171', fontWeight:800 }}>8hp</span> while you were gone 😤
            </p>
          </div>
          <button onClick={() => { setCaughtYou(false); caughtPenaltyRef.current = false; }}
            className="mt-6 px-8 py-3.5 rounded-2xl font-black text-lg text-black transition-all active:scale-95"
            style={{ background:'linear-gradient(135deg,#f59e0b,#fbbf24)', boxShadow:'0 4px 24px rgba(251,191,36,0.45)' }}>
            🧌 Back to Goblin Mode
          </button>
          <p className="mt-3 text-xs" style={{ color:'rgba(255,255,255,0.2)' }}>
            don't make goblin lose all his HP fr
          </p>
        </div>
      )}

      <div className="w-full max-w-sm flex flex-col min-h-screen px-4 pb-10">

        {/* ── Header ── */}
        <header className="pt-10 pb-2 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Focus<span style={{ color:'#fbbf24' }}>Bro</span>
            </h1>
            <p className="text-xs font-medium mt-0.5" style={{ color:'rgba(255,255,255,0.25)' }}>
              lock in · take breaks · don't rot
            </p>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
                style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.2)' }}>
                <span className="text-sm">🔥</span>
                <span className="text-sm font-black" style={{ color:'#fbbf24' }}>{streak}</span>
              </div>
            )}
            <div className="text-right">
              <p className="text-xl font-black" style={{ color:'#fbbf24' }}>{focusMin}</p>
              <p className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color:'rgba(255,255,255,0.25)' }}>min today</p>
            </div>
          </div>
        </header>

        {/* ── Goblin health bar ── */}
        <div className="mt-3 mb-2">
          <HpBar hp={goblinHp}/>
        </div>

        {/* ── Mascot ── */}
        <div className="flex flex-col items-center py-2">
          <GoblinMascot mascotState={mascotState} size={220}/>
        </div>

        {/* ── Timer ring ── */}
        <div className="flex flex-col items-center mt-2 mb-4">
          <div className="relative flex items-center justify-center" style={{ width:190, height:190 }}>
            <Ring progress={progress} color={ringColor} size={190} sw={7}/>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black tabular-nums tracking-tight"
                style={{ color: phase==='done' ? '#a78bfa' : 'white' }}>
                {phase === 'done' ? '✓' : fmt(timeLeft)}
              </span>
              <span className="text-[11px] uppercase tracking-widest mt-1"
                style={{ color:'rgba(255,255,255,0.25)' }}>
                {phase==='idle' && 'ready'}
                {phase==='working' && 'focus session'}
                {phase==='break' && 'break time'}
                {phase==='done' && 'day complete'}
              </span>
              {sessions.length > 0 && (
                <span className="text-[10px] mt-1" style={{ color:'rgba(255,255,255,0.18)' }}>
                  {sessions.length} session{sessions.length!==1?'s':''} done
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Overdue warning ── */}
        {phase === 'working' && workElapsed >= OVERDUE_THRESHOLD_S && (
          <div className="mb-3 px-4 py-3 rounded-2xl animate-slide-up text-center"
            style={{ background:'rgba(251,146,60,0.1)', border:'1px solid rgba(251,146,60,0.3)' }}>
            <p className="text-sm font-bold" style={{ color:'#f97316' }}>
              ⚠️ 55 min in — goblin is losing hp. Take a break fr.
            </p>
          </div>
        )}

        {/* ── Interval selectors ── */}
        {canStart && (
          <div className="space-y-3 animate-slide-up mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-2"
                style={{ color:'rgba(255,255,255,0.25)' }}>Work</p>
              <div className="flex gap-2">
                {WORK_OPTIONS.map((o,i) => (
                  <ModeBtn key={i} opt={o} sel={workIdx===i}
                    onClick={() => { setWorkIdx(i); setTimeLeft(o.s); }}/>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-semibold mb-2"
                style={{ color:'rgba(255,255,255,0.25)' }}>Break</p>
              <div className="flex gap-2">
                {BREAK_OPTIONS.map((o,i) => (
                  <ModeBtn key={i} opt={o} sel={breakIdx===i} onClick={() => setBreakIdx(i)}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Controls ── */}
        <div className="space-y-3">
          {canStart && (
            <button onClick={startSession}
              className="w-full py-4 rounded-2xl font-black text-lg tracking-tight text-black transition-all active:scale-95"
              style={{ background:'linear-gradient(135deg,#f59e0b,#fbbf24)',
                boxShadow:'0 4px 28px rgba(251,191,36,0.4)' }}>
              {sessions.length===0 ? '🧌 Start Goblin Mode' : '⚡ Next Session'}
            </button>
          )}

          {phase === 'working' && (
            <div className="flex gap-3">
              <button onClick={pauseResume}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all active:scale-95"
                style={{ background: running ? 'rgba(251,191,36,0.1)' : 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                  border: running ? '1px solid rgba(251,191,36,0.3)' : 'none',
                  color: running ? '#fbbf24' : '#0f0a00',
                  boxShadow: running ? 'none' : '0 4px 20px rgba(251,191,36,0.35)' }}>
                {running ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button onClick={skipToBreak}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all active:scale-95"
                style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', color:'#22c55e' }}>
                🌊 Break
              </button>
            </div>
          )}

          {phase === 'break' && (
            <div className="flex gap-3">
              <button onClick={pauseResume}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all active:scale-95"
                style={{ background: running ? 'rgba(34,197,94,0.08)' : 'linear-gradient(135deg,#10b981,#34d399)',
                  border: running ? '1px solid rgba(34,197,94,0.3)' : 'none',
                  color: running ? '#22c55e' : '#001a0e',
                  boxShadow: running ? 'none' : '0 4px 20px rgba(34,197,94,0.3)' }}>
                {running ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button onClick={skipBreak}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all active:scale-95"
                style={{ background:'rgba(251,146,60,0.1)', border:'1px solid rgba(251,146,60,0.3)', color:'#f97316' }}>
                ⚠️ Skip <span className="text-xs font-medium opacity-70">(-{SKIP_BREAK_HP_LOSS}hp)</span>
              </button>
            </div>
          )}

          {isActive && (
            <button onClick={resetAll}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)',
                color:'rgba(255,255,255,0.25)' }}>
              ↺ Reset
            </button>
          )}

          {sessions.length > 0 && !isActive && phase !== 'done' && (
            <button onClick={finishDay}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{ background:'rgba(167,139,250,0.08)', border:'1px solid rgba(167,139,250,0.2)',
                color:'#a78bfa' }}>
              ✅ Done for today
            </button>
          )}
        </div>

        {/* ── Upgrade nudge ── */}
        {showUpgrade && <div className="mt-5"><UpgradeBanner onDismiss={() => setShowUpgrade(false)}/></div>}

        {/* ── Stats ── */}
        {sessions.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label:'Sessions', val: sessions.length,    icon:'🧌' },
              { label:'Focus min',val: focusMin,           icon:'⏱'  },
              { label:'Goblin hp', val: `${goblinHp}/100`, icon:'❤️' },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center py-3 rounded-xl"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-base font-black text-white">{s.icon} {s.val}</p>
                <p className="text-[10px] uppercase tracking-wider mt-0.5"
                  style={{ color:'rgba(255,255,255,0.25)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Session log ── */}
        {sessions.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] uppercase tracking-widest font-semibold"
                style={{ color:'rgba(255,255,255,0.25)' }}>Today's sessions</p>
              <button onClick={clearData}
                className="text-[10px] font-medium px-2 py-1 rounded-lg"
                style={{ color:'rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.04)' }}>
                clear
              </button>
            </div>
            <div className="space-y-2">
              {[...sessions].reverse().map((s,i) => (
                <SessionRow key={s.id} s={s} idx={sessions.length-1-i}/>
              ))}
            </div>
          </div>
        )}

        {/* ── Science footer ── */}
        <div className="mt-6 px-4 py-3 rounded-2xl"
          style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[11px] text-center leading-relaxed"
            style={{ color:'rgba(255,255,255,0.2)' }}>
            {phase==='break'
              ? '🧬 ADHD brains recover 40% faster with movement breaks. Walk around fr fr.'
              : '🧬 Skipping breaks degrades your goblin and your focus. The goblin knows. He rots.'}
          </p>
        </div>

      </div>
    </div>
  );
}
