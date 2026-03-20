import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const ONBOARDED_KEY = 'caffiend_onboarded';

const FIRST_RUN_DRINKS = [
  { id: 'espresso',        name: 'Espresso',       caffeine: 63,  size: '1 shot',    emoji: '☕' },
  { id: 'flat-white',      name: 'Flat White',     caffeine: 130, size: '5oz',       emoji: '☕' },
  { id: 'drip-coffee-md',  name: 'Filter Coffee',  caffeine: 142, size: '12oz',      emoji: '☕' },
  { id: 'americano-md',    name: 'Americano',      caffeine: 154, size: '12oz',      emoji: '☕' },
  { id: 'red-bull',        name: 'Red Bull',        caffeine: 80,  size: '250ml',     emoji: '🔴' },
  { id: 'monster-energy',  name: 'Monster',         caffeine: 160, size: '500ml',     emoji: '🟢' },
];

export default function FirstRunModal() {
  const { addEntry, todayEntries } = useApp();
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState([]);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDED_KEY);
    if (!done && todayEntries.length === 0) {
      // Small delay so the dashboard renders first — makes the reveal feel intentional
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const toggle = (drink) => {
    setSelected(prev =>
      prev.find(d => d.id === drink.id)
        ? prev.filter(d => d.id !== drink.id)
        : [...prev, drink]
    );
  };

  const handleDone = () => {
    selected.forEach(drink => {
      addEntry({ name: drink.name, caffeine: drink.caffeine, size: drink.size, emoji: drink.emoji, drinkId: drink.id });
    });
    dismiss();
  };

  const dismiss = () => {
    setClosing(true);
    localStorage.setItem(ONBOARDED_KEY, '1');
    setTimeout(() => setVisible(false), 400);
  };

  const totalMg = selected.reduce((sum, d) => sum + d.caffeine, 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        opacity: closing ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* Sheet */}
      <div
        className="w-full max-w-md rounded-t-3xl px-5 pt-6 pb-10"
        style={{
          background: 'linear-gradient(180deg, #0e0e12 0%, #060608 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          transform: closing ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Pill */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: 'rgba(255,255,255,0.12)' }} />

        {/* Heading */}
        <div className="mb-6">
          <h2
            className="font-black text-2xl leading-tight mb-1"
            style={{
              background: 'linear-gradient(135deg, #fcd34d 0%, #ffffff 60%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            What have you had today?
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Tap everything you've drunk — we'll show you exactly what's in your system right now.
          </p>
        </div>

        {/* Drink grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {FIRST_RUN_DRINKS.map(drink => {
            const isSelected = selected.find(d => d.id === drink.id);
            return (
              <button
                key={drink.id}
                onClick={() => toggle(drink)}
                className="relative flex flex-col items-center gap-2 rounded-2xl p-3 active:scale-95 transition-all duration-150"
                style={{
                  background: isSelected ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${isSelected ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isSelected ? '0 0 16px rgba(251,191,36,0.12)' : 'none',
                }}
              >
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#fbbf24' }}
                  >
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <span className="text-3xl">{drink.emoji}</span>
                <div className="text-center">
                  <p className="text-xs font-semibold leading-tight" style={{ color: isSelected ? '#fcd34d' : 'rgba(255,255,255,0.75)' }}>
                    {drink.name}
                  </p>
                  <p className="text-xs font-bold mt-0.5" style={{ color: isSelected ? '#fbbf24' : 'rgba(255,255,255,0.3)' }}>
                    {drink.caffeine}mg
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        {selected.length > 0 ? (
          <button
            onClick={handleDone}
            className="w-full rounded-2xl py-4 font-bold text-base text-black active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #fcd34d, #f59e0b)' }}
          >
            Show my caffeine level — {totalMg}mg
          </button>
        ) : (
          <button
            onClick={dismiss}
            className="w-full rounded-2xl py-4 font-semibold text-sm"
            style={{ color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            Nothing yet today
          </button>
        )}
      </div>
    </div>
  );
}
