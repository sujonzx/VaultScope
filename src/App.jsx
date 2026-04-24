import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import VaultTable from './components/VaultTable';
import TVLChart from './components/TVLChart';
import APYChart from './components/APYChart';
import EventFeed from './components/EventFeed';
import YieldCalculator from './components/YieldCalculator';
import VaultModal from './components/VaultModal';
import { MOCK_VAULTS, fetchConcreteTVL, formatUSD } from './utils/data';
import './index.css';

const grid = (cols, gap = 16) => ({
  display: 'grid',
  gridTemplateColumns: cols,
  gap,
});

export default function App() {
  const [selectedVault, setSelectedVault] = useState(null);
  const [liveTVL, setLiveTVL] = useState(null);
  const [loading, setLoading] = useState(true);

  const totalTVL = MOCK_VAULTS.reduce((s, v) => s + v.tvl, 0);
  const avgAPY = MOCK_VAULTS.reduce((s, v) => s + v.apy, 0) / MOCK_VAULTS.length;
  const totalDepositors = MOCK_VAULTS.reduce((s, v) => s + v.depositors, 0);
  const totalYieldPaid = MOCK_VAULTS.reduce((s, v) => s + v.totalYieldPaid, 0);

  useEffect(() => {
    fetchConcreteTVL().then(data => {
      if (data?.tvl) setLiveTVL(data.tvl);
      setLoading(false);
    }).catch(() => setLoading(false));
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <Header />

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 11 }}>
          <span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid var(--border2)', borderTopColor: 'var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginRight: 8, verticalAlign: 'middle' }} />
          Fetching live data...
        </div>
      )}

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 20px 60px' }}>

        {/* Live TVL banner if fetched */}
        {liveTVL && (
          <div style={{
            marginBottom: 16, padding: '8px 14px',
            background: 'var(--green-dim)', border: '1px solid var(--green-border)',
            borderRadius: 8, fontSize: 11, color: 'var(--green)',
            display: 'flex', alignItems: 'center', gap: 8,
            animation: 'fadeUp 0.4s ease',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            Live DeFiLlama TVL: <strong>${(liveTVL / 1e6).toFixed(1)}M</strong>
            <span style={{ color: 'var(--text3)', marginLeft: 4 }}>— data fetched successfully</span>
          </div>
        )}

        {/* Metrics */}
        <div style={{ ...grid('repeat(auto-fit, minmax(160px, 1fr))', 12), marginBottom: 20 }}>
          <MetricCard label="Total TVL" value={formatUSD(totalTVL)} change={2.4} delay={0} accent="#22c55e" />
          <MetricCard label="Avg APY" value={avgAPY.toFixed(1) + '%'} change={0.6} changeLabel="this week" delay={60} />
          <MetricCard label="Depositors" value={totalDepositors.toLocaleString()} change={1.2} delay={120} />
          <MetricCard label="Yield paid (7d)" value={formatUSD(totalYieldPaid)} change={5.1} changeLabel="vs last week" delay={180} />
          <MetricCard label="Active vaults" value={MOCK_VAULTS.length} delay={240} />
        </div>

        {/* Charts row */}
        <div style={{ ...grid('2fr 1fr', 16), marginBottom: 16 }}>
          <TVLChart />
          <APYChart />
        </div>

        {/* Vault table full width */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            All vaults — click to inspect
          </div>
          <VaultTable vaults={MOCK_VAULTS} onSelect={setSelectedVault} />
        </div>

        {/* Bottom row: events + calculator */}
        <div style={{ ...grid('1fr 1fr', 16) }}>
          <EventFeed />
          <YieldCalculator />
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
            Built for{' '}
            <a href="https://concrete.xyz" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--green)', textDecoration: 'none' }}>
              Concrete
            </a>
            {' '}— community analytics dashboard
          </div>
          <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
            {[
              ['App', 'https://app.concrete.xyz'],
              ['Docs', 'https://docs.concrete.xyz'],
              ['Twitter', 'https://x.com/ConcreteXYZ'],
              ['Audits', 'https://www.halborn.com/audits/blueprint-finance'],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--text3)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'var(--text)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}>
                {label} ↗
              </a>
            ))}
          </div>
        </div>
      </main>

      {selectedVault && <VaultModal vault={selectedVault} onClose={() => setSelectedVault(null)} />}
    </div>
  );
}
