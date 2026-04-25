// Dune Analytics REST API client.
//
// Browser caveat: any key embedded at build time is visible to users.
// For a public dashboard, prefer a backend proxy. The
// REACT_APP_DUNE_API_KEY path below is fine for local/dev or a trusted
// deployment where the key has read-only scope.

const DUNE_BASE = 'https://api.dune.com/api/v1';
const API_KEY = process.env.REACT_APP_DUNE_API_KEY || '';

const headers = () => ({
  'x-dune-api-key': API_KEY,
  'Content-Type': 'application/json',
});

export const duneEnabled = () => Boolean(API_KEY);

// Fetch the cached/latest result for a query without re-executing.
export async function getLatestResult(queryId) {
  if (!queryId || !API_KEY) return null;
  try {
    const res = await fetch(`${DUNE_BASE}/query/${queryId}/results`, {
      headers: headers(),
    });
    if (!res.ok) throw new Error(`dune ${res.status}`);
    const json = await res.json();
    return json?.result?.rows ?? null;
  } catch (err) {
    console.warn('[dune] getLatestResult failed', queryId, err);
    return null;
  }
}

// Trigger an execution and poll until complete. Use sparingly — costs credits.
export async function executeAndWait(queryId, params = {}, { timeoutMs = 60000, intervalMs = 2000 } = {}) {
  if (!queryId || !API_KEY) return null;
  try {
    const exec = await fetch(`${DUNE_BASE}/query/${queryId}/execute`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ query_parameters: params }),
    });
    if (!exec.ok) throw new Error(`execute ${exec.status}`);
    const { execution_id } = await exec.json();
    if (!execution_id) return null;

    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      await new Promise(r => setTimeout(r, intervalMs));
      const status = await fetch(`${DUNE_BASE}/execution/${execution_id}/status`, {
        headers: headers(),
      });
      if (!status.ok) continue;
      const sjson = await status.json();
      if (sjson.state === 'QUERY_STATE_COMPLETED') {
        const result = await fetch(`${DUNE_BASE}/execution/${execution_id}/results`, {
          headers: headers(),
        });
        const rjson = await result.json();
        return rjson?.result?.rows ?? null;
      }
      if (sjson.state === 'QUERY_STATE_FAILED' || sjson.state === 'QUERY_STATE_CANCELLED') {
        return null;
      }
    }
    return null;
  } catch (err) {
    console.warn('[dune] executeAndWait failed', queryId, err);
    return null;
  }
}
