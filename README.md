# GATHER

AI-powered food-ops engine that helps restaurants **reduce waste, save money, and rescue surplus** through 4 independent agents built with **CrewAI** and a **Next.js** dashboard.

## The Problem

Restaurants lose 8–10% of revenue to food waste — from over-ordering, poor forecasting, and surplus that never gets rescued. Food waste also accounts for ~8–10% of global greenhouse gas emissions.

## The 4 Agents

Each agent runs **independently** — no fixed pipeline. Triggered manually or on schedule.

| Agent | Trigger | What it does |
|-------|---------|--------------|
| **1 — Procurement** | Manual or scheduled (daily / 2 days / weekly) | Reads POS + weather + inventory → insight + optimised order list |
| **2 — Purchasing** | After procurement approval | Prices basket across 3 Finnish suppliers → per-item best price → grouped order confirmation |
| **3 — Waste Analyst** | Auto at configured time (e.g. 17:00 + 19:45) | **Phase 1:** Waste report + surplus snapshot + recommendations. **Phase 2:** Post-pickup reconciliation → feedback to Agent 1 |
| **4 — Surplus Deflection** | After reviewing Phase 1 | Routes leftovers to ResQ Club / shelters, tracks pickups, records leftovers |

### Key design decisions

- **Multi-supplier sourcing** — Compares prices across Mäkinen Tukku, Tukku Vihannes, and Nordic Wholesale, grouping items by cheapest supplier
- **Two-phase waste report** — Phase 1 before pickups (triggers deflection), Phase 2 after pickups (feeds back to procurement)
- **Closed feedback loop** — Agent 3 Phase 2 output adjusts Agent 1's next-day orders
- **Human-in-the-loop** — Owner approves order lists and tracks pickups manually

## Dashboard Pages

| Page | Description |
|------|-------------|
| **Dashboard** (`/`) | Waste report metrics (money saved, waste per capita, deflection potential, daily average), breakdown by food type and waste type, eaten/wasted ratio gauge, AI recommendations, food distribution status table |
| **Procurements** (`/procurements`) | Multi-step flow: forecast demand → AI insight + order list → adjust with AI chat → supplier price comparison across 3 suppliers → confirm order grouped by supplier |
| **Distribute food** (`/distribute`) | Today's surplus table → select items to give away → track pickups with +/- controls → view final leftovers |
| **Configure** (`/configure`) | Restaurant settings, scheduling, supplier configuration, notification preferences |

## Measuring Impact

### Operational metrics
- **Order accuracy rate** — % of ordered items actually used (not wasted)
- **Procurement savings (€)** — Cheapest supplier vs. average (mock: €31.40/order)
- **Staff time** — ~12 seconds per full approval cycle

### Waste reduction metrics
- **Total waste (kg/week)** — Primary KPI, tracked week-over-week
- **Waste per cover** — Normalized against customer count
- **Deflection rate (%)** — `rescued_kg / surplus_kg` (mock: 77.8%)
- **Meals rescued** — Shelter donations + ResQ portions

### Sustainability (ESG)
- **Environmental** — ~2.5 kg CO2e avoided per kg of food waste prevented. Reduced over-ordering means less transport and packaging.
- **Social** — Surplus routed to shelters addresses food insecurity. ResQ listings make quality food accessible at 50% off.
- **Economic** — Combines procurement savings + waste reduction + recovered revenue. Estimated €1,000–2,500/month for a small bistro.

## Tech Stack

- **Backend:** Python, CrewAI, FastAPI
- **Frontend:** Next.js 14, React, TypeScript
- **Fonts:** Inter (app), Newsreader (landing)
- **Data:** JSON mock files (POS sales, inventory, suppliers, weather, config)

## Quick Start

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # add your API key
python main.py         # http://localhost:8000

# Frontend (from project root)
npm install
npm run dev            # http://localhost:3000
```

The frontend works in **demo mode** with hardcoded mock data even without the backend running.

## Project Structure

```
backend/
  agents/           # 4 CrewAI agent definitions
  tasks/            # Task specs with expected JSON outputs
  tools/            # Data access tools (@tool decorated)
  data/             # Mock JSON data (POS, inventory, suppliers, config)
  crew.py           # Standalone crew builders
  main.py           # FastAPI server with per-agent endpoints

app/
  page.tsx          # Dashboard (home page)
  dashboard/        # Dashboard page component
  procurements/     # Multi-step procurement flow
  distribute/       # Surplus distribution + pickup tracking
  configure/        # Settings page
  api/agents/       # Next.js proxy to Python backend
  planner/          # Legacy agent demo (tab-based)

components/
  Sidebar.tsx       # App sidebar navigation
  AppShell.tsx      # Layout wrapper (sidebar + header)
  Nav.tsx           # Landing page nav (unused in app)
```

## Hackathon Demo

The app auto-deploys on Vercel. No backend needed — demo mode uses realistic mock data.

1. Open the app → lands on the **Dashboard** with waste metrics
2. Navigate to **Procurements** → forecast demand → review AI insight + order list → compare suppliers → confirm order
3. Navigate to **Distribute food** → review surplus → give away → track pickups → see leftovers
4. All metrics on the Dashboard reflect the closed loop: order right → buy cheapest → analyse waste → rescue surplus → feed back
