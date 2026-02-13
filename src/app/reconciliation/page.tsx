"use client";

import { useState } from "react";
import { SectionHead, Subsection, Callout } from "@/components/ui/section";
import { KpiCard } from "@/components/ui/card";
import { SelectFilter } from "@/components/ui/select-filter";
import { FindingsCards } from "@/components/reconciliation/findings";
import {
  ChannelTable,
  SkuTable,
  ShortfallTable,
} from "@/components/reconciliation/tables";
import {
  getOverallMetrics,
  getChannelSummaries,
  getSkuSummaries,
  getTopShortfalls,
  getUniqueChannels,
  getUniqueSkus,
} from "@/data";
import { fmt } from "@/lib/utils";

export default function ReconciliationPage() {
  const [channel, setChannel] = useState("");
  const [sku, setSku] = useState("");

  const filters = {
    channel: channel || undefined,
    sku: sku || undefined,
  };

  const m = getOverallMetrics(filters);
  const channelData = getChannelSummaries(filters);
  const skuData = getSkuSummaries(filters);
  const shortfalls = getTopShortfalls(10, filters);

  return (
    <>
      <SectionHead
        title="Order-to-Fulfillment Reconciliation"
        description="Analysis of discrepancies between Order Master (606 lines) and Fulfillment Lines (778 lines). Data period: Jan 1 – Mar 1, 2025."
      />

      {/* Filters */}
      <div className="flex gap-4 mb-5 p-3 bg-surface rounded-gc border border-border flex-wrap">
        <SelectFilter
          label="Channel"
          value={channel}
          onChange={setChannel}
          options={getUniqueChannels()}
        />
        <SelectFilter
          label="SKU"
          value={sku}
          onChange={setSku}
          options={getUniqueSkus()}
        />
        {(channel || sku) && (
          <button
            onClick={() => {
              setChannel("");
              setSku("");
            }}
            className="text-xs font-mono text-accent hover:text-accent/80 px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        <KpiCard
          value={`${m.fillRate}%`}
          label="Overall Fill Rate"
          sub={`${fmt(m.totalFulfilled)} of ${fmt(m.totalOrdered)} units`}
          color="text-accent"
        />
        <KpiCard
          value={m.underFulfilledLines.toString()}
          label="Under-Fulfilled Lines"
          sub={`of ${m.totalLines} total (${m.totalLines > 0 ? ((m.underFulfilledLines / m.totalLines) * 100).toFixed(1) : 0}%)`}
          color="text-gc-red"
        />
        <KpiCard
          value={fmt(m.totalShortfall)}
          label="Units Short"
          sub="across selected filters"
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

      {/* Root Cause Findings */}
      {!channel && !sku && (
        <>
          <Subsection>Root Cause Analysis</Subsection>
          <FindingsCards />
        </>
      )}

      {/* Tables */}
      <Subsection>Fill Rate by Channel</Subsection>
      <ChannelTable data={channelData} />

      <Subsection>Fill Rate by SKU</Subsection>
      <SkuTable data={skuData} />

      <Subsection>Top Shortfall Order Lines</Subsection>
      <ShortfallTable data={shortfalls} />

      <Callout variant="red">
        <strong className="text-gc-red">Key Insight:</strong> The top 5
        shortfalls are all PZ-PEPPERON (typo) on DTC-Shopify. The root cause is{" "}
        <strong>operational</strong> (data quality at order entry), not a 3PL or
        inventory problem. Fixing the SKU validation would eliminate 22% of all
        shortfall immediately.
      </Callout>
    </>
  );
}
