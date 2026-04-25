import {
  duneEnabled,
  getLatestResult,
} from './dune';
import {
  QUERIES,
  mapVaultRows,
  mapTvlHistoryRows,
  mapEventRows,
} from './dune-queries';

// DeFiLlama API - Free, no key needed
const DEFILLAMA_BASE = 'https://api.llama.fi';
const CONCRETE_SLUG = 'concrete';

export async function fetchConcreteTVL() {
  try {
    const res = await fetch(`${DEFILLAMA_BASE}/protocol/${CONCRETE_SLUG}`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function fetchConcreteChains() {
  try {
    const res = await fetch(`${DEFILLAMA_BASE}/chains`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

// Realistic mock data (used as fallback + for vault-level detail)
export const MOCK_VAULTS = [
  {
    id: 'usdt-earn',
    name: 'USDT Earn Vault',
    asset: 'USDT',
    tvl: 405200000,
    apy: 12.4,
    apy7d: 11.9,
    apy30d: 11.2,
    risk: 'low',
    utilization: 82,
    change24h: 1.8,
    depositors: 3241,
    totalYieldPaid: 2140000,
    category: 'stablecoin',
    color: '#22c55e',
    strategies: ['Aave v3', 'Compound v3', 'Morpho Blue'],
  },
  {
    id: 'wbtc-yield',
    name: 'WBTC Yield Vault',
    asset: 'WBTC',
    tvl: 228400000,
    apy: 9.1,
    apy7d: 8.7,
    apy30d: 8.4,
    risk: 'medium',
    utilization: 67,
    change24h: 3.2,
    depositors: 1820,
    totalYieldPaid: 980000,
    category: 'btc',
    color: '#f59e0b',
    strategies: ['Aave v3', 'Pendle', 'Eigenlayer'],
  },
  {
    id: 'eth-strategy',
    name: 'ETH Strategy Vault',
    asset: 'ETH',
    tvl: 144000000,
    apy: 11.7,
    apy7d: 11.4,
    apy30d: 10.8,
    risk: 'medium',
    utilization: 74,
    change24h: -0.4,
    depositors: 2105,
    totalYieldPaid: 760000,
    category: 'eth',
    color: '#a78bfa',
    strategies: ['Lido', 'Eigenlayer', 'Morpho'],
  },
  {
    id: 'usdc-secure',
    name: 'USDC Secure Vault',
    asset: 'USDC',
    tvl: 70000000,
    apy: 7.8,
    apy7d: 7.6,
    apy30d: 7.4,
    risk: 'low',
    utilization: 55,
    change24h: 0.9,
    depositors: 890,
    totalYieldPaid: 310000,
    category: 'stablecoin',
    color: '#60a5fa',
    strategies: ['Aave v3', 'Compound v3'],
  },
];

export function generateTVLHistory(days = 90) {
  const history = [];
  let base = 580;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    base += (Math.random() - 0.35) * 12;
    if (i === days - 1) base = 847;
    history.push({
      date: date.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      tvl: Math.max(400, Math.round(base * 10) / 10),
    });
  }
  return history;
}

export function generateEvents() {
  const types = ['Deposit', 'Withdrawal', 'Yield Accrued', 'Rebalance', 'Deposit', 'Deposit'];
  const vaults = MOCK_VAULTS;
  const events = [];
  let minutesAgo = 1;
  for (let i = 0; i < 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const vault = vaults[Math.floor(Math.random() * vaults.length)];
    const amount = type === 'Yield Accrued'
      ? Math.round(Math.random() * 50000 + 5000)
      : type === 'Rebalance'
      ? null
      : Math.round(Math.random() * 500000 + 10000);
    events.push({
      id: i,
      type,
      vault: vault.name,
      asset: vault.asset,
      amount,
      minutesAgo,
      color: vault.color,
    });
    minutesAgo += Math.round(Math.random() * 18 + 2);
  }
  return events;
}

export function formatUSD(n, decimals = 0) {
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n.toFixed(decimals);
}

export function formatTime(minutesAgo) {
  if (minutesAgo < 60) return minutesAgo + 'm ago';
  if (minutesAgo < 1440) return Math.floor(minutesAgo / 60) + 'h ago';
  return Math.floor(minutesAgo / 1440) + 'd ago';
}

// Orchestrates Dune fetches with mock fallbacks. Returns whatever is
// available — partial Dune data + partial mock is fine. The `sources`
// object reports which channel served each slice for the UI badge.
export async function loadDashboardData() {
  const result = {
    vaults: MOCK_VAULTS,
    tvlHistory: generateTVLHistory(90),
    events: generateEvents(),
    sources: { vaults: 'mock', tvlHistory: 'mock', events: 'mock' },
    duneEnabled: duneEnabled(),
  };

  if (!duneEnabled()) return result;

  const [vaultRows, tvlRows, eventRows] = await Promise.all([
    QUERIES.vaults ? getLatestResult(QUERIES.vaults) : Promise.resolve(null),
    QUERIES.tvlHistory ? getLatestResult(QUERIES.tvlHistory) : Promise.resolve(null),
    QUERIES.events ? getLatestResult(QUERIES.events) : Promise.resolve(null),
  ]);

  const vaults = mapVaultRows(vaultRows);
  if (vaults && vaults.length) {
    result.vaults = vaults;
    result.sources.vaults = 'dune';
  }

  const tvl = mapTvlHistoryRows(tvlRows);
  if (tvl && tvl.length) {
    result.tvlHistory = tvl;
    result.sources.tvlHistory = 'dune';
  }

  const events = mapEventRows(eventRows);
  if (events && events.length) {
    result.events = events;
    result.sources.events = 'dune';
  }

  return result;
}
