"use client";

import { Card } from "@/components/ui/card";
import { Badge, FillRateBadge } from "@/components/ui/badge";
import { DataTable, Th, Td } from "@/components/ui/data-table";
import { getLocationSummaries } from "@/data";
import type { LocationSummary } from "@/data/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const tooltipStyle = {
  contentStyle: {
    background: "#1A1D27",
    border: "1px solid #2E3340",
    borderRadius: "6px",
    fontSize: "13px",
    fontFamily: "JetBrains Mono, monospace",
  },
  labelStyle: { color: "#9499AD" },
};

function MetricDefinitionCard({
  num,
  title,
  desc,
  formula,
  benchmark,
}: {
  num: number;
  title: string;
  desc: string;
  formula: string;
  benchmark: string;
}) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-bold mb-1">
        {num}. {title}
      </h3>
      <p className="text-sm text-text-muted mb-3">{desc}</p>
      <div className="font-mono text-[13px] bg-surface-2 px-3 py-2 rounded-gc-sm text-gc-cyan mb-2.5">
        {formula}
      </div>
      <div className="text-[13px] text-text-dim">{benchmark}</div>
    </Card>
  );
}

function ProviderSummary(locations: LocationSummary[]) {
  const lines = locations.reduce((s, l) => s + l.lines, 0);
  const synced = locations.reduce((s, l) => s + l.synced, 0);
  const pending = locations.reduce((s, l) => s + l.pending, 0);
  const lags = locations.filter((l) => l.avgLag !== null).map((l) => l.avgLag!);
  return {
    lines,
    synced,
    pending,
    syncRate: lines > 0 ? Math.round((synced / lines) * 1000) / 10 : 0,
    avgLag:
      lags.length > 0
        ? Math.round((lags.reduce((a, b) => a + b, 0) / lags.length) * 10) / 10
        : null,
  };
}

export function TplMetricsView() {
  const locations = getLocationSummaries();
  const jackRabbit = locations.filter((l) => l.provider === "JackRabbit");
  const kratos = locations.filter((l) => l.provider === "Kratos");
  const jrSummary = ProviderSummary(jackRabbit);
  const krSummary = ProviderSummary(kratos);

  return (
    <div className="space-y-6">
      {/* KPI Definitions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <MetricDefinitionCard
          num={1}
          title="Order Fill Rate (%)"
          desc="Percentage of ordered units successfully fulfilled. The single most important metric for customer satisfaction."
          formula="Fill Rate = (Fulfilled Qty / Ordered Qty) x 100"
          benchmark="Industry benchmark: 95-98% for frozen CPG. Below 95% triggers retailer chargebacks."
        />
        <MetricDefinitionCard
          num={2}
          title="ERP Sync Reliability (%)"
          desc="Percentage of fulfillment lines that successfully sync back to DOSS. Pending lines mean GoodCrust has no visibility into shipment status."
          formula="Sync Rate = (Synced Lines / Total Lines) x 100"
          benchmark="Target: >95%. Current average is ~70% — unacceptable for real-time inventory management."
        />
        <MetricDefinitionCard
          num={3}
          title="Average Ship Lag (Days)"
          desc="Days between order date and ship date. Critical for DTC (customer expects 2-3 days) and wholesale (retailer compliance windows)."
          formula="Ship Lag = Ship Date - Order Date"
          benchmark="Target: ≤2 days for DTC, ≤3 days for wholesale. Current avg: 3.5-3.7 days."
        />
        <MetricDefinitionCard
          num={4}
          title="Split Shipment Rate (%)"
          desc="Percentage of orders requiring multiple shipments. Each split increases shipping cost and customer confusion."
          formula="Split Rate = (Orders w/ 2+ shipments / Total Orders) x 100"
          benchmark="Target: <20%. Current: 84% of orders have 2+ fulfillment lines — needs investigation."
        />
      </div>

      {/* Comparison Table */}
      <div>
        <h2 className="text-lg font-semibold font-display mb-3">
          3PL Comparison: JackRabbit vs Kratos
        </h2>
        <DataTable>
          <thead>
            <tr>
              <Th>Location</Th>
              <Th align="right">Lines</Th>
              <Th align="right">Synced</Th>
              <Th align="right">Pending</Th>
              <Th align="right">Sync Rate</Th>
              <Th align="right">Avg Lag</Th>
              <Th align="right">Median Lag</Th>
              <Th align="right">Max Lag</Th>
            </tr>
          </thead>
          <tbody>
            {jackRabbit.map((l) => (
              <tr key={l.location} className="hover:bg-accent/[0.04]">
                <Td>{l.location}</Td>
                <Td align="right">{l.lines}</Td>
                <Td align="right">{l.synced}</Td>
                <Td align="right">{l.pending}</Td>
                <Td align="right">{l.syncRate}%</Td>
                <Td align="right">{l.avgLag}d</Td>
                <Td align="right">{l.medianLag}d</Td>
                <Td align="right">{l.maxLag}d</Td>
              </tr>
            ))}
            <tr className="font-semibold bg-surface-2">
              <Td>JackRabbit (Combined)</Td>
              <Td align="right">{jrSummary.lines}</Td>
              <Td align="right">{jrSummary.synced}</Td>
              <Td align="right">{jrSummary.pending}</Td>
              <Td align="right">
                <FillRateBadge rate={jrSummary.syncRate} />
              </Td>
              <Td align="right">{jrSummary.avgLag}d</Td>
              <Td align="right">-</Td>
              <Td align="right">-</Td>
            </tr>
            <tr>
              <Td colSpan={8} className="py-1" />
            </tr>
            {kratos.map((l) => (
              <tr key={l.location} className="hover:bg-accent/[0.04]">
                <Td>{l.location}</Td>
                <Td align="right">{l.lines}</Td>
                <Td align="right">{l.synced}</Td>
                <Td align="right">{l.pending}</Td>
                <Td align="right">{l.syncRate}%</Td>
                <Td align="right">{l.avgLag}d</Td>
                <Td align="right">{l.medianLag}d</Td>
                <Td align="right">{l.maxLag}d</Td>
              </tr>
            ))}
            <tr className="font-semibold bg-surface-2">
              <Td>Kratos (Combined)</Td>
              <Td align="right">{krSummary.lines}</Td>
              <Td align="right">{krSummary.synced}</Td>
              <Td align="right">{krSummary.pending}</Td>
              <Td align="right">
                <FillRateBadge rate={krSummary.syncRate} />
              </Td>
              <Td align="right">{krSummary.avgLag}d</Td>
              <Td align="right">-</Td>
              <Td align="right">-</Td>
            </tr>
          </tbody>
        </DataTable>
      </div>

      {/* Sync Rate Chart */}
      <Card className="p-5">
        <h3 className="text-base font-semibold mb-4">
          Sync Rate by Location
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={locations}>
            <XAxis
              dataKey="location"
              tick={{ fill: "#6B7089", fontSize: 11 }}
              angle={-15}
              textAnchor="end"
              height={55}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#6B7089", fontSize: 12 }}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip
              {...tooltipStyle}
              formatter={(value: number) => [`${value}%`, "Sync Rate"]}
            />
            <Bar dataKey="syncRate" radius={[4, 4, 0, 0]}>
              {locations.map((l, i) => (
                <Cell
                  key={i}
                  fill={l.provider === "JackRabbit" ? "#22D3EE" : "#A78BFA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recommendation */}
      <Card className="p-5">
        <h3 className="text-base font-semibold mb-2 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-bold font-mono bg-accent-glow text-accent">
            &rarr;
          </span>
          Both 3PLs Perform Similarly — Focus on Integration Quality First
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          JackRabbit and Kratos show nearly identical performance across all 4
          metrics. The differences are marginal: JackRabbit has a slightly better
          sync rate ({jrSummary.syncRate}% vs {krSummary.syncRate}%) and ship lag
          ({jrSummary.avgLag}d vs {krSummary.avgLag}d), but neither meets
          acceptable thresholds.
        </p>
        <div className="text-sm text-text-muted mt-3 space-y-1">
          <p>
            <strong className="text-gc-cyan">1.</strong> Resolve the 30% pending
            sync issue — this may be a DOSS integration bug, not a 3PL fault.
          </p>
          <p>
            <strong className="text-gc-cyan">2.</strong> Request historical data
            directly from each 3PL&apos;s WMS to validate against DOSS records.
          </p>
          <p>
            <strong className="text-gc-cyan">3.</strong> After cleaning data:
            consolidate volume with the better performer, or negotiate on
            price/SLA terms.
          </p>
        </div>
      </Card>
    </div>
  );
}
