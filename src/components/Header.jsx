import React, { useState, useEffect } from 'react';

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    padding: '0 24px',
    height: 56,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
  },
  logoMark: {
    width: 28,
    height: 28,
    background: 'var(--green)',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    color: '#0a0a0a',
    fontFamily: 'var(--font-display)',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  logoSub: {
    fontSize: 10,
    color: 'var(--text3)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  liveDot: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    color: 'var(--green)',
    fontFamily: 'var(--font-mono)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--green)',
    animation: 'pulse-green 2s infinite',
  },
  clock: {
    fontSize: 11,
    color: 'var(--text3)',
    fontFamily: 'var(--font-mono)',
  },
  navLink: {
    fontSize: 12,
    color: 'var(--text2)',
    textDecoration: 'none',
    padding: '4px 10px',
    borderRadius: 6,
    border: '1px solid var(--border)',
    transition: 'all 0.15s',
    cursor: 'pointer',
    background: 'transparent',
    fontFamily: 'var(--font-mono)',
  },
};

export default function Header() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={styles.header}>
      <a href="https://concrete.xyz" target="_blank" rel="noopener noreferrer" style={styles.logo}>
        <div style={styles.logoMark}>C</div>
        <span style={styles.logoText}>Concrete</span>
        <span style={styles.logoSub}>Analytics</span>
      </a>
      <div style={styles.right}>
        <div style={styles.liveDot}>
          <span style={styles.dot} />
          Live
        </div>
        <span style={styles.clock}>
          {time.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <a href="https://app.concrete.xyz" target="_blank" rel="noopener noreferrer"
          style={styles.navLink}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--green)'; e.target.style.color = 'var(--green)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text2)'; }}>
          Launch App ↗
        </a>
      </div>
    </header>
  );
}
