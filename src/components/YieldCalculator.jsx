import React, { useState } from 'react';
import { MOCK_VAULTS, formatUSD } from '../utils/data';

export default function YieldCalculator() {
  const [amount, setAmount] = useState(10000);
  const [vaultId, setVaultId] = useState('usdt-earn');
  const [period, setPeriod] = useState(365);

  const vault = MOCK_VAULTS.find(v => v.id === vaultId);
  const apy = vault?.apy || 10;
  const daily = amount * (apy / 100) / 365;
  const periodYield = daily * period;
  const total = amount + periodYield;
  const effectiveRate = (periodYield / amount) * 100;

  const periods = [
    { label: '1 Day', days: 1 },
    { label: '1 Week', days: 7 },
    { label: '1 Month', days: 30 },
    { label: '3 Months', days: 90 },
    { label: '1 Year', days: 365 },
  ];

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    background: 'var(--bg3)', border: '1px solid var(--border)',
    borderRadius: 8, color: 'var(--text)', fontSize: 14,
    fontFamily: 'var(--font-mono)', outline: 'none',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px',
      animation: 'fadeUp 0.5s ease 0.35s both',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
        Yield Calculator
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Deposit Amount (USD)</label>
          <input
            type="number" value={amount} min={0}
            onChange={e => setAmount(Number(e.target.value))}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div>
          <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Select Vault</label>
          <select value={vaultId} onChange={e => setVaultId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}>
            {MOCK_VAULTS.map(v => (
              <option key={v.id} value={v.id}>{v.name} — {v.apy.toFixed(1)}% APY</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>Time Period</label>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {periods.map(p => (
              <button key={p.days} onClick={() => setPeriod(p.days)} style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 6,
                border: '1px solid ' + (period === p.days ? 'var(--green)' : 'var(--border)'),
                background: period === p.days ? 'var(--green-dim)' : 'transparent',
                color: period === p.days ? 'var(--green)' : 'var(--text3)',
                cursor: 'pointer', fontFamily: 'var(--font-mono)',
                transition: 'all 0.15s', flex: '1 1 auto',
              }}>{p.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: 14, background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--green-border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Est. yield</div>
            <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--green)' }}>
              +{formatUSD(periodYield)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Total value</div>
            <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--text)' }}>
              {formatUSD(total)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Daily yield</div>
            <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>
              {formatUSD(daily, 2)}/day
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>Effective rate</div>
            <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>
              {effectiveRate.toFixed(2)}%
            </div>
          </div>
        </div>
        <a href="https://app.concrete.xyz" target="_blank" rel="noopener noreferrer" style={{
          display: 'block', marginTop: 12, textAlign: 'center',
          padding: '8px', background: 'var(--green)', color: '#0a0a0a',
          borderRadius: 8, fontSize: 12, fontWeight: 600,
          fontFamily: 'var(--font-display)', textDecoration: 'none',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => e.target.style.opacity = '0.85'}
        onMouseLeave={e => e.target.style.opacity = '1'}>
          Deposit on Concrete ↗
        </a>
      </div>
    </div>
  );
}
