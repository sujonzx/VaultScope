import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { generateTVLHistory } from '../utils/data';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
      <div style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
        ${payload[0].value}M TVL
      </div>
    </div>
  );
};

export default function TVLChart() {
  const [range, setRange] = useState(30);
  const allData = generateTVLHistory(90);
  const data = allData.slice(-range);

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 20px 12px',
      animation: 'fadeUp 0.5s ease 0.3s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
            Total Value Locked
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
            $847M
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {RANGES.map(r => (
            <button key={r.label} onClick={() => setRange(r.days)} style={{
              fontSize: 11, padding: '3px 10px', borderRadius: 6,
              border: '1px solid ' + (range === r.days ? 'var(--green)' : 'var(--border)'),
              background: range === r.days ? 'var(--green-dim)' : 'transparent',
              color: range === r.days ? 'var(--green)' : 'var(--text3)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s',
            }}>{r.label}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="tvlGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#555350', fontFamily: 'DM Mono' }}
            tickLine={false} axisLine={false}
            interval={Math.floor(data.length / 5)} />
          <YAxis tick={{ fontSize: 10, fill: '#555350', fontFamily: 'DM Mono' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `$${v}M`} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="tvl" stroke="#22c55e" strokeWidth={2}
            fill="url(#tvlGrad)" dot={false} activeDot={{ r: 4, fill: '#22c55e', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
