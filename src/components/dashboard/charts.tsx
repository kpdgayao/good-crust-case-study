"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import {
  getChannelSummaries,
  getSkuSummaries,
  getLocationSummaries,
  fulfillment,
} from "@/data";

const COLORS = {
  accent: "#4F8CFF",
  green: "#34D399",
  amber: "#FBBF24",
  red: "#F87171",
  purple: "#A78BFA",
  cyan: "#22D3EE",
  orange: "#FB923C",
};

const tooltipStyle = {
  contentStyle: {
    background: "#1A1D27",
    border: "1px solid #2E3340",
    borderRadius: "6px",
    fontSize: "11px",
    fontFamily: "JetBrains Mono, monospace",
  },
  labelStyle: { color: "#9499AD" },
};

export function ChannelFillRateChart() {
  const data = getChannelSummaries();

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold mb-4">Fill Rate by Channel</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical">
          <XAxis
            type="number"
            domain={[(dataMin: number) => Math.floor(Math.min(dataMin, 90) - 2), 100]}
            tick={{ fill: "#6B7089", fontSize: 10 }}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="channel"
            width={130}
            tick={{ fill: "#9499AD", fontSize: 11 }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [`${value}%`, "Fill Rate"]}
          />
          <Bar dataKey="fillRate" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.fillRate < 95 ? COLORS.red : COLORS.green}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SkuShortfallChart() {
  const data = getSkuSummaries()
    .filter((s) => s.shortfall > 0)
    .sort((a, b) => b.shortfall - a.shortfall);

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold mb-4">Shortfall by SKU</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical">
          <XAxis
            type="number"
            tick={{ fill: "#6B7089", fontSize: 10 }}
          />
          <YAxis
            type="category"
            dataKey="sku"
            width={120}
            tick={{ fill: "#9499AD", fontSize: 10 }}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [value, "Units Short"]}
          />
          <Bar dataKey="shortfall" fill={COLORS.red} radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.sku === "PZ-PEPPERON" ? COLORS.red : COLORS.amber
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function SyncStatusChart() {
  const synced = fulfillment.filter(
    (f) => f.erp_sync_status === "Synced"
  ).length;
  const pending = fulfillment.length - synced;

  const data = [
    { name: "Synced", value: synced },
    { name: "Pending", value: pending },
  ];

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold mb-4">ERP Sync Status</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={COLORS.green} />
            <Cell fill={COLORS.amber} />
          </Pie>
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [value, "Lines"]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: "#9499AD", fontSize: 11 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function LocationSyncChart() {
  const data = getLocationSummaries();

  return (
    <Card className="p-5">
      <h3 className="text-sm font-semibold mb-4">Sync Rate by Location</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis
            dataKey="location"
            tick={{ fill: "#6B7089", fontSize: 9 }}
            angle={-15}
            textAnchor="end"
            height={50}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "#6B7089", fontSize: 10 }}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number) => [`${value}%`, "Sync Rate"]}
          />
          <Bar dataKey="syncRate" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.provider === "JackRabbit"
                    ? COLORS.cyan
                    : COLORS.purple
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
