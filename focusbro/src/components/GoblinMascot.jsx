import { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

const CAPTIONS = {
  idle:      ['doomscrolling instead of working 📱','goblin cannot be bothered rn','tap start or stay cooked forever','what even is productivity fr'],
  working:   ['GOBLIN MODE ACTIVATED 🧌','locked in no cap fr fr','feral grind commencing','W goblin behavior detected'],
  break:     ['take a breather frfr 🌊','goblin resting arc begins','fr fr you earned this bestie','experiencing nature?? weird 🌸'],
  good:      ['W goblin behavior fr 🔥','on track no cap bestie','keep going goblin king','the bag is being secured'],
  great:     ['GOBLIN KING STATUS 👑','absolutely cooked the tasks fr','no cap this is legendary','all hail the sigma goblin'],
  overdue:   ['bro you NEED a break 😵‍💫','goblin is tweaking rn','unhinged behavior — dial it back','this is NOT it chief'],
  done:      ["day's grind complete fr 🎉","that's W goblin behavior",'rest mode: ACTIVATED','sigma goblin signing off'],
  celebrate: ['SESSION COMPLETE 🏆',"THAT'S GOBLIN MODE FR",'W W W W W W W','no cap you absolutely cooked it'],
};

const GLOW = {
  idle:'rgba(34,197,94,0.35)', working:'rgba(251,191,36,0.5)', break:'rgba(34,197,94,0.4)',
  good:'rgba(34,197,94,0.4)', great:'rgba(251,191,36,0.6)', overdue:'rgba(239,68,68,0.5)',
  done:'rgba(167,139,250,0.4)', celebrate:'rgba(251,191,36,0.7)',
};

/* ── Goblin SVG — matches Figma character style ───────────────────────────── */
function GoblinSVG({ state }) {
  // Eye variants
  const eyeL = { cx: 76, cy: 96 };
  const eyeR = { cx: 124, cy: 96 };

  function Eyes() {
    if (state === 'break' || state === 'done') {
      // Closed crescent eyes
      return (
        <>
          <path d={`M ${eyeL.cx-20} ${eyeL.cy} Q ${eyeL.cx} ${eyeL.cy-18} ${eyeL.cx+20} ${eyeL.cy}`}
            stroke="#1a0a00" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d={`M ${eyeR.cx-20} ${eyeR.cy} Q ${eyeR.cx} ${eyeR.cy-18} ${eyeR.cx+20} ${eyeR.cy}`}
            stroke="#1a0a00" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        </>
      );
    }
    if (state === 'celebrate') {
      // Star eyes
      return (
        <>
          <text x={eyeL.cx-14} y={eyeL.cy+10} fontSize="28">★</text>
          <text x={eyeR.cx-14} y={eyeR.cy+10} fontSize="28">★</text>
        </>
      );
    }
    const wide = state === 'overdue' || state === 'working';
    const ry = wide ? 22 : 19;
    return (
      <>
        {[eyeL, eyeR].map((e, i) => (
          <g key={i}>
            <ellipse cx={e.cx} cy={e.cy} rx={21} ry={ry} fill="#0d0d0d"/>
            <ellipse cx={e.cx+5} cy={e.cy-6} rx={7} ry={5} fill="white" opacity="0.95"/>
            <circle  cx={e.cx-4} cy={e.cy+6} r={3} fill="white" opacity="0.6"/>
          </g>
        ))}
      </>
    );
  }

  function Brows() {
    if (state === 'working') {
      return (
        <>
          <path d="M 56 70 Q 70 65 84 68" stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>
          <path d="M 116 68 Q 130 65 144 70" stroke="#1a0a00" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </>
      );
    }
    if (state === 'overdue') {
      return (
        <>
          <path d="M 54 68 Q 68 74 82 69" stroke="#1a0a00" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
          <path d="M 118 69 Q 132 74 146 68" stroke="#1a0a00" strokeWidth="4.5" fill="none" strokeLinecap="round"/>
        </>
      );
    }
    return null;
  }

  function Mouth() {
    if (state === 'break' || state === 'done') {
      return <path d="M 84 130 Q 100 140 116 130" stroke="#1a0a00" strokeWidth="3" fill="rgba(10,40,5,0.5)" strokeLinecap="round"/>;
    }
    if (state === 'overdue') {
      return (
        <g>
          <ellipse cx="100" cy="136" rx="18" ry="12" fill="#0d0d0d"/>
          <ellipse cx="100" cy="130" rx="18" ry="7" fill="#cc3333" opacity="0.8"/>
        </g>
      );
    }
    if (state === 'celebrate') {
      return (
        <g>
          <path d="M 70 128 Q 100 152 130 128" fill="#0d0d0d"/>
          <rect x="88" y="128" width="10" height="11" rx="2" fill="white"/>
          <rect x="102" y="128" width="10" height="11" rx="2" fill="white"/>
        </g>
      );
    }
    // Default: buck teeth grin
    return (
      <g>
        <path d="M 78 128 Q 100 144 122 128" fill="#0d0d0d"/>
        <rect x="88" y="128" width="9" height="10" rx="2" fill="white"/>
        <rect x="101" y="128" width="9" height="10" rx="2" fill="white"/>
      </g>
    );
  }

  function SweatDrop() {
    if (state !== 'overdue') return null;
    return (
      <g>
        <ellipse cx="138" cy="48" rx="7" ry="10" fill="#93c5fd" opacity="0.9"/>
        <path d="M 138 38 L 134 50 L 142 50 Z" fill="#93c5fd" opacity="0.7"/>
      </g>
    );
  }

  return (
    <svg viewBox="0 0 200 230" width="100%" height="100%" style={{ overflow: 'visible' }}>
      {/* Drop shadow */}
      <ellipse cx="100" cy="222" rx="66" ry="10" fill="rgba(0,0,0,0.1)"/>

      {/* Ears */}
      <rect x="22" y="72" width="22" height="20" rx="6" fill="#3d7a22" stroke="#1a4a0a" strokeWidth="2.5"/>
      <rect x="156" y="72" width="22" height="20" rx="6" fill="#3d7a22" stroke="#1a4a0a" strokeWidth="2.5"/>

      {/* Body */}
      <path d="M 62 168 Q 48 162 44 182 L 44 220 Q 72 228 100 228 Q 128 228 156 220 L 156 182 Q 152 162 138 168 Z"
        fill="#3d7a22" stroke="#1a4a0a" strokeWidth="2.5" strokeLinejoin="round"/>

      {/* Feet */}
      <ellipse cx="76"  cy="220" rx="20" ry="13" fill="#3d7a22" stroke="#1a4a0a" strokeWidth="2.5"/>
      <ellipse cx="124" cy="220" rx="20" ry="13" fill="#3d7a22" stroke="#1a4a0a" strokeWidth="2.5"/>

      {/* Head */}
      <ellipse cx="100" cy="100" rx="84" ry="80"
        fill="#5aaa2a" stroke="#1a4a0a" strokeWidth="3"/>
      {/* Head highlight */}
      <ellipse cx="72" cy="68" rx="26" ry="20" fill="rgba(255,255,255,0.14)"/>
      {/* Head crease line */}
      <path d="M 100 24 Q 97 50 100 70" stroke="#3a8a18" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>

      {/* Muzzle */}
      <ellipse cx="100" cy="122" rx="38" ry="30" fill="#6b3a1f" stroke="#1a4a0a" strokeWidth="2.5"/>

      {/* Nose */}
      <circle cx="100" cy="108" r="5" fill="#3d7a22" stroke="#1a4a0a" strokeWidth="1.5"/>

      {/* Cheeks */}
      <ellipse cx="52" cy="114" rx="16" ry="10" fill="rgba(255,100,100,0.22)"/>
      <ellipse cx="148" cy="114" rx="16" ry="10" fill="rgba(255,100,100,0.22)"/>

      <Brows/>
      <Eyes/>
      <Mouth/>
      <SweatDrop/>
    </svg>
  );
}

/* ── Main component ───────────────────────────────────────────────────────── */
export default function GoblinMascot({ mascotState = 'idle', size = 200 }) {
  const wrapRef   = useRef(null);
  const blinkRef  = useRef(null);
  const mountRef  = useRef(true);
  const [capIdx, setCapIdx] = useState(0);

  const captions = CAPTIONS[mascotState] ?? CAPTIONS.idle;
  const glow     = GLOW[mascotState]     ?? GLOW.idle;

  // Caption cycling
  useEffect(() => {
    setCapIdx(0);
    const id = setInterval(() => setCapIdx(i => (i + 1) % captions.length), 4500);
    return () => clearInterval(id);
  }, [mascotState, captions.length]);

  useEffect(() => {
    mountRef.current = true;
    return () => { mountRef.current = false; };
  }, []);

  // GSAP animation per state
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: 'all' });

    switch (mascotState) {
      case 'idle':
        gsap.to(el, { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        break;
      case 'working':
        gsap.to(el, { y: -6, duration: 0.85, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(el, { rotation: 1.5, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center bottom' });
        break;
      case 'break':
        gsap.to(el, { y: -14, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(el, { rotation: -2, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center bottom' });
        break;
      case 'overdue':
        gsap.to(el, { x: 5, duration: 0.065, yoyo: true, repeat: -1, ease: 'none' });
        break;
      case 'celebrate': {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.3 });
        tl.to(el, { y: -36, scaleX: 0.86, scaleY: 1.18, duration: 0.28, ease: 'power2.out', transformOrigin: 'center bottom' })
          .to(el, { y: 0, scaleX: 1.22, scaleY: 0.82, duration: 0.16, ease: 'power3.in', transformOrigin: 'center bottom' })
          .to(el, { scaleX: 1, scaleY: 1, duration: 0.65, ease: 'elastic.out(1.2,0.4)', transformOrigin: 'center bottom' });
        break;
      }
      case 'good':
      case 'great':
        gsap.to(el, { scale: 1.05, y: -6, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center bottom' });
        break;
      case 'done':
        gsap.to(el, { y: -8, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        break;
      default:
        gsap.to(el, { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
    return () => gsap.killTweensOf(el);
  }, [mascotState]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      {/* Glow ring */}
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-ring" style={{
          position: 'absolute', width: size + 40, height: size + 40, borderRadius: '50%',
          background: `radial-gradient(circle, ${glow} 0%, transparent 65%)`,
        }}/>
        <div ref={wrapRef} style={{ width: size, height: size }}>
          <GoblinSVG state={mascotState}/>
        </div>
      </div>

      {/* Caption */}
      <div key={`${mascotState}-${capIdx}`} className="animate-caption"
        style={{ padding: '8px 16px', borderRadius: 99, background: 'rgba(21,128,61,0.08)',
          border: `1px solid ${glow}`, maxWidth: 260, textAlign: 'center' }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d', lineHeight: 1.3 }}>
          {captions[capIdx]}
        </p>
      </div>
    </div>
  );
}
