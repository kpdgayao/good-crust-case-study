import { Badge } from "@/components/ui/badge";

function FlowNode({
  variant,
  children,
}: {
  variant: "api" | "edi" | "manual" | "internal" | "money";
  children: React.ReactNode;
}) {
  const border = {
    api: "border-l-gc-green",
    edi: "border-l-gc-purple",
    manual: "border-l-gc-amber",
    internal: "border-l-accent",
    money: "border-l-gc-orange",
  }[variant];

  return (
    <div
      className={`bg-surface-2 border border-border-accent rounded-gc-sm p-2.5 text-[13px] leading-snug border-l-[3px] ${border}`}
    >
      {children}
    </div>
  );
}

function FlowTag({ variant, children }: { variant: string; children: React.ReactNode }) {
  const variantMap: Record<string, "green" | "purple" | "amber" | "accent" | "orange"> = {
    api: "green",
    edi: "purple",
    manual: "amber",
    internal: "accent",
    money: "orange",
  };
  return (
    <Badge variant={variantMap[variant] || "accent"} className="mt-1 text-[11px]">
      {children}
    </Badge>
  );
}

export function ProcessFlowGrid() {
  return (
    <div className="overflow-x-auto pb-5">
      <div className="grid grid-cols-[160px_repeat(5,1fr)] min-w-[1100px]">
        {/* Headers */}
        <div className="p-3 text-center font-semibold text-xs border-b-2 border-border border-r-2 bg-surface text-text-muted uppercase tracking-wider">
          Lane
        </div>
        {["1. Order Capture", "2. Procurement", "3. Production", "4. Fulfillment", "5. Accounting"].map(
          (h) => (
            <div
              key={h}
              className="p-3 text-center font-semibold text-xs border-b-2 border-border border-r border-border bg-surface text-text-muted uppercase tracking-wider last:border-r-0"
            >
              {h}
            </div>
          )
        )}

        {/* Goods Lane */}
        <div className="flex items-center justify-center font-semibold text-sm p-4 border-r-2 border-border bg-gc-green/[0.03]">
          Goods
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-green/[0.03]">
          <FlowNode variant="internal">Customer places order (DTC or Wholesale PO)</FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-green/[0.03]">
          <FlowNode variant="internal">Raw materials shipped to co-packer per BOM</FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-green/[0.03]">
          <FlowNode variant="manual">
            Co-packer manufactures frozen pizzas per production order
            <FlowTag variant="manual">CO-PACKER</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-green/[0.03]">
          <FlowNode variant="api">
            Finished goods &rarr; 3PL warehouse (JackRabbit or Kratos)
          </FlowNode>
          <FlowNode variant="api">
            3PL picks, packs, ships to customer/retailer DC
            <FlowTag variant="api">3PL</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-b border-border flex flex-col gap-1.5 bg-gc-green/[0.03]">
          <FlowNode variant="internal">Goods received. Returns/credits if needed</FlowNode>
        </div>

        {/* Data Lane */}
        <div className="flex items-center justify-center font-semibold text-sm p-4 border-r-2 border-border bg-accent/[0.03]">
          Data
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-accent/[0.03]">
          <FlowNode variant="api">
            <strong>DTC:</strong> Shopify &rarr; DOSS
            <FlowTag variant="api">API &middot; Real-time</FlowTag>
          </FlowNode>
          <FlowNode variant="edi">
            <strong>Wholesale:</strong> Retailer &rarr; DOSS via SPS
            <FlowTag variant="edi">EDI 850 PO</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-accent/[0.03]">
          <FlowNode variant="internal">
            DOSS generates PO to co-packer (demand forecast + safety stock)
            <FlowTag variant="internal">DOSS ARP</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-accent/[0.03]">
          <FlowNode variant="manual">
            Production order &rarr; co-packer; confirmation back
            <FlowTag variant="manual">EMAIL / SHEET</FlowTag>
          </FlowNode>
          <FlowNode variant="internal">
            DOSS updates inventory on confirmation
            <FlowTag variant="internal">MANUAL ENTRY</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-accent/[0.03]">
          <FlowNode variant="api">
            DOSS &rarr; 3PL fulfillment order
            <FlowTag variant="api">API / SFTP</FlowTag>
          </FlowNode>
          <FlowNode variant="api">
            3PL &rarr; DOSS tracking + ship confirm
            <FlowTag variant="api">WEBHOOK</FlowTag>
          </FlowNode>
          <FlowNode variant="edi">
            Wholesale: ASN to retailer
            <FlowTag variant="edi">EDI 856 ASN</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-b border-border flex flex-col gap-1.5 bg-accent/[0.03]">
          <FlowNode variant="api">
            DOSS &rarr; QBO invoice on shipment
            <FlowTag variant="api">QBO API</FlowTag>
          </FlowNode>
          <FlowNode variant="edi">
            Wholesale: Invoice to retailer
            <FlowTag variant="edi">EDI 810 INV</FlowTag>
          </FlowNode>
        </div>

        {/* Money Lane */}
        <div className="flex items-center justify-center font-semibold text-sm p-4 border-r-2 border-border bg-gc-orange/[0.03]">
          Money
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-orange/[0.03]">
          <FlowNode variant="money">
            <strong>DTC:</strong> Paid at checkout
            <FlowTag variant="money">PREPAID</FlowTag>
          </FlowNode>
          <FlowNode variant="money">
            <strong>Wholesale:</strong> Payment on terms
            <FlowTag variant="money">NET 30/60</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-orange/[0.03]">
          <FlowNode variant="money">
            GoodCrust &rarr; co-packer per run
            <FlowTag variant="money">AP &middot; QBO</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-orange/[0.03]">
          <FlowNode variant="internal">
            <span className="opacity-40">&mdash; No direct flow &mdash;</span>
          </FlowNode>
        </div>
        <div className="p-2.5 border-r border-b border-border flex flex-col gap-1.5 bg-gc-orange/[0.03]">
          <FlowNode variant="money">
            GoodCrust &rarr; 3PL monthly fees
            <FlowTag variant="money">AP &middot; QBO</FlowTag>
          </FlowNode>
        </div>
        <div className="p-2.5 border-b border-border flex flex-col gap-1.5 bg-gc-orange/[0.03]">
          <FlowNode variant="money">
            <strong>DTC:</strong> Shopify payout &rarr; bank &rarr; QBO
          </FlowNode>
          <FlowNode variant="money">
            <strong>Wholesale:</strong> Remittance &rarr; AR
            <FlowTag variant="edi">EDI 820</FlowTag>
          </FlowNode>
          <FlowNode variant="api">
            COGS JE auto-posted
            <FlowTag variant="api">QBO API</FlowTag>
          </FlowNode>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 flex-wrap mt-4 p-3 bg-surface rounded-gc border border-border">
        {[
          { color: "bg-gc-green", label: "API (Real-time)" },
          { color: "bg-gc-purple", label: "EDI (SPS Commerce)" },
          { color: "bg-gc-amber", label: "Manual / Email" },
          { color: "bg-accent", label: "Internal (DOSS)" },
          { color: "bg-gc-orange", label: "Money Flow" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-[13px] text-text-muted">
            <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CoPackerOptions() {
  const phases = [
    {
      phase: "PHASE 1 · NOW",
      badge: "green",
      title: "Structured Email Templates",
      desc: "Standardize production order emails with fixed fields. Ops team manually enters completion data into DOSS.",
      pros: ["Zero cost", "No change for co-packer"],
      cons: ["Manual lag 1-3 days"],
    },
    {
      phase: "PHASE 2 · 1-2 MO",
      badge: "amber",
      title: "Shared Google Sheet",
      desc: "DOSS auto-populates a Sheet with production orders. Co-packer updates status columns. DOSS watches via Sheets API.",
      pros: ["Familiar UX", "Near real-time"],
      cons: ["Limited validation"],
    },
    {
      phase: "PHASE 3 · 3-6 MO",
      badge: "purple",
      title: "Supplier Portal",
      desc: "Simple web form where co-packer views orders, confirms qty, uploads lot/batch info. Data flows directly to DOSS API.",
      pros: ["Structured data", "Lot traceability"],
      cons: ["Training needed"],
    },
    {
      phase: "PHASE 4 · FUTURE",
      badge: "cyan",
      title: "EDI / Full Integration",
      desc: "If co-packer upgrades systems, establish EDI 850/855/856 or direct API. Full automation from PO to receipt.",
      pros: ["Fully automated", "Real-time"],
      cons: ["Depends on co-packer"],
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
      {phases.map((p) => (
        <div
          key={p.title}
          className="bg-surface border border-border rounded-gc p-4 relative"
        >
          <Badge
            variant={p.badge}
            className="absolute top-3 right-3 text-[11px]"
          >
            {p.phase}
          </Badge>
          <h3 className="text-sm font-semibold mb-1.5 pr-20">{p.title}</h3>
          <p className="text-[13px] text-text-muted leading-relaxed">{p.desc}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {p.pros.map((t) => (
              <span key={t} className="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-gc-green-dim text-gc-green">
                + {t}
              </span>
            ))}
            {p.cons.map((t) => (
              <span key={t} className="inline-block px-1.5 py-0.5 rounded text-xs font-mono bg-gc-red-dim text-gc-red">
                - {t}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
