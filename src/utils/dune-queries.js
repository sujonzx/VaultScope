// Dune query IDs for the Concrete dashboard.
//
// Override per-deployment via env vars (CRA exposes only REACT_APP_*).
// Set the values below in .env or your hosting provider.
//
// To discover or create queries:
//   1. https://dune.com/queries — search "concrete vault" or build your own.
//   2. Save the query, copy the numeric ID from the URL.
//   3. Drop it into the matching env var.
//
// When an ID is missing the app silently falls back to mock data.

const numEnv = (key) => {
  const v = process.env[key];
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : null;
};

export const QUERIES = {
  vaults: numEnv('REACT_APP_DUNE_QUERY_VAULTS'),
  tvlHistory: numEnv('REACT_APP_DUNE_QUERY_TVL_HISTORY'),
  events: numEnv('REACT_APP_DUNE_QUERY_EVENTS'),
};

// Adapters: shape Dune rows into the structures the UI already expects.
// Each query is expected to return rows matching the comments below; if
// your query uses different column names, edit the mapper here.

// Expected vaults columns:
//   id, name, asset, tvl, apy, apy_7d, apy_30d, risk, utilization,
//   change_24h, depositors, total_yield_paid, category, color, strategies (json/array)
export function mapVaultRows(rows) {
  if (!Array.isArray(rows)) return null;
  return rows.map((r) => ({
    id: r.id ?? r.vault_id,
    name: r.name,
    asset: r.asset,
    tvl: Number(r.tvl ?? 0),
    apy: Number(r.apy ?? 0),
    apy7d: Number(r.apy_7d ?? r.apy7d ?? 0),
    apy30d: Number(r.apy_30d ?? r.apy30d ?? 0),
    risk: r.risk ?? 'medium',
    utilization: Number(r.utilization ?? 0),
    change24h: Number(r.change_24h ?? r.change24h ?? 0),
    depositors: Number(r.depositors ?? 0),
    totalYieldPaid: Number(r.total_yield_paid ?? r.totalYieldPaid ?? 0),
    category: r.category ?? 'other',
    color: r.color ?? '#22c55e',
    strategies: Array.isArray(r.strategies)
      ? r.strategies
      : typeof r.strategies === 'string'
      ? r.strategies.split(',').map((s) => s.trim()).filter(Boolean)
      : [],
  }));
}

// Expected TVL history columns: day (date/string), tvl (number, in millions or USD)
export function mapTvlHistoryRows(rows) {
  if (!Array.isArray(rows)) return null;
  return rows.map((r) => {
    const raw = r.day ?? r.date ?? r.t;
    const d = raw ? new Date(raw) : new Date();
    return {
      date: d.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
      tvl: Number(r.tvl ?? r.tvl_usd ?? 0),
    };
  });
}

// Expected event columns: id, type, vault, asset, amount, ts (timestamp), color
export function mapEventRows(rows) {
  if (!Array.isArray(rows)) return null;
  const now = Date.now();
  return rows.map((r, i) => {
    const tsRaw = r.ts ?? r.block_time ?? r.timestamp;
    const ts = tsRaw ? new Date(tsRaw).getTime() : now;
    return {
      id: r.id ?? i,
      type: r.type ?? 'Deposit',
      vault: r.vault ?? r.vault_name ?? 'Unknown',
      asset: r.asset ?? '',
      amount: r.amount == null ? null : Number(r.amount),
      minutesAgo: Math.max(1, Math.round((now - ts) / 60000)),
      color: r.color ?? '#22c55e',
    };
  });
}
