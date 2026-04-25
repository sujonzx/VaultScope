import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import VaultTable from './components/VaultTable';
import TVLChart from './components/TVLChart';
import APYChart from './components/APYChart';
import EventFeed from './components/EventFeed';
import YieldCalculator from './components/YieldCalculator';
import VaultModal from './components/VaultModal';
import {
  MOCK_VAULTS,
  fetchConcreteTVL,
  formatUSD,
  loadDashboardData,
  generateTVLHistory,
  generateEvents,
} from './utils/data';
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

  const [vaults, setVaults] = useState(MOCK_VAULTS);
  const [tvlHistory, setTvlHistory] = useState(() => generateTVLHistory(90));
  const [events, setEvents] = useState(() => generateEvents());
  const [sources, setSources] = useState({ vaults: 'mock', tvlHistory: 'mock', events: 'mock' });
  const [duneOn, setDuneOn] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const totalTVL = vaults.reduce((s, v) => s + v.tvl, 0);
  const avgAPY = totalTVL > 0
    ? vaults.reduce((s, v) => s + v.apy * v.tvl, 0) / totalTVL
    : (vaults.length ? vaults.reduce((s, v) => s + v.apy, 0) / vaults.length : 0);
  const totalDepositors = vaults.reduce((s, v) => s + v.depositors, 0);
  const totalYieldPaid = vaults.reduce((s, v) => s + v.totalYieldPaid, 0);
  const weightedChange24h = totalTVL > 0
    ? vaults.reduce((s, v) => s + v.change24h * v.tvl, 0) / totalTVL
    : 0;

  const refresh = React.useCallback(async () => {
    setRefreshing(true);
    const [llama, dash] = await Promise.all([
      fetchConcreteTVL(),
      loadDashboardData(),
    ]);
    if (llama?.tvl) setLiveTVL(llama.tvl);
    setVaults(dash.vaults);
    setTvlHistory(dash.tvlHistory);
    setEvents(dash.events);
    setSources(dash.sources);
    setDuneOn(dash.duneEnabled);
    setLastUpdated(new Date());
    setRefreshing(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refresh]);

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

        {/* Live data banner */}
        <div style={{
          marginBottom: 16, padding: '10px 14px',
          background: duneOn ? 'var(--green-dim)' : 'var(--bg2)',
          border: '1px solid ' + (duneOn ? 'var(--green-border)' : 'var(--border)'),
          borderRadius: 10, fontSize: 11,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
          animation: 'fadeUp 0.4s ease',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: duneOn ? 'var(--green)' : 'var(--text3)',
            display: 'inline-block',
            animation: duneOn ? 'pulse-green 2s infinite' : 'none',
          }} />
          <span style={{ color: duneOn ? 'var(--green)' : 'var(--text2)', fontWeight: 500 }}>
            {duneOn ? 'Dune live' : 'Mock data'}
          </span>
          {duneOn && (
            <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              vaults·{sources.vaults} | tvl·{sources.tvlHistory} | events·{sources.events}
            </span>
          )}
          {liveTVL && (
            <span style={{ color: 'var(--text3)' }}>
              DeFiLlama: <strong style={{ color: 'var(--text2)' }}>${(liveTVL / 1e6).toFixed(1)}M</strong>
            </span>
          )}
          <span style={{ flex: 1 }} />
          {lastUpdated && (
            <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
              Updated {lastUpdated.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button onClick={refresh} disabled={refreshing} style={{
            fontSize: 11, padding: '4px 10px', borderRadius: 6,
            border: '1px solid var(--border)', background: 'transparent',
            color: refreshing ? 'var(--text3)' : 'var(--text2)',
            cursor: refreshing ? 'wait' : 'pointer', fontFamily: 'var(--font-mono)',
            transition: 'all 0.15s',
          }}>
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        {/* Metrics */}
        <div style={{ ...grid('repeat(auto-fit, minmax(160px, 1fr))', 12), marginBottom: 20 }}>
          <MetricCard label="Total TVL" value={formatUSD(totalTVL)} change={Number(weightedChange24h.toFixed(2))} delay={0} accent="#22c55e" />
          <MetricCard label="Avg APY" value={avgAPY.toFixed(2) + '%'} changeLabel="TVL-weighted" delay={60} />
          <MetricCard label="Depositors" value={totalDepositors.toLocaleString()} delay={120} />
          <MetricCard label="Yield paid" value={formatUSD(totalYieldPaid)} changeLabel="cumulative" delay={180} />
          <MetricCard label="Active vaults" value={vaults.length} delay={240} />
        </div>

        {/* Charts row */}
        <div style={{ ...grid('2fr 1fr', 16), marginBottom: 16 }}>
          <TVLChart history={tvlHistory} totalTVL={totalTVL} />
          <APYChart vaults={vaults} />
        </div>

        {/* Vault table full width */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
            All vaults — click to inspect
          </div>
          <VaultTable vaults={vaults} onSelect={setSelectedVault} />
        </div>

        {/* Bottom row: events + calculator */}
        <div style={{ ...grid('1fr 1fr', 16) }}>
          <EventFeed events={events} live={sources.events !== 'dune'} />
          <YieldCalculator vaults={vaults} />
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
