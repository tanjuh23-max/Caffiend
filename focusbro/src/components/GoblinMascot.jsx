import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

/* ─── State config ────────────────────────────────────────────────────────── */
const STATE = {
  idle: {
    glow: 'rgba(34,197,94,0.3)', ringColor: '#22c55e',
    brows: 'relaxed', eyes: 'normal', mouth: 'smile', extra: null,
    captions: ['ready when you are 👀','tap start to lock in','goblin is waiting...','you got this fr'],
  },
  working: {
    glow: 'rgba(21,128,61,0.45)', ringColor: '#15803d',
    brows: 'determined', eyes: 'manic', mouth: 'grin', extra: 'sparks',
    captions: ['GOBLIN MODE ACTIVATED 🧌','locked in no cap fr fr','feral grind commencing','W goblin behavior detected'],
  },
  break: {
    glow: 'rgba(132,204,22,0.35)', ringColor: '#84cc16',
    brows: 'happy', eyes: 'content', mouth: 'smile', extra: null,
    captions: ['take a breather frfr 🌊','goblin resting arc begins','fr fr you earned this bestie','eyes off screen pls'],
  },
  good: {
    glow: 'rgba(34,197,94,0.4)', ringColor: '#22c55e',
    brows: 'happy', eyes: 'normal', mouth: 'smile', extra: null,
    captions: ['W goblin behavior fr 🔥','on track no cap bestie','keep going goblin king','the bag is being secured'],
  },
  great: {
    glow: 'rgba(21,128,61,0.55)', ringColor: '#15803d',
    brows: 'raised', eyes: 'stars', mouth: 'bigGrin', extra: 'crown',
    captions: ['GOBLIN KING STATUS 👑','absolutely cooked the tasks fr','all hail the sigma goblin','no cap this is legendary'],
  },
  overdue: {
    glow: 'rgba(220,38,38,0.5)', ringColor: '#dc2626',
    brows: 'worried', eyes: 'spiral', mouth: 'open', extra: null,
    captions: ['bro you NEED a break 😵','goblin is tweaking rn','this is NOT it chief','dial it back fr'],
  },
  done: {
    glow: 'rgba(124,58,237,0.4)', ringColor: '#7c3aed',
    brows: 'happy', eyes: 'content', mouth: 'smile', extra: 'crownTilt',
    captions: ["day's grind complete fr 🎉","sigma goblin signing off",'rest mode: ACTIVATED',"that's W behavior all day"],
  },
  celebrate: {
    glow: 'rgba(132,204,22,0.6)', ringColor: '#84cc16',
    brows: 'raised', eyes: 'stars', mouth: 'bigGrin', extra: 'sparkles',
    captions: ['SESSION COMPLETE 🏆',"THAT'S GOBLIN MODE FR",'W W W W W W W','you absolutely cooked it'],
  },
};

/* ─── Gradients & Filters ─────────────────────────────────────────────────── */
function Defs() {
  return (
    <defs>
      <radialGradient id="gm-skin" cx="35%" cy="28%" r="70%">
        <stop offset="0%"   stopColor="#b4e87a"/>
        <stop offset="40%"  stopColor="#6aba3c"/>
        <stop offset="75%"  stopColor="#3e9020"/>
        <stop offset="100%" stopColor="#245c10"/>
      </radialGradient>
      <radialGradient id="gm-skin-dark" cx="30%" cy="25%" r="75%">
        <stop offset="0%"   stopColor="#80c44e"/>
        <stop offset="100%" stopColor="#1e5c0c"/>
      </radialGradient>
      <radialGradient id="gm-iris" cx="35%" cy="28%" r="68%">
        <stop offset="0%"   stopColor="#fde68a"/>
        <stop offset="45%"  stopColor="#f59e0b"/>
        <stop offset="100%" stopColor="#78350f"/>
      </radialGradient>
      <linearGradient id="gm-cloth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#7c4522"/>
        <stop offset="100%" stopColor="#2e1508"/>
      </linearGradient>
      <radialGradient id="gm-head-hi" cx="35%" cy="25%" r="50%">
        <stop offset="0%"   stopColor="rgba(255,255,255,0.32)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="gm-shadow" x="-20%" y="-10%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.22)"/>
      </filter>
      <filter id="gm-blush" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="5"/>
      </filter>
    </defs>
  );
}

/* ─── Ears ────────────────────────────────────────────────────────────────── */
function LeftEar() {
  return (
    <>
      <path d="M 30 85 Q 12 62 22 44 Q 36 28 56 54 Q 47 68 44 88 Z" fill="url(#gm-skin-dark)"/>
      <path d="M 34 81 Q 20 62 28 48 Q 38 36 52 58 Q 44 70 42 84 Z" fill="url(#gm-skin)" opacity="0.65"/>
    </>
  );
}
function RightEar() {
  return (
    <>
      <path d="M 170 85 Q 188 62 178 44 Q 164 28 144 54 Q 153 68 156 88 Z" fill="url(#gm-skin-dark)"/>
      <path d="M 166 81 Q 180 62 172 48 Q 162 36 148 58 Q 156 70 158 84 Z" fill="url(#gm-skin)" opacity="0.65"/>
    </>
  );
}

/* ─── Head ────────────────────────────────────────────────────────────────── */
function Head() {
  return (
    <>
      <ellipse cx="100" cy="108" rx="82" ry="78"
        fill="url(#gm-skin)" filter="url(#gm-shadow)"/>
      {/* specular highlight */}
      <ellipse cx="72" cy="72" rx="30" ry="22" fill="url(#gm-head-hi)" opacity="0.9"/>
      {/* chin shadow */}
      <ellipse cx="100" cy="182" rx="34" ry="8" fill="rgba(0,0,0,0.08)" opacity="0.7"/>
    </>
  );
}

/* ─── Hair tufts ──────────────────────────────────────────────────────────── */
function Hair() {
  const c = '#1e0e04';
  return (
    <>
      <path d="M 70 32 Q 64 16 56 22 Q 62 28 66 36" fill={c}/>
      <path d="M 88 26 Q 84 10 76 16 Q 80 24 84 30" fill={c}/>
      <path d="M 100 24 Q 98 8 90 14 Q 94 22 98 28"  fill={c}/>
      <path d="M 112 26 Q 116 10 124 16 Q 120 24 116 30" fill={c}/>
      <path d="M 130 32 Q 136 16 144 22 Q 138 28 134 36" fill={c}/>
    </>
  );
}

/* ─── Body ────────────────────────────────────────────────────────────────── */
function Body() {
  return (
    <>
      <path d="M 28 170 Q 56 158 100 156 Q 144 158 172 170 L 176 224 L 24 224 Z"
        fill="url(#gm-cloth)"/>
      <path d="M 28 170 Q 56 158 100 156 Q 144 158 172 170 L 162 196 Q 100 188 38 196 Z"
        fill="rgba(255,200,140,0.12)"/>
      <ellipse cx="100" cy="224" rx="65" ry="8" fill="rgba(0,0,0,0.15)"/>
    </>
  );
}

/* ─── Cheeks ──────────────────────────────────────────────────────────────── */
function Cheeks() {
  return (
    <>
      <ellipse cx="46" cy="118" rx="18" ry="13"
        fill="rgba(255,120,100,0.3)" filter="url(#gm-blush)"/>
      <ellipse cx="154" cy="118" rx="18" ry="13"
        fill="rgba(255,120,100,0.3)" filter="url(#gm-blush)"/>
    </>
  );
}

/* ─── Eyebrows ────────────────────────────────────────────────────────────── */
function Brows({ type }) {
  const b = (d, w = 4.5) => (
    <path d={d} fill="#1a0a02" stroke="#1a0a02"
      strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"/>
  );
  if (type === 'relaxed')   return <>{b("M 52 72 Q 68 67 82 70")}{b("M 118 70 Q 132 67 148 72")}</>;
  if (type === 'determined')return <>{b("M 50 68 Q 68 74 82 70",5)}{b("M 118 70 Q 132 74 150 68",5)}</>;
  if (type === 'happy')     return <>{b("M 52 68 Q 68 62 82 66")}{b("M 118 66 Q 132 62 148 68")}</>;
  if (type === 'raised')    return <>{b("M 52 62 Q 68 55 82 60")}{b("M 118 60 Q 132 55 148 62")}</>;
  if (type === 'worried')   return <>{b("M 50 66 Q 68 74 82 68",5)}{b("M 118 68 Q 132 74 150 66",5)}</>;
  return null;
}

/* ─── Eyes ────────────────────────────────────────────────────────────────── */
function EyeUnit({ cx, state }) {
  const cy = 104;

  if (state === 'content') {
    return (
      <path d={`M ${cx-22} ${cy} Q ${cx} ${cy-20} ${cx+22} ${cy}`}
        stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>
    );
  }
  if (state === 'stars') {
    return (
      <>
        <ellipse cx={cx} cy={cy} rx="26" ry="24" fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8"/>
        <text x={cx - 16} y={cy + 10} fontSize="22">⭐</text>
      </>
    );
  }
  if (state === 'spiral') {
    return (
      <>
        <ellipse cx={cx} cy={cy} rx="26" ry="24" fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8"/>
        <line x1={cx-14} y1={cy-14} x2={cx+14} y2={cy+14} stroke="#1a0a00" strokeWidth="4" strokeLinecap="round"/>
        <line x1={cx+14} y1={cy-14} x2={cx-14} y2={cy+14} stroke="#1a0a00" strokeWidth="4" strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r="5" fill="#dc2626"/>
      </>
    );
  }

  const isManic = state === 'manic';
  const irisR   = isManic ? 18 : 15;
  const pupilR  = isManic ? 12 : 9;
  const lidFrac = state === 'sleepy' ? 0.55 : 0;
  const ry      = 24;
  const lidH    = ry * 2 * lidFrac;

  return (
    <g>
      {/* Sclera */}
      <ellipse cx={cx} cy={cy} rx="26" ry={ry} fill="white" stroke="rgba(0,0,0,0.08)" strokeWidth="0.8"/>
      {/* Iris */}
      <ellipse cx={cx} cy={cy} rx={irisR} ry={irisR * 0.92} fill="url(#gm-iris)"/>
      {/* Pupil */}
      <ellipse cx={cx} cy={cy + 1} rx={pupilR * 0.65} ry={pupilR * 0.78} fill="#0a0600"/>
      {/* Primary shine */}
      <ellipse cx={cx + 6} cy={cy - 8} rx="7" ry="5" fill="white" opacity="0.96"/>
      {/* Secondary shine */}
      <circle cx={cx - 5} cy={cy + 10} r="3" fill="white" opacity="0.5"/>
      {/* Eyelid for sleepy */}
      {lidFrac > 0 && (
        <rect x={cx - 27} y={cy - ry - 1} width={54} height={lidH + 1}
          rx="10" fill="url(#gm-skin)"/>
      )}
      {/* Eye outline */}
      <ellipse cx={cx} cy={cy} rx="26" ry={ry}
        fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1.2"/>
    </g>
  );
}

/* ─── Nose ────────────────────────────────────────────────────────────────── */
function Nose() {
  return (
    <>
      <ellipse cx="100" cy="130" rx="12" ry="9" fill="#2e7a1a" opacity="0.7"/>
      <ellipse cx="95" cy="133"  rx="4.5" ry="3.5" fill="#154010" opacity="0.85"/>
      <ellipse cx="105" cy="133" rx="4.5" ry="3.5" fill="#154010" opacity="0.85"/>
      <circle cx="94" cy="132"  r="1.2" fill="rgba(255,255,255,0.22)"/>
      <circle cx="104" cy="132" r="1.2" fill="rgba(255,255,255,0.22)"/>
    </>
  );
}

/* ─── Mouth ───────────────────────────────────────────────────────────────── */
function Mouth({ type }) {
  const lip = 'rgba(14,60,8,0.7)';
  if (type === 'flat')
    return <path d="M 80 148 Q 100 150 120 148" stroke={lip} strokeWidth="3" fill="none" strokeLinecap="round"/>;
  if (type === 'smile')
    return (
      <>
        <path d="M 76 146 Q 100 162 124 146" fill="rgba(8,42,4,0.55)" stroke={lip} strokeWidth="1.5"/>
        <path d="M 82 156 Q 100 162 118 156" stroke="rgba(100,200,60,0.3)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      </>
    );
  if (type === 'grin')
    return (
      <g>
        <path d="M 66 144 Q 100 166 134 144" fill="#0a2808"/>
        {[66,78,90,102,114].map((x, i) => (
          <rect key={i} x={x + 2} y="144" width="10" height="10" rx="2" fill="#fffff0"/>
        ))}
        <path d="M 66 144 Q 100 166 134 144" fill="none" stroke={lip} strokeWidth="2"/>
      </g>
    );
  if (type === 'bigGrin')
    return (
      <g>
        <path d="M 60 142 Q 100 168 140 142" fill="#0a2808"/>
        {[60,73,86,100,113,126].map((x, i) => (
          <rect key={i} x={x + 2} y="142" width="11" height="12" rx="2.5" fill="#fffff0"/>
        ))}
        <path d="M 60 142 Q 100 168 140 142" fill="none" stroke={lip} strokeWidth="2"/>
      </g>
    );
  if (type === 'open')
    return (
      <g>
        <ellipse cx="100" cy="152" rx="22" ry="15" fill="#0a2808"/>
        <ellipse cx="100" cy="147" rx="22" ry="9"  fill="#cc4444" opacity="0.75"/>
        <ellipse cx="100" cy="158" rx="11" ry="7"  fill="#e05050" opacity="0.9"/>
      </g>
    );
  return null;
}

/* ─── Accessories ─────────────────────────────────────────────────────────── */
function Extra({ type, color }) {
  if (type === 'crown')
    return (
      <g>
        <path d="M 58 30 L 68 14 L 100 24 L 132 14 L 142 30 L 136 36 L 64 36 Z"
          fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
        <circle cx="100" cy="16" r="5.5" fill="#ef4444"/>
        <circle cx="68"  cy="18" r="4"   fill="#34d399"/>
        <circle cx="132" cy="18" r="4"   fill="#60a5fa"/>
        <path d="M 66 32 Q 100 28 134 32" stroke="rgba(255,255,255,0.45)" strokeWidth="2" fill="none"/>
      </g>
    );
  if (type === 'crownTilt')
    return (
      <g transform="rotate(14,100,24)">
        <path d="M 60 30 L 70 14 L 100 22 L 130 14 L 140 30 L 134 36 L 66 36 Z"
          fill="#a78bfa" stroke="#7c3aed" strokeWidth="2"/>
        <circle cx="100" cy="14" r="5" fill="#f9a8d4"/>
      </g>
    );
  if (type === 'sparks')
    return (
      <g>
        <path d="M 16 48 L 10 62 L 18 62 L 10 78 L 26 56 L 18 56 Z"
          fill={color} opacity="0.85"
          style={{ animation: 'spark-pop 2s ease-out infinite 0.3s' }}/>
        <path d="M 178 42 L 173 54 L 180 54 L 174 66 L 188 48 L 181 48 Z"
          fill={color} opacity="0.75"
          style={{ animation: 'spark-pop 2s ease-out infinite 1.1s' }}/>
      </g>
    );
  if (type === 'sparkles')
    return (
      <g>
        {[['10','38','18','0s'],['172','28','14','0.7s'],['170','64','12','1.3s'],['8','66','12','1.9s']].map(([x, y, fs, d], i) => (
          <text key={i} x={x} y={y} fontSize={fs}
            style={{ animation: `spark-pop 2.2s ease-out infinite ${d}` }}>✨</text>
        ))}
      </g>
    );
  return null;
}

/* ─── Main Component ──────────────────────────────────────────────────────── */
export default function GoblinMascot({ mascotState = 'idle', size = 200 }) {
  const cfg = STATE[mascotState] ?? STATE.idle;

  const goblinRef  = useRef(null);
  const headGrpRef = useRef(null);
  const bodyGrpRef = useRef(null);
  const earLGrpRef = useRef(null);
  const earRGrpRef = useRef(null);
  const eyeLGrpRef = useRef(null);
  const eyeRGrpRef = useRef(null);
  const blinkTlRef = useRef(null);
  const mountedRef = useRef(true);

  const [captionIdx, setCaptionIdx] = useState(0);
  const captionTimer = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    setCaptionIdx(0);
    clearInterval(captionTimer.current);
    captionTimer.current = setInterval(() => {
      setCaptionIdx(i => (i + 1) % cfg.captions.length);
    }, 4500);
    return () => clearInterval(captionTimer.current);
  }, [mascotState, cfg.captions.length]);

  const scheduleBlink = useCallback((delay = 3.5) => {
    if (!mountedRef.current) return;
    if (blinkTlRef.current) blinkTlRef.current.kill();
    const tgtL = eyeLGrpRef.current;
    const tgtR = eyeRGrpRef.current;
    if (!tgtL || !tgtR) return;
    const d = delay + Math.random() * 2.5;
    blinkTlRef.current = gsap.timeline({ delay: d })
      .to([tgtL, tgtR], { scaleY: 0.05, duration: 0.07, ease: 'power2.in',  transformOrigin: 'center center' })
      .to([tgtL, tgtR], { scaleY: 1,    duration: 0.10, ease: 'power1.out', transformOrigin: 'center center' })
      .then(() => { if (mountedRef.current) scheduleBlink(delay); });
  }, []);

  useEffect(() => {
    const refs = [goblinRef, headGrpRef, bodyGrpRef, earLGrpRef, earRGrpRef, eyeLGrpRef, eyeRGrpRef];
    refs.forEach(r => { if (r.current) gsap.killTweensOf(r.current); });
    if (blinkTlRef.current) blinkTlRef.current.kill();
    refs.forEach(r => { if (r.current) gsap.set(r.current, { clearProps: 'all' }); });
    if (!goblinRef.current) return;

    const g  = goblinRef.current;
    const h  = headGrpRef.current;
    const bd = bodyGrpRef.current;
    const eL = earLGrpRef.current;
    const eR = earRGrpRef.current;
    const yL = eyeLGrpRef.current;
    const yR = eyeRGrpRef.current;

    switch (mascotState) {
      case 'idle':
        gsap.to(g, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        if (bd) gsap.to(bd, { scaleY: 1.015, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center top' });
        if (h)  gsap.to(h,  { rotation: -1.5, duration: 3.4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '100px 108px' });
        scheduleBlink(3.5);
        break;

      case 'working':
        gsap.to(g, { y: -5, duration: 0.85, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        if (bd) gsap.to(bd, { scaleY: 1.03, duration: 0.65, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center top' });
        if (h)  gsap.to(h,  { y: 3, rotation: 2, duration: 0.85, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '100px 108px' });
        if (yL && yR) gsap.to([yL, yR], { scale: 1.08, duration: 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center center' });
        break;

      case 'break':
        gsap.to(g, { y: -14, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(g, { rotation: -2.5, duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '100px 224px' });
        if (eL) gsap.to(eL, { rotation: 5,  duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '44px 52px' });
        if (eR) gsap.to(eR, { rotation: -5, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '156px 52px' });
        scheduleBlink(5);
        break;

      case 'overdue':
        gsap.to(g, { x: 5,  duration: 0.065, yoyo: true, repeat: -1, ease: 'none' });
        if (h)  gsap.to(h,  { x: 4,  duration: 0.055, yoyo: true, repeat: -1, ease: 'none' });
        if (bd) gsap.to(bd, { scaleY: 1.04, duration: 0.32, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center top' });
        break;

      case 'celebrate': {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
        tl.to(g, { y: -34, scaleX: 0.86, scaleY: 1.2, duration: 0.28, ease: 'power2.out', transformOrigin: '100px 224px' })
          .to(g, { y: 0, scaleX: 1.26, scaleY: 0.8, duration: 0.16, ease: 'power3.in', transformOrigin: '100px 224px' })
          .to(g, { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1.2,0.4)', transformOrigin: '100px 224px' })
          .to(g, { rotation: -7, duration: 0.16, ease: 'power2.inOut', transformOrigin: '100px 224px' })
          .to(g, { rotation: 7,  duration: 0.16, ease: 'power2.inOut', transformOrigin: '100px 224px' })
          .to(g, { rotation: 0,  duration: 0.12, ease: 'power1.out',   transformOrigin: '100px 224px' });
        break;
      }

      case 'good':
        gsap.to(g, { scale: 1.04, y: -4, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '100px 224px' });
        if (h) gsap.to(h, { rotation: 2, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '100px 108px' });
        scheduleBlink(4.5);
        break;

      case 'great':
        gsap.to(g, { scale: 1.06, y: -6, duration: 1.4, yoyo: true, repeat: -1, ease: 'power1.inOut', transformOrigin: '100px 224px' });
        if (eL) gsap.to(eL, { rotation: 9,  duration: 0.65, yoyo: true, repeat: -1, ease: 'power2.inOut', transformOrigin: '44px 52px' });
        if (eR) gsap.to(eR, { rotation: -9, duration: 0.65, yoyo: true, repeat: -1, ease: 'power2.inOut', transformOrigin: '156px 52px' });
        scheduleBlink(4);
        break;

      case 'done':
        gsap.to(g, { y: -10, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(g, { rotation: -1.5, duration: 5.5, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '100px 224px' });
        scheduleBlink(5.5);
        break;

      default:
        gsap.to(g, { y: -8, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        scheduleBlink(4);
    }

    return () => {
      refs.forEach(r => { if (r.current) gsap.killTweensOf(r.current); });
      if (blinkTlRef.current) blinkTlRef.current.kill();
    };
  }, [mascotState, scheduleBlink]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      <svg viewBox="0 0 200 232" width={size} height={size}
        aria-label="Goblin mascot"
        style={{ overflow: 'visible', filter: `drop-shadow(0 0 20px ${cfg.glow})` }}>
        <Defs/>
        {/* Ground shadow */}
        <ellipse cx="100" cy="226" rx="66" ry="9" fill="rgba(10,40,5,0.13)"/>
        <g ref={goblinRef}>
          <Extra type={cfg.extra} color={cfg.ringColor}/>
          <g ref={earLGrpRef}><LeftEar/></g>
          <g ref={earRGrpRef}><RightEar/></g>
          <g ref={bodyGrpRef}><Body/></g>
          <g ref={headGrpRef}>
            <Head/>
            <Hair/>
            <Cheeks/>
            <Brows type={cfg.brows}/>
            <g ref={eyeLGrpRef}><EyeUnit cx={70}  state={cfg.eyes}/></g>
            <g ref={eyeRGrpRef}><EyeUnit cx={130} state={cfg.eyes}/></g>
            <Nose/>
            <Mouth type={cfg.mouth}/>
          </g>
        </g>
      </svg>

      {/* Caption bubble */}
      <div key={`${mascotState}-${captionIdx}`}
        style={{
          padding: '8px 18px', borderRadius: 99,
          background: 'white',
          border: `1.5px solid ${cfg.glow}`,
          maxWidth: 260,
        }}
        className="animate-caption">
        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f2008', textAlign: 'center', lineHeight: 1.3 }}>
          {cfg.captions[captionIdx]}
        </p>
      </div>
    </div>
  );
}
