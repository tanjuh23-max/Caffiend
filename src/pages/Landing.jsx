import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogoFull, LogoMark } from '../components/Logo';
import EmailCapture from '../components/EmailCapture';

// ─── Animated Hero Curve ────────────────────────────────────────────────────
function HeroCurve() {
  const pathRef = useRef(null);
  const areaRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    // Trigger animation after a tiny delay so browser paints initial state
    const t = setTimeout(() => {
      path.style.transition = 'stroke-dashoffset 2.4s cubic-bezier(0.4, 0, 0.2, 1)';
      path.style.strokeDashoffset = '0';
    }, 300);
    return () => clearTimeout(t);
  }, []);

  // Curve: fast rise 0→45min (x0→x80), peak, then exponential decay
  // ViewBox 0 0 500 220, x=time (hours), y=caffeine level
  const curvePath =
    'M 10,195 C 30,195 55,100 80,55 C 100,25 115,20 130,22 C 180,30 220,75 270,110 C 330,150 390,175 490,185';

  const areaPath =
    'M 10,195 C 30,195 55,100 80,55 C 100,25 115,20 130,22 C 180,30 220,75 270,110 C 330,150 390,175 490,185 L 490,200 L 10,200 Z';

  return (
    <svg viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <linearGradient id="curveGrad" x1="0" y1="0" x2="500" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="220" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
        </linearGradient>
        <filter id="curveGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {[40, 80, 120, 160].map(y => (
        <line key={y} x1="10" y1={y} x2="490" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {[80, 160, 240, 320, 400].map(x => (
        <line key={x} x1={x} y1="10" x2={x} y2="200" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* Sleep threshold line */}
      <line x1="10" y1="145" x2="490" y2="145" stroke="rgba(99,102,241,0.4)" strokeWidth="1" strokeDasharray="6 4" />
      <text x="495" y="148" fill="rgba(99,102,241,0.7)" fontSize="9" textAnchor="end" fontFamily="JetBrains Mono, monospace">sleep threshold</text>

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Glow layer */}
      <path d={curvePath} stroke="rgba(245,158,11,0.3)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#curveGlow)" />

      {/* Main animated curve */}
      <path
        ref={pathRef}
        d={curvePath}
        stroke="url(#curveGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Peak marker */}
      <circle cx="130" cy="22" r="4" fill="#f97316" opacity="0.9" />
      <circle cx="130" cy="22" r="8" fill="#f97316" opacity="0.15" />

      {/* Current time indicator */}
      <line x1="270" y1="15" x2="270" y2="200" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="270" cy="110" r="4" fill="#fbbf24" />
      <circle cx="270" cy="110" r="9" fill="#fbbf24" opacity="0.15" />

      {/* Time labels */}
      <text x="10" y="214" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="JetBrains Mono, monospace">0h</text>
      <text x="75" y="214" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="JetBrains Mono, monospace">45m</text>
      <text x="155" y="214" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="JetBrains Mono, monospace">2h</text>
      <text x="258" y="214" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="JetBrains Mono, monospace">now</text>
      <text x="390" y="214" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="JetBrains Mono, monospace">8h</text>

      {/* Phase labels */}
      <text x="55" y="35" fill="rgba(245,158,11,0.8)" fontSize="9" fontFamily="JetBrains Mono, monospace">absorption</text>
      <text x="195" y="55" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="JetBrains Mono, monospace">elimination</text>
    </svg>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, description }) {
  return (
    <div
      className="p-6 rounded-2xl relative overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3
        className="text-base font-bold mb-2 uppercase tracking-wider"
        style={{ fontFamily: "'JetBrains Mono', monospace", color: '#fbbf24' }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
        {description}
      </p>
    </div>
  );
}

// ─── Trust Badge ─────────────────────────────────────────────────────────────
function Badge({ children }) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider"
      style={{
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.2)',
        color: 'rgba(245,158,11,0.9)',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span className="text-amber-400">✦</span>
      {children}
    </div>
  );
}

// ─── Blog Card ───────────────────────────────────────────────────────────────
function BlogCard({ href, title, excerpt, tag }) {
  return (
    <a
      href={href}
      className="block p-6 rounded-2xl transition-all duration-200 hover:border-amber-500/30"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
      }}
    >
      <span
        className="inline-block text-xs uppercase tracking-wider px-2 py-1 rounded-md mb-3"
        style={{
          background: 'rgba(245,158,11,0.12)',
          color: '#f59e0b',
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {tag}
      </span>
      <h3
        className="text-base font-bold mb-2 leading-snug"
        style={{ color: 'rgba(255,255,255,0.87)', fontFamily: "'JetBrains Mono', monospace" }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
        {excerpt}
      </p>
      <span
        className="inline-block mt-3 text-xs font-semibold"
        style={{ color: '#f59e0b' }}
      >
        Read more →
      </span>
    </a>
  );
}

// ─── Pro Feature Row ─────────────────────────────────────────────────────────
function ProFeature({ children }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <span
        className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs"
        style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}
      >
        ✓
      </span>
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {children}
      </span>
    </div>
  );
}

// ─── Main Landing Component ──────────────────────────────────────────────────
export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const entries = JSON.parse(localStorage.getItem('caffiend_entries') || '[]');
      if (entries.length > 0) navigate('/app', { replace: true });
    } catch {}
  }, [navigate]);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{ background: '#060608', color: 'rgba(255,255,255,0.87)' }}
    >
      {/* ── Google Font ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');

        .landing-mono { font-family: 'JetBrains Mono', monospace; }

        @keyframes drawCurve {
          to { stroke-dashoffset: 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .anim-1 { animation: fadeUp 0.7s ease both 0.1s; }
        .anim-2 { animation: fadeUp 0.7s ease both 0.25s; }
        .anim-3 { animation: fadeUp 0.7s ease both 0.4s; }
        .anim-4 { animation: fadeUp 0.7s ease both 0.55s; }
        .anim-5 { animation: fadeIn 1.2s ease both 0.7s; }

        .grain {
          position: absolute; inset: 0; pointer-events: none; z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
        }

        .amber-glow {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%);
          pointer-events: none;
        }

        .section-divider {
          width: 100%; overflow: hidden; line-height: 0;
        }

        .cta-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          text-decoration: none;
          font-family: 'JetBrains Mono', monospace;
        }
        .cta-primary {
          background: linear-gradient(135deg, #f59e0b, #f97316);
          color: #000;
          box-shadow: 0 4px 24px rgba(245,158,11,0.35);
        }
        .cta-primary:hover {
          box-shadow: 0 6px 32px rgba(245,158,11,0.5);
          transform: translateY(-1px);
        }
        .cta-secondary {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cta-secondary:hover {
          background: rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.9);
        }

        .pricing-card-pro {
          position: relative;
          background: rgba(245,158,11,0.04);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 20px;
          padding: 32px;
          overflow: hidden;
        }
        .pricing-card-pro::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #f59e0b, #f97316);
        }
      `}</style>

      {/* ── NAVBAR ── */}
      {/* Product Hunt launch banner — visible from 24 March 2026 */}
      {new Date() >= new Date('2026-03-24') && (
        <a
          href="https://www.producthunt.com/products/caffiend?launch=caffiend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold w-full"
          style={{ background: 'linear-gradient(90deg, #ff6154, #ff4500)', color: '#fff', textDecoration: 'none' }}
        >
          <span>🚀</span>
          <span>We're live on Product Hunt today — support us with an upvote!</span>
          <span style={{ opacity: 0.7 }}>→</span>
        </a>
      )}

      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(6,6,8,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <LogoFull iconSize={28} />
        <button
          onClick={() => navigate('/app')}
          className="cta-btn cta-primary"
          style={{ padding: '10px 20px', fontSize: '0.8rem' }}
        >
          Open App
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="relative px-6 pt-20 pb-16 overflow-hidden" style={{ maxWidth: '100vw' }}>
        {/* Noise grain */}
        <div className="grain" />

        {/* Ambient glow blobs */}
        <div className="amber-glow" style={{ width: '600px', height: '600px', top: '-200px', left: '-100px', opacity: 0.6 }} />
        <div className="amber-glow" style={{ width: '400px', height: '400px', top: '100px', right: '-150px', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="max-w-2xl anim-1">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs uppercase tracking-widest mb-6"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#f59e0b',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span>⚗</span> Pharmacokinetics-based tracking
            </div>

            <h1
              className="landing-mono font-extrabold leading-none mb-6"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)', letterSpacing: '-0.03em' }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Is tonight's sleep
              </span>
              <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                already ruined?
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-8 anim-2"
              style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '520px' }}
            >
              Caffiend shows you exactly how much caffeine is active in your bloodstream right now —
              and precisely when it'll drop low enough to actually sleep. That 3pm coffee might still
              be 50% active at 9pm. Now you'll know before it's too late.
            </p>

            <div className="flex flex-wrap gap-4 anim-3">
              <button onClick={() => navigate('/app')} className="cta-btn cta-primary">
                Start Tracking Free →
              </button>
              <a href="#science" className="cta-btn cta-secondary">
                See the Science
              </a>
            </div>
          </div>

          {/* Hero curve */}
          <div
            className="mt-16 rounded-2xl p-4 anim-5"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              maxWidth: '640px',
            }}
          >
            <div
              className="text-xs uppercase tracking-widest mb-3 px-2"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              Live caffeine curve — 200mg dose
            </div>
            <HeroCurve />
          </div>
        </div>
      </section>

      {/* ── APP SCREENSHOTS ── */}
      <section className="px-6 py-12 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs uppercase tracking-widest mb-8"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
            See it in action
          </p>
          <div className="flex gap-6 justify-center items-end flex-wrap">
            {[
              { src: '/screenshot-dashboard.png', label: 'Live gauge' },
              { src: '/screenshot-curve.png', label: 'Metabolism curve' },
              { src: '/screenshot-history.png', label: '7-day history' },
            ].map(({ src, label }) => (
              <div key={src} className="flex flex-col items-center gap-3">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,158,11,0.08)',
                    width: '160px',
                  }}
                >
                  <img src={src} alt={label} style={{ width: '100%', display: 'block' }} />
                </div>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-3 justify-center">
          <Badge>Pharmacokinetics-based</Badge>
          <Badge>Free to start</Badge>
          <Badge>No account needed</Badge>
          <Badge>Works offline</Badge>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}
            >
              What makes it different
            </p>
            <h2
              className="landing-mono font-extrabold text-4xl"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built on actual biology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard
              icon="📈"
              title="Real-time metabolism curve"
              description="Watch your caffeine level rise and fall in real time. We model the full pharmacokinetic cycle — absorption ramp, bloodstream peak, and exponential elimination. Not just a timer."
            />
            <FeatureCard
              icon="🌙"
              title="Sleep impact predictor"
              description="See exactly what time your caffeine will drop below your sleep threshold. Stop guessing whether that 4pm coffee will wreck your night. Now you'll know."
            />
            <FeatureCard
              icon="📷"
              title="Barcode scanner"
              description="Point your camera at any can, bottle, or packaging. We look up the product's caffeine content instantly via Open Food Facts — covering thousands of drinks worldwide."
            />
            <FeatureCard
              icon="⚖️"
              title="Body-weight personalisation"
              description="Caffeine hits differently at 60kg vs 90kg. Caffiend shows your dose in mg/kg so your limits are calibrated to your actual body — not some generic average."
            />
          </div>
        </div>
      </section>

      {/* ── THE SCIENCE ── */}
      <section id="science" className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Asymmetric layout */}
          <div
            className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="amber-glow" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px', opacity: 0.5 }} />

            <div className="relative z-10">
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}
              >
                The science
              </p>
              <h2
                className="landing-mono font-extrabold text-3xl sm:text-4xl mb-8"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                How caffeine actually<br />moves through you
              </h2>

              <div className="grid sm:grid-cols-3 gap-8">
                <div>
                  <div
                    className="text-2xl font-extrabold mb-2 landing-mono"
                    style={{ color: '#f59e0b' }}
                  >
                    45 min
                  </div>
                  <h3 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Absorption phase
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Caffeine is almost completely absorbed through your gut in ~45 minutes. Peak plasma concentration
                    arrives fast — which is why that espresso hits so quickly.
                  </p>
                </div>

                <div>
                  <div
                    className="text-2xl font-extrabold mb-2 landing-mono"
                    style={{ color: '#f97316' }}
                  >
                    5.7 hrs
                  </div>
                  <h3 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Half-life
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Caffeine's half-life averages 5.7 hours in healthy adults. That 3pm coffee? By 9pm you still have
                    50% of it in your bloodstream, quietly blocking your adenosine receptors.
                  </p>
                </div>

                <div>
                  <div
                    className="text-2xl font-extrabold mb-2 landing-mono"
                    style={{ color: '#a78bfa' }}
                  >
                    ~30 mg
                  </div>
                  <h3 className="text-sm font-bold mb-2 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Sleep threshold
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Research suggests sleep quality degrades measurably above ~30mg active caffeine. We calculate
                    precisely when you cross back below that line — so you can plan your last cup wisely.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Our model is based on the standard one-compartment pharmacokinetic model used in caffeine research,
                  with parameters derived from peer-reviewed studies including Nehlig et al. (1992) and Fredholm et al. (1999).
                  We use a linear absorption ramp and first-order exponential elimination — the same approach used in
                  clinical caffeine studies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRO PRICING ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}
            >
              Go further
            </p>
            <h2
              className="landing-mono font-extrabold text-4xl mb-3"
              style={{
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Caffiend Pro
            </h2>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
              For people who take sleep and performance seriously.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Monthly */}
            <div
              className="pricing-card-pro"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>Monthly</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="landing-mono font-extrabold text-4xl" style={{ color: 'rgba(255,255,255,0.9)' }}>£9.99</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>/month</span>
              </div>
              <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>Cancel anytime</p>
              <a href="https://buy.stripe.com/8x28wO0Sx4kqco27I02Ji04" className="cta-btn cta-secondary w-full justify-center" style={{ display: 'flex' }}>
                Get Pro Monthly
              </a>
            </div>

            {/* Annual — highlighted */}
            <div className="pricing-card-pro">
              <div
                className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}
              >
                Save 50%
              </div>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>Annual</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="landing-mono font-extrabold text-4xl" style={{ color: 'rgba(255,255,255,0.9)' }}>£59.99</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>/year</span>
              </div>
              <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>£5/month — 2 months free</p>
              <a href="https://buy.stripe.com/aFa8wO8kZ8AG2Ns4vO2Ji05" className="cta-btn cta-primary w-full justify-center" style={{ display: 'flex' }}>
                Get Pro Annual →
              </a>
            </div>
          </div>

          {/* Feature list */}
          <div
            className="mt-8 p-8 rounded-2xl max-w-2xl mx-auto"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>Everything in Pro</p>
            <ProFeature>Full caffeine history — see every crash pattern across 90+ days</ProFeature>
            <ProFeature>Weekly analytics — spot which days you're overloading and wrecking your sleep</ProFeature>
            <ProFeature>Custom drinks — save any drink with your exact caffeine data</ProFeature>
            <ProFeature>Barcode scanner — point at any can and get instant caffeine data</ProFeature>
            <ProFeature>Export to CSV — take your data to any health app or doctor visit</ProFeature>
            <div className="mt-6 pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span style={{ color: '#22c55e' }}>✓</span>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <strong style={{ color: 'rgba(255,255,255,0.7)' }}>7-day money-back guarantee</strong> — not happy? Full refund, no questions asked.
                </p>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Already purchased?{' '}
                <button onClick={() => navigate('/app')} style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit' }}>
                  Verify your purchase in the app →
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-xs uppercase tracking-widest mb-2"
                style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}
              >
                From the lab
              </p>
              <h2
                className="landing-mono font-extrabold text-3xl"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                The caffeine science blog
              </h2>
            </div>
            <a href="/blog/caffeine-half-life.html" style={{ color: '#f59e0b', textDecoration: 'none', fontSize: '0.85rem', fontFamily: "'JetBrains Mono', monospace" }}>
              All posts →
            </a>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <BlogCard href="/blog/caffeine-half-life.html" tag="Pharmacology" title="The Caffeine Half-Life Guide: How Long Does Coffee Really Last?" excerpt="From first sip to final trace — a complete timeline of what caffeine does inside you." />
            <BlogCard href="/blog/caffeine-and-sleep.html" tag="Sleep Science" title="How Caffeine Ruins Your Sleep (Even When You Fall Asleep Fine)" excerpt="The hidden way afternoon coffee steals your deep sleep — even hours after you've forgotten you drank it." />
            <BlogCard href="/blog/best-time-for-coffee.html" tag="Optimisation" title="The Best (and Worst) Times to Drink Coffee, According to Science" excerpt="Cortisol rhythms, chronotypes, and why your morning cup might be doing less than you think." />
            <BlogCard href="/blog/caffeine-calculator.html" tag="Science" title="Caffeine Calculator: How the Pharmacokinetic Model Actually Works" excerpt="The maths behind the curve — how we calculate exactly what's in your bloodstream right now." />
            <BlogCard href="/blog/monster-energy-caffeine.html" tag="Energy Drinks" title="How Much Caffeine Is in Monster Energy? Every Flavour Compared" excerpt="Original, Ultra, Zero Sugar, Java — every variant ranked with sleep impact data." />
            <BlogCard href="/blog/how-much-caffeine-too-much.html" tag="Safety" title="How Much Caffeine Is Too Much? Science-Backed Daily Limits" excerpt="The FDA says 400mg. But that ignores body weight, genetics, and timing. Here's the full picture." />
            <BlogCard href="/blog/pre-workout-caffeine-sleep.html" tag="Fitness" title="Does Pre-Workout Ruin Your Sleep? The Caffeine Problem Explained" excerpt="A 300mg pre-workout at 6pm still has 150mg active at midnight. Here's the timing data." />
            <BlogCard href="/blog/caffeine-sensitivity.html" tag="Genetics" title="Why Caffeine Hits You Differently: The CYP1A2 Gene Explained" excerpt="Fast vs slow metabolisers — why the same coffee affects people completely differently." />
            <BlogCard href="/blog/caffeine-mg-per-kg.html" tag="Dosing" title="How Much Caffeine Is Right for Your Body Weight?" excerpt="A 60kg person and a 90kg person should not be drinking the same amount. Here's the science." />
            <BlogCard href="/blog/caffeine-drinks-comparison.html" tag="Reference" title="Caffeine Content in Every Drink — Complete 2025 Guide" excerpt="Coffee, energy drinks, tea, pre-workout — every drink ranked by caffeine content." />
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>
              How we compare
            </p>
            <h2 className="landing-mono font-extrabold text-4xl" style={{ color: 'rgba(255,255,255,0.9)' }}>
              No other app does this
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(255,255,255,0.02)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Feature', 'Caffiend', 'Apple Health', 'Chronometer', 'Caffeine Informer'].map((h, i) => (
                    <th key={h} style={{
                      padding: '14px 16px', textAlign: i === 0 ? 'left' : 'center',
                      fontSize: '0.75rem', fontFamily: "'JetBrains Mono', monospace",
                      color: i === 1 ? '#f59e0b' : 'rgba(255,255,255,0.4)',
                      fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                      background: i === 1 ? 'rgba(245,158,11,0.05)' : 'transparent',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Real-time metabolism curve', '✅', '❌', '❌', '❌'],
                  ['Sleep impact predictor', '✅', '❌', '❌', '❌'],
                  ['Pharmacokinetic model', '✅', '❌', '❌', '❌'],
                  ['mg/kg personalised dosing', '✅', '❌', '❌', '❌'],
                  ['Barcode scanner', '✅ Pro', '❌', '✅', '❌'],
                  ['Caffeine history', '✅', '✅', '✅', '❌'],
                  ['No account needed', '✅', '❌', '❌', '✅'],
                  ['Free to use', '✅', '✅', '✅', '✅'],
                ].map((row, ri) => (
                  <tr key={ri} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: '13px 16px', textAlign: ci === 0 ? 'left' : 'center',
                        fontSize: ci === 0 ? '0.85rem' : '1rem',
                        color: ci === 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)',
                        background: ci === 1 ? 'rgba(245,158,11,0.03)' : 'transparent',
                        fontWeight: ci === 1 ? 600 : 400,
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>
              Questions
            </p>
            <h2 className="landing-mono font-extrabold text-4xl" style={{ color: 'rgba(255,255,255,0.9)' }}>
              FAQ
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'How accurate is the caffeine tracking?',
                a: "We use the same one-compartment pharmacokinetic model used in peer-reviewed caffeine research (Nehlig et al., 1992). The model uses a 5.7-hour half-life and 45-minute absorption phase — the published averages for healthy adults. Individual variation exists (genetics, liver health, tolerance) but the model is significantly more accurate than any timer-based approach."
              },
              {
                q: 'Is my data private?',
                a: "Yes. All your caffeine data is stored locally on your device using localStorage — nothing is sent to our servers. We don't collect, store, or sell any personal data. You can delete everything instantly from Settings."
              },
              {
                q: 'Does it work offline?',
                a: "Yes. Caffiend is a Progressive Web App (PWA) that works fully offline once loaded. Your data stays on your device and the app functions without an internet connection."
              },
              {
                q: "What's the difference between Free and Pro?",
                a: "Free gives you real-time caffeine tracking, the metabolism curve, sleep predictor, and 7-day history — everything you need to understand your caffeine. Pro unlocks 90+ day history, advanced weekly analytics, the barcode scanner, custom drinks, and CSV export."
              },
              {
                q: 'Do I need to create an account?',
                a: "No account needed to use Caffiend. Just open the app and start tracking. Pro verification is done by email only — no passwords, no sign-up forms."
              },
              {
                q: 'What if Pro is not right for me?',
                a: "If you subscribe to Pro and it's not what you expected, email us within 7 days for a full refund. No questions asked."
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="group rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none" style={{ color: 'rgba(255,255,255,0.87)' }}>
                  <span className="font-semibold text-sm pr-4" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{q}</span>
                  <span className="text-amber-400 shrink-0 text-lg leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA STRIP ── */}
      <section className="px-6 py-16">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background: 'rgba(245,158,11,0.05)',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <div className="amber-glow" style={{ width: '500px', height: '300px', top: '-50px', left: '50%', transform: 'translateX(-50%)', opacity: 0.7 }} />
          <div className="relative z-10">
            <LogoMark size={48} />
            <h2
              className="landing-mono font-extrabold text-3xl sm:text-4xl mt-6 mb-4"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              Ready to Know Your Buzz?
            </h2>
            <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '400px', margin: '0 auto 2rem' }}>
              Free, no account needed, works offline. Start tracking in 10 seconds.
            </p>
            <button onClick={() => navigate('/app')} className="cta-btn cta-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
              Start Tracking Free →
            </button>
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ── */}
      <section className="px-6 py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
            ☕ Free Caffeine Tips
          </div>
          <h2 className="font-black text-3xl sm:text-4xl mb-4" style={{ color: '#ffffff', lineHeight: 1.15 }}>
            Get smarter about caffeine
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Weekly science-backed tips on caffeine timing, sleep optimisation, and getting the most from your buzz. No spam, unsubscribe anytime.
          </p>
          <EmailCapture />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 py-12"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <LogoFull iconSize={24} />
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
                Know Your Buzz.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <button onClick={() => navigate('/app')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontFamily: 'inherit', fontSize: 'inherit' }}>App</button>
              <a href="#science" style={{ color: 'inherit', textDecoration: 'none' }}>Science</a>
              <a href="/blog/caffeine-half-life.html" style={{ color: 'inherit', textDecoration: 'none' }}>Blog</a>
              <Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</Link>
              <Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</Link>
            </div>
          </div>

          <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              © {new Date().getFullYear()} Caffiend. Built with actual science.
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>
              Caffeine data sourced from Open Food Facts & published research.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
