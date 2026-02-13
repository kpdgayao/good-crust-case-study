import { SectionHead, Callout } from "@/components/ui/section";
import { HubSpokeDiagram } from "@/components/architecture/hub-spoke";

export default function ArchitecturePage() {
  return (
    <>
      <SectionHead
        title="System Architecture"
        description="Logical integration linking DOSS (hub), QBO, Shopify, and two 3PLs. All data flows through DOSS as single source of truth."
      />
      <HubSpokeDiagram />
      <Callout variant="accent">
        <strong className="text-accent">Design Principle:</strong> No direct
        integration between external systems. All data flows through DOSS to
        prevent data conflicts and maintain audit trail integrity. QBO is the
        financial system of record; DOSS is the operational system of record.
      </Callout>
    </>
  );
}
