import React, { useState, useEffect } from 'react';
import { formatUSD, formatTime, generateEvents } from '../utils/data';

const TYPE_ICONS = {
  'Deposit': '↓',
  'Withdrawal': '↑',
  'Yield Accrued': '◆',
  'Rebalance': '⟳',
};
const TYPE_COLORS = {
  'Deposit': '#22c55e',
  'Withdrawal': '#ef4444',
  'Yield Accrued': '#a78bfa',
  'Rebalance': '#60a5fa',
};

export default function EventFeed({ events: incoming, live = true }) {
  const initial = (incoming && incoming.length) ? incoming : generateEvents();
  const [events, setEvents] = useState(initial);

  useEffect(() => {
    if (incoming && incoming.length) setEvents(incoming);
  }, [incoming]);

  useEffect(() => {
    if (!live) return undefined;
    const interval = setInterval(() => {
      setEvents(prev => {
        const fresh = generateEvents();
        return [fresh[0], ...prev.slice(0, 19)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px',
      animation: 'fadeUp 0.5s ease 0.4s both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          On-chain events
        </div>
        <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-green 2s infinite' }} />
          Live
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 320, overflowY: 'auto' }}>
        {events.map((e, i) => (
          <div key={e.id + '-' + i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 0',
            borderBottom: i < events.length - 1 ? '1px solid var(--border)' : 'none',
            animation: i === 0 ? 'fadeUp 0.3s ease' : 'none',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: TYPE_COLORS[e.type] + '18',
              border: `1px solid ${TYPE_COLORS[e.type]}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: TYPE_COLORS[e.type], flexShrink: 0,
            }}>
              {TYPE_ICONS[e.type]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{e.type}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {e.vault}
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: e.type === 'Withdrawal' ? 'var(--red)' : 'var(--text)' }}>
                {e.amount ? (e.type === 'Withdrawal' ? '-' : '+') + formatUSD(e.amount) : '—'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>{formatTime(e.minutesAgo)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
