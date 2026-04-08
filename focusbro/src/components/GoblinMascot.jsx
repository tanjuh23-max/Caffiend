import { useState, useEffect, useRef } from 'react';

/* ─── State config ────────────────────────────────────────────────────────── */
const STATE = {
  idle: {
    glow: 'rgba(99,102,241,0.45)', ringColor: '#818cf8', anim: 'mascot-pulse-slow',
    brows: 'droopy', eyes: 'sleepy', mouth: 'flat', extra: 'phone',
    captions: ['doomscrolling instead of working 📱','what even is productivity fr','goblin cannot be bothered rn','tap start or stay cooked forever'],
  },
  working: {
    glow: 'rgba(251,191,36,0.55)', ringColor: '#fbbf24', anim: 'mascot-work',
    brows: 'determined', eyes: 'manic', mouth: 'grin', extra: 'laptop',
    captions: ['GOBLIN MODE ACTIVATED 🧌','locked in no cap fr fr','feral grind commencing','W goblin behavior detected'],
  },
  break: {
    glow: 'rgba(34,197,94,0.4)', ringColor: '#22c55e', anim: 'mascot-float',
    brows: 'relaxed', eyes: 'content', mouth: 'smile', extra: 'flower',
    captions: ['experiencing nature?? weird 🌸','take a breather frfr 🌊','goblin resting arc begins','fr fr you earned this bestie'],
  },
  good: {
    glow: 'rgba(251,191,36,0.4)', ringColor: '#fbbf24', anim: 'mascot-pulse',
    brows: 'smug', eyes: 'smug', mouth: 'smirk', extra: null,
    captions: ['W goblin behavior fr 🔥','on track no cap bestie','the bag is being secured','keep going goblin king'],
  },
  great: {
    glow: 'rgba(251,191,36,0.65)', ringColor: '#f59e0b', anim: 'mascot-pulse',
    brows: 'raised', eyes: 'stars', mouth: 'bigGrin', extra: 'crown',
    captions: ['GOBLIN KING STATUS 👑','absolutely cooked the tasks fr','no cap this is legendary','all hail the sigma goblin'],
  },
  overdue: {
    glow: 'rgba(251,146,60,0.6)', ringColor: '#f97316', anim: 'mascot-shake',
    brows: 'panicked', eyes: 'spiral', mouth: 'openScream', extra: 'papers',
    captions: ['bro you NEED a break 😵‍💫','goblin is tweaking rn','this is NOT it chief','unhinged behavior — dial it back'],
  },
  done: {
    glow: 'rgba(167,139,250,0.42)', ringColor: '#a78bfa', anim: 'mascot-float',
    brows: 'relaxed', eyes: 'content', mouth: 'smile', extra: 'crownTilt',
    captions: ["day's grind complete fr 🎉","that's W goblin behavior all day",'rest mode: ACTIVATED','sigma goblin signing off'],
  },
  celebrate: {
    glow: 'rgba(251,191,36,0.72)', ringColor: '#fbbf24', anim: 'mascot-celebrate',
    brows: 'raised', eyes: 'stars', mouth: 'bigGrin', extra: 'sparkles',
    captions: ['SESSION COMPLETE 🏆',"THAT'S GOBLIN MODE FR",'W W W W W W W','no cap you absolutely cooked it'],
  },
};

/* ─── SVG Defs (gradients + filters) ─────────────────────────────────────── */
function Defs() {
  return (
    <defs>
      {/* Skin — radial, light source top-left */}
      <radialGradient id="g-skin" cx="38%" cy="28%" r="68%">
        <stop offset="0%"   stopColor="#a8e070"/>
        <stop offset="42%"  stopColor="#5dba48"/>
        <stop offset="78%"  stopColor="#3a8c28"/>
        <stop offset="100%" stopColor="#1f5c12"/>
      </radialGradient>

      {/* Skin — darker variant for ears/neck */}
      <radialGradient id="g-skin-dark" cx="30%" cy="25%" r="75%">
        <stop offset="0%"   stopColor="#6dc850"/>
        <stop offset="100%" stopColor="#1a5010"/>
      </radialGradient>

      {/* Eye iris — warm amber */}
      <radialGradient id="g-iris" cx="38%" cy="32%" r="65%">
        <stop offset="0%"   stopColor="#fde68a"/>
        <stop offset="45%"  stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#78350f"/>
      </radialGradient>

      {/* Cloth — linen brown */}
      <linearGradient id="g-cloth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#7c4522"/>
        <stop offset="100%" stopColor="#2e1508"/>
      </linearGradient>

      {/* Cloth highlight */}
      <linearGradient id="g-cloth-hi" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="rgba(255,200,140,0.18)"/>
        <stop offset="100%" stopColor="rgba(255,200,140,0)"/>
      </linearGradient>

      {/* Teeth */}
      <linearGradient id="g-teeth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#fffff0"/>
        <stop offset="100%" stopColor="#d4d4a0"/>
      </linearGradient>

      {/* Drop shadow on whole character */}
      <filter id="f-shadow" x="-15%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="rgba(0,0,0,0.45)"/>
      </filter>

      {/* Soft blur for cheek blush */}
      <filter id="f-blush" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>

      {/* Soft inner highlight on head */}
      <radialGradient id="g-head-hi" cx="38%" cy="28%" r="45%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.28)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>

      {/* Eye white gradient */}
      <radialGradient id="g-sclera" cx="35%" cy="30%" r="65%">
        <stop offset="0%"   stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#dde8d0"/>
      </radialGradient>

      {/* Clip paths for sleepy/smug eyelids */}
      <clipPath id="cp-eyeL"><ellipse cx="72" cy="86" rx="19" ry="17"/></clipPath>
      <clipPath id="cp-eyeR"><ellipse cx="128" cy="86" rx="19" ry="17"/></clipPath>
    </defs>
  );
}

/* ─── Static body parts ───────────────────────────────────────────────────── */

function Ears() {
  return (
    <>
      {/* LEFT ear — organic curved shape */}
      <path d="M 42 60 Q 34 52 22 38 Q 14 26 18 16 Q 26 10 36 22 Q 44 34 44 52 Z"
        fill="url(#g-skin-dark)"/>
      <path d="M 40 58 Q 34 50 24 38 Q 18 28 22 20 Q 28 16 34 26 Q 40 38 42 54 Z"
        fill="url(#g-skin)" opacity="0.7"/>
      {/* inner ear line */}
      <path d="M 32 24 Q 36 34 38 50" stroke="#1a5010" strokeWidth="1.2"
        fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* RIGHT ear */}
      <path d="M 158 60 Q 166 52 178 38 Q 186 26 182 16 Q 174 10 164 22 Q 156 34 156 52 Z"
        fill="url(#g-skin-dark)"/>
      <path d="M 160 58 Q 166 50 176 38 Q 182 28 178 20 Q 172 16 166 26 Q 160 38 158 54 Z"
        fill="url(#g-skin)" opacity="0.7"/>
      <path d="M 168 24 Q 164 34 162 50" stroke="#1a5010" strokeWidth="1.2"
        fill="none" strokeLinecap="round" opacity="0.5"/>
    </>
  );
}

function Head() {
  return (
    <>
      {/* Main head — organic rounded path */}
      <path
        d="M 100 16 C 146 16 172 40 172 76 C 172 110 152 132 126 140 C 116 146 100 150 100 150 C 100 150 84 146 74 140 C 48 132 28 110 28 76 C 28 40 54 16 100 16 Z"
        fill="url(#g-skin)" filter="url(#f-shadow)"/>

      {/* Specular highlight — soft oval top-left of head */}
      <ellipse cx="78" cy="44" rx="24" ry="18"
        fill="url(#g-head-hi)" opacity="0.9"/>

      {/* Chin ambient occlusion shadow */}
      <ellipse cx="100" cy="144" rx="30" ry="8"
        fill="rgba(0,0,0,0.12)" opacity="0.6"/>
    </>
  );
}

function Hair() {
  const c = '#1e0e04';
  const hi = 'rgba(120,60,20,0.5)';
  return (
    <>
      {/* Five unruly tufts with varying thickness */}
      <path d="M 66 18 Q 60 4  52 10 Q 58 16 62 24"    fill={c}/>
      <path d="M 80 14 Q 76 1  68 6  Q 72 14 76 20"    fill={c}/>
      <path d="M 100 12 Q 98 -1 92 4  Q 95 12 98 18"   fill={c}/>
      <path d="M 118 14 Q 122 1 130 6 Q 126 14 122 20"  fill={c}/>
      <path d="M 133 18 Q 140 4 148 10 Q 142 16 137 24" fill={c}/>

      {/* Highlight on each tuft */}
      <path d="M 63 12 Q 60 7 56 11"  stroke={hi} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 78 8  Q 76 4 72 7"   stroke={hi} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 99 6  Q 98 2 95 5"   stroke={hi} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 121 8  Q 123 4 127 7" stroke={hi} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 136 12 Q 140 7 144 10"stroke={hi} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </>
  );
}

function Nose() {
  return (
    <>
      {/* Nose bump with shading */}
      <ellipse cx="100" cy="112" rx="10" ry="9" fill="#2e7a1a" opacity="0.85"/>
      <ellipse cx="97" cy="110" rx="6" ry="5" fill="#3d9a22" opacity="0.6"/>
      {/* Nostrils */}
      <ellipse cx="95.5" cy="116" rx="3" ry="2.5" fill="#144010" opacity="0.9"/>
      <ellipse cx="104.5" cy="116" rx="3" ry="2.5" fill="#144010" opacity="0.9"/>
      {/* Nostril highlight */}
      <circle cx="94" cy="115" r="1" fill="rgba(255,255,255,0.2)"/>
      <circle cx="103" cy="115" r="1" fill="rgba(255,255,255,0.2)"/>
    </>
  );
}

function Cheeks() {
  return (
    <>
      <ellipse cx="52" cy="102" rx="16" ry="11"
        fill="rgba(255,130,130,0.32)" filter="url(#f-blush)"/>
      <ellipse cx="148" cy="102" rx="16" ry="11"
        fill="rgba(255,130,130,0.32)" filter="url(#f-blush)"/>
    </>
  );
}

function Body() {
  return (
    <>
      {/* Shoulders / torso */}
      <path d="M 22 158 Q 50 148 100 146 Q 150 148 178 158 L 184 220 L 16 220 Z"
        fill="url(#g-cloth)"/>
      {/* Cloth highlight */}
      <path d="M 22 158 Q 50 148 100 146 Q 150 148 178 158 L 170 190 Q 100 182 30 190 Z"
        fill="url(#g-cloth-hi)"/>
      {/* Ragged neckline */}
      <path d="M 64 150 L 70 140 L 76 150 L 82 138 L 88 149 L 94 142 L 100 150 L 106 142 L 112 149 L 118 138 L 124 150 L 130 140 L 136 150"
        stroke="#5a3010" strokeWidth="2.5" fill="#5a3010" strokeLinejoin="round"/>
      {/* Cloth fold lines */}
      <path d="M 55 175 Q 80 170 100 172 Q 120 170 145 175"
        stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none"/>
      <path d="M 40 192 Q 70 186 100 188 Q 130 186 160 192"
        stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" fill="none"/>
      {/* Ground shadow */}
      <ellipse cx="100" cy="220" rx="62" ry="7"
        fill="rgba(0,0,0,0.22)"/>
    </>
  );
}

/* ─── Eyebrows ────────────────────────────────────────────────────────────── */
function Brows({ type }) {
  const brow = (d, w = 4) => (
    <path d={d} fill="#1e0e04" stroke="#1e0e04"
      strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
  );
  switch (type) {
    case 'droopy':    return <>{brow("M 56 68 Q 68 73 80 71")}{brow("M 120 71 Q 132 73 144 68")}</>;
    case 'determined':return <>{brow("M 54 64 Q 68 70 80 67",4.5)}{brow("M 120 67 Q 132 70 146 64",4.5)}</>;
    case 'relaxed':   return <>{brow("M 56 65 Q 68 60 80 63")}{brow("M 120 63 Q 132 60 144 65")}</>;
    case 'smug':      return <>{brow("M 56 62 Q 68 56 80 60")}{brow("M 120 63 Q 132 61 144 64")}</>;
    case 'raised':    return <>{brow("M 56 60 Q 68 53 80 57")}{brow("M 120 57 Q 132 53 144 60")}</>;
    case 'panicked':  return <>{brow("M 54 62 Q 68 70 80 64",4.5)}{brow("M 120 64 Q 132 70 146 62",4.5)}</>;
    default:          return null;
  }
}

/* ─── Eyes ────────────────────────────────────────────────────────────────── */
function EyeUnit({ cx, clipId, state }) {
  const rx = 19, ry = 17;

  if (state === 'content' || state === 'happy') {
    return (
      <path
        d={`M ${cx - rx} 86 Q ${cx} ${86 - ry - 4} ${cx + rx} 86`}
        stroke="#1a0a00" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    );
  }

  if (state === 'stars') {
    return (
      <>
        <ellipse cx={cx} cy="86" rx={rx} ry={ry} fill="url(#g-sclera)"/>
        <text x={cx - 14} y={92} fontSize="18">⭐</text>
      </>
    );
  }

  if (state === 'spiral') {
    return (
      <>
        <ellipse cx={cx} cy="86" rx={rx} ry={ry} fill="url(#g-sclera)"/>
        <line x1={cx-12} y1="74" x2={cx+12} y2="98" stroke="#1a0a00" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1={cx+12} y1="74" x2={cx-12} y2="98" stroke="#1a0a00" strokeWidth="3.5" strokeLinecap="round"/>
        <circle cx={cx} cy="86" r="4" fill="#cc2222"/>
      </>
    );
  }

  // All variants that show the eyeball
  const pupilR = state === 'manic' ? 10 : state === 'smug' ? 7 : 8;
  const irisR  = state === 'manic' ? 14 : state === 'smug' ? 10 : 12;
  const pupilOx = state === 'smug' ? 2 : 1;

  // Eyelid fraction — how much is covered from top
  const lidFrac = state === 'sleepy' ? 0.65 : state === 'smug' ? 0.40 : 0;
  const lidH    = ry * 2 * lidFrac;

  return (
    <g>
      {/* Sclera */}
      <ellipse cx={cx} cy="86" rx={rx} ry={ry} fill="url(#g-sclera)"
        stroke="rgba(0,0,0,0.12)" strokeWidth="0.8"/>

      {/* Iris */}
      <ellipse cx={cx + pupilOx} cy="86" rx={irisR} ry={irisR * 0.92}
        fill="url(#g-iris)" clipPath={`url(#${clipId})`}/>

      {/* Pupil */}
      <ellipse cx={cx + pupilOx} cy="87" rx={pupilR * 0.62} ry={pupilR * 0.72}
        fill="#0a0600" clipPath={`url(#${clipId})`}/>

      {/* Primary specular highlight */}
      <ellipse cx={cx + pupilOx + 4} cy="80" rx="5" ry="3.5"
        fill="white" opacity="0.95" clipPath={`url(#${clipId})`}/>
      {/* Secondary tiny specular */}
      <circle cx={cx + pupilOx - 3} cy="91" r="1.8"
        fill="white" opacity="0.55" clipPath={`url(#${clipId})`}/>

      {/* Eyelid overlay (for sleepy / smug) */}
      {lidFrac > 0 && (
        <rect x={cx - rx - 1} y={86 - ry - 1} width={rx * 2 + 2} height={lidH + 1}
          rx="8" fill="url(#g-skin)"/>
      )}

      {/* Eye outline */}
      <ellipse cx={cx} cy="86" rx={rx} ry={ry}
        fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2"/>
    </g>
  );
}

function Eyes({ type }) {
  return (
    <>
      <EyeUnit cx={72}  clipId="cp-eyeL" state={type}/>
      <EyeUnit cx={128} clipId="cp-eyeR" state={type}/>
    </>
  );
}

/* ─── Mouths ──────────────────────────────────────────────────────────────── */
function Mouth({ type }) {
  const lip = 'rgba(20,80,10,0.75)';
  switch (type) {
    case 'flat':
      return <path d="M 82 128 Q 100 130 118 128"
        stroke={lip} strokeWidth="2.5" fill="none" strokeLinecap="round"/>;

    case 'smile':
      return (
        <>
          <path d="M 78 126 Q 100 140 122 126"
            fill="rgba(10,50,5,0.6)" stroke={lip} strokeWidth="1.5"/>
          {/* lower lip highlight */}
          <path d="M 84 136 Q 100 140 116 136"
            stroke="rgba(120,200,80,0.35)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </>
      );

    case 'smirk':
      return <path d="M 82 126 Q 96 134 114 126"
        fill="rgba(10,50,5,0.55)" stroke={lip} strokeWidth="1.5"/>;

    case 'grin': {
      return (
        <g>
          {/* Outer mouth shape */}
          <path d="M 68 124 Q 100 148 132 124"
            fill="#0a2808"/>
          {/* Teeth row */}
          {[68,80,92,104,116].map((x,i) => (
            <rect key={i} x={x + 2} y="124" width="10" height="10"
              rx="2" fill="url(#g-teeth)"/>
          ))}
          {/* Gum line */}
          <path d="M 68 124 Q 100 136 132 124"
            fill="none" stroke="rgba(255,180,180,0.6)" strokeWidth="1.5"/>
          {/* Lip curve */}
          <path d="M 68 124 Q 100 148 132 124"
            fill="none" stroke={lip} strokeWidth="1.8"/>
        </g>
      );
    }

    case 'bigGrin': {
      return (
        <g>
          <path d="M 62 122 Q 100 152 138 122" fill="#0a2808"/>
          {[62,74,87,100,113,126].map((x,i) => (
            <rect key={i} x={x + 2} y="122" width="11" height="12"
              rx="2.5" fill="url(#g-teeth)"/>
          ))}
          <path d="M 62 122 Q 100 138 138 122"
            fill="none" stroke="rgba(255,180,180,0.5)" strokeWidth="1.5"/>
          <path d="M 62 122 Q 100 152 138 122"
            fill="none" stroke={lip} strokeWidth="2"/>
        </g>
      );
    }

    case 'openScream':
      return (
        <g>
          <ellipse cx="100" cy="134" rx="20" ry="14" fill="#0a2808"/>
          <ellipse cx="100" cy="130" rx="20" ry="8" fill="#cc4444" opacity="0.8"/>
          {/* Tongue tip */}
          <ellipse cx="100" cy="140" rx="10" ry="6" fill="#e05050" opacity="0.9"/>
        </g>
      );

    default: return null;
  }
}

/* ─── Accessories ─────────────────────────────────────────────────────────── */
function Extra({ type, glowColor }) {
  switch (type) {
    case 'phone':
      return (
        <g>
          <rect x="126" y="128" width="18" height="28" rx="4"
            fill="#111827" stroke="#374151" strokeWidth="1.2"/>
          <rect x="128" y="131" width="14" height="18" rx="2"
            fill="#2563eb" opacity="0.75"/>
          {/* Screen glow reflection on face */}
          <ellipse cx="126" cy="132" rx="18" ry="12"
            fill="rgba(59,130,246,0.12)" style={{filter:'blur(6px)'}}/>
          <text style={{animation:'zzz-drift 2.4s ease-out infinite 0s'}}
            x="150" y="110" fontSize="13" fontWeight="bold" fill="#93c5fd" opacity="0.8">z</text>
          <text style={{animation:'zzz-drift 2.4s ease-out infinite 0.9s'}}
            x="158" y="92"  fontSize="16" fontWeight="bold" fill="#93c5fd" opacity="0.55">z</text>
          <text style={{animation:'zzz-drift 2.4s ease-out infinite 1.7s'}}
            x="164" y="72"  fontSize="20" fontWeight="bold" fill="#93c5fd" opacity="0.3">Z</text>
        </g>
      );

    case 'laptop':
      return (
        <g>
          {/* Laptop glow from below */}
          <ellipse cx="100" cy="196" rx="46" ry="12"
            fill="rgba(96,165,250,0.22)" style={{filter:'blur(6px)'}}/>
          {/* Lightning bolts */}
          <path d="M 14 40 L 8 56 L 16 56 L 8 74 L 24 52 L 16 52 Z"
            fill={glowColor} opacity="0.8"
            style={{animation:'spark-pop 2s ease-out infinite 0.3s'}}/>
          <path d="M 178 34 L 173 48 L 180 48 L 174 62 L 188 44 L 181 44 Z"
            fill={glowColor} opacity="0.7"
            style={{animation:'spark-pop 2s ease-out infinite 1.2s'}}/>
        </g>
      );

    case 'flower':
      return (
        <text x="132" y="134" fontSize="26"
          style={{animation:'spark-pop 3s ease-out infinite 0.5s'}}>🌸</text>
      );

    case 'crown':
      return (
        <g>
          <path d="M 58 24 L 68 8 L 100 18 L 132 8 L 142 24 L 136 30 L 64 30 Z"
            fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
          <circle cx="100" cy="10" r="5.5" fill="#ef4444"/>
          <circle cx="68"  cy="12" r="4"   fill="#34d399"/>
          <circle cx="132" cy="12" r="4"   fill="#60a5fa"/>
          {/* Crown highlight */}
          <path d="M 65 26 Q 100 22 135 26"
            stroke="rgba(255,255,255,0.4)" strokeWidth="2" fill="none"/>
        </g>
      );

    case 'crownTilt':
      return (
        <g transform="rotate(14,100,18)">
          <path d="M 58 24 L 68 8 L 100 18 L 132 8 L 142 24 L 136 30 L 64 30 Z"
            fill="#a78bfa" stroke="#7c3aed" strokeWidth="2"/>
          <circle cx="100" cy="10" r="5" fill="#f9a8d4"/>
        </g>
      );

    case 'papers':
      return (
        <g>
          {[[10,30,-22],[16,54,15],[170,24,18],[166,52,-12]].map(([x,y,rot],i) => (
            <rect key={i} x={x} y={y} width="20" height="26" rx="2"
              fill="white" stroke="#e5e7eb" strokeWidth="1"
              transform={`rotate(${rot},${x+10},${y+13})`}
              style={{animation:`spark-pop 1.5s ease-out infinite ${i*0.4}s`}}/>
          ))}
        </g>
      );

    case 'sparkles':
      return (
        <g>
          {[['8','32','16','0s'],['170','24','14','0.7s'],['168','60','11','1.2s'],['10','62','11','1.8s']].map(([x,y,fs,d],i) => (
            <text key={i} x={x} y={y} fontSize={fs}
              style={{animation:`spark-pop 2.2s ease-out infinite ${d}`}}>✨</text>
          ))}
        </g>
      );

    default: return null;
  }
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

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative flex items-center justify-center">
        {/* Ambient glow ring */}
        <div className="absolute rounded-full animate-ring" style={{
          width: size + 28, height: size + 28,
          background: `radial-gradient(circle, ${cfg.glow} 0%, transparent 68%)`,
        }}/>

        <svg viewBox="0 0 200 220" width={size} height={size}
          className={cfg.anim} aria-label="Goblin mascot"
          style={{ filter: `drop-shadow(0 0 20px ${cfg.glow}) drop-shadow(0 0 6px ${cfg.glow})` }}>
          <Defs/>
          {/* Render order: ears → body → head → hair → face features */}
          <Extra type={cfg.extra} glowColor={cfg.ringColor}/>
          <Ears/>
          <Body/>
          <Head/>
          <Hair/>
          <Cheeks/>
          <Nose/>
          <Brows type={cfg.brows}/>
          <Eyes  type={cfg.eyes}/>
          <Mouth type={cfg.mouth}/>
        </svg>
      </div>

      {/* Caption */}
      <div key={`${mascotState}-${captionIdx}`} className="animate-caption px-4 py-2 rounded-2xl text-center"
        style={{ background:'rgba(255,255,255,0.05)', border:`1px solid ${cfg.glow}`,
          backdropFilter:'blur(12px)', maxWidth:270 }}>
        <p className="text-sm font-semibold leading-snug" style={{ color: cfg.ringColor }}>
          {cfg.captions[captionIdx]}
        </p>
      </div>
    </div>
  );
}
