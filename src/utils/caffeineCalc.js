// Caffeine pharmacokinetics:
// - Absorption phase: caffeine rises linearly to peak over ~45 minutes
// - Elimination phase: half-life of ~5.7 hours from peak
// This model is a good approximation of real caffeine metabolism

const HALF_LIFE_HOURS = 5.7;
const HALF_LIFE_MINUTES = HALF_LIFE_HOURS * 60;
const ABSORPTION_MINUTES = 45;
export const SLEEP_SAFE_THRESHOLD = 50; // mg — below this, most people can sleep

/**
 * Returns how much caffeine from a single dose is active at a given time.
 */
export function getCaffeineAtTime(dose, entryTimestamp, queryTime) {
  const minutesElapsed = (queryTime - new Date(entryTimestamp)) / (1000 * 60);
  if (minutesElapsed < 0) return 0;

  if (minutesElapsed <= ABSORPTION_MINUTES) {
    // Rising phase: linear absorption
    return dose * (minutesElapsed / ABSORPTION_MINUTES);
  } else {
    // Elimination phase: exponential decay from peak
    const minutesSincePeak = minutesElapsed - ABSORPTION_MINUTES;
    return dose * Math.pow(0.5, minutesSincePeak / HALF_LIFE_MINUTES);
  }
}

/**
 * Returns total active caffeine in mg across all entries at a given time.
 */
export function calculateCurrentCaffeine(entries, atTime = new Date()) {
  return entries.reduce((total, entry) => {
    return total + getCaffeineAtTime(entry.caffeine, entry.timestamp, atTime);
  }, 0);
}

/**
 * Returns the full caffeine curve as data points for the chart.
 * Covers from hoursBack hours ago to hoursAhead hours in the future.
 */
export function getCaffeineCurve(entries, hoursBack = 1, hoursAhead = 10) {
  const now = new Date();
  const intervalMinutes = 15;
  const totalMinutes = (hoursBack + hoursAhead) * 60;
  const startTime = new Date(now.getTime() - hoursBack * 60 * 60 * 1000);
  const points = [];

  for (let i = 0; i <= totalMinutes; i += intervalMinutes) {
    const time = new Date(startTime.getTime() + i * 60 * 1000);
    const level = calculateCurrentCaffeine(entries, time);
    const minutesFromNow = Math.round((time - now) / (1000 * 60));
    points.push({
      time: time.toISOString(),
      level: Math.round(level * 10) / 10,
      minutesFromNow,
      isFuture: minutesFromNow > 0,
    });
  }

  return points;
}

/**
 * Returns hours until caffeine drops below the sleep-safe threshold.
 * Returns 0 if already safe, null if never drops in 24h.
 */
export function getTimeUntilSafe(entries, threshold = SLEEP_SAFE_THRESHOLD) {
  const current = calculateCurrentCaffeine(entries);
  if (current <= threshold) return 0;

  const now = new Date();
  for (let minutes = 10; minutes <= 24 * 60; minutes += 10) {
    const futureTime = new Date(now.getTime() + minutes * 60 * 1000);
    const level = calculateCurrentCaffeine(entries, futureTime);
    if (level <= threshold) {
      return minutes / 60;
    }
  }
  return null;
}

export function getCaffeineZone(mg) {
  if (mg < 80)  return 'clear';
  if (mg < 150) return 'low';
  if (mg < 250) return 'moderate';
  if (mg < 400) return 'high';
  return 'extreme';
}

export const ZONE_INFO = {
  clear:    { label: 'Clear',         color: '#6b7280', glow: '#6b728040', description: 'Barely any caffeine active' },
  low:      { label: 'Warming Up',    color: '#22c55e', glow: '#22c55e40', description: 'Just getting started' },
  moderate: { label: 'Peak Buzz',     color: '#f59e0b', glow: '#f59e0b40', description: 'Optimal focus zone' },
  high:     { label: 'High Alert',    color: '#f97316', glow: '#f9731640', description: 'Stay hydrated' },
  extreme:  { label: 'Over the Edge', color: '#ef4444', glow: '#ef444440', description: 'Consider stopping' },
};

export function getTodayEntries(allEntries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return allEntries.filter(e => new Date(e.timestamp) >= today);
}

export function getTodayTotal(allEntries) {
  return getTodayEntries(allEntries).reduce((sum, e) => sum + e.caffeine, 0);
}

export function getWeeklyData(allEntries) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    const dayEntries = allEntries.filter(e => {
      const t = new Date(e.timestamp);
      return t >= date && t < nextDay;
    });
    days.push({
      date: date.toISOString(),
      total: dayEntries.reduce((sum, e) => sum + e.caffeine, 0),
      entries: dayEntries,
    });
  }
  return days;
}

export function formatHours(hours) {
  if (hours === 0) return 'now';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function getMgPerKg(mg, weightKg) {
  if (!weightKg) return '—';
  const val = mg / weightKg;
  if (val < 0.1) return '<0.1';
  if (val < 10)  return val.toFixed(1);
  return Math.round(val).toString();
}
