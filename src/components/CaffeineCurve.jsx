import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ZONE_INFO } from '../utils/caffeineCalc';

function formatXTick(isoString) {
  return format(new Date(isoString), 'h:mm');
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const level = Math.round(payload[0]?.value ?? 0);
  const time = label ? format(new Date(label), 'h:mm a') : '';
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm shadow-xl">
      <p className="text-neutral-400 text-xs">{time}</p>
      <p className="text-white font-semibold">{level} mg</p>
    </div>
  );
}

export default function CaffeineCurve({ data, sleepThreshold = 50, dailyLimit = 400 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-36 text-neutral-600 text-sm">
        Log a drink to see your caffeine curve
      </div>
    );
  }

  // Find the index of "now" (minutesFromNow closest to 0)
  const nowPoint = data.reduce((best, point) =>
    Math.abs(point.minutesFromNow) < Math.abs(best.minutesFromNow) ? point : best
  , data[0]);

  // Show every hour on x-axis
  const tickInterval = Math.ceil(data.length / 8);

  const maxLevel = Math.max(...data.map(d => d.level), dailyLimit * 0.5);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="caffGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="caffGradientFuture" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#6b7280" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6b7280" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />

          <XAxis
            dataKey="time"
            tickFormatter={formatXTick}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={{ fill: '#6b7280', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            domain={[0, Math.ceil(maxLevel / 50) * 50]}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Sleep-safe threshold line */}
          <ReferenceLine
            y={sleepThreshold}
            stroke="#22c55e"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: '💤', position: 'right', fill: '#22c55e', fontSize: 12 }}
          />

          {/* Daily limit line */}
          <ReferenceLine
            y={dailyLimit}
            stroke="#ef4444"
            strokeDasharray="4 3"
            strokeWidth={1}
            label={{ value: '⚠️', position: 'right', fill: '#ef4444', fontSize: 12 }}
          />

          {/* "Now" vertical line */}
          <ReferenceLine
            x={nowPoint.time}
            stroke="#ffffff"
            strokeWidth={1.5}
            strokeDasharray="3 3"
            label={{ value: 'Now', position: 'top', fill: '#9ca3af', fontSize: 10 }}
          />

          <Area
            type="monotone"
            dataKey="level"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#caffGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#f59e0b', stroke: '#0a0a0a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex items-center gap-4 mt-2 px-1">
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span className="inline-block w-4 border-t border-dashed border-green-500" /> Sleep safe
        </span>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span className="inline-block w-4 border-t border-dashed border-red-500" /> Daily limit
        </span>
        <span className="flex items-center gap-1 text-[10px] text-neutral-500">
          <span className="inline-block w-4 border-t border-white/40" /> Now
        </span>
      </div>
    </div>
  );
}
