import { useState, useEffect, useCallback, useRef } from 'react';
import BrainMascot from './components/BrainMascot';

/* ─── Constants ───────────────────────────────────────────────────────────── */

const WORK_OPTIONS = [
  { label: '25 min', seconds: 25 * 60, desc: 'Pomodoro classic' },
  { label: '45 min', seconds: 45 * 60, desc: 'ADHD sweet spot' },
  { label: '52 min', seconds: 52 * 60, desc: 'Research-backed' },
];
const BREAK_OPTIONS = [
  { label: '5 min',  seconds: 5 * 60,  desc: 'Quick reset' },
  { label: '15 min', seconds: 15 * 60, desc: 'Recharge' },
  { label: '17 min', seconds: 17 * 60, desc: 'Deep rest' },
];

// How long (seconds) before we nudge the user to take a break
const OVERDUE_THRESHOLD = 55 * 60;

/* ─── Local storage helpers ───────────────────────────────────────────────── */
function loadSessions() {
  try {
    const raw = localStorage.getItem('focusbro_sessions');
    if (!raw) return [];
    const all = JSON.parse(raw);
    // Keep only today's sessions
    const today = new Date().toDateString();
    return all.filter(s => new Date(s.endedAt).toDateString() === today);
  } catch { return []; }
}

function saveSessions(sessions) {
  try { localStorage.setItem('focusbro_sessions', JSON.stringify(sessions)); } catch {}
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function totalFocusMin(sessions) {
  return Math.round(sessions.reduce((acc, s) => acc + s.workSeconds / 60, 0));
}

/* ─── Mascot state derivation ─────────────────────────────────────────────── */
function deriveMascotState({ phase, sessions, celebrateFlag, workSecondsElapsed }) {
  if (celebrateFlag) return 'celebrate';
  if (phase === 'working') {
    if (workSecondsElapsed >= OVERDUE_THRESHOLD) return 'overdue';
    return 'working';
  }
  if (phase === 'break') return 'break';
  if (phase === 'done') return 'done';
  // idle — judge by sessions today
  const count = sessions.length;
  if (count >= 4) return 'great';
  if (count >= 2) return 'good';
  return 'idle';
}

/* ─── Progress ring ───────────────────────────────────────────────────────── */
function ProgressRing({ progress, color, size = 200, strokeWidth = 8 }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * radius;
  const dash = circ * (1 - progress);

  return (
    <svg width={size} height={size} className="absolute animate-progress" style={{ color }}>
      {/* Track */}
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
      {/* Progress */}
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={dash}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
}

/* ─── Session log row ─────────────────────────────────────────────────────── */
function SessionRow({ session, index }) {
  const mins = Math.round(session.workSeconds / 60);
  const time = new Date(session.endedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="flex items-center justify-between px-4 py-2.5 rounded-xl animate-slide-up"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="flex items-center gap-2.5">
        <span className="text-base">🧠</span>
        <div>
          <p className="text-sm font-semibold text-white">Session {index + 1}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold" style={{ color: '#fbbf24' }}>{mins} min</p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>focused</p>
      </div>
    </div>
  );
}

/* ─── Mode selector button ────────────────────────────────────────────────── */
function ModeBtn({ option, selected, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 py-2 px-1 rounded-xl text-center transition-all duration-150 active:scale-95"
      style={{
        background: selected ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${selected ? 'rgba(251,191,36,0.45)' : 'rgba(255,255,255,0.07)'}`,
        opacity: disabled ? 0.45 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <p className="text-sm font-bold" style={{ color: selected ? '#fbbf24' : 'rgba(255,255,255,0.6)' }}>
        {option.label}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
        {option.desc}
      </p>
    </button>
  );
}

/* ─── Main App ────────────────────────────────────────────────────────────── */
export default function App() {
  // Timer state
  const [phase, setPhase]       = useState('idle');  // 'idle' | 'working' | 'break' | 'done'
  const [timeLeft, setTimeLeft]  = useState(WORK_OPTIONS[1].seconds);
  const [running, setRunning]    = useState(false);

  // Config
  const [workIdx, setWorkIdx]    = useState(1);  // 45 min default
  const [breakIdx, setBreakIdx]  = useState(1);  // 15 min default

  // Stats
  const [sessions, setSessions]  = useState(loadSessions);
  const [workElapsed, setWorkElapsed] = useState(0);  // seconds in current work session

  // Celebrate flash
  const [celebrateFlag, setCelebrateFlag] = useState(false);
  const celebrateTimer = useRef(null);

  // Notification permission
  const [notifGranted, setNotifGranted] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const workSecs  = WORK_OPTIONS[workIdx].seconds;
  const breakSecs = BREAK_OPTIONS[breakIdx].seconds;

  // ── Countdown tick ──
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(id);
          handlePhaseEnd();
          return 0;
        }
        return t - 1;
      });
      if (phase === 'working') {
        setWorkElapsed(e => e + 1);
      }
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase]);

  // ── Phase transition ──
  const handlePhaseEnd = useCallback(() => {
    setRunning(false);
    if (phase === 'working') {
      // Save session
      const session = {
        id: Date.now(),
        endedAt: new Date().toISOString(),
        workSeconds: workElapsed + 1,
      };
      const next = [...sessions, session];
      setSessions(next);
      saveSessions(next);
      setWorkElapsed(0);

      // Celebrate briefly
      setCelebrateFlag(true);
      clearTimeout(celebrateTimer.current);
      celebrateTimer.current = setTimeout(() => setCelebrateFlag(false), 3500);

      // Notify
      sendNotification('Session done! 🏆', 'Time for a well-earned break. Take a breather frfr.');

      // Auto-move to break
      setPhase('break');
      setTimeLeft(breakSecs);
    } else if (phase === 'break') {
      sendNotification('Break over! ⚡', 'Lock back in — sigma grind mode awaits.');
      setPhase('idle');
      setTimeLeft(workSecs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, workElapsed, sessions, workSecs, breakSecs]);

  // ── Controls ──
  function startSession() {
    if (phase === 'idle' || phase === 'done') {
      setPhase('working');
      setTimeLeft(workSecs);
      setWorkElapsed(0);
    }
    setRunning(true);
    requestNotifPermission();
  }

  function pauseResume() {
    setRunning(r => !r);
  }

  function skipToBreak() {
    if (phase !== 'working') return;
    setRunning(false);
    const session = {
      id: Date.now(),
      endedAt: new Date().toISOString(),
      workSeconds: workElapsed,
    };
    const next = [...sessions, session];
    setSessions(next);
    saveSessions(next);
    setWorkElapsed(0);
    setPhase('break');
    setTimeLeft(breakSecs);
    setRunning(true);
  }

  function skipBreak() {
    if (phase !== 'break') return;
    setRunning(false);
    setPhase('idle');
    setTimeLeft(workSecs);
  }

  function resetAll() {
    setRunning(false);
    setPhase('idle');
    setTimeLeft(workSecs);
    setWorkElapsed(0);
  }

  function finishDay() {
    setRunning(false);
    setPhase('done');
    setTimeLeft(0);
  }

  function clearSessions() {
    setSessions([]);
    saveSessions([]);
    resetAll();
  }

  // ── Notifications ──
  function requestNotifPermission() {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(p => setNotifGranted(p === 'granted'));
    }
  }
  function sendNotification(title, body) {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '🧠' });
    }
  }

  // ── Derived values ──
  const totalSecs = phase === 'break' ? breakSecs : workSecs;
  const progress  = phase === 'done' ? 0 : Math.max(0, (totalSecs - timeLeft) / totalSecs);
  const mascotState = deriveMascotState({ phase, sessions, celebrateFlag, workSecondsElapsed: workElapsed });
  const focusMin  = totalFocusMin(sessions);

  // Progress ring colour by phase
  const ringColor = phase === 'break' ? '#34d399' : phase === 'done' ? '#a78bfa' : '#fbbf24';

  const isActive  = phase === 'working' || phase === 'break';
  const canStart  = phase === 'idle' || phase === 'done';

  return (
    <div className="min-h-screen w-full flex flex-col items-center"
      style={{ background: 'linear-gradient(180deg, #07070a 0%, #0d0a14 100%)' }}>

      <div className="w-full max-w-sm flex flex-col min-h-screen px-4 pb-8">

        {/* ── Header ── */}
        <header className="pt-10 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Focus<span style={{ color: '#fbbf24' }}>Bro</span>
            </h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              lock in. take breaks. don't get cooked.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black" style={{ color: '#fbbf24' }}>{focusMin}</p>
            <p className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: 'rgba(255,255,255,0.3)' }}>mins today</p>
          </div>
        </header>

        {/* ── Mascot + Timer ── */}
        <div className="flex flex-col items-center gap-6 py-4">

          {/* Mascot */}
          <BrainMascot mascotState={mascotState} size={170} />

          {/* Timer ring + display */}
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            <ProgressRing progress={progress} color={ringColor} size={200} strokeWidth={8} />
            <div className="flex flex-col items-center">
              <span
                className="text-5xl font-black tabular-nums tracking-tight"
                style={{ color: phase === 'done' ? '#a78bfa' : 'white' }}
              >
                {phase === 'done' ? '✓' : formatTime(timeLeft)}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest mt-1"
                style={{ color: 'rgba(255,255,255,0.3)' }}>
                {phase === 'idle'    && 'ready'}
                {phase === 'working' && 'focus session'}
                {phase === 'break'   && 'break time'}
                {phase === 'done'    && 'day complete'}
              </span>
              {sessions.length > 0 && (
                <span className="text-[10px] mt-1 font-medium"
                  style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''} done
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Interval selectors (only when idle/done) ── */}
        {(phase === 'idle' || phase === 'done') && (
          <div className="space-y-3 animate-slide-up">
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-2"
                style={{ color: 'rgba(255,255,255,0.3)' }}>Work interval</p>
              <div className="flex gap-2">
                {WORK_OPTIONS.map((opt, i) => (
                  <ModeBtn key={i} option={opt} selected={workIdx === i}
                    onClick={() => { setWorkIdx(i); setTimeLeft(opt.seconds); }}
                    disabled={false} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest font-semibold mb-2"
                style={{ color: 'rgba(255,255,255,0.3)' }}>Break interval</p>
              <div className="flex gap-2">
                {BREAK_OPTIONS.map((opt, i) => (
                  <ModeBtn key={i} option={opt} selected={breakIdx === i}
                    onClick={() => setBreakIdx(i)} disabled={false} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Controls ── */}
        <div className="mt-5 space-y-3">
          {/* Primary button */}
          {canStart && (
            <button
              onClick={startSession}
              className="w-full py-4 rounded-2xl font-black text-lg tracking-tight transition-all duration-150 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                boxShadow: '0 4px 28px rgba(251,191,36,0.4)',
                color: '#0f0a00',
              }}
            >
              {sessions.length === 0 ? '🧠 Start Locking In' : '⚡ Next Session'}
            </button>
          )}

          {/* Working controls */}
          {phase === 'working' && (
            <div className="flex gap-3">
              <button
                onClick={pauseResume}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-150 active:scale-95"
                style={{
                  background: running
                    ? 'rgba(251,191,36,0.12)'
                    : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                  border: running ? '1px solid rgba(251,191,36,0.3)' : 'none',
                  color: running ? '#fbbf24' : '#0f0a00',
                  boxShadow: running ? 'none' : '0 4px 20px rgba(251,191,36,0.35)',
                }}
              >
                {running ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button
                onClick={skipToBreak}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-150 active:scale-95"
                style={{
                  background: 'rgba(52,211,153,0.12)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  color: '#34d399',
                }}
              >
                🌊 Take Break
              </button>
            </div>
          )}

          {/* Break controls */}
          {phase === 'break' && (
            <div className="flex gap-3">
              <button
                onClick={pauseResume}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-150 active:scale-95"
                style={{
                  background: running
                    ? 'rgba(52,211,153,0.1)'
                    : 'linear-gradient(135deg, #10b981, #34d399)',
                  border: running ? '1px solid rgba(52,211,153,0.3)' : 'none',
                  color: running ? '#34d399' : '#001a0e',
                  boxShadow: running ? 'none' : '0 4px 20px rgba(52,211,153,0.3)',
                }}
              >
                {running ? '⏸ Pause' : '▶ Resume'}
              </button>
              <button
                onClick={skipBreak}
                className="flex-1 py-3.5 rounded-2xl font-bold transition-all duration-150 active:scale-95"
                style={{
                  background: 'rgba(251,191,36,0.1)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  color: '#fbbf24',
                }}
              >
                ⚡ Skip Break
              </button>
            </div>
          )}

          {/* Secondary actions */}
          {isActive && (
            <button
              onClick={resetAll}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              ↺ Reset
            </button>
          )}

          {sessions.length > 0 && !isActive && (
            <button
              onClick={finishDay}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95"
              style={{
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
                color: '#a78bfa',
              }}
            >
              ✅ I'm done for today
            </button>
          )}
        </div>

        {/* ── ADHD tip banner ── */}
        {phase === 'working' && workElapsed > 0 && workElapsed % (15 * 60) === 0 && (
          <div className="mt-4 px-4 py-3 rounded-2xl animate-slide-up"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <p className="text-xs font-semibold text-center" style={{ color: '#fbbf24' }}>
              💡 Quick stretch? Stand up for 30 secs — keeps the brain cells alive fr
            </p>
          </div>
        )}

        {/* ── Stats bar ── */}
        {sessions.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { label: 'Sessions', value: sessions.length, emoji: '🧠' },
              { label: 'Focus min', value: focusMin, emoji: '⏱' },
              {
                label: 'Streak',
                value: `${sessions.length}🔥`,
                emoji: null,
              },
            ].map(stat => (
              <div key={stat.label}
                className="flex flex-col items-center py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-base font-black text-white">{stat.emoji} {stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.3)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Session log ── */}
        {sessions.length > 0 && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: 'rgba(255,255,255,0.3)' }}>Today's sessions</p>
              <button
                onClick={clearSessions}
                className="text-[10px] font-medium px-2 py-1 rounded-lg"
                style={{ color: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.04)' }}>
                clear
              </button>
            </div>
            <div className="space-y-2">
              {[...sessions].reverse().map((s, i) => (
                <SessionRow key={s.id} session={s} index={sessions.length - 1 - i} />
              ))}
            </div>
          </div>
        )}

        {/* ── ADHD science tip footer ── */}
        <div className="mt-6 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[11px] text-center leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.25)' }}>
            {phase === 'break'
              ? '🧬 ADHD brains recover faster with movement breaks — walk around, stretch, or stare at something far away.'
              : '🧬 Research suggests 52/17 min cycles maximise sustained focus for ADHD brains. Breaks are not optional fr.'}
          </p>
        </div>

      </div>
    </div>
  );
}
