import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Finding {
  num: number;
  numColor: string;
  title: string;
  severity: string;
  severityVariant: "red" | "amber" | "accent" | "purple";
  description: React.ReactNode;
  fix: string;
}

const findings: Finding[] = [
  {
    num: 1,
    numColor: "bg-gc-red-dim text-gc-red",
    title: 'SKU Typo: PZ-PEPPERON vs PZ-PEPPERONI',
    severity: "CRITICAL · OPERATIONAL",
    severityVariant: "red",
    description: (
      <>
        4 order lines use the misspelled SKU{" "}
        <code className="bg-surface-2 px-1.5 py-0.5 rounded text-[11px] font-mono">
          PZ-PEPPERON
        </code>{" "}
        instead of{" "}
        <code className="bg-surface-2 px-1.5 py-0.5 rounded text-[11px] font-mono">
          PZ-PEPPERONI
        </code>
        . All 4 have a <strong className="text-gc-red">0% fill rate</strong> (66
        units completely unfulfilled) because the 3PL cannot match the misspelled
        SKU to inventory. This single typo accounts for{" "}
        <strong className="text-gc-red">22% of all shortfall</strong> (66 of 300
        units).
      </>
    ),
    fix: "Implement SKU validation in DOSS at order entry. Add a master SKU lookup that rejects or flags unrecognized codes before orders are routed to 3PLs.",
  },
  {
    num: 2,
    numColor: "bg-gc-amber-dim text-gc-amber",
    title: '30% of Fulfillment Lines Stuck in "Pending" Sync',
    severity: "HIGH · TECHNICAL",
    severityVariant: "amber",
    description: (
      <>
        235 of 778 fulfillment lines (30.2%) have{" "}
        <code className="bg-surface-2 px-1.5 py-0.5 rounded text-[11px] font-mono">
          erp_sync_status = Pending
        </code>
        . All 235 are missing carrier, tracking number, and ship date — meaning
        these shipments may have occurred but DOSS doesn&apos;t know about them. This
        is distributed evenly across all 4 locations, suggesting a systemic
        integration issue.
      </>
    ),
    fix: "Investigate 3PL webhook/SFTP reliability. Implement a daily reconciliation job in DOSS that queries 3PL APIs for unsynced fulfillments. Add monitoring alerts when sync backlog exceeds threshold.",
  },
  {
    num: 3,
    numColor: "bg-accent-glow text-accent",
    title: "DTC-Shopify Has Worst Fill Rate (92.9%)",
    severity: "MEDIUM · OPERATIONAL",
    severityVariant: "amber",
    description: (
      <>
        DTC has the highest shortfall (130 units) and lowest fill rate across
        channels. This is the most customer-visible issue. 66 of the 130
        shortfall is from the SKU typo (Finding #1), but the remaining 64 units
        suggest partial fulfillment issues at the 3PL level.
      </>
    ),
    fix: "After resolving the SKU typo, monitor DTC fill rate separately. Consider allocating safety stock specifically for DTC to avoid cross-channel stockouts.",
  },
  {
    num: 4,
    numColor: "bg-gc-purple-dim text-gc-purple",
    title: "Naming Inconsistency Across 3PLs",
    severity: "LOW · TECHNICAL",
    severityVariant: "purple",
    description: (
      <>
        JackRabbit locations use hyphens (
        <code className="bg-surface-2 px-1.5 py-0.5 rounded text-[11px] font-mono">
          3PL-JackRabbit-East
        </code>
        ) while Kratos uses underscores (
        <code className="bg-surface-2 px-1.5 py-0.5 rounded text-[11px] font-mono">
          3PL_Kratos_East
        </code>
        ). This suggests different integration methods or manual entry — a
        potential source of data quality issues downstream.
      </>
    ),
    fix: "Standardize location naming in DOSS master data. Apply transformation rules at the integration layer to normalize incoming 3PL data.",
  },
];

export function FindingsCards() {
  return (
    <div className="space-y-3.5">
      {findings.map((f) => (
        <Card key={f.num} className="p-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold font-mono shrink-0 ${f.numColor}`}
            >
              {f.num}
            </span>
            <span className="flex-1">{f.title}</span>
            <Badge variant={f.severityVariant}>{f.severity}</Badge>
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            {f.description}
          </p>
          <p className="text-xs mt-2">
            <strong className="text-gc-green">Fix:</strong>{" "}
            <span className="text-text-muted">{f.fix}</span>
          </p>
        </Card>
      ))}
    </div>
  );
}
