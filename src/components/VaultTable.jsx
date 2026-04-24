import React, { useState } from 'react';
import { formatUSD } from '../utils/data';

const FILTERS = ['All', 'Stablecoins', 'BTC', 'ETH'];

function RiskBadge({ level }) {
  const colors = {
    low: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.2)' },
    medium: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  };
  const c = colors[level] || colors.medium;
  return (
    <span style={{
      fontSize: 10, padding: '2px 8px', borderRadius: 99,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500,
    }}>
      {level}
    </span>
  );
}

function UtilBar({ pct, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 64, height: 4, background: 'var(--bg4)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
    </div>
  );
}

export default function VaultTable({ vaults, onSelect }) {
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('tvl');
  const [sortDir, setSortDir] = useState(-1);

  const filtered = vaults.filter(v => {
    if (filter === 'All') return true;
    if (filter === 'Stablecoins') return v.category === 'stablecoin';
    if (filter === 'BTC') return v.category === 'btc';
    if (filter === 'ETH') return v.category === 'eth';
    return true;
  }).sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1) * sortDir);

  const handleSort = col => {
    if (sortBy === col) setSortDir(d => -d);
    else { setSortBy(col); setSortDir(-1); }
  };

  const cols = [
    { key: 'name', label: 'Vault' },
    { key: 'tvl', label: 'TVL' },
    { key: 'apy', label: 'APY' },
    { key: 'apy7d', label: '7D APY' },
    { key: 'utilization', label: 'Utilization' },
    { key: 'depositors', label: 'Depositors' },
    { key: 'risk', label: 'Risk' },
    { key: 'change24h', label: '24h' },
  ];

  return (
    <div style={{ animation: 'fadeUp 0.5s ease 0.2s both' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {filtered.length} vault{filtered.length !== 1 ? 's' : ''}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontSize: 11, padding: '4px 12px', borderRadius: 99,
              border: '1px solid ' + (filter === f ? 'var(--green)' : 'var(--border)'),
              background: filter === f ? 'var(--green-dim)' : 'transparent',
              color: filter === f ? 'var(--green)' : 'var(--text2)',
              cursor: 'pointer', fontFamily: 'var(--font-mono)',
              transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid var(--border)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {cols.map(c => (
                <th key={c.key}
                  onClick={() => handleSort(c.key)}
                  style={{
                    padding: '10px 14px', textAlign: 'left', fontSize: 10,
                    color: sortBy === c.key ? 'var(--green)' : 'var(--text3)',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap',
                    background: 'var(--bg3)',
                  }}>
                  {c.label} {sortBy === c.key ? (sortDir === -1 ? '↓' : '↑') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((v, i) => (
              <tr key={v.id}
                onClick={() => onSelect(v)}
                style={{
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: v.color + '22', border: `1px solid ${v.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: v.color, fontWeight: 600 }}>
                      {v.asset.slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 1 }}>{v.strategies.slice(0, 2).join(' · ')}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>
                  {formatUSD(v.tvl)}
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
                  {v.apy.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text2)' }}>
                  {v.apy7d.toFixed(1)}%
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <UtilBar pct={v.utilization} color={v.color} />
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text2)' }}>
                  {v.depositors.toLocaleString()}
                </td>
                <td style={{ padding: '12px 14px' }}>
                  <RiskBadge level={v.risk} />
                </td>
                <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                  <span style={{ color: v.change24h >= 0 ? 'var(--green)' : 'var(--red)' }}>
                    {v.change24h >= 0 ? '+' : ''}{v.change24h.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
