import { SectionHead } from "@/components/ui/section";
import { DashboardKpis } from "@/components/dashboard/kpi-cards";
import {
  ChannelFillRateChart,
  SkuShortfallChart,
  SyncStatusChart,
  LocationSyncChart,
} from "@/components/dashboard/charts";

export default function DashboardPage() {
  return (
    <>
      <SectionHead
        title="Dashboard"
        description="High-level overview of GoodCrust Foods order fulfillment performance. All metrics computed dynamically from source data (Jan 1 – Mar 1, 2025)."
      />
      <DashboardKpis />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mt-6">
        <ChannelFillRateChart />
        <SkuShortfallChart />
        <SyncStatusChart />
        <LocationSyncChart />
      </div>
    </>
  );
}
