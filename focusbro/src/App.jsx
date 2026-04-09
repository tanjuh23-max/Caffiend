import { useState, useEffect, useCallback, useRef } from 'react';
import GoblinMascot from './components/GoblinMascot';
import Onboarding from './components/Onboarding';

/* ─── Constants ───────────────────────────────────────────────────────────── */
const WORK_OPTIONS = [
  { label: '25 min', s: 25 * 60, desc: 'Classic' },
  { label: '45 min', s: 45 * 60, desc: 'ADHD sweet spot' },
  { label: '52 min', s: 52 * 60, desc: 'Research-backed' },
];
const BREAK_OPTIONS = [
  { label: '5 min',  s: 5  * 60, desc: 'Quick reset' },
  { label: '15 min', s: 15 * 60, desc: 'Recharge' },
  { label: '17 min', s: 17 * 60, desc: 'Deep rest' },
];
const MAX_HP          = 100;
const SESSION_HP      = 20;
const SKIP_BREAK_LOSS = 15;
const TAB_SWITCH_LOSS = 8;
const OVERDUE_S       = 55 * 60;

/* ─── Storage ─────────────────────────────────────────────────────────────── */
function loadState() {
  try {
    const raw = localStorage.getItem('focusbro_v2');
    if (!raw) return null;
    const s = JSON.parse(raw);
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
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function totalFocusMin(sessions) {
  return Math.round(sessions.reduce((a, s) => a + s.workS / 60, 0));
}

/* ─── HP → mascot state ───────────────────────────────────────────────────── */
function hpToIdle(hp, sessions) {
  if (hp >= 90) return 'great';
  if (hp >= 65 && sessions.length >= 2) return 'good';
  if (hp <= 20) return 'overdue';
  return 'idle';
}

/* ─── Error boundary ──────────────────────────────────────────────────────── */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontSize: 48 }}>🧌</p>
          <p style={{ fontSize: 20, fontWeight: 900, color: '#0f2008', marginTop: 12 }}>Goblin crashed</p>
          <p style={{ fontSize: 13, color: '#7aaa6a', marginTop: 6 }}>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ error: null })}
            style={{ marginTop: 20, padding: '12px 24px', borderRadius: 14, background: '#15803d',
              color: 'white', fontWeight: 800, border: 'none', fontSize: 15 }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from 'react';

/* ─── App gate ────────────────────────────────────────────────────────────── */
export default function App() {
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('focusbro_onboarded') === 'true'
  );
  if (!onboarded) {
    return (
      <Onboarding onComplete={() => {
        localStorage.setItem('focusbro_onboarded', 'true');
        setOnboarded(true);
      }}/>
    );
  }
  return <ErrorBoundary><MainApp/></ErrorBoundary>;
}

/* ─── Chip button ─────────────────────────────────────────────────────────── */
function Chip({ opt, selected, onClick }) {
  return (
    <button onClick={onClick}
      style={{
        flex: 1, padding: '10px 4px', borderRadius: 14, border: 'none', cursor: 'pointer',
        background: selected ? '#15803d' : 'white',
        boxShadow: selected ? '0 4px 16px rgba(21,128,61,0.3)' : 'none',
        outline: selected ? 'none' : '1.5px solid #d1f0b8',
        transition: 'all 0.18s',
      }}>
      <p style={{ fontSize: 14, fontWeight: 800, color: selected ? 'white' : '#0f2008', margin: 0 }}>{opt.label}</p>
      <p style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.7)' : '#7aaa6a', margin: '2px 0 0' }}>{opt.desc}</p>
    </button>
  );
}

/* ─── Bottom nav ──────────────────────────────────────────────────────────── */
function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'focus', label: 'Focus', icon: '🧌' },
    { id: 'stats', label: 'Stats', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 60, paddingBottom: 'env(safe-area-inset-bottom)',
      background: 'white', borderTop: '1px solid #e8f0df',
      display: 'flex', alignItems: 'center', zIndex: 40,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setTab(it.id)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 2, border: 'none', background: 'none',
            cursor: 'pointer', padding: '6px 0',
          }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>{it.icon}</span>
          <span style={{
            fontSize: 11, fontWeight: 700,
            color: tab === it.id ? '#15803d' : '#9aaa90',
          }}>{it.label}</span>
          {tab === it.id && (
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#15803d', marginTop: 1 }}/>
          )}
        </button>
      ))}
    </nav>
  );
}

/* ─── HP bar ──────────────────────────────────────────────────────────────── */
function HpBar({ hp, thin = false }) {
  const pct   = (hp / MAX_HP) * 100;
  const color = hp >= 70 ? '#22c55e' : hp >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div style={{ width: '100%', height: thin ? 5 : 8, borderRadius: 99, background: '#e8f0df', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${pct}%`, borderRadius: 99,
        background: `linear-gradient(90deg, ${color}, ${color}cc)`,
        transition: 'width 0.8s ease',
      }}/>
    </div>
  );
}

/* ─── Stats Tab ───────────────────────────────────────────────────────────── */
function StatsTab({ sessions, goblinHp, streak }) {
  const focusMin = totalFocusMin(sessions);
  return (
    <div style={{ padding: '0 20px 100px', paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginBottom: 20 }}>Stats</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
        {[
          { val: `${goblinHp}`, label: 'Goblin HP', sub: '/ 100' },
          { val: `${sessions.length}`, label: 'Sessions today' },
          { val: `${focusMin}m`, label: 'Focus time' },
          { val: `${streak}`, label: 'Day streak' },
        ].map(s => (
          <div key={s.label} style={{
            padding: 16, borderRadius: 18, background: 'white',
            border: '1.5px solid #e8f0df',
          }}>
            <p style={{ fontSize: 30, fontWeight: 900, color: '#15803d', margin: 0 }}>
              {s.val}<span style={{ fontSize: 14, color: '#9aaa90' }}>{s.sub}</span>
            </p>
            <p style={{ fontSize: 12, color: '#7aaa6a', marginTop: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {sessions.length > 0 ? (
        <>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#7aaa6a', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Today's Sessions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[...sessions].reverse().map((s, i) => {
              const mins = Math.round(s.workS / 60);
              const time = new Date(s.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', borderRadius: 16, background: 'white',
                  border: '1.5px solid #e8f0df',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: '#f0fce8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🧌</div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: '#0f2008', margin: 0 }}>Session {sessions.length - i}</p>
                      <p style={{ fontSize: 12, color: '#9aaa90', margin: '2px 0 0' }}>{time}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#15803d', margin: 0 }}>{mins}m</p>
                    <p style={{ fontSize: 11, color: '#9aaa90', margin: '2px 0 0' }}>+{SESSION_HP}hp</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: 40 }}>📊</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#9aaa90', marginTop: 8 }}>No sessions yet today</p>
          <p style={{ fontSize: 13, color: '#b8cbb0', marginTop: 4 }}>Start a focus session to see stats here</p>
        </div>
      )}
    </div>
  );
}

/* ─── Settings Tab ────────────────────────────────────────────────────────── */
function SettingsTab({ onClearData, onResetOnboarding }) {
  return (
    <div style={{ padding: '0 20px 100px', paddingTop: 'calc(env(safe-area-inset-top) + 24px)' }}>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginBottom: 20 }}>Settings</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onClearData}
          style={{ padding: '16px 20px', borderRadius: 16, background: 'white', border: '1.5px solid #e8f0df',
            color: '#dc2626', fontWeight: 800, fontSize: 15, textAlign: 'left', cursor: 'pointer' }}>
          🗑 Clear today's data
        </button>
        <button onClick={onResetOnboarding}
          style={{ padding: '16px 20px', borderRadius: 16, background: 'white', border: '1.5px solid #e8f0df',
            color: '#7aaa6a', fontWeight: 800, fontSize: 15, textAlign: 'left', cursor: 'pointer' }}>
          ↺ Redo onboarding
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#b8cbb0', marginTop: 32, textAlign: 'center' }}>FocusBro · ADHD Focus App</p>
    </div>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
function MainApp() {
  const stored = loadState() ?? defaultState();

  const [sessions,   setSessions]   = useState(stored.sessions);
  const [goblinHp,   setGoblinHp]   = useState(stored.goblinHp);
  const [streak,     setStreak]     = useState(stored.streak);
  const [tab,        setTab]        = useState('focus');

  const [phase,      setPhase]      = useState('idle');
  const [timeLeft,   setTimeLeft]   = useState(WORK_OPTIONS[1].s);
  const [running,    setRunning]    = useState(false);
  const [workIdx,    setWorkIdx]    = useState(1);
  const [breakIdx,   setBreakIdx]   = useState(1);
  const [workElapsed,setWorkElapsed]= useState(0);

  const [celebFlag,  setCelebFlag]  = useState(false);
  const [caughtYou,  setCaughtYou]  = useState(false);

  const celebTimer       = useRef(null);
  const caughtPenaltyRef = useRef(false);
  const lastSessionDate  = useRef(stored.lastSessionDate);

  const workS  = WORK_OPTIONS[workIdx].s;
  const breakS = BREAK_OPTIONS[breakIdx].s;

  /* Persist */
  useEffect(() => {
    saveState({ sessions, goblinHp, streak, lastSessionDate: lastSessionDate.current });
  }, [sessions, goblinHp, streak]);

  /* Tab-switch detection */
  useEffect(() => {
    if (phase !== 'working') { setCaughtYou(false); return; }
    const handle = () => {
      if (document.hidden && !caughtPenaltyRef.current) {
        caughtPenaltyRef.current = true;
        setCaughtYou(true);
        setGoblinHp(h => clamp(h - TAB_SWITCH_LOSS, 0, MAX_HP));
      } else if (!document.hidden) {
        setCaughtYou(false);
        caughtPenaltyRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', handle);
    return () => {
      document.removeEventListener('visibilitychange', handle);
      setCaughtYou(false);
      caughtPenaltyRef.current = false;
    };
  }, [phase]);

  /* Countdown */
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); return 0; }
        return t - 1;
      });
      if (phase === 'working') setWorkElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running, phase]);

  /* Phase end when timeLeft hits 0 */
  useEffect(() => {
    if (!running || timeLeft !== 0) return;
    handlePhaseEnd();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handlePhaseEnd = useCallback(() => {
    setRunning(false);
    if (phase === 'working') {
      const s = { id: Date.now(), endedAt: new Date().toISOString(), workS: workElapsed || 1 };
      setSessions(prev => [...prev, s]);
      setGoblinHp(h => clamp(h + SESSION_HP, 0, MAX_HP));
      setWorkElapsed(0);
      const today = new Date().toDateString();
      if (lastSessionDate.current !== today) {
        setStreak(k => k + 1);
        lastSessionDate.current = today;
      }
      setCelebFlag(true);
      clearTimeout(celebTimer.current);
      celebTimer.current = setTimeout(() => setCelebFlag(false), 3500);
      notify('Session done! 🧌', 'Goblin earned HP. Time for a break.');
      setPhase('break');
      setTimeLeft(breakS);
    } else if (phase === 'break') {
      notify('Break over ⚡', 'Back to goblin grind mode — lock in.');
      setPhase('idle');
      setTimeLeft(workS);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, workElapsed, workS, breakS]);

  function startSession() {
    setPhase('working');
    setTimeLeft(workS);
    setWorkElapsed(0);
    setRunning(true);
    requestNotif();
  }
  function pauseResume() { setRunning(r => !r); }
  function skipToBreak() {
    if (phase !== 'working') return;
    setRunning(false);
    const s = { id: Date.now(), endedAt: new Date().toISOString(), workS: workElapsed || 1 };
    setSessions(prev => [...prev, s]);
    setGoblinHp(h => clamp(h + Math.round(SESSION_HP * 0.5), 0, MAX_HP));
    setWorkElapsed(0);
    setPhase('break');
    setTimeLeft(breakS);
    setRunning(true);
  }
  function skipBreak() {
    setRunning(false);
    setGoblinHp(h => clamp(h - SKIP_BREAK_LOSS, 0, MAX_HP));
    setPhase('idle');
    setTimeLeft(workS);
  }
  function finishDay() { setRunning(false); setPhase('done'); }
  function clearData() {
    setRunning(false); setPhase('idle'); setTimeLeft(workS); setWorkElapsed(0);
    setSessions([]); setGoblinHp(60); setStreak(0);
    saveState(defaultState());
  }
  function resetOnboarding() {
    localStorage.removeItem('focusbro_onboarded');
    window.location.reload();
  }
  function requestNotif() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default')
      Notification.requestPermission();
  }
  function notify(title, body) {
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted')
        new Notification(title, { body });
    } catch {}
  }

  /* Derived */
  const totalS     = phase === 'break' ? breakS : workS;
  const progress   = totalS > 0 ? Math.max(0, (totalS - timeLeft) / totalS) : 0;
  const focusMin   = totalFocusMin(sessions);
  const isActive   = phase === 'working' || phase === 'break';
  const canStart   = phase === 'idle' || phase === 'done';

  const mascotState = celebFlag ? 'celebrate'
    : phase === 'working' ? (workElapsed >= OVERDUE_S ? 'overdue' : 'working')
    : phase === 'break'   ? 'break'
    : phase === 'done'    ? 'done'
    : hpToIdle(goblinHp, sessions);

  const hpColor = goblinHp >= 70 ? '#22c55e' : goblinHp >= 40 ? '#f59e0b' : '#ef4444';
  const hpLabel = goblinHp >= 90 ? 'Peak goblin 🔥' : goblinHp >= 70 ? 'Locked in' : goblinHp >= 40 ? 'Getting there' : goblinHp >= 20 ? 'Rotting...' : 'Cooked ☠️';

  const screenBg = '#faf8f3';

  return (
    <div style={{ background: screenBg, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Caught-you overlay ── */}
      {caughtYou && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(15,32,8,0.94)', backdropFilter: 'blur(10px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px',
        }}>
          <GoblinMascot mascotState="overdue" size={180}/>
          <p style={{ fontSize: 26, fontWeight: 900, color: 'white', marginTop: 16, textAlign: 'center' }}>
            OI! WHERE D'YOU GO?
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
            You left mid-session — goblin lost <strong style={{ color: '#ef4444' }}>{TAB_SWITCH_LOSS}hp</strong>
          </p>
          <button onClick={() => { setCaughtYou(false); caughtPenaltyRef.current = false; }}
            style={{ marginTop: 24, padding: '14px 32px', borderRadius: 18, background: '#15803d',
              color: 'white', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(21,128,61,0.4)' }}>
            🧌 Back to Goblin Mode
          </button>
        </div>
      )}

      {/* ── Focus Tab ── */}
      {tab === 'focus' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 'env(safe-area-inset-top)', paddingBottom: 80,
          minHeight: '100vh',
        }}>
          {/* Header */}
          <header style={{
            width: '100%', maxWidth: 430, padding: '16px 20px 8px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#0f2008', margin: 0 }}>
              Focus<span style={{ color: '#15803d' }}>Bro</span>
            </h1>
            {streak > 0 && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 12px', borderRadius: 99, background: 'white',
                border: '1.5px solid #e8f0df',
              }}>
                <span style={{ fontSize: 16 }}>🔥</span>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#15803d' }}>{streak}</span>
              </div>
            )}
          </header>

          {/* Goblin hero */}
          <div style={{ marginTop: 8 }}>
            <GoblinMascot mascotState={mascotState} size={230}/>
          </div>

          {/* ── Health / Timer number ── */}
          <div style={{ width: '100%', maxWidth: 430, padding: '0 40px', marginTop: 4, textAlign: 'center' }}>
            {phase === 'idle' || phase === 'done' ? (
              <>
                <p style={{ fontSize: 80, fontWeight: 900, color: '#0f2008', lineHeight: 1, letterSpacing: -3, margin: 0 }}>
                  {goblinHp}
                </p>
                <div style={{ margin: '10px 0 4px' }}>
                  <HpBar hp={goblinHp} thin/>
                </div>
                <p style={{ fontSize: 13, color: '#7aaa6a', fontWeight: 700, margin: 0 }}>
                  Health · {hpLabel}
                </p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 68, fontWeight: 900, color: '#0f2008', lineHeight: 1, letterSpacing: -2, fontVariantNumeric: 'tabular-nums', margin: 0 }}>
                  {fmt(timeLeft)}
                </p>
                {/* Session progress bar */}
                <div style={{ margin: '10px 0 4px', width: '100%', height: 5, borderRadius: 99, background: '#e8f0df', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 99, transition: 'width 1s linear',
                    width: `${progress * 100}%`,
                    background: phase === 'break' ? 'linear-gradient(90deg,#22c55e,#84cc16)' : 'linear-gradient(90deg,#15803d,#22c55e)',
                  }}/>
                </div>
                <p style={{ fontSize: 13, color: '#7aaa6a', fontWeight: 700, margin: 0 }}>
                  {phase === 'working' ? 'Focus Session' : 'Break Time'}
                  {phase === 'working' && workElapsed >= OVERDUE_S && (
                    <span style={{ color: '#dc2626', marginLeft: 8 }}>⚠️ take a break!</span>
                  )}
                </p>
              </>
            )}
          </div>

          {/* ── Stats row ── */}
          <div style={{
            width: '100%', maxWidth: 430, display: 'flex',
            padding: '20px 40px', gap: 0,
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#9aaa90', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Focus Time</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#0f2008', margin: 0 }}>{focusMin}<span style={{ fontSize: 13, color: '#9aaa90', fontWeight: 600 }}>m</span></p>
            </div>
            <div style={{ width: 1, background: '#e8f0df', margin: '0 4px' }}/>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#9aaa90', fontWeight: 600, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: 1 }}>Sessions</p>
              <p style={{ fontSize: 24, fontWeight: 900, color: '#0f2008', margin: 0 }}>{sessions.length}</p>
            </div>
          </div>

          <div style={{ width: '100%', maxWidth: 430, height: 1, background: '#e8f0df', margin: '0 0 20px' }}/>

          {/* ── Duration pickers (idle only) ── */}
          {canStart && (
            <div style={{ width: '100%', maxWidth: 430, padding: '0 20px', marginBottom: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9aaa90', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 8px' }}>Work</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {WORK_OPTIONS.map((o, i) => (
                  <Chip key={i} opt={o} selected={workIdx === i}
                    onClick={() => { setWorkIdx(i); setTimeLeft(o.s); }}/>
                ))}
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9aaa90', textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 8px' }}>Break</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {BREAK_OPTIONS.map((o, i) => (
                  <Chip key={i} opt={o} selected={breakIdx === i} onClick={() => setBreakIdx(i)}/>
                ))}
              </div>
            </div>
          )}

          {/* ── CTA / controls ── */}
          <div style={{ width: '100%', maxWidth: 430, padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {canStart && (
              <button onClick={startSession}
                style={{
                  width: '100%', padding: 18, borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: '#15803d', color: 'white', fontSize: 18, fontWeight: 900,
                  boxShadow: '0 8px 32px rgba(21,128,61,0.35)',
                }}>
                {sessions.length === 0 ? '🧌 Start Focus Session' : '⚡ Next Session'}
              </button>
            )}

            {phase === 'working' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={pauseResume}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 16, cursor: 'pointer', border: 'none',
                    background: running ? 'white' : '#15803d',
                    outline: running ? '1.5px solid #d1f0b8' : 'none',
                    color: running ? '#15803d' : 'white', fontWeight: 800, fontSize: 15,
                    boxShadow: running ? 'none' : '0 4px 20px rgba(21,128,61,0.3)',
                  }}>
                  {running ? '⏸ Pause' : '▶ Resume'}
                </button>
                <button onClick={skipToBreak}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 16, cursor: 'pointer',
                    background: 'white', outline: '1.5px solid #d1f0b8', border: 'none',
                    color: '#15803d', fontWeight: 800, fontSize: 15,
                  }}>
                  🌊 Break
                </button>
              </div>
            )}

            {phase === 'break' && (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={pauseResume}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 16, cursor: 'pointer', border: 'none',
                    background: running ? 'white' : '#15803d',
                    outline: running ? '1.5px solid #d1f0b8' : 'none',
                    color: running ? '#15803d' : 'white', fontWeight: 800, fontSize: 15,
                  }}>
                  {running ? '⏸ Pause' : '▶ Resume'}
                </button>
                <button onClick={skipBreak}
                  style={{
                    flex: 1, padding: '14px 0', borderRadius: 16, cursor: 'pointer',
                    background: 'white', outline: '1.5px solid #fca5a5', border: 'none',
                    color: '#dc2626', fontWeight: 800, fontSize: 15,
                  }}>
                  ⚠️ Skip <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>(-{SKIP_BREAK_LOSS}hp)</span>
                </button>
              </div>
            )}

            {isActive && (
              <button onClick={() => { setRunning(false); setPhase('idle'); setTimeLeft(workS); setWorkElapsed(0); }}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 14, cursor: 'pointer',
                  background: 'white', outline: '1.5px solid #e8f0df', border: 'none',
                  color: '#9aaa90', fontWeight: 700, fontSize: 14,
                }}>
                ↺ Reset
              </button>
            )}

            {sessions.length > 0 && !isActive && phase !== 'done' && (
              <button onClick={finishDay}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 14, cursor: 'pointer',
                  background: 'white', outline: '1.5px solid #ddd6fe', border: 'none',
                  color: '#7c3aed', fontWeight: 700, fontSize: 14,
                }}>
                ✅ Done for today
              </button>
            )}
          </div>
        </div>
      )}

      {tab === 'stats'    && <StatsTab sessions={sessions} goblinHp={goblinHp} streak={streak}/>}
      {tab === 'settings' && <SettingsTab onClearData={clearData} onResetOnboarding={resetOnboarding}/>}

      <BottomNav tab={tab} setTab={setTab}/>
    </div>
  );
}
