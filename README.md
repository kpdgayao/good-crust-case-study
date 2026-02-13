# GoodCrust Foods — DOSS ERP Dashboard

Interactive case study analyzing GoodCrust Foods' DOSS ERP implementation, order-to-fulfillment reconciliation, and 3PL performance evaluation.

Built with Next.js, Tailwind CSS, and Recharts. Deployed on Railway.

## Pages

| Page | Description |
|---|---|
| **Dashboard** | KPI cards and interactive charts — fill rate, shortfall by SKU, ERP sync status, location sync |
| **Process Flow** | End-to-end flow of Goods, Data, and Money across Procurement → Production → Fulfillment → Accounting |
| **Architecture** | Hub-and-spoke system integration diagram with DOSS as single source of truth |
| **Data Model** | 10 core entities with PK/FK relationships, color-coded by system of origin |
| **Reconciliation** | Interactive order-to-fulfillment analysis with channel/SKU filters, root cause findings |
| **3PL Metrics** | JackRabbit vs Kratos performance comparison across 4 KPIs |

## Key Findings

- **95.9%** overall fill rate (7,053 of 7,353 units)
- **SKU typo** (`PZ-PEPPERON`) accounts for 22% of all shortfall
- **30%** of fulfillment lines stuck in pending ERP sync
- Both 3PLs perform similarly (~70% sync rate, 3.5–3.7d avg ship lag)

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS (custom dark theme)
- **Charts**: Recharts
- **Data**: Excel files parsed at build time to static JSON
- **Deployment**: Railway (standalone output)

## Getting Started

```bash
npm install
npm run dev
```

The `dev` script automatically parses the Excel source data from `docs/` before starting the dev server.

## Data Pipeline

Source Excel files in `docs/` are parsed at build time:

```
docs/Order Master.xlsx      → src/data/orders.json      (606 order lines)
docs/Fulfillment Lines.xlsx → src/data/fulfillment.json  (778 fulfillment lines)
```

All metrics (fill rates, sync rates, shortfalls) are computed dynamically from the parsed data.

## Project Structure

```
├── docs/                    # Source Excel data files
├── scripts/parse-excel.mjs  # Build-time Excel → JSON parser
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components by feature
│   ├── data/                # Generated JSON + data access layer
│   └── lib/                 # Utilities
├── next.config.ts
├── tailwind.config.ts
└── package.json
```
