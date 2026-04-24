import React from 'react';
import { formatUSD } from '../utils/data';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

export default function VaultModal({ vault, onClose }) {
  if (!vault) return null;

  const radarData = [
    { metric: 'Yield', value: Math.round((vault.apy / 20) * 100) },
    { metric: 'Safety', value: vault.risk === 'low' ? 90 : 60 },
    { metric: 'Liquidity', value: 100 - vault.utilization + 30 },
    { metric: 'Stability', value: vault.risk === 'low' ? 85 : 65 },
    { metric: 'Efficiency', value: vault.utilization },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg2)', border: '1px solid var(--border2)',
        borderRadius: 16, padding: 28, width: '100%', maxWidth: 520,
        animation: 'fadeUp 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: vault.color + '22', border: `1px solid ${vault.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: vault.color, fontWeight: 700,
              fontFamily: 'var(--font-display)',
            }}>{vault.asset.slice(0,2)}</div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-display)' }}>{vault.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                {vault.strategies.join(' · ')}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 6, color: 'var(--text2)', cursor: 'pointer',
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Current APY', value: vault.apy.toFixed(1) + '%', color: 'var(--green)' },
            { label: '7D APY', value: vault.apy7d.toFixed(1) + '%' },
            { label: '30D APY', value: vault.apy30d.toFixed(1) + '%' },
            { label: 'TVL', value: formatUSD(vault.tvl) },
            { label: 'Depositors', value: vault.depositors.toLocaleString() },
            { label: 'Yield Paid', value: formatUSD(vault.totalYieldPaid) },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', color: s.color || 'var(--text)' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            Vault profile
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#8a8780', fontFamily: 'DM Mono' }} />
              <Radar dataKey="value" stroke={vault.color} fill={vault.color} fillOpacity={0.15} strokeWidth={1.5} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Utilization
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 6, background: 'var(--bg4)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${vault.utilization}%`, height: '100%', background: vault.color, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{vault.utilization}%</span>
          </div>
        </div>

        <a href="https://app.concrete.xyz" target="_blank" rel="noopener noreferrer" style={{
          display: 'block', textAlign: 'center', padding: '10px',
          background: vault.color, color: '#0a0a0a',
          borderRadius: 10, fontSize: 13, fontWeight: 700,
          fontFamily: 'var(--font-display)', textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}>
          Deposit in this Vault ↗
        </a>
      </div>
    </div>
  );
}
