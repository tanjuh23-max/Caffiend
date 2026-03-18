/**
 * Caffiend brand logo mark — the gauge-arc icon.
 * The arc shape mirrors the CaffeineGauge, making it the visual identity of the app.
 *
 * Usage:
 *   <LogoMark size={32} />           — just the icon
 *   <LogoFull size={32} />           — icon + wordmark
 */

export function LogoMark({ size = 36, className = '' }) {
  // Arc math: center=(cx,cy), R, start=-120deg, sweep=240deg
  // polar(cx,cy,r,deg): rad=(deg-90)*PI/180
  // At this viewBox size we use cx=18, cy=18, R=12.5
  const cx = 18, cy = 18, R = 12.5;

  function polar(deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
  }

  const start = polar(-120);  // (7.16, 24.25)
  const end   = polar(120);   // (28.84, 24.25)
  const tip   = polar(48);    // ~70% fill, end angle = -120 + 168 = 48

  // largeArc: full track = 240° → 1; progress = 168° < 180° → 0
  const trackPath = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${R} ${R} 0 1 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  const progPath  = `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${R} ${R} 0 0 1 ${tip.x.toFixed(2)} ${tip.y.toFixed(2)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="lm-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#f97316"/>
        </linearGradient>
        <filter id="lm-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lm-soft" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Track */}
      <path d={trackPath} stroke="#1e1e24" strokeWidth="4.5" strokeLinecap="round"/>

      {/* Amber progress arc */}
      <path d={progPath} stroke="url(#lm-grad)" strokeWidth="4.5" strokeLinecap="round" filter="url(#lm-glow)"/>

      {/* Needle halo */}
      <circle cx={tip.x} cy={tip.y} r="3.8" fill="#f97316" fillOpacity="0.25" filter="url(#lm-soft)"/>
      {/* Needle dot */}
      <circle cx={tip.x} cy={tip.y} r="2" fill="#f97316" filter="url(#lm-glow)"/>
      {/* White center */}
      <circle cx={tip.x} cy={tip.y} r="0.85" fill="white"/>
    </svg>
  );
}

export function LogoFull({ iconSize = 30 }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <LogoMark size={iconSize} />
      <span
        style={{
          fontFamily: "'JetBrains Mono', 'Inter', monospace",
          fontWeight: 800,
          fontSize: '1.35rem',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #fcd34d 0%, #ffffff 60%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Caffiend
      </span>
    </div>
  );
}
