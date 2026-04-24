# Concrete Vault Analytics Dashboard

A community-built real-time analytics dashboard for [Concrete](https://concrete.xyz) — full-stack yield infrastructure for DeFi.

## Features

- **Live TVL tracking** via DeFiLlama public API (no API key needed)
- **Vault overview table** with sorting, filtering, APY, utilization, risk
- **TVL chart** — 7D / 30D / 90D range selector
- **APY comparison** bar chart
- **Live event feed** — deposits, withdrawals, yield accruals, rebalances
- **Yield calculator** — estimate earnings across any vault and time period
- **Vault detail modal** — radar chart, full metrics, deposit CTA

## Tech Stack

- React 18
- Recharts (charts)
- DeFiLlama API (free, no key)
- Deployed on GitHub Pages

---

## Run Locally

```bash
npm install
npm start
```

Opens at `http://localhost:3000`

---

## Deploy to GitHub Pages (Free)

### Step 1 — Create GitHub repo
1. Go to [github.com](https://github.com) → New repository
2. Name it `concrete-analytics` (or anything you like)
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Push your code
```bash
git init
git add .
git commit -m "Initial commit — Concrete Analytics Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/concrete-analytics.git
git push -u origin main
```

### Step 3 — Install gh-pages and deploy
```bash
npm install --save-dev gh-pages
npm run deploy
```

### Step 4 — Enable GitHub Pages
1. Go to your repo on GitHub
2. Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **gh-pages** → **/root**
5. Save

Your site will be live at:
`https://YOUR_USERNAME.github.io/concrete-analytics`

---

## Deploy to Vercel (Even Easier)

1. Push code to GitHub (steps above)
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Click **Deploy** — done!

Live at: `https://concrete-analytics.vercel.app`

---

## Data Sources

| Data | Source |
|------|--------|
| Live TVL | [DeFiLlama API](https://defillama.com/docs/api) — free, no key |
| Vault APY | Mock data (realistic) — can be replaced with Concrete subgraph |
| Events | Simulated — can be replaced with on-chain subgraph |

---

## Links

- Website: https://concrete.xyz
- App: https://app.concrete.xyz
- Docs: https://docs.concrete.xyz
- Twitter: https://x.com/ConcreteXYZ
- Points: https://points.concrete.xyz

---

*This is a community-built tool, not an official Concrete product. Data may not reflect real-time vault performance.*
