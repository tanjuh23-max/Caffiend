import { useState, useEffect, useRef } from 'react';

/* ─── State config ────────────────────────────────────────────────────────── */
const STATE = {
  idle: {
    glow:     'rgba(59,130,246,0.35)',
    ringColor:'#3b82f6',
    anim:     'mascot-pulse-slow',
    brows:    'droopy',
    eyes:     'sleepy',
    mouth:    'flat',
    extra:    'phone',
    captions: [
      'doomscrolling instead of working 📱',
      'what even is productivity fr',
      'goblin cannot be bothered rn',
      'tap start or stay cooked forever',
    ],
  },
  working: {
    glow:     'rgba(251,191,36,0.55)',
    ringColor:'#fbbf24',
    anim:     'mascot-work',
    brows:    'determined',
    eyes:     'manic',
    mouth:    'grin',
    extra:    'laptop',
    captions: [
      'GOBLIN MODE ACTIVATED 🧌',
      'locked in no cap fr fr',
      'feral grind commencing',
      'W goblin behavior detected',
      'sigma goblin on the clock',
    ],
  },
  break: {
    glow:     'rgba(34,197,94,0.38)',
    ringColor:'#22c55e',
    anim:     'mascot-float',
    brows:    'relaxed',
    eyes:     'content',
    mouth:    'smile',
    extra:    'flower',
    captions: [
      'experiencing nature?? weird 🌸',
      'take a breather frfr 🌊',
      'goblin resting arc begins',
      'fr fr you earned this bestie',
    ],
  },
  good: {
    glow:     'rgba(251,191,36,0.4)',
    ringColor:'#fbbf24',
    anim:     'mascot-pulse',
    brows:    'smug',
    eyes:     'smug',
    mouth:    'smirk',
    extra:    null,
    captions: [
      'W goblin behavior fr 🔥',
      'on track no cap bestie',
      'the bag is being secured',
      'keep going goblin king',
    ],
  },
  great: {
    glow:     'rgba(251,191,36,0.65)',
    ringColor:'#f59e0b',
    anim:     'mascot-pulse',
    brows:    'raised',
    eyes:     'stars',
    mouth:    'bigGrin',
    extra:    'crown',
    captions: [
      'GOBLIN KING STATUS 👑',
      'absolutely cooked the tasks fr',
      'no cap this is legendary behavior',
      'all hail the sigma goblin',
    ],
  },
  overdue: {
    glow:     'rgba(251,146,60,0.6)',
    ringColor:'#f97316',
    anim:     'mascot-shake',
    brows:    'panicked',
    eyes:     'spiral',
    mouth:    'openScream',
    extra:    'papers',
    captions: [
      'bro you NEED a break 😵‍💫',
      'goblin is tweaking rn',
      'this is NOT it chief',
      'unhinged behavior — dial it back',
    ],
  },
  done: {
    glow:     'rgba(167,139,250,0.42)',
    ringColor:'#a78bfa',
    anim:     'mascot-float',
    brows:    'relaxed',
    eyes:     'content',
    mouth:    'smile',
    extra:    'crownTilt',
    captions: [
      'day\'s grind complete fr 🎉',
      'that\'s W goblin behavior all day',
      'rest mode: ACTIVATED',
      'sigma goblin signing off',
    ],
  },
  celebrate: {
    glow:     'rgba(251,191,36,0.72)',
    ringColor:'#fbbf24',
    anim:     'mascot-celebrate',
    brows:    'raised',
    eyes:     'stars',
    mouth:    'bigGrin',
    extra:    'sparkles',
    captions: [
      'SESSION COMPLETE 🏆',
      'THAT\'S GOBLIN MODE FR',
      'W W W W W W W',
      'no cap you absolutely cooked it',
    ],
  },
};

/* ─── Eyebrows ────────────────────────────────────────────────────────────── */
function Brows({ type }) {
  switch (type) {
    case 'droopy':
      return (
        <>
          <path d="M30 34 Q38 37 45 35" stroke="#2a1a08" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
          <path d="M55 35 Q62 37 70 34" stroke="#2a1a08" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        </>
      );
    case 'determined':
      // angled inward — "serious goblin"
      return (
        <>
          <path d="M29 32 Q38 36 45 34" stroke="#1a0e04" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
          <path d="M55 34 Q62 36 71 32" stroke="#1a0e04" strokeWidth="2.8" fill="none" strokeLinecap="round"/>
        </>
      );
    case 'relaxed':
      return (
        <>
          <path d="M30 33 Q38 30 45 32" stroke="#2a1a08" strokeWidth="2" fill="none" strokeLinecap="round"/>
          <path d="M55 32 Q62 30 70 33" stroke="#2a1a08" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      );
    case 'smug':
      // left brow raised, right normal
      return (
        <>
          <path d="M30 31 Q38 27 45 30" stroke="#1a0e04" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
          <path d="M55 33 Q62 31 70 33" stroke="#1a0e04" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
        </>
      );
    case 'raised':
      return (
        <>
          <path d="M30 30 Q38 26 45 28" stroke="#1a0e04" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
          <path d="M55 28 Q62 26 70 30" stroke="#1a0e04" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
        </>
      );
    case 'panicked':
      // one up one down — chaos
      return (
        <>
          <path d="M29 30 Q38 35 45 31" stroke="#1a0e04" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          <path d="M55 31 Q62 35 71 30" stroke="#1a0e04" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </>
      );
    default:
      return null;
  }
}

/* ─── Eyes ────────────────────────────────────────────────────────────────── */
function Eyes({ type }) {
  const L = { cx: 38, cy: 44 };
  const R = { cx: 62, cy: 44 };

  switch (type) {
    case 'sleepy':
      return (
        <>
          {/* white circles, mostly covered by eyelid */}
          <circle cx={L.cx} cy={L.cy} r="8.5" fill="white"/>
          <circle cx={R.cx} cy={R.cy} r="8.5" fill="white"/>
          <circle cx={L.cx + 1} cy={L.cy + 2} r="4.5" fill="#1a0f00"/>
          <circle cx={R.cx + 1} cy={R.cy + 2} r="4.5" fill="#1a0f00"/>
          {/* heavy eyelid — filled with skin color */}
          <rect x="29" y="36" width="19" height="10" rx="5" fill="#5ab84a"/>
          <rect x="53" y="36" width="19" height="10" rx="5" fill="#5ab84a"/>
        </>
      );
    case 'manic':
      return (
        <>
          <circle cx={L.cx} cy={L.cy} r="11" fill="white"/>
          <circle cx={R.cx} cy={R.cy} r="11" fill="white"/>
          {/* large pupils */}
          <circle cx={L.cx + 1} cy={L.cy} r="6.5" fill="#1a0f00"/>
          <circle cx={R.cx + 1} cy={R.cy} r="6.5" fill="#1a0f00"/>
          {/* shine */}
          <circle cx={L.cx + 4} cy={L.cy - 3} r="2.2" fill="white"/>
          <circle cx={R.cx + 4} cy={R.cy - 3} r="2.2" fill="white"/>
        </>
      );
    case 'content':
      // gentle closed happy eyes (arcs)
      return (
        <>
          <path d="M29 44 Q38 37 47 44" stroke="rgba(0,0,0,0.75)" strokeWidth="2.8"
            fill="none" strokeLinecap="round"/>
          <path d="M53 44 Q62 37 71 44" stroke="rgba(0,0,0,0.75)" strokeWidth="2.8"
            fill="none" strokeLinecap="round"/>
        </>
      );
    case 'smug':
      return (
        <>
          <circle cx={L.cx} cy={L.cy} r="8.5" fill="white"/>
          <circle cx={R.cx} cy={R.cy} r="8.5" fill="white"/>
          <circle cx={L.cx + 2} cy={L.cy + 1} r="4.5" fill="#1a0f00"/>
          <circle cx={R.cx + 2} cy={R.cy + 1} r="4.5" fill="#1a0f00"/>
          <circle cx={L.cx + 4} cy={L.cy - 1} r="1.5" fill="white"/>
          <circle cx={R.cx + 4} cy={R.cy - 1} r="1.5" fill="white"/>
          {/* smug half-lid on each eye */}
          <rect x="29" y="36" width="19" height="7" rx="4" fill="#5ab84a"/>
          <rect x="53" y="36" width="19" height="7" rx="4" fill="#5ab84a"/>
        </>
      );
    case 'stars':
      return (
        <>
          <circle cx={L.cx} cy={L.cy} r="10" fill="white"/>
          <circle cx={R.cx} cy={R.cy} r="10" fill="white"/>
          <text x="29.5" y="49" fontSize="12">⭐</text>
          <text x="53.5" y="49" fontSize="12">⭐</text>
        </>
      );
    case 'spiral':
      // X eyes — completely cooked
      return (
        <>
          <circle cx={L.cx} cy={L.cy} r="8.5" fill="white"/>
          <circle cx={R.cx} cy={R.cy} r="8.5" fill="white"/>
          <line x1="31" y1="37" x2="45" y2="51" stroke="#1a0f00" strokeWidth="3" strokeLinecap="round"/>
          <line x1="45" y1="37" x2="31" y2="51" stroke="#1a0f00" strokeWidth="3" strokeLinecap="round"/>
          <line x1="55" y1="37" x2="69" y2="51" stroke="#1a0f00" strokeWidth="3" strokeLinecap="round"/>
          <line x1="69" y1="37" x2="55" y2="51" stroke="#1a0f00" strokeWidth="3" strokeLinecap="round"/>
        </>
      );
    default: // normal
      return (
        <>
          <circle cx={L.cx} cy={L.cy} r="8.5" fill="white"/>
          <circle cx={R.cx} cy={R.cy} r="8.5" fill="white"/>
          <circle cx={L.cx + 1} cy={L.cy} r="4.5" fill="#1a0f00"/>
          <circle cx={R.cx + 1} cy={R.cy} r="4.5" fill="#1a0f00"/>
          <circle cx={L.cx + 3} cy={L.cy - 2} r="1.6" fill="white"/>
          <circle cx={R.cx + 3} cy={R.cy - 2} r="1.6" fill="white"/>
        </>
      );
  }
}

/* ─── Mouths ──────────────────────────────────────────────────────────────── */
function Mouth({ type }) {
  switch (type) {
    case 'flat':
      return (
        <line x1="40" y1="67" x2="60" y2="67"
          stroke="rgba(0,0,0,0.55)" strokeWidth="2.2" strokeLinecap="round"/>
      );
    case 'smile':
      return (
        <path d="M37 65 Q50 74 63 65"
          stroke="rgba(0,0,0,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      );
    case 'smirk':
      // asymmetric smug smirk
      return (
        <path d="M39 65 Q50 70 60 64"
          stroke="rgba(0,0,0,0.7)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      );
    case 'grin': {
      // big toothy grin
      return (
        <g>
          <path d="M33 64 Q50 78 67 64" fill="#1a0f00"/>
          {/* teeth row */}
          <rect x="36" y="64" width="7" height="6" rx="1" fill="white"/>
          <rect x="44" y="63" width="7" height="7" rx="1" fill="white"/>
          <rect x="52" y="63" width="7" height="7" rx="1" fill="white"/>
          <rect x="60" y="64" width="6" height="6" rx="1" fill="white"/>
        </g>
      );
    }
    case 'bigGrin': {
      return (
        <g>
          <path d="M30 63 Q50 80 70 63" fill="#1a0f00"/>
          <rect x="33" y="63" width="7" height="7" rx="1" fill="white"/>
          <rect x="41" y="61" width="8" height="9" rx="1" fill="white"/>
          <rect x="50" y="61" width="8" height="9" rx="1" fill="white"/>
          <rect x="59" y="62" width="8" height="8" rx="1" fill="white"/>
        </g>
      );
    }
    case 'openScream':
      return (
        <g>
          <ellipse cx="50" cy="69" rx="13" ry="9" fill="#1a0f00"/>
          <ellipse cx="50" cy="66" rx="13" ry="4" fill="#cc3333"/>
        </g>
      );
    default:
      return null;
  }
}

/* ─── Accessories ─────────────────────────────────────────────────────────── */
function Extra({ type, glowColor }) {
  switch (type) {
    case 'phone':
      return (
        <g>
          {/* Phone held in lower right area */}
          <rect x="62" y="68" width="11" height="17" rx="2.5"
            fill="#111827" stroke="#374151" strokeWidth="1"/>
          <rect x="63.5" y="70" width="8" height="10" rx="1"
            fill="#3b82f6" opacity="0.7"/>
          {/* Glow on goblin face from phone */}
          <ellipse cx="62" cy="70" rx="10" ry="7"
            fill="rgba(59,130,246,0.18)" style={{ filter: 'blur(3px)' }}/>
          {/* Z's */}
          <text style={{ animation: 'zzz-drift 2.2s ease-out infinite 0s' }}
            x="76" y="56" fontSize="10" fontWeight="bold" fill="#93c5fd" opacity="0.8">z</text>
          <text style={{ animation: 'zzz-drift 2.2s ease-out infinite 0.8s' }}
            x="81" y="44" fontSize="13" fontWeight="bold" fill="#93c5fd" opacity="0.6">z</text>
          <text style={{ animation: 'zzz-drift 2.2s ease-out infinite 1.5s' }}
            x="85" y="32" fontSize="17" fontWeight="bold" fill="#93c5fd" opacity="0.4">Z</text>
        </g>
      );
    case 'laptop':
      return (
        <g>
          {/* Faint laptop glow from below face */}
          <ellipse cx="50" cy="90" rx="26" ry="8"
            fill="rgba(96,165,250,0.25)" style={{ filter: 'blur(4px)' }}/>
          {/* Lightning bolt accessories */}
          <path d="M9 22 L4 36 L11 36 L5 52 L17 32 L10 32 Z"
            fill={glowColor} opacity="0.7"
            style={{ animation: 'spark-pop 2.1s ease-out infinite 0.2s' }}/>
          <path d="M87 18 L83 30 L89 30 L84 43 L95 26 L88 26 Z"
            fill={glowColor} opacity="0.6"
            style={{ animation: 'spark-pop 2.1s ease-out infinite 1.1s' }}/>
        </g>
      );
    case 'flower':
      return (
        <g>
          <text x="66" y="72" fontSize="20"
            style={{ animation: 'spark-pop 3s ease-out infinite 0.5s' }}>🌸</text>
        </g>
      );
    case 'crown':
      return (
        <g>
          <path d="M30 18 L37 6 L50 14 L63 6 L70 18 L66 22 L34 22 Z"
            fill="#fbbf24" stroke="#d97706" strokeWidth="1.5"/>
          <circle cx="50" cy="8" r="3" fill="#f87171"/>
          <circle cx="37" cy="10" r="2" fill="#34d399"/>
          <circle cx="63" cy="10" r="2" fill="#60a5fa"/>
        </g>
      );
    case 'crownTilt':
      return (
        <g transform="rotate(12, 50, 14)">
          <path d="M30 18 L37 6 L50 14 L63 6 L70 18 L66 22 L34 22 Z"
            fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5"/>
          <circle cx="50" cy="8" r="3" fill="#f9a8d4"/>
        </g>
      );
    case 'papers':
      return (
        <g>
          <rect x="6" y="28" width="14" height="18" rx="2"
            fill="white" stroke="#e5e7eb" strokeWidth="1"
            transform="rotate(-20, 13, 37)"
            style={{ animation: 'spark-pop 1.6s ease-out infinite 0s' }}/>
          <rect x="80" y="22" width="13" height="16" rx="2"
            fill="white" stroke="#e5e7eb" strokeWidth="1"
            transform="rotate(18, 86, 30)"
            style={{ animation: 'spark-pop 1.6s ease-out infinite 0.6s' }}/>
          <rect x="72" y="50" width="11" height="14" rx="2"
            fill="white" stroke="#e5e7eb" strokeWidth="1"
            transform="rotate(-10, 77, 57)"
            style={{ animation: 'spark-pop 1.6s ease-out infinite 1.1s' }}/>
        </g>
      );
    case 'sparkles':
      return (
        <g>
          <text x="4" y="28" fontSize="16"
            style={{ animation: 'spark-pop 2.2s ease-out infinite 0s' }}>✨</text>
          <text x="80" y="22" fontSize="14"
            style={{ animation: 'spark-pop 2.2s ease-out infinite 0.7s' }}>✨</text>
          <text x="74" y="55" fontSize="11"
            style={{ animation: 'spark-pop 2.2s ease-out infinite 1.3s' }}>⭐</text>
          <text x="8" y="55" fontSize="11"
            style={{ animation: 'spark-pop 2.2s ease-out infinite 1.8s' }}>⭐</text>
        </g>
      );
    default:
      return null;
  }
}

/* ─── Static goblin body ──────────────────────────────────────────────────── */
function GoblinBody() {
  const skinGreen   = '#5ab84a';
  const skinDark    = '#3f8a30';
  const ragBrown    = '#5a3a18';
  const ragDark     = '#3d2610';
  const hairColor   = '#2a1a08';

  return (
    <>
      {/* ── Ears (behind head) ── */}
      <polygon points="23,36 10,20 21,53" fill={skinGreen}/>
      <polygon points="77,36 90,20 79,53" fill={skinGreen}/>
      {/* inner ear */}
      <polygon points="22,38 14,24 21,49" fill={skinDark} opacity="0.6"/>
      <polygon points="78,38 86,24 79,49" fill={skinDark} opacity="0.6"/>

      {/* ── Main head ── */}
      <ellipse cx="50" cy="47" rx="27" ry="29" fill={skinGreen}/>

      {/* ── Hair tufts ── */}
      <path d="M36 19 Q33 8 28 15"  stroke={hairColor} strokeWidth="4"   fill="none" strokeLinecap="round"/>
      <path d="M43 16 Q41 5 37 11"  stroke={hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M50 15 Q50 3 46 9"   stroke={hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M57 16 Q59 5 55 10"  stroke={hairColor} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M65 20 Q70 9 64 15"  stroke={hairColor} strokeWidth="4"   fill="none" strokeLinecap="round"/>

      {/* ── Nose ── */}
      <ellipse cx="50" cy="57" rx="6" ry="5.5" fill={skinDark}/>
      <circle cx="47.5" cy="59.5" r="2" fill="#2d6020"/>
      <circle cx="52.5" cy="59.5" r="2" fill="#2d6020"/>

      {/* ── Chin/jaw shading ── */}
      <ellipse cx="50" cy="71" rx="18" ry="7" fill={skinDark} opacity="0.25"/>

      {/* ── Body / shoulders ── */}
      <path d="M23,78 Q36,75 50,74 Q64,75 77,78 L80,105 L20,105 Z" fill={ragDark}/>
      {/* ragged collar */}
      <path d="M35,78 L39,71 L43,78 L47,69 L50,75 L53,69 L57,78 L61,71 L65,78"
        stroke={ragBrown} strokeWidth="2.5" fill={ragBrown} strokeLinejoin="round"/>
      {/* tunic texture lines */}
      <path d="M34,88 Q50,85 66,88" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" fill="none"/>
      <path d="M30,96 Q50,93 70,96" stroke="rgba(255,255,255,0.04)" strokeWidth="1"   fill="none"/>
    </>
  );
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export default function GoblinMascot({ mascotState = 'idle', size = 180 }) {
  const cfg = STATE[mascotState] ?? STATE.idle;
  const [captionIdx, setCaptionIdx] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setCaptionIdx(0);
    intervalRef.current = setInterval(() => {
      setCaptionIdx(i => (i + 1) % cfg.captions.length);
    }, 4500);
    return () => clearInterval(intervalRef.current);
  }, [mascotState, cfg.captions.length]);

  const glowStyle = {
    filter: `drop-shadow(0 0 22px ${cfg.glow}) drop-shadow(0 0 8px ${cfg.glow})`,
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative flex items-center justify-center">
        {/* ambient glow ring */}
        <div
          className="absolute rounded-full animate-ring"
          style={{
            width:  size + 24,
            height: size + 24,
            background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 68%)`,
          }}
        />

        <svg
          viewBox="0 0 100 105"
          width={size}
          height={size}
          className={cfg.anim}
          style={glowStyle}
          aria-label="Goblin mascot"
        >
          {/* z-order: extras behind head go first, head body, then face layers */}
          <Extra type={cfg.extra} glowColor={cfg.ringColor}/>
          <GoblinBody />
          <Brows type={cfg.brows}/>
          <Eyes  type={cfg.eyes}/>
          <Mouth type={cfg.mouth}/>
        </svg>
      </div>

      {/* Caption */}
      <div
        key={`${mascotState}-${captionIdx}`}
        className="animate-caption px-4 py-2 rounded-2xl text-center"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${cfg.glow}`,
          backdropFilter: 'blur(12px)',
          maxWidth: 260,
        }}
      >
        <p className="text-sm font-semibold leading-snug" style={{ color: cfg.ringColor }}>
          {cfg.captions[captionIdx]}
        </p>
      </div>
    </div>
  );
}
