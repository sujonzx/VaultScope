import React from 'react';

export default function MetricCard({ label, value, change, changeLabel, accent, delay = 0 }) {
  const isPos = change > 0;
  const isNeg = change < 0;

  return (
    <div style={{
      background: 'var(--bg2)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '18px 20px',
      animation: `fadeUp 0.4s ease both`,
      animationDelay: `${delay}ms`,
      borderTop: accent ? `2px solid ${accent}` : '1px solid var(--border)',
      transition: 'border-color 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
        {value}
      </div>
      {change !== undefined && (
        <div style={{
          fontSize: 11,
          marginTop: 6,
          color: isPos ? 'var(--green)' : isNeg ? 'var(--red)' : 'var(--text3)',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {isPos ? '▲' : isNeg ? '▼' : '—'}
          {Math.abs(change).toFixed(1)}% {changeLabel || '(24h)'}
        </div>
      )}
    </div>
  );
}
