import { SectionHead, Callout } from "@/components/ui/section";
import { DataModelView } from "@/components/data-model/erd";

export default function DataModelPage() {
  return (
    <>
      <SectionHead
        title="Core Data Model"
        description="10 key objects with PK/FK relationships. Color-coded by system of origin (mastered vs. synced)."
      />
      <DataModelView />
      <Callout variant="accent">
        <strong className="text-accent">Design Decision:</strong>{" "}
        Inventory_Txn is an event log, not a snapshot. Current stock =
        SUM(transactions) by SKU + location. This supports full audit trail and
        FEFO (First Expired, First Out) for frozen goods.
      </Callout>
    </>
  );
}
