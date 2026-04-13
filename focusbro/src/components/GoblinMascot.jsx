import { useState, useEffect, useRef } from 'react';
import imgExcited  from '../assets/goblin-excited.png';
import imgAngry    from '../assets/goblin-angry.png';
import imgSleepy   from '../assets/goblin-sleepy.png';
import imgPanicked from '../assets/goblin-panicked.png';
import imgEcstatic from '../assets/goblin-ecstatic.png';
import imgPeaceful from '../assets/goblin-peaceful.png';
import gsap from 'gsap';

const IMAGES = {
  idle:      imgExcited,
  working:   imgAngry,
  break:     imgSleepy,
  overdue:   imgPanicked,
  celebrate: imgEcstatic,
  done:      imgPeaceful,
  good:      imgExcited,
  great:     imgEcstatic,
};

const GLOW = {
  idle:      'drop-shadow(0 0 20px rgba(34,197,94,0.4))',
  working:   'drop-shadow(0 0 20px rgba(251,191,36,0.5))',
  break:     'drop-shadow(0 0 20px rgba(34,197,94,0.4))',
  overdue:   'drop-shadow(0 0 20px rgba(220,38,38,0.55))',
  celebrate: 'drop-shadow(0 0 28px rgba(251,191,36,0.7))',
  done:      'drop-shadow(0 0 20px rgba(167,139,250,0.45))',
  good:      'drop-shadow(0 0 20px rgba(34,197,94,0.45))',
  great:     'drop-shadow(0 0 28px rgba(251,191,36,0.65))',
};

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

export default function GoblinMascot({ mascotState = 'idle', size = 220 }) {
  const imgRef   = useRef(null);
  const mountRef = useRef(true);
  const [capIdx, setCapIdx] = useState(0);

  const src      = IMAGES[mascotState]   ?? IMAGES.idle;
  const glow     = GLOW[mascotState]     ?? GLOW.idle;
  const captions = CAPTIONS[mascotState] ?? CAPTIONS.idle;

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

  // GSAP per state
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: 'all' });

    switch (mascotState) {
      case 'idle':
      case 'good':
        gsap.to(el, { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        break;
      case 'working':
        gsap.to(el, { y: -6, duration: 0.85, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(el, { rotation: 2, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center bottom' });
        break;
      case 'break':
      case 'done':
        gsap.to(el, { y: -12, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        gsap.to(el, { rotation: -3, duration: 4.5, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: 'center bottom' });
        break;
      case 'overdue':
        gsap.to(el, { x: 5, duration: 0.07, yoyo: true, repeat: -1, ease: 'none' });
        break;
      case 'celebrate':
      case 'great': {
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
        tl.to(el, { y: -38, scaleX: 0.85, scaleY: 1.2, duration: 0.28, ease: 'power2.out', transformOrigin: 'center bottom' })
          .to(el, { y: 0, scaleX: 1.25, scaleY: 0.8, duration: 0.15, ease: 'power3.in', transformOrigin: 'center bottom' })
          .to(el, { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1.2,0.4)', transformOrigin: 'center bottom' });
        break;
      }
      default:
        gsap.to(el, { y: -10, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
    return () => gsap.killTweensOf(el);
  }, [mascotState]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, userSelect: 'none' }}>
      {/* Outer div: blend mode removes white bg by multiplying with page */}
      <div style={{ display: 'inline-block', mixBlendMode: 'multiply' }}>
        {/* Inner div: glow filter — kept separate so blend mode works correctly */}
        <div style={{ filter: glow }}>
          <img
            ref={imgRef}
            src={src}
            alt="Goblin mascot"
            width={size}
            height={size}
            style={{ objectFit: 'contain', display: 'block' }}
          />
        </div>
      </div>
      <div key={`${mascotState}-${capIdx}`} className="animate-caption"
        style={{ padding: '6px 14px', borderRadius: 99,
          background: 'rgba(21,128,61,0.07)', border: '1px solid #d1f0b8',
          maxWidth: 260, textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#15803d', lineHeight: 1.3 }}>
          {captions[capIdx]}
        </p>
      </div>
    </div>
  );
}
