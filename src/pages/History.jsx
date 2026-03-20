import { useState, useMemo } from 'react';
import { format, isToday, isYesterday, subDays, startOfDay } from 'date-fns';
import { BarChart2, Trash2, TrendingUp, TrendingDown, Minus, Lock, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';

const STRIPE_URL = 'https://buy.stripe.com/8x28wO0Sx4kqco27I02Ji04';

function formatDayLabel(isoDate) {
  const d = new Date(isoDate);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yest.';
  return format(d, 'EEE');
}

function WeekBarChart({ data, dailyLimit }) {
  const maxVal = Math.max(...data.map(d => d.total), dailyLimit);

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={data} margin={{ top: 5, right: 0, left: -28, bottom: 0 }}>
        <XAxis
          dataKey="date"
          tickFormatter={formatDayLabel}
          tick={{ fill: '#6b7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6b7280', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          domain={[0, Math.ceil(maxVal / 100) * 100]}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            return (
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-xs">
                <p className="text-neutral-400">{format(new Date(label), 'EEE, MMM d')}</p>
                <p className="text-white font-bold">{Math.round(payload[0].value)}mg</p>
              </div>
            );
          }}
        />
        <ReferenceLine y={dailyLimit} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} />
        <Bar dataKey="total" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell
              key={i}
              fill={
                isToday(new Date(entry.date))
                  ? '#f59e0b'
                  : entry.total >= dailyLimit
                  ? '#ef4444'
                  : '#3a3a3a'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EntryRow({ entry, onRemove }) {
  return (
    <div className="flex items-center gap-3 py-2.5 group">
      <span className="text-lg w-7 text-center shrink-0">{entry.emoji || '☕'}</span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm truncate">{entry.name}</p>
        <p className="text-neutral-500 text-xs">{format(new Date(entry.timestamp), 'h:mm a')}</p>
      </div>
      <span className="text-brand-400 text-sm font-semibold shrink-0">{entry.caffeine}mg</span>
      <button
        onClick={() => onRemove(entry.id)}
        className="opacity-30 group-hover:opacity-100 w-10 h-10 flex items-center justify-center text-neutral-600 hover:text-red-400 transition-all -mr-2"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function DaySection({ date, entries, onRemove }) {
  const d = new Date(date);
  const label = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'EEEE, MMMM d');
  const total = entries.reduce((s, e) => s + e.caffeine, 0);

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden mb-3">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1f]">
        <p className="text-white text-sm font-semibold">{label}</p>
        <span className="text-brand-400 text-sm font-bold">{Math.round(total)}mg</span>
      </div>
      <div className="px-4 divide-y divide-[#1a1a1a]">
        {entries.map(e => <EntryRow key={e.id} entry={e} onRemove={onRemove} />)}
      </div>
    </div>
  );
}

export default function History() {
  const { entries, weeklyData, settings, removeEntry, isPro, activatePro } = useApp();
  const [activating, setActivating] = useState(false);

  const cutoff = startOfDay(subDays(new Date(), 7));

  // Group all entries by calendar day
  const grouped = useMemo(() => {
    const map = new Map();
    [...entries]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .forEach(e => {
        const d = new Date(e.timestamp);
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(e);
      });
    return [...map.entries()];
  }, [entries]);

  // Weekly stats
  const weekTotal = weeklyData.reduce((s, d) => s + d.total, 0);
  const weekAvg = Math.round(weekTotal / 7);
  const todayTotal = weeklyData[6]?.total ?? 0;
  const yesterdayTotal = weeklyData[5]?.total ?? 0;
  const trend = todayTotal - yesterdayTotal;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-4 pt-14 pb-4">
        <h1 className="text-white text-2xl font-black tracking-tight">History</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Your caffeine over time</p>
      </div>

      <div className="px-4 space-y-4">
        {/* Weekly chart card */}
        <div className="bg-[#111] border border-[#1f1f1f] rounded-3xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-brand-400" />
            <p className="text-white text-sm font-semibold">7-Day Overview</p>
          </div>
          <WeekBarChart data={weeklyData} dailyLimit={settings.dailyLimit} />
          <div className="flex items-center justify-around mt-4 pt-3 border-t border-[#1f1f1f]">
            <div className="text-center">
              <p className="text-neutral-500 text-xs">Weekly avg</p>
              <p className="text-white font-bold">{weekAvg}mg</p>
            </div>
            <div className="text-center">
              <p className="text-neutral-500 text-xs">Today</p>
              <p className="text-white font-bold">{Math.round(todayTotal)}mg</p>
            </div>
            <div className="text-center">
              <p className="text-neutral-500 text-xs">vs yesterday</p>
              <div className="flex items-center justify-center gap-1">
                {trend > 0 ? (
                  <TrendingUp size={13} className="text-red-400" />
                ) : trend < 0 ? (
                  <TrendingDown size={13} className="text-green-400" />
                ) : (
                  <Minus size={13} className="text-neutral-500" />
                )}
                <p className={`font-bold text-sm ${trend > 0 ? 'text-red-400' : trend < 0 ? 'text-green-400' : 'text-neutral-500'}`}>
                  {trend > 0 ? '+' : ''}{Math.round(trend)}mg
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Log by day */}
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-neutral-600 gap-3">
            <span className="text-4xl">📋</span>
            <p className="text-sm">No history yet</p>
            <p className="text-xs text-center">Start logging drinks and your history will appear here</p>
          </div>
        ) : (
          <>
            {grouped.map(([date, dayEntries]) => {
              const isOld = !isPro && new Date(date) < cutoff;
              if (isOld) return null; // handled below in the Pro teaser
              return (
                <DaySection
                  key={date}
                  date={date}
                  entries={dayEntries}
                  onRemove={removeEntry}
                />
              );
            })}

            {/* Pro teaser — shown when there are locked entries */}
            {!isPro && grouped.some(([date]) => new Date(date) < cutoff) && (
              <div className="relative rounded-3xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {/* Blurred preview of oldest visible day */}
                <div className="blur-sm pointer-events-none select-none px-4 py-3 opacity-40">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                    <p className="text-white text-sm font-semibold">Older entries…</p>
                    <span className="text-yellow-400 text-sm font-bold">—mg</span>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3 py-2.5">
                      <span className="text-lg w-7 text-center">☕</span>
                      <div className="flex-1">
                        <div className="h-3 rounded bg-white/10 w-24 mb-1" />
                        <div className="h-2.5 rounded bg-white/06 w-16" />
                      </div>
                      <span className="text-yellow-400 text-sm font-semibold">—mg</span>
                    </div>
                  ))}
                </div>

                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6"
                  style={{ background: 'rgba(6,6,8,0.75)', backdropFilter: 'blur(4px)' }}>
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                    <Lock size={18} style={{ color: '#f59e0b' }} />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-bold text-sm">Full history is a Pro feature</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Free plan shows 7 days. Upgrade for unlimited history.
                    </p>
                  </div>

                  {!activating ? (
                    <>
                      <button
                        onClick={() => { window.open(STRIPE_URL, '_blank', 'noopener,noreferrer'); setTimeout(() => setActivating(true), 1500); }}
                        className="w-full h-11 rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 4px 20px rgba(245,158,11,0.4)' }}
                      >
                        <Zap size={15} strokeWidth={2.5} />
                        Upgrade to Pro — £9.99/mo
                      </button>
                      <button onClick={() => setActivating(true)}
                        className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        Already purchased? Activate
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => activatePro()}
                      className="w-full h-11 rounded-2xl font-bold text-sm"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e' }}
                    >
                      I've paid — Activate Pro
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
