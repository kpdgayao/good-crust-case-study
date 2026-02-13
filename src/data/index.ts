import rawOrders from "./orders.json";
import rawFulfillment from "./fulfillment.json";
import type {
  OrderLine,
  FulfillmentLine,
  ReconciliationRow,
  ChannelSummary,
  SkuSummary,
  LocationSummary,
} from "./types";
import { pct, daysBetween } from "@/lib/utils";

export const orders: OrderLine[] = rawOrders;
export const fulfillment: FulfillmentLine[] = rawFulfillment;

// Extract order_id from fulfillment_order_id: "F-1000-PZ-GLUTENFREE-0" -> "GC-1000"
function extractOrderId(fulId: string): string {
  const match = fulId.match(/^F-(\d+)-/);
  return match ? `GC-${match[1]}` : fulId;
}

// Extract SKU from fulfillment_order_id: "F-1000-PZ-GLUTENFREE-0" -> "PZ-GLUTENFREE"
function extractSku(fulId: string): string {
  const match = fulId.match(/^F-\d+-(.*)-\d+$/);
  return match ? match[1] : "";
}

// Build reconciliation: match order lines to fulfillment lines
export function getReconciliation(filters?: {
  channel?: string;
  sku?: string;
  location?: string;
}): ReconciliationRow[] {
  // Group fulfillment by order_id + sku
  const fulMap = new Map<string, number>();
  for (const f of fulfillment) {
    if (filters?.location && f.fulfillment_location !== filters.location)
      continue;
    const orderId = extractOrderId(f.fulfillment_order_id);
    const sku = extractSku(f.fulfillment_order_id);
    const key = `${orderId}|${sku}`;
    fulMap.set(key, (fulMap.get(key) || 0) + f.fulfilled_quantity);
  }

  const rows: ReconciliationRow[] = [];
  for (const o of orders) {
    if (filters?.channel && o.channel !== filters.channel) continue;
    if (filters?.sku && o.sku !== filters.sku) continue;

    const key = `${o.order_id}|${o.sku}`;
    const fulfilled = fulMap.get(key) || 0;
    const shortfall = Math.max(0, o.order_quantity - fulfilled);
    rows.push({
      order_id: o.order_id,
      order_date: o.order_date,
      channel: o.channel,
      sku: o.sku,
      ordered: o.order_quantity,
      fulfilled,
      shortfall,
      fillRate: pct(fulfilled, o.order_quantity),
    });
  }
  return rows;
}

export function getChannelSummaries(filters?: {
  sku?: string;
  location?: string;
}): ChannelSummary[] {
  const recon = getReconciliation(filters);
  const map = new Map<
    string,
    { lines: number; ordered: number; fulfilled: number }
  >();

  for (const r of recon) {
    const cur = map.get(r.channel) || { lines: 0, ordered: 0, fulfilled: 0 };
    cur.lines++;
    cur.ordered += r.ordered;
    cur.fulfilled += r.fulfilled;
    map.set(r.channel, cur);
  }

  return Array.from(map.entries())
    .map(([channel, d]) => ({
      channel,
      orderLines: d.lines,
      ordered: d.ordered,
      fulfilled: d.fulfilled,
      shortfall: d.ordered - d.fulfilled,
      fillRate: pct(d.fulfilled, d.ordered),
    }))
    .sort((a, b) => a.fillRate - b.fillRate);
}

export function getSkuSummaries(filters?: {
  channel?: string;
  location?: string;
}): SkuSummary[] {
  const recon = getReconciliation(filters);
  const map = new Map<
    string,
    { lines: number; ordered: number; fulfilled: number }
  >();

  for (const r of recon) {
    const cur = map.get(r.sku) || { lines: 0, ordered: 0, fulfilled: 0 };
    cur.lines++;
    cur.ordered += r.ordered;
    cur.fulfilled += r.fulfilled;
    map.set(r.sku, cur);
  }

  return Array.from(map.entries())
    .map(([sku, d]) => ({
      sku,
      lines: d.lines,
      ordered: d.ordered,
      fulfilled: d.fulfilled,
      shortfall: d.ordered - d.fulfilled,
      fillRate: pct(d.fulfilled, d.ordered),
    }))
    .sort((a, b) => a.fillRate - b.fillRate);
}

export function getLocationSummaries(): LocationSummary[] {
  const map = new Map<
    string,
    { lines: number; synced: number; pending: number; lags: number[] }
  >();

  for (const f of fulfillment) {
    const loc = f.fulfillment_location;
    const cur = map.get(loc) || { lines: 0, synced: 0, pending: 0, lags: [] };
    cur.lines++;
    if (f.erp_sync_status === "Synced") cur.synced++;
    else cur.pending++;

    const lag = daysBetween(f.order_date, f.ship_date);
    if (lag !== null) cur.lags.push(lag);
    map.set(loc, cur);
  }

  return Array.from(map.entries())
    .map(([location, d]) => {
      const sorted = d.lags.slice().sort((a, b) => a - b);
      const provider = location.includes("JackRabbit")
        ? "JackRabbit"
        : "Kratos";
      return {
        location,
        provider,
        lines: d.lines,
        synced: d.synced,
        pending: d.pending,
        syncRate: pct(d.synced, d.lines),
        avgLag:
          sorted.length > 0
            ? Math.round((sorted.reduce((a, b) => a + b, 0) / sorted.length) * 10) / 10
            : null,
        medianLag:
          sorted.length > 0
            ? sorted[Math.floor(sorted.length / 2)]
            : null,
        maxLag: sorted.length > 0 ? sorted[sorted.length - 1] : null,
      };
    })
    .sort((a, b) => a.location.localeCompare(b.location));
}

export function getOverallMetrics(filters?: {
  channel?: string;
  sku?: string;
  location?: string;
}) {
  const recon = getReconciliation(filters);
  const totalOrdered = recon.reduce((s, r) => s + r.ordered, 0);
  const totalFulfilled = recon.reduce((s, r) => s + r.fulfilled, 0);
  const underFulfilledLines = recon.filter((r) => r.shortfall > 0).length;
  const totalShortfall = totalOrdered - totalFulfilled;
  const missingOrders = recon.filter(
    (r) => r.fulfilled === 0 && r.ordered > 0
  );

  // Sync stats from fulfillment data
  let fulLines = fulfillment;
  if (filters?.location) {
    fulLines = fulLines.filter(
      (f) => f.fulfillment_location === filters.location
    );
  }
  const pendingSync = fulLines.filter(
    (f) => f.erp_sync_status === "Pending"
  ).length;

  return {
    totalLines: recon.length,
    totalOrdered,
    totalFulfilled,
    fillRate: pct(totalFulfilled, totalOrdered),
    underFulfilledLines,
    totalShortfall,
    pendingSync,
    pendingSyncPct: pct(pendingSync, fulLines.length),
    totalFulfillmentLines: fulLines.length,
    missingOrders: missingOrders.length,
    missingOrderIds: missingOrders
      .filter((r) => !recon.some((r2) => r2.order_id === r.order_id && r2.fulfilled > 0))
      .map((r) => r.order_id)
      .filter((v, i, a) => a.indexOf(v) === i),
  };
}

export function getTopShortfalls(
  n: number = 10,
  filters?: { channel?: string; sku?: string }
): ReconciliationRow[] {
  return getReconciliation(filters)
    .filter((r) => r.shortfall > 0)
    .sort((a, b) => b.shortfall - a.shortfall)
    .slice(0, n);
}

export function getUniqueChannels(): string[] {
  return [...new Set(orders.map((o) => o.channel))].sort();
}

export function getUniqueSkus(): string[] {
  return [...new Set(orders.map((o) => o.sku))].sort();
}

export function getUniqueLocations(): string[] {
  return [...new Set(fulfillment.map((f) => f.fulfillment_location))].sort();
}
