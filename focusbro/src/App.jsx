import { useState, useEffect, useCallback, useRef } from 'react';
import GoblinMascot from './components/GoblinMascot';
import Onboarding from './components/Onboarding';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabase';

/* ─── Constants ────────────────────────────────────────────────────────────── */
const WORK_OPTIONS  = [
  { label: '25 min', s: 25*60, desc: 'Classic' },
  { label: '45 min', s: 45*60, desc: 'ADHD sweet spot' },
  { label: '52 min', s: 52*60, desc: 'Research-backed' },
];
const BREAK_OPTIONS = [
  { label: '5 min',  s:  5*60 },
  { label: '15 min', s: 15*60 },
  { label: '17 min', s: 17*60 },
];
const MAX_HP              = 100;
const SESSION_HP_GAIN     = 20;
const SKIP_BREAK_HP_LOSS  = 15;
const OVERDUE_THRESHOLD_S = 55 * 60;

/* ─── Storage ──────────────────────────────────────────────────────────────── */
function loadState() {
  try {
    const raw = localStorage.getItem('brainfog_v2');
    if (!raw) return null;
    const s = JSON.parse(raw);
    const today = new Date().toDateString();
    s.sessions = (s.sessions || []).filter(x => new Date(x.endedAt).toDateString() === today);
    return s;
  } catch { return null; }
}
function saveState(s) {
  try { localStorage.setItem('brainfog_v2', JSON.stringify(s)); } catch {}
}
function defaultState() {
  return { sessions: [], goblinHp: 60, streak: 0, lastSessionDate: null };
}
function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function totalFocusMin(sessions) {
  return Math.round(sessions.reduce((a, s) => a + s.workS / 60, 0));
}

/* ─── Error boundary ───────────────────────────────────────────────────────── */
import { Component } from 'react';
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
          <p style={{ fontSize: 48 }}>🧌</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#dc2626', marginTop: 12 }}>Something broke</p>
          <p style={{ fontSize: 13, color: '#7aaa6a', marginTop: 8 }}>{this.state.error.message}</p>
          <button onClick={() => { localStorage.removeItem('brainfog_v2'); window.location.reload(); }}
            style={{ marginTop: 20, padding: '12px 24px', borderRadius: 12, background: '#15803d',
              color: 'white', fontWeight: 700, border: 'none', fontSize: 14 }}>
            Reset & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── App gate ─────────────────────────────────────────────────────────────── */
export default function App() {
  const [onboarded, setOnboarded] = useState(() => {
    // If returning from Stripe with ?subscribed=1 — mark subscribed + onboarded
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('subscribed') === '1') {
        localStorage.setItem('brainfog_subscribed', 'true');
        localStorage.setItem('brainfog_onboarded',  'true');
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
        return true;
      }
    }
    return localStorage.getItem('brainfog_onboarded') === 'true';
  });

  if (!onboarded) {
    return (
      <Onboarding onComplete={() => {
        localStorage.setItem('brainfog_onboarded', 'true');
        setOnboarded(true);
      }}/>
    );
  }
  return <ErrorBoundary><MainApp/></ErrorBoundary>;
}

/* ─── Push notification helper ─────────────────────────────────────────────── */
function notify(title, body) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  try { new Notification(title, { body, icon: '/favicon.svg', tag: 'brainfog' }); } catch {}
}

/* ─── Main App ─────────────────────────────────────────────────────────────── */
function MainApp() {
  const stored = useRef(loadState() ?? defaultState());

  const [sessions,    setSessions]   = useState(stored.current.sessions);
  const [goblinHp,    setGoblinHp]   = useState(stored.current.goblinHp);
  const [streak,      setStreak]     = useState(stored.current.streak);
  const [phase,       setPhase]      = useState('idle');
  const [timeLeft,    setTimeLeft]   = useState(WORK_OPTIONS[1].s);
  const [running,     setRunning]    = useState(false);
  const [workIdx,     setWorkIdx]    = useState(1);
  const [breakIdx,    setBreakIdx]   = useState(1);
  const [workElapsed, setWorkElapsed]= useState(0);
  const [celebFlag,   setCelebFlag]  = useState(false);
  const [caughtYou,   setCaughtYou]  = useState(false);
  const [tab,         setTab]        = useState('focus');
  const [user,        setUser]       = useState(null);
  const [showAuth,    setShowAuth]   = useState(false);
  const [subscribed,  setSubscribed] = useState(
    () => localStorage.getItem('brainfog_subscribed') === 'true'
  );

  const celebTimer      = useRef(null);
  const caughtPenalty   = useRef(false);
  const phaseRef        = useRef(phase);
  const workElapsedRef  = useRef(workElapsed);
  const sessionsRef     = useRef(sessions);

  const workS  = WORK_OPTIONS[workIdx].s;
  const breakS = BREAK_OPTIONS[breakIdx].s;

  // Keep refs in sync
  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { workElapsedRef.current = workElapsed; }, [workElapsed]);
  useEffect(() => { sessionsRef.current = sessions; }, [sessions]);

  // ── Supabase auth listener ──
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) setUser(data.session.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Supabase: load cloud state when user logs in ──
  useEffect(() => {
    if (!supabase || !user) return;
    async function loadCloud() {
      const today = new Date().toDateString();
      const [{ data: gs }, { data: sessions_data }, { data: profile }] = await Promise.all([
        supabase.from('goblin_state').select('*').eq('user_id', user.id).single(),
        supabase.from('focus_sessions').select('*').eq('user_id', user.id)
          .gte('ended_at', new Date().toISOString().slice(0, 10)),
        supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
      ]);
      if (gs) {
        setGoblinHp(gs.hp);
        setStreak(gs.streak);
      }
      if (sessions_data?.length) {
        const mapped = sessions_data.map(s => ({
          id: s.id, endedAt: s.ended_at, workS: s.work_s,
        }));
        setSessions(mapped);
      }
      if (profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing') {
        setSubscribed(true);
        localStorage.setItem('brainfog_subscribed', 'true');
      }
    }
    loadCloud();
  }, [user]);

  // ── Supabase: save goblin state when it changes ──
  useEffect(() => {
    if (!supabase || !user) return;
    const t = setTimeout(() => {
      supabase.from('goblin_state').upsert({
        user_id: user.id, hp: goblinHp, streak,
        updated_at: new Date().toISOString(),
      });
    }, 1500); // debounce 1.5s
    return () => clearTimeout(t);
  }, [user, goblinHp, streak]);

  // Local persist (always, regardless of auth)
  useEffect(() => { saveState({ sessions, goblinHp, streak }); }, [sessions, goblinHp, streak]);

  // Tab-switch detection
  useEffect(() => {
    if (phase !== 'working') { setCaughtYou(false); return; }
    const handle = () => {
      if (document.hidden && !caughtPenalty.current) {
        caughtPenalty.current = true;
        setCaughtYou(true);
        setGoblinHp(h => clamp(h - 8, 0, MAX_HP));
      } else if (!document.hidden) {
        setCaughtYou(false);
        caughtPenalty.current = false;
      }
    };
    document.addEventListener('visibilitychange', handle);
    return () => { document.removeEventListener('visibilitychange', handle); };
  }, [phase]);

  // Countdown — uses refs to avoid stale closures
  const handlePhaseEnd = useCallback(() => {
    const currentPhase    = phaseRef.current;
    const currentElapsed  = workElapsedRef.current;
    const currentSessions = sessionsRef.current;

    setRunning(false);
    if (currentPhase === 'working') {
      const s = { id: Date.now(), endedAt: new Date().toISOString(), workS: currentElapsed + 1 };
      const next = [...currentSessions, s];
      setSessions(next);
      setGoblinHp(h => clamp(h + SESSION_HP_GAIN, 0, MAX_HP));
      setWorkElapsed(0);
      const today = new Date().toDateString();
      if (stored.current.lastSessionDate !== today) setStreak(k => k + 1);
      setCelebFlag(true);
      clearTimeout(celebTimer.current);
      celebTimer.current = setTimeout(() => setCelebFlag(false), 3500);
      setPhase('break');
      setTimeLeft(BREAK_OPTIONS[1].s);
      notify('Session complete! 🧌', 'Take your break — goblin demands it.');
      // Sync new session to Supabase
      if (supabase && user) {
        supabase.from('focus_sessions').insert({ user_id: user.id, work_s: currentElapsed + 1 });
      }
    } else if (currentPhase === 'break') {
      setPhase('idle');
      setTimeLeft(workS);
      notify('Break over 🧌', 'Ready for the next session? Lock in.');
    }
  }, [workS, user]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(id); handlePhaseEnd(); return 0; }
        return t - 1;
      });
      if (phaseRef.current === 'working') setWorkElapsed(e => e + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [running, handlePhaseEnd]);

  function startSession() {
    setPhase('working');
    setTimeLeft(workS);
    setWorkElapsed(0);
    setRunning(true);
    // Request notification permission on first session start
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }
  function pauseResume() { setRunning(r => !r); }
  function skipToBreak() {
    if (phase !== 'working') return;
    setRunning(false);
    const s = { id: Date.now(), endedAt: new Date().toISOString(), workS: workElapsed };
    setSessions(prev => [...prev, s]);
    setGoblinHp(h => clamp(h + Math.round(SESSION_HP_GAIN * 0.5), 0, MAX_HP));
    setWorkElapsed(0);
    setPhase('break');
    setTimeLeft(breakS);
    setRunning(true);
  }
  function skipBreak() {
    setRunning(false);
    setGoblinHp(h => clamp(h - SKIP_BREAK_HP_LOSS, 0, MAX_HP));
    setPhase('idle');
    setTimeLeft(workS);
  }
  function finishDay() { setRunning(false); setPhase('done'); }
  function resetAll()  { setRunning(false); setPhase('idle'); setTimeLeft(workS); setWorkElapsed(0); }
  function clearData() {
    setSessions([]); setGoblinHp(60); setStreak(0); resetAll();
    saveState(defaultState());
  }

  // Derived
  const focusMin  = totalFocusMin(sessions);
  const isActive  = phase === 'working' || phase === 'break';
  const canStart  = phase === 'idle' || phase === 'done';
  const totalS    = phase === 'break' ? breakS : workS;
  const progress  = isActive ? Math.max(0, (totalS - timeLeft) / totalS) : 0;
  const hpPct     = (goblinHp / MAX_HP) * 100;

  const mascotState = celebFlag   ? 'celebrate'
    : phase === 'working'         ? (workElapsed >= OVERDUE_THRESHOLD_S ? 'overdue' : 'working')
    : phase === 'break'           ? 'break'
    : phase === 'done'            ? 'done'
    : goblinHp >= 90              ? 'great'
    : goblinHp >= 65 && sessions.length >= 1 ? 'good'
    : goblinHp <= 20              ? 'overdue'
    : 'idle';

  const hpColor = goblinHp >= 70 ? '#22c55e' : goblinHp >= 40 ? '#f59e0b' : '#dc2626';

  return (
    <div style={{ minHeight: '100vh', background: '#f2fde8', fontFamily: 'Inter, system-ui, sans-serif', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── Caught overlay ── */}
      {caughtYou && (
        <div className="caught-in" style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(15,32,8,0.92)', backdropFilter: 'blur(10px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24
        }}>
          <GoblinMascot mascotState="overdue" size={180}/>
          <p style={{ fontSize: 26, fontWeight: 900, color: 'white', marginTop: 16, textAlign: 'center' }}>OI! WHERE D'YOU GO?</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
            Left mid-session — goblin lost <span style={{ color: '#f87171', fontWeight: 800 }}>8hp</span> 😤
          </p>
          <button onClick={() => { setCaughtYou(false); caughtPenalty.current = false; }}
            style={{ marginTop: 24, width: '100%', maxWidth: 320, padding: 18, borderRadius: 18,
              background: '#15803d', color: 'white', fontSize: 17, fontWeight: 900, border: 'none',
              boxShadow: '0 8px 32px rgba(21,128,61,0.4)' }}>
            🧌 Back to Goblin Mode
          </button>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ maxWidth: 430, margin: '0 auto', paddingBottom: 80 }}>

        {tab === 'focus' && (
          <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px 8px' }}>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', letterSpacing: -0.5, margin: 0 }}>
                Brain<span style={{ color: '#15803d' }}>fog</span>
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {streak > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
                    borderRadius: 99, background: 'rgba(21,128,61,0.08)', border: '1px solid #d1f0b8' }}>
                    <span style={{ fontSize: 14 }}>🔥</span>
                    <span style={{ fontSize: 14, fontWeight: 900, color: '#15803d' }}>{streak}</span>
                  </div>
                )}
                <button onClick={() => { localStorage.removeItem('brainfog_onboarded'); window.location.reload(); }}
                  style={{ fontSize: 12, color: '#7aaa6a', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                  Help
                </button>
              </div>
            </header>

            {/* Goblin hero */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
              <GoblinMascot mascotState={mascotState} size={230}/>
            </div>

            {/* Health / Timer number */}
            <div style={{ textAlign: 'center', padding: '4px 20px 0' }}>
              <p style={{ fontSize: 80, fontWeight: 900, letterSpacing: -3, color: '#0f2008', lineHeight: 1, margin: 0, fontVariantNumeric: 'tabular-nums' }}>
                {phase === 'idle' || phase === 'done' ? goblinHp : fmt(timeLeft)}
              </p>

              {/* Progress bar */}
              <div style={{ margin: '10px 32px 0', height: 6, borderRadius: 99, background: '#d1f0b8', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99, transition: 'width 0.7s ease',
                  width: `${isActive ? progress * 100 : hpPct}%`,
                  background: isActive
                    ? (phase === 'break' ? '#22c55e' : '#15803d')
                    : `linear-gradient(90deg, ${hpColor}, ${hpColor}cc)`,
                }}/>
              </div>

              <p style={{ fontSize: 13, fontWeight: 600, color: '#7aaa6a', marginTop: 6 }}>
                {phase === 'idle'    && 'Goblin Health'}
                {phase === 'working' && 'Focus Session'}
                {phase === 'break'   && 'Break Time'}
                {phase === 'done'    && 'Well done! 🎉'}
              </p>
            </div>

            {/* Divider + stats */}
            <div style={{ margin: '16px 20px 0', height: 1, background: '#d1f0b8' }}/>
            <div style={{ display: 'flex', padding: '14px 20px' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#7aaa6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Focus Time</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#0f2008', margin: '2px 0 0' }}>{focusMin}m</p>
              </div>
              <div style={{ width: 1, background: '#d1f0b8' }}/>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#7aaa6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Sessions</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: '#0f2008', margin: '2px 0 0' }}>{sessions.length}</p>
              </div>
              <div style={{ width: 1, background: '#d1f0b8' }}/>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <p style={{ fontSize: 11, color: '#7aaa6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Goblin HP</p>
                <p style={{ fontSize: 22, fontWeight: 900, color: hpColor, margin: '2px 0 0' }}>{goblinHp}</p>
              </div>
            </div>
            <div style={{ margin: '0 20px', height: 1, background: '#d1f0b8' }}/>

            {/* Duration pickers — idle only */}
            {canStart && (
              <div style={{ padding: '16px 20px 0' }}>
                <p style={{ fontSize: 11, color: '#7aaa6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Work</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {WORK_OPTIONS.map((o, i) => (
                    <button key={i} onClick={() => { setWorkIdx(i); setTimeLeft(o.s); }}
                      style={{ flex: 1, padding: '10px 4px', borderRadius: 12, border: `1.5px solid ${workIdx === i ? '#15803d' : '#d1f0b8'}`,
                        background: workIdx === i ? '#f0fce8' : 'white', cursor: 'pointer',
                        color: workIdx === i ? '#15803d' : '#4a6741', fontWeight: 700, fontSize: 13 }}>
                      {o.label}
                      <span style={{ display: 'block', fontSize: 10, fontWeight: 500, color: '#7aaa6a', marginTop: 1 }}>{o.desc}</span>
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#7aaa6a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, margin: '12px 0 8px' }}>Break</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {BREAK_OPTIONS.map((o, i) => (
                    <button key={i} onClick={() => setBreakIdx(i)}
                      style={{ flex: 1, padding: '10px 4px', borderRadius: 12, border: `1.5px solid ${breakIdx === i ? '#15803d' : '#d1f0b8'}`,
                        background: breakIdx === i ? '#f0fce8' : 'white', cursor: 'pointer',
                        color: breakIdx === i ? '#15803d' : '#4a6741', fontWeight: 700, fontSize: 13 }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Overdue warning */}
            {phase === 'working' && workElapsed >= OVERDUE_THRESHOLD_S && (
              <div className="animate-slide-up" style={{ margin: '12px 20px 0', padding: '12px 16px', borderRadius: 14,
                background: '#fef2f2', border: '1px solid #fca5a5' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#dc2626', margin: 0 }}>
                  ⚠️ 55 min in — goblin needs a break!
                </p>
              </div>
            )}

            {/* Controls */}
            <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {canStart && (
                <button onClick={startSession} style={{
                  width: '100%', padding: 18, borderRadius: 18, background: '#15803d',
                  color: 'white', fontSize: 18, fontWeight: 900, border: 'none',
                  boxShadow: '0 8px 32px rgba(21,128,61,0.35)', cursor: 'pointer' }}>
                  {sessions.length === 0 ? '🧌 Start Focus Session' : '⚡ Next Session'}
                </button>
              )}

              {phase === 'working' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={pauseResume} style={{
                    flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    background: running ? 'white' : '#15803d',
                    border: running ? '2px solid #d1f0b8' : 'none',
                    color: running ? '#15803d' : 'white',
                    boxShadow: running ? 'none' : '0 4px 20px rgba(21,128,61,0.3)' }}>
                    {running ? '⏸ Pause' : '▶ Resume'}
                  </button>
                  <button onClick={skipToBreak} style={{
                    flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    background: 'white', border: '2px solid #22c55e', color: '#15803d' }}>
                    🌊 Break
                  </button>
                </div>
              )}

              {phase === 'break' && (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={pauseResume} style={{
                    flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    background: running ? 'white' : '#15803d',
                    border: running ? '2px solid #d1f0b8' : 'none',
                    color: running ? '#15803d' : 'white' }}>
                    {running ? '⏸ Pause' : '▶ Resume'}
                  </button>
                  <button onClick={skipBreak} style={{
                    flex: 1, padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 15, cursor: 'pointer',
                    background: 'white', border: '2px solid #fca5a5', color: '#dc2626' }}>
                    ⚠️ Skip <span style={{ fontSize: 12, fontWeight: 500 }}>(-{SKIP_BREAK_HP_LOSS}hp)</span>
                  </button>
                </div>
              )}

              {isActive && (
                <button onClick={resetAll} style={{
                  padding: 12, borderRadius: 12, background: 'white', border: '1.5px solid #d1f0b8',
                  color: '#7aaa6a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  ↺ Reset
                </button>
              )}

              {sessions.length > 0 && canStart && (
                <button onClick={finishDay} style={{
                  padding: 14, borderRadius: 14, background: 'white', border: '2px solid #d1f0b8',
                  color: '#7c3aed', fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                  ✅ Done for today
                </button>
              )}
            </div>

            {/* Science tip */}
            <div style={{ margin: '20px 20px 0', padding: '12px 16px', borderRadius: 14,
              background: 'white', border: '1px solid #d1f0b8' }}>
              <p style={{ fontSize: 12, color: '#7aaa6a', textAlign: 'center', lineHeight: 1.5, margin: 0 }}>
                {phase === 'break'
                  ? '🧬 ADHD brains recover 40% faster with movement breaks.'
                  : '🧬 It takes 23 min to regain focus after every distraction.'}
              </p>
            </div>

          </div>
        )}

        {/* ── Stats tab ── */}
        {tab === 'stats' && (
          <div style={{ padding: '16px 20px', paddingTop: 'env(safe-area-inset-top)' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginBottom: 20 }}>Stats</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
              {[
                { label: 'Focus Time', val: `${focusMin} min` },
                { label: 'Sessions',   val: sessions.length },
                { label: 'Goblin HP',  val: `${goblinHp}/100` },
                { label: 'Streak',     val: `${streak} days` },
              ].map(s => (
                <div key={s.label} style={{ padding: 16, borderRadius: 16, background: 'white', border: '1px solid #d1f0b8', textAlign: 'center' }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: '#15803d', margin: 0 }}>{s.val}</p>
                  <p style={{ fontSize: 12, color: '#7aaa6a', marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>

            {sessions.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#7aaa6a', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Today's Sessions</p>
                  <button onClick={clearData} style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[...sessions].reverse().map((s, i) => (
                    <div key={s.id} className="animate-pop" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', borderRadius: 14, background: 'white', border: '1px solid #d1f0b8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 22 }}>🧌</span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#0f2008', margin: 0 }}>Session {sessions.length - i}</p>
                          <p style={{ fontSize: 12, color: '#7aaa6a', margin: '1px 0 0' }}>{new Date(s.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 16, fontWeight: 900, color: '#15803d', margin: 0 }}>{Math.round(s.workS / 60)} min</p>
                        <p style={{ fontSize: 11, color: '#7aaa6a', margin: '1px 0 0' }}>+{SESSION_HP_GAIN}hp</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <p style={{ fontSize: 40 }}>🧌</p>
                <p style={{ fontSize: 15, color: '#7aaa6a', marginTop: 8 }}>No sessions yet today</p>
              </div>
            )}
          </div>
        )}

        {/* ── Settings tab ── */}
        {tab === 'settings' && (
          <div style={{ padding: '16px 20px', paddingTop: 'env(safe-area-inset-top)' }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0f2008', marginBottom: 20 }}>Settings</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

              {/* Account / sync */}
              {user ? (
                <div style={{ padding: '16px 20px', borderRadius: 16, background: '#f0fce8', border: '2px solid #22c55e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#15803d', margin: 0 }}>✅ Syncing across devices</p>
                      <p style={{ fontSize: 12, color: '#4a6741', margin: '3px 0 0' }}>{user.email}</p>
                    </div>
                    <button onClick={() => supabase?.auth.signOut()}
                      style={{ fontSize: 12, color: '#7aaa6a', background: 'none', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAuth(true)}
                  style={{ padding: '16px 20px', borderRadius: 16, background: '#15803d',
                    color: 'white', fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer', textAlign: 'left',
                    boxShadow: '0 4px 20px rgba(21,128,61,0.25)' }}>
                  ☁️ Sign in to sync across devices
                  <span style={{ display: 'block', fontSize: 12, fontWeight: 500, opacity: 0.8, marginTop: 2 }}>
                    HP, streak &amp; sessions saved to cloud
                  </span>
                </button>
              )}

              {/* Subscription status */}
              <div style={{ padding: '14px 20px', borderRadius: 16, background: 'white', border: `2px solid ${subscribed ? '#22c55e' : '#d1f0b8'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: subscribed ? '#15803d' : '#7aaa6a', margin: 0 }}>
                      {subscribed ? '👑 Brainfog Premium' : '🔒 Free plan'}
                    </p>
                    <p style={{ fontSize: 12, color: '#7aaa6a', margin: '3px 0 0' }}>
                      {subscribed ? 'Full goblin mode unlocked' : 'Upgrade to unlock all features'}
                    </p>
                  </div>
                  {!subscribed && (
                    <button onClick={() => { localStorage.removeItem('brainfog_onboarded'); window.location.reload(); }}
                      style={{ fontSize: 12, color: 'white', background: '#15803d', border: 'none',
                        borderRadius: 10, padding: '6px 12px', fontWeight: 800, cursor: 'pointer' }}>
                      Upgrade
                    </button>
                  )}
                </div>
              </div>

              <button onClick={clearData} style={{ padding: '16px 20px', borderRadius: 16, background: 'white',
                border: '2px solid #fca5a5', color: '#dc2626', fontSize: 15, fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}>
                🗑️ Reset all data
              </button>
              <button onClick={() => { localStorage.removeItem('brainfog_onboarded'); window.location.reload(); }}
                style={{ padding: '16px 20px', borderRadius: 16, background: 'white',
                  border: '2px solid #d1f0b8', color: '#4a6741', fontSize: 15, fontWeight: 800, cursor: 'pointer', textAlign: 'left' }}>
                🔄 Replay onboarding
              </button>
              <div style={{ padding: '16px 20px', borderRadius: 16, background: 'white', border: '1px solid #d1f0b8' }}>
                <p style={{ fontSize: 13, color: '#7aaa6a', margin: 0, lineHeight: 1.6 }}>
                  Brainfog v1.0 — Built for ADHD brains 🧌<br/>
                  Lock in. Take breaks. Don't rot.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Auth modal ── */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuth={u => { setUser(u); setShowAuth(false); }}
        />
      )}

      {/* ── Bottom Nav ── */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 56, paddingBottom: 'env(safe-area-inset-bottom)',
        background: 'white', borderTop: '1px solid #d1f0b8',
        display: 'flex', zIndex: 40
      }}>
        {[
          { id: 'focus',    label: 'Focus',    icon: '🧌' },
          { id: 'stats',    label: 'Stats',    icon: '📊' },
          { id: 'settings', label: 'Settings', icon: '⚙️' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 2, background: 'none', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 700,
              color: tab === t.id ? '#15803d' : '#7aaa6a' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
