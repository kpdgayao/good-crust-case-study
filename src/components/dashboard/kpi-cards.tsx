"use client";

import { KpiCard } from "@/components/ui/card";
import { getOverallMetrics } from "@/data";
import { fmt } from "@/lib/utils";

export function DashboardKpis() {
  const m = getOverallMetrics();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
      <KpiCard
        value={`${m.fillRate}%`}
        label="Overall Fill Rate"
        sub={`${fmt(m.totalFulfilled)} of ${fmt(m.totalOrdered)} units`}
        color="text-accent"
      />
      <KpiCard
        value={m.underFulfilledLines.toString()}
        label="Under-Fulfilled Lines"
        sub={`of ${m.totalLines} total`}
        color="text-gc-red"
      />
      <KpiCard
        value={fmt(m.totalShortfall)}
        label="Units Short"
        sub="across all channels"
        color="text-gc-amber"
      />
      <KpiCard
        value={m.pendingSync.toString()}
        label="Pending ERP Sync"
        sub={`${m.pendingSyncPct}% of ${m.totalFulfillmentLines} lines`}
        color="text-gc-amber"
      />
      <KpiCard
        value={m.missingOrders.toString()}
        label="Zero-Fill Orders"
        sub={m.missingOrderIds.slice(0, 3).join(", ")}
        color="text-gc-red"
      />
    </div>
  );
}
