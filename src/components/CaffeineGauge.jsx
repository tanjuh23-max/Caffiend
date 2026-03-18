import { ZONE_INFO } from '../utils/caffeineCalc';

const CX = 100, CY = 88, R = 66;
const OUTER_R = R + 16;
const START_ANGLE = -120;
const TOTAL_SWEEP = 240;

function polar(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startDeg, sweepDeg) {
  if (sweepDeg <= 0) return '';
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, startDeg + Math.min(sweepDeg, 359.99));
  const largeArc = sweepDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

export default function CaffeineGauge({ current, max = 400, zone }) {
  const pct = Math.min(current / max, 1);
  const sweep = TOTAL_SWEEP * pct;
  const zoneInfo = ZONE_INFO[zone] || ZONE_INFO.clear;
  const color = zoneInfo.color;

  const trackPath    = arcPath(CX, CY, R, START_ANGLE, TOTAL_SWEEP);
  const progressPath = pct > 0 ? arcPath(CX, CY, R, START_ANGLE, sweep) : '';
  const outerTrack   = arcPath(CX, CY, OUTER_R, START_ANGLE, TOTAL_SWEEP);
  const outerProg    = pct > 0 ? arcPath(CX, CY, OUTER_R, START_ANGLE, sweep * 0.85) : '';
  const needlePt     = polar(CX, CY, R + 1, START_ANGLE + sweep);

  return (
    <div className="flex flex-col items-center select-none w-full">
      <svg viewBox="0 0 200 158" className="w-full max-w-[300px]">
        <defs>
          <filter id="glow-hard" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-soft" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="numGrad" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="55%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        <circle cx={CX} cy={CY} r={R + 2}
          fill="none" stroke={color} strokeWidth="30" strokeOpacity="0.07"
          style={{ transition: 'stroke 1.2s ease' }}
        />

        <path d={outerTrack} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="1"
          strokeLinecap="round" strokeDasharray="2 7"
        />
        {pct > 0 && (
          <path d={outerProg} fill="none"
            stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4"
            style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
          />
        )}

        <path d={trackPath} fill="none" stroke="#1a1a1e" strokeWidth="12" strokeLinecap="round" />

        <path d={arcPath(CX, CY, R, START_ANGLE, TOTAL_SWEEP * 0.375)}
          fill="none" stroke="#22c55e" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.06" />
        <path d={arcPath(CX, CY, R, START_ANGLE + TOTAL_SWEEP * 0.375, TOTAL_SWEEP * 0.25)}
          fill="none" stroke="#f59e0b" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.06" />
        <path d={arcPath(CX, CY, R, START_ANGLE + TOTAL_SWEEP * 0.625, TOTAL_SWEEP * 0.25)}
          fill="none" stroke="#f97316" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.06" />
        <path d={arcPath(CX, CY, R, START_ANGLE + TOTAL_SWEEP * 0.875, TOTAL_SWEEP * 0.125)}
          fill="none" stroke="#ef4444" strokeWidth="12" strokeLinecap="round" strokeOpacity="0.06" />

        {pct > 0 && (
          <path d={progressPath} fill="none"
            stroke={color} strokeWidth="12" strokeLinecap="round"
            filter="url(#glow-hard)"
            style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
          />
        )}

        <circle cx={needlePt.x} cy={needlePt.y} r="9"
          fill={color} fillOpacity="0.22" filter="url(#glow-soft)"
          style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <circle cx={needlePt.x} cy={needlePt.y} r="4.5"
          fill={color} filter="url(#glow-hard)"
          style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <circle cx={needlePt.x} cy={needlePt.y} r="2" fill="white"
          style={{ transition: 'all 0.9s cubic-bezier(0.4,0,0.2,1)' }}
        />

        <text x={CX} y={CY - 1}
          textAnchor="middle" fill="url(#numGrad)"
          fontSize="50" fontWeight="800"
          fontFamily="JetBrains Mono,Inter,monospace"
          style={{ transition: 'all 0.4s ease' }}
        >{Math.round(current)}</text>

        <text x={CX} y={CY + 18}
          textAnchor="middle" fill="rgba(255,255,255,0.28)"
          fontSize="9.5" letterSpacing="2.5"
          fontFamily="Inter,sans-serif" fontWeight="600"
        >MG ACTIVE</text>

        <rect x={CX - 38} y={CY + 27} width="76" height="20" rx="10"
          fill={color} fillOpacity="0.12"
          stroke={color} strokeWidth="0.6" strokeOpacity="0.45"
          style={{ transition: 'all 0.6s ease' }}
        />
        <text x={CX} y={CY + 41}
          textAnchor="middle" fill={color}
          fontSize="9" fontWeight="700" letterSpacing="1.8"
          fontFamily="Inter,sans-serif"
          style={{ transition: 'all 0.6s ease' }}
        >{zoneInfo.label.toUpperCase()}</text>

        <text x="19" y="152" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="8.5" fontFamily="Inter,sans-serif">0</text>
        <text x="181" y="152" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="8.5" fontFamily="Inter,sans-serif">400+</text>
      </svg>
    </div>
  );
}
