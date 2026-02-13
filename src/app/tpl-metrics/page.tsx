import { SectionHead, Callout } from "@/components/ui/section";
import { TplMetricsView } from "@/components/tpl-metrics/comparison";

export default function TplMetricsPage() {
  return (
    <>
      <SectionHead
        title="3PL Contract Renewal Metrics"
        description="Top 4 KPIs for evaluating JackRabbit vs Kratos performance. Assumes comparable fulfillment locations and no routing delays."
      />
      <TplMetricsView />
      <Callout variant="green">
        <strong className="text-gc-green">Contract Negotiation Leverage:</strong>{" "}
        The 30% pending sync rate is ammunition regardless of which 3PL you&apos;re
        negotiating with. Include SLA clauses requiring &ge;95% sync rate within
        24 hours of shipment, with financial penalties for non-compliance.
      </Callout>
    </>
  );
}
