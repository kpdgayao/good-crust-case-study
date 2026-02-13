"use client";

import { DataTable, Th, Td } from "@/components/ui/data-table";
import { FillRateBadge } from "@/components/ui/badge";
import { fmt } from "@/lib/utils";
import type { ChannelSummary, SkuSummary, ReconciliationRow } from "@/data/types";

export function ChannelTable({ data }: { data: ChannelSummary[] }) {
  const total = data.reduce(
    (acc, d) => ({
      lines: acc.lines + d.orderLines,
      ordered: acc.ordered + d.ordered,
      fulfilled: acc.fulfilled + d.fulfilled,
      shortfall: acc.shortfall + d.shortfall,
    }),
    { lines: 0, ordered: 0, fulfilled: 0, shortfall: 0 }
  );
  const totalRate =
    total.ordered > 0
      ? Math.round((total.fulfilled / total.ordered) * 1000) / 10
      : 0;

  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Channel</Th>
          <Th align="right">Order Lines</Th>
          <Th align="right">Units Ordered</Th>
          <Th align="right">Units Fulfilled</Th>
          <Th align="right">Shortfall</Th>
          <Th align="right">Fill Rate</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.channel} className="hover:bg-accent/[0.04]">
            <Td>{d.channel}</Td>
            <Td align="right">{fmt(d.orderLines)}</Td>
            <Td align="right">{fmt(d.ordered)}</Td>
            <Td align="right">{fmt(d.fulfilled)}</Td>
            <Td align="right" className={d.shortfall > 60 ? "text-gc-red" : ""}>
              {fmt(d.shortfall)}
            </Td>
            <Td align="right">
              <FillRateBadge rate={d.fillRate} />
            </Td>
          </tr>
        ))}
        <tr className="font-bold bg-surface-2">
          <Td>TOTAL</Td>
          <Td align="right">{fmt(total.lines)}</Td>
          <Td align="right">{fmt(total.ordered)}</Td>
          <Td align="right">{fmt(total.fulfilled)}</Td>
          <Td align="right" className="text-gc-red">
            {fmt(total.shortfall)}
          </Td>
          <Td align="right">{totalRate}%</Td>
        </tr>
      </tbody>
    </DataTable>
  );
}

export function SkuTable({ data }: { data: SkuSummary[] }) {
  return (
    <DataTable>
      <thead>
        <tr>
          <Th>SKU</Th>
          <Th align="right">Lines</Th>
          <Th align="right">Ordered</Th>
          <Th align="right">Fulfilled</Th>
          <Th align="right">Shortfall</Th>
          <Th align="right">Fill Rate</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr
            key={d.sku}
            className={
              d.sku === "PZ-PEPPERON"
                ? "bg-gc-red/[0.06]"
                : "hover:bg-accent/[0.04]"
            }
          >
            <Td
              className={
                d.sku === "PZ-PEPPERON" ? "text-gc-red font-semibold" : ""
              }
            >
              {d.sku}
              {d.sku === "PZ-PEPPERON" && (
                <span className="ml-2 text-[11px] text-gc-red">TYPO</span>
              )}
            </Td>
            <Td align="right">{fmt(d.lines)}</Td>
            <Td align="right">{fmt(d.ordered)}</Td>
            <Td align="right">{fmt(d.fulfilled)}</Td>
            <Td
              align="right"
              className={d.shortfall > 50 ? "text-gc-red font-bold" : ""}
            >
              {fmt(d.shortfall)}
            </Td>
            <Td align="right">
              <FillRateBadge rate={d.fillRate} />
            </Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}

export function ShortfallTable({ data }: { data: ReconciliationRow[] }) {
  return (
    <DataTable>
      <thead>
        <tr>
          <Th>Order ID</Th>
          <Th>SKU</Th>
          <Th>Channel</Th>
          <Th align="right">Ordered</Th>
          <Th align="right">Fulfilled</Th>
          <Th align="right">Short</Th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, i) => (
          <tr
            key={`${d.order_id}-${d.sku}-${i}`}
            className={
              d.sku === "PZ-PEPPERON"
                ? "bg-gc-red/[0.06]"
                : "hover:bg-accent/[0.04]"
            }
          >
            <Td>{d.order_id}</Td>
            <Td className={d.sku === "PZ-PEPPERON" ? "text-gc-red" : ""}>
              {d.sku}
            </Td>
            <Td>{d.channel}</Td>
            <Td align="right">{fmt(d.ordered)}</Td>
            <Td align="right">{fmt(d.fulfilled)}</Td>
            <Td align="right" className="text-gc-red font-bold">
              {fmt(d.shortfall)}
            </Td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  );
}
