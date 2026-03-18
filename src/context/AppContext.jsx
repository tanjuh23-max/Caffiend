import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { loadEntries, saveEntries, loadSettings, saveSettings, generateId, loadIsPro, loadProState, saveProState } from '../utils/storage';
import { verifyProEmail } from '../utils/api';
import {
  calculateCurrentCaffeine,
  getCaffeineCurve,
  getTimeUntilSafe,
  getCaffeineZone,
  getTodayEntries,
  getTodayTotal,
  getWeeklyData,
} from '../utils/caffeineCalc';

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ENTRY': {
      const entries = [action.entry, ...state.entries];
      saveEntries(entries);
      return { ...state, entries };
    }
    case 'REMOVE_ENTRY': {
      const entries = state.entries.filter(e => e.id !== action.id);
      saveEntries(entries);
      return { ...state, entries };
    }
    case 'UPDATE_SETTINGS': {
      const settings = { ...state.settings, ...action.settings };
      saveSettings(settings);
      return { ...state, settings };
    }
    case 'CLEAR_ALL': {
      saveEntries([]);
      return { ...state, entries: [] };
    }
    case 'SET_PRO': {
      // action.proState = { email, expiresAt } or null
      saveProState(action.proState);
      return { ...state, isPro: action.proState !== null, proState: action.proState };
    }
    case 'TICK':
      return { ...state, now: action.now };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const initialProState = loadProState();
  const [state, dispatch] = useReducer(reducer, null, () => ({
    entries: loadEntries(),
    settings: loadSettings(),
    isPro: initialProState !== null,
    proState: initialProState,
    now: new Date(),
  }));

  // Refresh every 30 seconds so the caffeine curve stays current
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'TICK', now: new Date() }), 30_000);
    return () => clearInterval(id);
  }, []);

  // On launch, silently re-verify Pro if stored email exists
  useEffect(() => {
    const ps = loadProState();
    if (ps?.email) {
      verifyProEmail(ps.email).then(result => {
        if (!result.isPro) {
          dispatch({ type: 'SET_PRO', proState: null });
        }
      }).catch(() => { /* network offline — keep current state */ });
    }
  }, []);

  const todayEntries    = useMemo(() => getTodayEntries(state.entries), [state.entries, state.now]);
  const currentCaffeine = useMemo(() => calculateCurrentCaffeine(todayEntries, state.now), [todayEntries, state.now]);
  const todayTotal      = useMemo(() => getTodayTotal(state.entries), [state.entries]);
  const caffeineZone    = useMemo(() => getCaffeineZone(currentCaffeine), [currentCaffeine]);
  const sleepSafeIn     = useMemo(() => getTimeUntilSafe(todayEntries, state.settings.sleepThreshold), [todayEntries, state.settings.sleepThreshold, state.now]);
  const caffeineCurve   = useMemo(() => getCaffeineCurve(todayEntries), [todayEntries, state.now]);
  const weeklyData      = useMemo(() => getWeeklyData(state.entries), [state.entries]);

  const addEntry = useCallback((drinkData) => {
    const entry = { id: generateId(), timestamp: new Date().toISOString(), ...drinkData };
    dispatch({ type: 'ADD_ENTRY', entry });
    return entry;
  }, []);

  const removeEntry    = useCallback((id) => dispatch({ type: 'REMOVE_ENTRY', id }), []);
  const updateSettings = useCallback((s) => dispatch({ type: 'UPDATE_SETTINGS', settings: s }), []);
  const clearAll       = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []);

  // Verify email with backend and activate Pro
  const verifyPro = useCallback(async (email) => {
    const result = await verifyProEmail(email);
    if (result.isPro) {
      dispatch({ type: 'SET_PRO', proState: { email: email.toLowerCase().trim(), expiresAt: result.expiresAt } });
    }
    return result;
  }, []);

  const deactivatePro = useCallback(() => dispatch({ type: 'SET_PRO', proState: null }), []);

  const value = {
    entries: state.entries,
    todayEntries,
    settings: state.settings,
    isPro: state.isPro,
    proEmail: state.proState?.email ?? null,
    now: state.now,
    currentCaffeine,
    todayTotal,
    caffeineZone,
    sleepSafeIn,
    caffeineCurve,
    weeklyData,
    addEntry,
    removeEntry,
    updateSettings,
    clearAll,
    verifyPro,
    deactivatePro,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
