import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Th, Td } from "@/components/ui/data-table";

interface Field {
  name: string;
  type: string;
  key?: "PK" | "FK";
}

interface Entity {
  name: string;
  source: string;
  sourceVariant: "accent" | "green" | "orange" | "purple";
  fields: Field[];
}

const entities: Entity[] = [
  {
    name: "Product_SKU",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "sku_id", type: "VARCHAR", key: "PK" },
      { name: "sku_code", type: "VARCHAR" },
      { name: "product_name", type: "VARCHAR" },
      { name: "upc_barcode", type: "VARCHAR" },
      { name: "unit_cost", type: "DECIMAL" },
      { name: "case_pack_qty", type: "INT" },
      { name: "shopify_product_id", type: "VARCHAR" },
    ],
  },
  {
    name: "Sales_Order",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "order_id", type: "VARCHAR", key: "PK" },
      { name: "customer_id", type: "VARCHAR", key: "FK" },
      { name: "channel", type: "ENUM" },
      { name: "order_date", type: "DATETIME" },
      { name: "status", type: "ENUM" },
      { name: "edi_po_number", type: "VARCHAR" },
    ],
  },
  {
    name: "Order_Line",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "line_id", type: "VARCHAR", key: "PK" },
      { name: "order_id", type: "VARCHAR", key: "FK" },
      { name: "sku_id", type: "VARCHAR", key: "FK" },
      { name: "ordered_qty", type: "INT" },
      { name: "unit_price", type: "DECIMAL" },
    ],
  },
  {
    name: "Fulfillment_Order",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "fulfillment_id", type: "VARCHAR", key: "PK" },
      { name: "order_id", type: "VARCHAR", key: "FK" },
      { name: "location", type: "VARCHAR" },
      { name: "ship_date", type: "DATETIME" },
      { name: "carrier", type: "VARCHAR" },
      { name: "tracking_number", type: "VARCHAR" },
      { name: "erp_sync_status", type: "ENUM" },
    ],
  },
  {
    name: "Fulfillment_Line",
    source: "3PL SYNC",
    sourceVariant: "purple",
    fields: [
      { name: "ful_line_id", type: "VARCHAR", key: "PK" },
      { name: "fulfillment_id", type: "VARCHAR", key: "FK" },
      { name: "sku_id", type: "VARCHAR", key: "FK" },
      { name: "fulfilled_qty", type: "INT" },
      { name: "lot_number", type: "VARCHAR" },
    ],
  },
  {
    name: "Production_Order",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "production_id", type: "VARCHAR", key: "PK" },
      { name: "sku_id", type: "VARCHAR", key: "FK" },
      { name: "requested_qty", type: "INT" },
      { name: "completed_qty", type: "INT" },
      { name: "co_packer_ref", type: "VARCHAR" },
      { name: "status", type: "ENUM" },
    ],
  },
  {
    name: "Customer",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "customer_id", type: "VARCHAR", key: "PK" },
      { name: "name", type: "VARCHAR" },
      { name: "channel_type", type: "ENUM" },
      { name: "payment_terms", type: "VARCHAR" },
      { name: "qbo_customer_id", type: "VARCHAR" },
    ],
  },
  {
    name: "Invoice",
    source: "→ QBO",
    sourceVariant: "orange",
    fields: [
      { name: "invoice_id", type: "VARCHAR", key: "PK" },
      { name: "order_id", type: "VARCHAR", key: "FK" },
      { name: "customer_id", type: "VARCHAR", key: "FK" },
      { name: "total_amount", type: "DECIMAL" },
      { name: "payment_status", type: "ENUM" },
      { name: "qbo_invoice_id", type: "VARCHAR" },
    ],
  },
  {
    name: "Inventory_Txn",
    source: "DOSS",
    sourceVariant: "accent",
    fields: [
      { name: "txn_id", type: "VARCHAR", key: "PK" },
      { name: "sku_id", type: "VARCHAR", key: "FK" },
      { name: "txn_type", type: "ENUM" },
      { name: "quantity", type: "INT" },
      { name: "location", type: "VARCHAR" },
      { name: "timestamp", type: "DATETIME" },
    ],
  },
  {
    name: "GL_Journal_Entry",
    source: "→ QBO",
    sourceVariant: "orange",
    fields: [
      { name: "je_id", type: "VARCHAR", key: "PK" },
      { name: "je_date", type: "DATE" },
      { name: "account_code", type: "VARCHAR" },
      { name: "debit", type: "DECIMAL" },
      { name: "credit", type: "DECIMAL" },
      { name: "source_type", type: "ENUM" },
    ],
  },
];

const relationships = [
  { parent: "Customer", child: "Sales_Order", card: "1 : N", key: "customer_id" },
  { parent: "Sales_Order", child: "Order_Line", card: "1 : N", key: "order_id" },
  { parent: "Product_SKU", child: "Order_Line", card: "1 : N", key: "sku_id" },
  { parent: "Sales_Order", child: "Fulfillment_Order", card: "1 : N", key: "order_id" },
  { parent: "Fulfillment_Order", child: "Fulfillment_Line", card: "1 : N", key: "fulfillment_id" },
  { parent: "Product_SKU", child: "Production_Order", card: "1 : N", key: "sku_id" },
  { parent: "Sales_Order", child: "Invoice", card: "1 : 1", key: "order_id" },
  { parent: "Product_SKU", child: "Inventory_Txn", card: "1 : N", key: "sku_id" },
  { parent: "Invoice", child: "GL_Journal_Entry", card: "1 : N", key: "source ref" },
];

function EntityCard({ entity }: { entity: Entity }) {
  return (
    <Card className="overflow-hidden hover:-translate-y-0.5 hover:border-border-accent hover:shadow-lg hover:shadow-black/30">
      <div className="px-3.5 py-2.5 border-b border-border flex items-center justify-between">
        <h3 className="text-[13px] font-bold font-mono">{entity.name}</h3>
        <Badge variant={entity.sourceVariant}>{entity.source}</Badge>
      </div>
      <div>
        {entity.fields.map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-2 px-3.5 py-1 text-[11px] border-b border-border last:border-b-0 font-mono hover:bg-surface-2"
          >
            {f.key ? (
              <span
                className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                  f.key === "PK"
                    ? "bg-gc-amber-dim text-gc-amber"
                    : "bg-gc-cyan-dim text-gc-cyan"
                }`}
              >
                {f.key}
              </span>
            ) : (
              <span className="w-5" />
            )}
            <span className="text-text font-medium">{f.name}</span>
            <span className="ml-auto text-text-dim text-[10px]">{f.type}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function DataModelView() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {entities.map((e) => (
          <EntityCard key={e.name} entity={e} />
        ))}
      </div>

      <div className="mt-5 bg-surface border border-border rounded-gc p-4 overflow-x-auto">
        <h3 className="text-sm font-semibold mb-3">Entity Relationships</h3>
        <DataTable>
          <thead>
            <tr>
              <Th>Parent</Th>
              <Th>Child</Th>
              <Th>Cardinality</Th>
              <Th>Join Key</Th>
            </tr>
          </thead>
          <tbody>
            {relationships.map((r, i) => (
              <tr key={i} className="hover:bg-surface-2">
                <Td>{r.parent}</Td>
                <Td>{r.child}</Td>
                <Td>{r.card}</Td>
                <Td>{r.key}</Td>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </div>
    </div>
  );
}
