const ENTRIES_KEY = 'caffiend_entries';
const SETTINGS_KEY = 'caffiend_settings';
const PRO_KEY = 'caffiend_pro';

// Pro state: { email, expiresAt } or null
export function loadProState() {
  try {
    const raw = localStorage.getItem(PRO_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.email || !parsed?.expiresAt) return null;
    if (new Date(parsed.expiresAt) < new Date()) return null; // expired
    return parsed;
  } catch { return null; }
}
export function saveProState(val) {
  try {
    if (val) localStorage.setItem(PRO_KEY, JSON.stringify(val));
    else localStorage.removeItem(PRO_KEY);
  } catch {}
}
// Convenience: is currently Pro?
export function loadIsPro() {
  return loadProState() !== null;
}

export const DEFAULT_SETTINGS = {
  weight: 70,           // kg — used for mg/kg display
  sleepTime: '23:00',   // target sleep time
  dailyLimit: 400,      // mg — recommended max
  sleepThreshold: 50,   // mg — safe level to fall asleep
  sensitivity: 'normal', // low | normal | high
};

export function loadEntries() {
  try {
    const raw = localStorage.getItem(ENTRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save entries', e);
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}
