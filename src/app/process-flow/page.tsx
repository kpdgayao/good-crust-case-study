import { SectionHead, Subsection, Callout } from "@/components/ui/section";
import { ProcessFlowGrid, CoPackerOptions } from "@/components/process-flow/flow-grid";

export default function ProcessFlowPage() {
  return (
    <>
      <SectionHead
        title="End-to-End Process Design"
        description="Flow of Goods, Data, and Money across Procurement → Production → Fulfillment → Accounting. Integration methods annotated at each touchpoint."
      />
      <ProcessFlowGrid />

      <Subsection>Co-Packer Integration Options</Subsection>
      <p className="text-text-muted text-sm mb-4">
        Phased approach to reduce the manual bottleneck at the co-packer
        integration point.
      </p>
      <CoPackerOptions />
      <Callout variant="amber">
        <strong className="text-gc-amber">Key Risk:</strong> The co-packer is
        the single manual bottleneck. Until Phase 2+, inventory visibility
        between production and 3PL receipt has a 1-3 day lag — impacting demand
        planning and fulfillment SLAs.
      </Callout>
    </>
  );
}
