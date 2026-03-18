import { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Moon, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ZONE_INFO, formatHours, getMgPerKg } from '../utils/caffeineCalc';
import { DRINKS, QUICK_ADD_IDS } from '../data/drinks';
import CaffeineGauge from '../components/CaffeineGauge';
import CaffeineCurve from '../components/CaffeineCurve';
import AddDrinkModal from '../components/AddDrinkModal';
import { LogoMark } from '../components/Logo';

function SleepCard({ sleepSafeIn }) {
  const isReady = sleepSafeIn === 0;
  const isMissed = sleepSafeIn === null;
  let safeAt = null;
  if (sleepSafeIn > 0) safeAt = new Date(Date.now() + sleepSafeIn * 3600000);

  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden"
      style={{
        background: isReady ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.025)',
        border: `1px solid ${isReady ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.07)'}`,
      }}
    >
      {isReady && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 50%, rgba(34,197,94,0.08) 0%, transparent 60%)' }} />
      )}
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: isReady ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)' }}>
        <Moon size={16} style={{ color: isReady ? '#22c55e' : 'rgba(255,255,255,0.35)' }} />
      </div>
      <div className="flex-1 relative">
        <p className="text-[10px] uppercase tracking-wider font-semibold mb-0.5"
          style={{ color: 'rgba(255,255,255,0.3)' }}>Sleep impact</p>
        {isReady ? (
          <p className="text-green-400 font-semibold text-sm">Safe to sleep now</p>
        ) : isMissed ? (
          <p className="font-semibold text-sm" style={{ color: '#f97316' }}>Heavy load — give it time</p>
        ) : (
          <p className="text-white font-semibold text-sm">
            Clear in{' '}
            <span style={{ color: '#fbbf24' }}>{formatHours(sleepSafeIn)}</span>
            {safeAt && (
              <span style={{ color: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>
                {' '}({format(safeAt, 'h:mm a')})
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function QuickAddButton({ drink, onAdd }) {
  return (
    <button
      onClick={() => onAdd(drink)}
      className="group relative flex flex-col items-center gap-2 rounded-2xl p-3 min-w-[72px] overflow-hidden active:scale-95 transition-transform duration-100"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)' }} />
      <span className="text-[22px] relative">{drink.emoji}</span>
      <div className="text-center relative">
        <p className="text-[10px] font-medium leading-tight" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {drink.name.split(' ')[0]}
        </p>
        <p className="text-[10px] font-bold mt-0.5" style={{ color: '#fbbf24' }}>{drink.caffeine}mg</p>
      </div>
    </button>
  );
}

function LogEntry({ entry, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-3 group">
      <span className="text-xl w-8 text-center shrink-0">{entry.emoji || '☕'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{entry.name}</p>
        <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {format(new Date(entry.timestamp), 'h:mm a')}
          {entry.size ? ` · ${entry.size}` : ''}
        </p>
      </div>
      <span className="font-semibold text-sm shrink-0" style={{ color: '#fbbf24' }}>{entry.caffeine}mg</span>
      <button
        onClick={() => onRemove(entry.id)}
        className="opacity-30 group-hover:opacity-100 ml-1 w-10 h-10 flex items-center justify-center rounded-lg transition-all -mr-1"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export default function Dashboard() {
  const {
    currentCaffeine, todayTotal, todayEntries, caffeineZone,
    sleepSafeIn, caffeineCurve, settings, addEntry, removeEntry,
  } = useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const zoneInfo = ZONE_INFO[caffeineZone] || ZONE_INFO.clear;
  const quickDrinks = QUICK_ADD_IDS.map(id => DRINKS.find(d => d.id === id)).filter(Boolean);
  const mgPerKg = getMgPerKg(currentCaffeine, settings.weight);

  const handleQuickAdd = (drink) => {
    addEntry({ name: drink.name, caffeine: drink.caffeine, size: drink.size, emoji: drink.emoji, drinkId: drink.id });
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: '#060608' }}>

      {/* Dynamic ambient zone glow */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse 90% 35% at 50% -2%, ${zoneInfo.color}18 0%, transparent 70%)`,
        transition: 'background 2s ease',
      }} />

      {/* Header */}
      <div className="relative z-10 px-5 pt-12 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark size={38} />
          <div>
            <h1
              className="font-black tracking-tight leading-none"
              style={{
                fontFamily: "'JetBrains Mono', 'Inter', monospace",
                fontSize: '1.45rem',
                letterSpacing: '-0.025em',
                background: 'linear-gradient(135deg, #fcd34d 0%, #ffffff 55%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Caffiend
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em]"
                style={{ color: 'rgba(74,222,128,0.65)' }}>Live tracking</span>
            </div>
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-glow w-10 h-10 rounded-2xl flex items-center justify-center">
          <Plus size={19} className="text-black" strokeWidth={3} />
        </button>
      </div>

      {/* Gauge card */}
      <div className="relative z-10 px-4 mt-1">
        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{
            background: `radial-gradient(ellipse 65% 45% at 50% 100%, ${zoneInfo.color}14 0%, transparent 70%)`,
            transition: 'background 1.2s ease',
          }} />
          <div className="relative pt-3 pb-2">
            <CaffeineGauge current={currentCaffeine} max={settings.dailyLimit} zone={caffeineZone} />
            <div className="flex gap-2 px-4 pb-4 mt-1">
              {[
                { label: 'Consumed', value: `${Math.round(todayTotal)}mg` },
                { label: 'Per kg',   value: `${mgPerKg} mg/kg` },
                { label: 'Drinks',   value: todayEntries.length },
              ].map(({ label, value }) => (
                <div key={label} className="flex-1 text-center py-2.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-[9px] uppercase tracking-wider font-semibold mb-1"
                    style={{ color: 'rgba(255,255,255,0.28)' }}>{label}</p>
                  <p className="text-white font-bold text-[15px]">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sleep card */}
      <div className="relative z-10 px-4 mt-3">
        <SleepCard sleepSafeIn={sleepSafeIn} sleepTime={settings.sleepTime} />
      </div>

      {/* Quick Add */}
      <div className="relative z-10 mt-5 px-4">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'rgba(255,255,255,0.35)' }}>Quick Add</p>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
          <button onClick={() => setModalOpen(true)} className="text-[11px] font-semibold px-2 py-2 -mr-2" style={{ color: '#fbbf24' }}>All drinks</button>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {quickDrinks.map(drink => (
            <QuickAddButton key={drink.id} drink={drink} onAdd={handleQuickAdd} />
          ))}
          <button
            onClick={() => setModalOpen(true)}
            className="flex flex-col items-center gap-2 rounded-2xl p-3 min-w-[72px] active:scale-95 transition-transform duration-100"
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px dashed rgba(255,255,255,0.1)' }}
          >
            <span className="text-[22px]" style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
            <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.25)' }}>Custom</span>
          </button>
        </div>
      </div>

      {/* Caffeine Curve */}
      <div className="relative z-10 mt-5 px-4">
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="px-4 pt-4 pb-1 flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(251,191,36,0.12)' }}>
              <TrendingUp size={13} style={{ color: '#fbbf24' }} />
            </div>
            <p className="text-white font-semibold text-sm">Caffeine Curve</p>
            <span className="ml-auto text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>Next 10h</span>
          </div>
          <div className="px-2 pb-3">
            <CaffeineCurve data={caffeineCurve} sleepThreshold={settings.sleepThreshold} dailyLimit={settings.dailyLimit} />
          </div>
        </div>
      </div>

      {/* Today's Log */}
      <div className="relative z-10 mt-5 px-4 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'rgba(255,255,255,0.35)' }}>Today</p>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
          {todayEntries.length > 0 && (
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {todayEntries.length} item{todayEntries.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {todayEntries.length === 0 ? (
            <div className="py-10 flex flex-col items-center gap-3" style={{ color: 'rgba(255,255,255,0.2)' }}>
              <span className="text-4xl">☕</span>
              <p className="text-sm font-medium">No drinks logged yet</p>
              <button onClick={() => setModalOpen(true)} className="text-xs font-semibold" style={{ color: '#fbbf24' }}>
                + Log your first drink
              </button>
            </div>
          ) : (
            <div className="px-4 divide-y" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {todayEntries.map(entry => (
                <LogEntry key={entry.id} entry={entry} onRemove={removeEntry} />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddDrinkModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
