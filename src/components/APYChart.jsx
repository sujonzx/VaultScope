import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { MOCK_VAULTS } from '../utils/data';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: 'var(--bg3)', border: '1px solid var(--border2)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--text3)', marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: d.color, fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
        {d.apy.toFixed(1)}% APY
      </div>
      <div style={{ color: 'var(--text3)', fontSize: 11 }}>7D: {d.apy7d.toFixed(1)}%</div>
    </div>
  );
};

export default function APYChart() {
  const data = MOCK_VAULTS.map(v => ({ name: v.asset, apy: v.apy, apy7d: v.apy7d, color: v.color }));

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 20px 12px',
      animation: 'fadeUp 0.5s ease 0.35s both',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
        APY comparison
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis type="number" tick={{ fontSize: 10, fill: '#555350', fontFamily: 'DM Mono' }}
            tickLine={false} axisLine={false} tickFormatter={v => v + '%'} domain={[0, 16]} />
          <YAxis type="category" dataKey="name"
            tick={{ fontSize: 11, fill: '#8a8780', fontFamily: 'DM Mono' }}
            tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="apy" radius={[0, 4, 4, 0]} barSize={18}>
            {data.map((d, i) => <Cell key={i} fill={d.color} opacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
