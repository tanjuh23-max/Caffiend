import { useState, useEffect, useRef } from 'react';

/* ─── State configuration ─────────────────────────────────────────────────── */
// mascotState is derived by App.jsx and passed as a prop:
//   'idle'       – nothing started yet today
//   'working'    – active focus session
//   'break'      – active break
//   'good'       – 2-3 sessions done, on track
//   'great'      – 4+ sessions, absolute sigma
//   'overdue'    – working too long without break
//   'done'       – user manually finished their day
//   'celebrate'  – just finished a session (short burst)

const STATE = {
  idle: {
    color: '#c084fc',
    dark:  '#7c3aed',
    glow:  'rgba(192,132,252,0.35)',
    anim:  'mascot-float',
    eye:   'sleepy',
    mouth: 'flat',
    badge: null,
    captions: [
      'skill issue... just start 💀',
      'no sessions detected fr',
      'literally what are you doing',
      'tap start or be cooked forever',
    ],
  },
  working: {
    color: '#fbbf24',
    dark:  '#b45309',
    glow:  'rgba(251,191,36,0.5)',
    anim:  'mascot-work',
    eye:   'squint',
    mouth: 'determined',
    badge: '⚡',
    captions: [
      'LOCKED IN NO CAP 🎯',
      'sigma grind mode activated',
      'no distractions fr fr',
      'W grinder behavior detected',
      'this is the way bestie',
    ],
  },
  break: {
    color: '#34d399',
    dark:  '#047857',
    glow:  'rgba(52,211,153,0.45)',
    anim:  'mascot-float',
    eye:   'happy',
    mouth: 'bigSmile',
    badge: '🌊',
    captions: [
      'take a breather frfr 🌊',
      'fr fr you earned this',
      'recharging brain cells...',
      'W break behavior 👑',
      'hydrate or diedrate bestie',
    ],
  },
  good: {
    color: '#fbbf24',
    dark:  '#92400e',
    glow:  'rgba(251,191,36,0.45)',
    anim:  'mascot-pulse',
    eye:   'normal',
    mouth: 'smile',
    badge: '🔥',
    captions: [
      'W behavior detected 🔥',
      'on track no cap',
      'keep going bestie',
      'the grind is real fr',
    ],
  },
  great: {
    color: '#f59e0b',
    dark:  '#78350f',
    glow:  'rgba(245,158,11,0.6)',
    anim:  'mascot-pulse',
    eye:   'stars',
    mouth: 'bigSmile',
    badge: '👑',
    captions: [
      'SIGMA GRINDER STATUS 👑',
      'absolutely gigachad behavior',
      'no cap this is legendary',
      'the brainrot is defeated fr fr',
    ],
  },
  overdue: {
    color: '#fb923c',
    dark:  '#c2410c',
    glow:  'rgba(251,146,60,0.6)',
    anim:  'mascot-shake',
    eye:   'wide',
    mouth: 'open',
    badge: '⚠️',
    captions: [
      'bro TAKE A BREAK 😵‍💫',
      'your brain is tweaking rn',
      'this is NOT it chief',
      'dial it back bestie please',
    ],
  },
  done: {
    color: '#a78bfa',
    dark:  '#5b21b6',
    glow:  'rgba(167,139,250,0.4)',
    anim:  'mascot-float',
    eye:   'happy',
    mouth: 'bigSmile',
    badge: '✅',
    captions: [
      'sessions done frfr 🎉',
      'that\'s W behavior all day',
      'rest mode: ACTIVATED',
      'absolute sigma locked in',
    ],
  },
  celebrate: {
    color: '#fbbf24',
    dark:  '#92400e',
    glow:  'rgba(251,191,36,0.7)',
    anim:  'mascot-celebrate',
    eye:   'stars',
    mouth: 'bigSmile',
    badge: '🏆',
    captions: [
      'SESSION COMPLETE 🏆',
      'THAT\'S SIGMA BEHAVIOR',
      'W W W W W W W',
      'no cap you absolutely cooked',
    ],
  },
};

/* ─── Sub-components: Eyes ────────────────────────────────────────────────── */

function EyeSleepy({ brainColor }) {
  // Closed arc eyes with occasional blink
  return (
    <>
      <path d="M26 76 Q36 69 46 76" stroke="rgba(255,255,255,0.9)" strokeWidth="3"
        fill="none" strokeLinecap="round" />
      <path d="M54 76 Q64 69 74 76" stroke="rgba(255,255,255,0.9)" strokeWidth="3"
        fill="none" strokeLinecap="round" />
    </>
  );
}

function EyeNormal() {
  return (
    <>
      <circle cx="36" cy="76" r="9" fill="white" />
      <circle cx="38" cy="76" r="5" fill="#0f0a1e" />
      <circle cx="40" cy="74" r="1.8" fill="white" />
      <circle cx="64" cy="76" r="9" fill="white" />
      <circle cx="66" cy="76" r="5" fill="#0f0a1e" />
      <circle cx="68" cy="74" r="1.8" fill="white" />
    </>
  );
}

function EyeSquint() {
  // Focused / squinting eyes
  return (
    <>
      <circle cx="36" cy="76" r="9" fill="white" />
      <circle cx="36" cy="77" r="5.5" fill="#0f0a1e" />
      <circle cx="38" cy="75" r="1.8" fill="white" />
      {/* squint upper lid */}
      <path d="M27 71 Q36 67 45 71" stroke="currentColor" strokeWidth="2.5"
        fill="none" strokeLinecap="round" />
      <circle cx="64" cy="76" r="9" fill="white" />
      <circle cx="64" cy="77" r="5.5" fill="#0f0a1e" />
      <circle cx="66" cy="75" r="1.8" fill="white" />
      <path d="M55 71 Q64 67 73 71" stroke="currentColor" strokeWidth="2.5"
        fill="none" strokeLinecap="round" />
    </>
  );
}

function EyeWide() {
  // Shocked / jittery wide eyes
  return (
    <>
      <circle cx="36" cy="76" r="11" fill="white" />
      <circle cx="36" cy="76" r="6.5" fill="#0f0a1e" />
      <circle cx="38.5" cy="73.5" r="2" fill="white" />
      <circle cx="64" cy="76" r="11" fill="white" />
      <circle cx="64" cy="76" r="6.5" fill="#0f0a1e" />
      <circle cx="66.5" cy="73.5" r="2" fill="white" />
    </>
  );
}

function EyeHappy() {
  // Closed, curved upward (^^)
  return (
    <>
      <path d="M27 76 Q36 65 45 76" stroke="rgba(255,255,255,0.95)" strokeWidth="3.5"
        fill="none" strokeLinecap="round" />
      <path d="M55 76 Q64 65 73 76" stroke="rgba(255,255,255,0.95)" strokeWidth="3.5"
        fill="none" strokeLinecap="round" />
    </>
  );
}

function EyeStars() {
  // Star/sparkle eyes for great performance
  return (
    <>
      {/* Left star eye */}
      <circle cx="36" cy="76" r="9" fill="white" />
      <text x="29" y="80" fontSize="13" textAnchor="start">⭐</text>
      {/* Right star eye */}
      <circle cx="64" cy="76" r="9" fill="white" />
      <text x="57" y="80" fontSize="13" textAnchor="start">⭐</text>
    </>
  );
}

function EyeX() {
  // X eyes for critical/cooked
  return (
    <>
      <circle cx="36" cy="76" r="9" fill="white" />
      <line x1="29" y1="69" x2="43" y2="83" stroke="#0f0a1e" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="43" y1="69" x2="29" y2="83" stroke="#0f0a1e" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="64" cy="76" r="9" fill="white" />
      <line x1="57" y1="69" x2="71" y2="83" stroke="#0f0a1e" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="71" y1="69" x2="57" y2="83" stroke="#0f0a1e" strokeWidth="3.5" strokeLinecap="round" />
    </>
  );
}

/* ─── Sub-components: Mouths ──────────────────────────────────────────────── */

function MouthFlat() {
  return (
    <line x1="40" y1="87" x2="60" y2="87"
      stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" />
  );
}

function MouthSmile() {
  return (
    <path d="M38 85 Q50 93 62 85"
      stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  );
}

function MouthBigSmile() {
  return (
    <path d="M34 84 Q50 96 66 84"
      stroke="rgba(255,255,255,0.95)" strokeWidth="3" fill="none" strokeLinecap="round" />
  );
}

function MouthOpen() {
  return (
    <ellipse cx="50" cy="88" rx="9" ry="6"
      fill="rgba(0,0,0,0.55)" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
  );
}

function MouthDetermined() {
  return (
    <path d="M40 86 Q50 84 60 86"
      stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  );
}

/* ─── Accessories ─────────────────────────────────────────────────────────── */

function ZzzAccessory({ color }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <text style={{ animation: 'zzz-drift 2.2s ease-out infinite 0s' }}
        x="76" y="38" fontSize="11" fontWeight="bold" fill={color} opacity="0.75">z</text>
      <text style={{ animation: 'zzz-drift 2.2s ease-out infinite 0.7s' }}
        x="83" y="26" fontSize="14" fontWeight="bold" fill={color} opacity="0.55">z</text>
      <text style={{ animation: 'zzz-drift 2.2s ease-out infinite 1.4s' }}
        x="89" y="14" fontSize="18" fontWeight="bold" fill={color} opacity="0.35">Z</text>
    </g>
  );
}

function LightningAccessory({ color }) {
  return (
    <g opacity="0.75">
      <path d="M11 26 L5 40 L12 40 L6 55 L18 37 L11 37 Z"
        fill={color} style={{ animation: 'spark-pop 2s ease-out infinite 0.3s' }} />
      <path d="M85 20 L80 32 L86 32 L81 44 L91 29 L85 29 Z"
        fill={color} style={{ animation: 'spark-pop 2s ease-out infinite 1s' }} />
    </g>
  );
}

function StarAccessory({ color }) {
  return (
    <g>
      <text x="4" y="28" fontSize="16"
        style={{ animation: 'spark-pop 2.4s ease-out infinite 0s' }}>✨</text>
      <text x="82" y="22" fontSize="12"
        style={{ animation: 'spark-pop 2.4s ease-out infinite 0.9s' }}>✨</text>
      <text x="76" y="52" fontSize="10"
        style={{ animation: 'spark-pop 2.4s ease-out infinite 1.6s' }}>⭐</text>
    </g>
  );
}

function CrownAccessory() {
  return (
    <text x="28" y="12" fontSize="36"
      style={{ filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.8))' }}>👑</text>
  );
}

/* ─── Brain SVG body ──────────────────────────────────────────────────────── */

function BrainBody({ color, dark }) {
  return (
    <>
      {/* Left lobe */}
      <ellipse cx="33" cy="38" rx="24" ry="27" fill={color} />
      {/* Right lobe */}
      <ellipse cx="67" cy="38" rx="24" ry="27" fill={color} />
      {/* Lower body join */}
      <ellipse cx="50" cy="64" rx="30" ry="19" fill={color} />

      {/* Fold lines — left lobe */}
      <path d="M11 33 Q24 28 44 33" stroke={dark} strokeWidth="1.4"
        fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M10 49 Q23 44 43 49" stroke={dark} strokeWidth="1.4"
        fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M14 63 Q27 59 42 63" stroke={dark} strokeWidth="1.2"
        fill="none" strokeLinecap="round" opacity="0.4" />

      {/* Fold lines — right lobe */}
      <path d="M56 33 Q76 28 89 33" stroke={dark} strokeWidth="1.4"
        fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M57 49 Q77 44 90 49" stroke={dark} strokeWidth="1.4"
        fill="none" strokeLinecap="round" opacity="0.55" />
      <path d="M58 63 Q73 59 86 63" stroke={dark} strokeWidth="1.2"
        fill="none" strokeLinecap="round" opacity="0.4" />

      {/* Center groove */}
      <path d="M50 11 Q47 38 50 82" stroke={dark} strokeWidth="1.8"
        fill="none" strokeLinecap="round" opacity="0.5" />
    </>
  );
}

/* ─── Eyes dispatcher ─────────────────────────────────────────────────────── */
function Eyes({ type, brainColor }) {
  switch (type) {
    case 'sleepy':      return <EyeSleepy brainColor={brainColor} />;
    case 'squint':      return <EyeSquint />;
    case 'wide':        return <EyeWide />;
    case 'happy':       return <EyeHappy />;
    case 'stars':       return <EyeStars />;
    case 'x':           return <EyeX />;
    default:            return <EyeNormal />;
  }
}

/* ─── Mouth dispatcher ────────────────────────────────────────────────────── */
function Mouth({ type }) {
  switch (type) {
    case 'flat':        return <MouthFlat />;
    case 'smile':       return <MouthSmile />;
    case 'bigSmile':    return <MouthBigSmile />;
    case 'open':        return <MouthOpen />;
    case 'determined':  return <MouthDetermined />;
    default:            return <MouthFlat />;
  }
}

/* ─── Accessories dispatcher ──────────────────────────────────────────────── */
function Accessories({ mascotState, color }) {
  switch (mascotState) {
    case 'idle':
      return <ZzzAccessory color={color} />;
    case 'working':
      return <LightningAccessory color={color} />;
    case 'great':
    case 'celebrate':
      return <StarAccessory color={color} />;
    case 'done':
      return <CrownAccessory />;
    default:
      return null;
  }
}

/* ─── Main component ──────────────────────────────────────────────────────── */

export default function BrainMascot({ mascotState = 'idle', size = 180 }) {
  const cfg = STATE[mascotState] ?? STATE.idle;
  const [captionIdx, setCaptionIdx] = useState(0);
  const intervalRef = useRef(null);

  // Cycle through captions every 4.5 s (matches animation duration)
  useEffect(() => {
    setCaptionIdx(0);
    intervalRef.current = setInterval(() => {
      setCaptionIdx(i => (i + 1) % cfg.captions.length);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, [mascotState, cfg.captions.length]);

  const glowStyle = {
    filter: `drop-shadow(0 0 24px ${cfg.glow}) drop-shadow(0 0 8px ${cfg.glow})`,
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* Outer glow ring */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute rounded-full animate-ring"
          style={{
            width: size + 20,
            height: size + 20,
            background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 70%)`,
          }}
        />
        {/* Brain SVG */}
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          className={cfg.anim}
          style={glowStyle}
          aria-label="Brain mascot"
        >
          {/* colour fills */}
          <color value={cfg.color} />

          <BrainBody color={cfg.color} dark={cfg.dark} />
          <Accessories mascotState={mascotState} color={cfg.color} />

          {/* Eyes — rendered inside SVG so currentColor resolves */}
          <g color={cfg.color}>
            <Eyes type={cfg.eye} brainColor={cfg.color} />
          </g>

          <Mouth type={cfg.mouth} />

          {/* Badge in bottom-right corner */}
          {cfg.badge && (
            <text x="68" y="100" fontSize="18" textAnchor="middle"
              style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }}>
              {cfg.badge}
            </text>
          )}
        </svg>
      </div>

      {/* Caption bubble */}
      <div
        key={`${mascotState}-${captionIdx}`}
        className="animate-caption px-4 py-2 rounded-2xl text-center"
        style={{
          background: `rgba(255,255,255,0.06)`,
          border: `1px solid ${cfg.glow}`,
          backdropFilter: 'blur(12px)',
          maxWidth: 260,
        }}
      >
        <p className="text-sm font-semibold leading-snug" style={{ color: cfg.color }}>
          {cfg.captions[captionIdx]}
        </p>
      </div>
    </div>
  );
}
