import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { StatusBarChart } from "@/components/charts/status-bar-chart";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatPct } from "@/lib/format";
import {
  degradationMetrics,
  monthlyReturns,
  relationshipHealth,
} from "@/lib/mock-data";
import type { RelationshipHealth } from "@/types/domain";

const relationshipColumns: TableColumn<RelationshipHealth>[] = [
  {
    key: "pair",
    header: "Asset Pair",
    render: (row) => row.pair,
  },
  {
    key: "regime",
    header: "Market Regime",
    render: (row) => row.regime,
  },
  {
    key: "correlation",
    header: "Correlation",
    render: (row) => row.correlation.toFixed(2),
  },
  {
    key: "stability",
    header: "Stability",
    render: (row) => formatPct(row.stabilityScore * 100),
  },
  {
    key: "status",
    header: "Validation",
    render: (row) => <StatusBadge status={row.validationStatus} />,
  },
  {
    key: "window",
    header: "Window End",
    render: (row) => formatDateTime(row.windowEnd),
  },
];

export default function AnalyticsPage() {
  const degradationChartData = degradationMetrics.map((metric) => ({
    label: metric.label.replace(" ratio", ""),
    value: metric.value,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Rolling validation analytics for asset relationships, model health, and performance trends."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard
          title="Monthly return trend"
          description="High-level performance trend in plain language view."
        >
          <LineTrendChart data={monthlyReturns} formatMode="percent" />
        </SectionCard>

        <SectionCard
          title="Model degradation monitor"
          description="Lower values are better for these mock drift ratios."
        >
          <StatusBarChart data={degradationChartData} color="#0891b2" />
        </SectionCard>
      </div>

      <SectionCard
        title="Asset relationship health"
        description="Empirical relationship checks refreshed by market regime."
      >
        <DataTable
          rows={relationshipHealth}
          getRowKey={(row) => `${row.pair}-${row.windowEnd}`}
          columns={relationshipColumns}
          emptyMessage="No relationship diagnostics are available."
        />
      </SectionCard>

      <RecommendationCard
        title="Analytics recommendation"
        recommendation={{
          observed:
            "Most tracked asset relationships remain validated, but one stressed-regime pair is still pending review.",
          inferred:
            "Current strategy rules are usable, yet allocation should stay moderate until stressed-regime checks pass.",
          uncertainty:
            "Relationship strength can decay quickly in unstable markets, so rolling checks stay mandatory.",
        }}
        note="All analytics in this page are powered by static mock data for demo purposes."
      />
    </div>
  );
}



