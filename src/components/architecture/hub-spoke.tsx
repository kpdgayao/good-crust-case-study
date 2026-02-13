import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function SpokeCard({
  icon,
  iconBg,
  title,
  type,
  rows,
}: {
  icon: string;
  iconBg: string;
  title: string;
  type: string;
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <Card className="p-4 hover:-translate-y-0.5 hover:border-border-accent hover:shadow-lg hover:shadow-black/30">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <div className="text-xs text-text-dim font-mono">{type}</div>
        </div>
      </div>
      <div className="space-y-0">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex justify-between py-1.5 border-b border-border last:border-b-0 text-[13px] text-text-muted"
          >
            <span className="text-text-dim">{r.label}</span>
            <span className="font-medium text-text font-mono text-xs">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DirBadge({ dir }: { dir: "in" | "out" | "bi" | "manual" }) {
  if (dir === "bi")
    return <Badge variant="cyan">&#8596; BI-DIR</Badge>;
  if (dir === "in")
    return <Badge variant="green">&#8592; IN</Badge>;
  if (dir === "out")
    return <Badge variant="purple">&#8594; OUT</Badge>;
  return <Badge variant="amber">&#9888; MANUAL</Badge>;
}

export function HubSpokeDiagram() {
  return (
    <div className="space-y-6">
      {/* Top spokes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <SpokeCard
          icon="&#128722;"
          iconBg="bg-gc-green-dim text-gc-green"
          title="Shopify (DTC)"
          type="E-Commerce"
          rows={[
            { label: "Method", value: <><DirBadge dir="bi" /> REST API</> },
            { label: "Frequency", value: "Real-time webhooks" },
            { label: "In", value: "Orders, customers, returns" },
            { label: "Out", value: "Inventory, catalog, tracking" },
            { label: "Connector", value: "DOSS native" },
          ]}
        />
        <SpokeCard
          icon="&#127970;"
          iconBg="bg-gc-purple-dim text-gc-purple"
          title="Wholesale (Target/UNFI/KeHE)"
          type="Retail Partners"
          rows={[
            { label: "Method", value: <><DirBadge dir="bi" /> EDI via SPS</> },
            { label: "Documents", value: "850, 855, 856, 810, 820" },
            { label: "In", value: "POs, PO changes, remittance" },
            { label: "Out", value: "PO ack, ASN, invoices" },
            { label: "Connector", value: "DOSS → SPS Commerce" },
          ]}
        />
        <SpokeCard
          icon="&#127981;"
          iconBg="bg-gc-amber-dim text-gc-amber"
          title="Co-Packer"
          type="Contract Manufacturer"
          rows={[
            { label: "Method", value: <DirBadge dir="manual" /> },
            { label: "Frequency", value: "Per run (1-3 day lag)" },
            { label: "Out", value: "Production orders, BOM" },
            { label: "In", value: "Completion qty, lot/batch" },
            {
              label: "Risk",
              value: (
                <span className="text-gc-amber">HIGH — see options</span>
              ),
            },
          ]}
        />
      </div>

      {/* Hub */}
      <div className="flex justify-center">
        <div className="bg-gradient-to-br from-accent/[0.12] to-gc-purple/[0.08] border-2 border-accent rounded-2xl px-10 py-6 text-center shadow-[0_0_40px_rgba(79,140,255,0.1)] relative">
          <Badge
            variant="accent"
            className="absolute -top-2.5 -right-2.5 text-[11px] rounded-full px-2"
          >
            SINGLE SOURCE OF TRUTH
          </Badge>
          <h2 className="font-display text-xl font-bold mb-1">
            DOSS Operations Cloud (ERP)
          </h2>
          <p className="text-text-muted text-sm mt-1.5">
            Unified Master Data &middot; ARP Workflows &middot; IDP Data Platform &middot; Real-time HTAB DB
          </p>
          <div className="flex gap-2 justify-center mt-3 flex-wrap">
            {["Orders", "Inventory", "Procurement", "Production", "Fulfillment", "Catalog"].map(
              (t) => (
                <Badge key={t} variant="accent" className="text-xs">
                  {t}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom spokes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <SpokeCard
          icon="&#128007;"
          iconBg="bg-gc-cyan-dim text-gc-cyan"
          title="3PL — JackRabbit"
          type="East + West"
          rows={[
            { label: "Method", value: <><DirBadge dir="bi" /> API/SFTP</> },
            { label: "Out", value: "Fulfillment orders (940)" },
            { label: "In", value: "Ship confirm + tracking (945)" },
          ]}
        />
        <SpokeCard
          icon="&#9889;"
          iconBg="bg-gc-cyan-dim text-gc-cyan"
          title="3PL — Kratos"
          type="East + West"
          rows={[
            { label: "Method", value: <><DirBadge dir="bi" /> API/SFTP</> },
            { label: "Out", value: "Fulfillment orders (940)" },
            { label: "In", value: "Ship confirm + tracking (945)" },
          ]}
        />
        <SpokeCard
          icon="&#128210;"
          iconBg="bg-gc-orange-dim text-gc-orange"
          title="QuickBooks Online"
          type="Financial GL"
          rows={[
            { label: "Method", value: <><DirBadge dir="out" /> QBO API</> },
            { label: "Trigger", value: "On shipment confirm" },
            { label: "Out", value: "Invoices, COGS JEs, AP bills" },
            { label: "In", value: "Payment status, bank feeds" },
          ]}
        />
      </div>
    </div>
  );
}
