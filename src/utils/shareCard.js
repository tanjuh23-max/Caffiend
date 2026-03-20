/**
 * Generates a branded shareable caffeine card as a canvas blob.
 * Returns a Promise<Blob> — use URL.createObjectURL() to display or share.
 */

const ZONE_COLORS = {
  peak:     '#ef4444',
  high:     '#f97316',
  elevated: '#f59e0b',
  moderate: '#eab308',
  low:      '#84cc16',
  clear:    '#22c55e',
};

const ZONE_LABELS = {
  peak:     'PEAK BUZZ',
  high:     'HIGH',
  elevated: 'ELEVATED',
  moderate: 'MODERATE',
  low:      'LOW',
  clear:    'CLEAR',
};

function formatHours(h) {
  if (!h || h <= 0) return 'Now';
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCurve(ctx, data, x, y, w, h, zoneColor) {
  if (!data || data.length < 2) return;

  const maxLevel = Math.max(...data.map(d => d.level), 100);
  const points = data.map((d, i) => ({
    px: x + (i / (data.length - 1)) * w,
    py: y + h - (d.level / maxLevel) * h,
  }));

  // Fill area
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, zoneColor + '55');
  grad.addColorStop(1, zoneColor + '00');
  ctx.beginPath();
  ctx.moveTo(points[0].px, y + h);
  ctx.lineTo(points[0].px, points[0].py);
  for (let i = 1; i < points.length; i++) {
    const cp = { x: (points[i - 1].px + points[i].px) / 2, y: (points[i - 1].py + points[i].py) / 2 };
    ctx.quadraticCurveTo(points[i - 1].px, points[i - 1].py, cp.x, cp.y);
  }
  ctx.lineTo(points[points.length - 1].px, y + h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Stroke line
  ctx.beginPath();
  ctx.moveTo(points[0].px, points[0].py);
  for (let i = 1; i < points.length; i++) {
    const cp = { x: (points[i - 1].px + points[i].px) / 2, y: (points[i - 1].py + points[i].py) / 2 };
    ctx.quadraticCurveTo(points[i - 1].px, points[i - 1].py, cp.x, cp.y);
  }
  ctx.strokeStyle = zoneColor;
  ctx.lineWidth = 3;
  ctx.stroke();

  // "Now" dot — find closest to minutesFromNow=0
  const nowIdx = data.reduce((bi, d, i) =>
    Math.abs(d.minutesFromNow) < Math.abs(data[bi].minutesFromNow) ? i : bi, 0);
  const np = points[nowIdx];
  ctx.beginPath();
  ctx.arc(np.px, np.py, 6, 0, Math.PI * 2);
  ctx.fillStyle = zoneColor;
  ctx.fill();
  ctx.strokeStyle = '#060608';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export async function generateShareCard({ currentCaffeine, sleepSafeIn, caffeineZone, todayTotal, caffeineCurve }) {
  const W = 1080, H = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const zone = caffeineZone || 'clear';
  const zoneColor = ZONE_COLORS[zone] || '#22c55e';

  // ── Background ────────────────────────────────────────────────
  ctx.fillStyle = '#060608';
  ctx.fillRect(0, 0, W, H);

  // Ambient glow
  const glow = ctx.createRadialGradient(W / 2, 0, 0, W / 2, 0, W * 0.7);
  glow.addColorStop(0, zoneColor + '22');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Header ────────────────────────────────────────────────────
  // Logo circle
  const logoGrad = ctx.createLinearGradient(72, 52, 72, 108);
  logoGrad.addColorStop(0, '#fcd34d');
  logoGrad.addColorStop(1, '#f59e0b');
  ctx.beginPath();
  ctx.arc(72, 80, 34, 0, Math.PI * 2);
  ctx.fillStyle = logoGrad;
  ctx.fill();

  // ☕ emoji in circle
  ctx.font = '32px serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#000';
  ctx.fillText('☕', 72, 92);

  // App name
  ctx.font = 'bold 52px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Caffiend', 122, 96);

  // Live dot
  ctx.beginPath();
  ctx.arc(310, 70, 7, 0, Math.PI * 2);
  ctx.fillStyle = '#22c55e';
  ctx.fill();

  ctx.font = '22px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(74,222,128,0.8)';
  ctx.fillText('LIVE', 326, 78);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(54, 130, W - 108, 1);

  // ── Zone badge ────────────────────────────────────────────────
  const badgeW = 220, badgeH = 52;
  const badgeX = (W - badgeW) / 2, badgeY = 170;
  drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 26);
  ctx.fillStyle = zoneColor + '22';
  ctx.fill();
  drawRoundRect(ctx, badgeX, badgeY, badgeW, badgeH, 26);
  ctx.strokeStyle = zoneColor + '66';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.font = 'bold 22px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = zoneColor;
  ctx.fillText(ZONE_LABELS[zone] || zone.toUpperCase(), W / 2, badgeY + 33);

  // ── Big caffeine number ───────────────────────────────────────
  ctx.font = 'bold 200px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(Math.round(currentCaffeine), W / 2, 460);

  ctx.font = '38px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.fillText('mg active in your system right now', W / 2, 510);

  // ── Stats row ─────────────────────────────────────────────────
  const stats = [
    { label: 'Consumed today', value: `${Math.round(todayTotal)}mg` },
    { label: 'Sleep safe in', value: sleepSafeIn === 0 ? 'Now' : sleepSafeIn ? formatHours(sleepSafeIn) : 'Heavy load' },
  ];

  const statW = 380, statH = 100, statY = 560, gap = 40;
  const totalStatsW = stats.length * statW + (stats.length - 1) * gap;
  const startX = (W - totalStatsW) / 2;

  stats.forEach((s, i) => {
    const sx = startX + i * (statW + gap);
    drawRoundRect(ctx, sx, statY, statW, statH, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.fill();
    drawRoundRect(ctx, sx, statY, statW, statH, 20);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '22px -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(s.label.toUpperCase(), sx + statW / 2, statY + 34);

    ctx.font = 'bold 38px -apple-system, sans-serif';
    ctx.fillStyle = i === 1 ? '#fbbf24' : '#ffffff';
    ctx.fillText(s.value, sx + statW / 2, statY + 76);
  });

  // ── Curve ─────────────────────────────────────────────────────
  const curveX = 80, curveY = 700, curveW = W - 160, curveH = 200;

  // Curve background
  drawRoundRect(ctx, curveX - 20, curveY - 20, curveW + 40, curveH + 60, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  ctx.fill();

  ctx.font = '22px -apple-system, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('Caffeine curve — next 10 hours', curveX, curveY + 14);

  drawCurve(ctx, caffeineCurve, curveX, curveY + 24, curveW, curveH - 24, zoneColor);

  // ── Footer ────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(54, H - 100, W - 108, 1);

  ctx.font = '28px -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('caffiend-one.vercel.app', W / 2, H - 54);

  ctx.font = '24px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillText('Real-time caffeine pharmacokinetics', W / 2, H - 22);

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}
