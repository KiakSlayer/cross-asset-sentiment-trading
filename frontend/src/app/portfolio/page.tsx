import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { buildRiskLabelDisplay } from "@/lib/gating";
import { portfolioSnapshot } from "@/lib/mock-data";
import type { PortfolioPosition } from "@/types/domain";

const columns: TableColumn<PortfolioPosition>[] = [
  {
    key: "asset",
    header: "Asset",
    render: (row) => <span className="font-semibold text-slate-900">{row.symbol}</span>,
  },
  {
    key: "qty",
    header: "Quantity",
    render: (row) => formatNumber(row.quantity),
  },
  {
    key: "entry",
    header: "Avg entry",
    render: (row) => formatCurrency(row.averageEntryPrice),
  },
  {
    key: "price",
    header: "Current price",
    render: (row) => formatCurrency(row.currentPrice),
  },
  {
    key: "pnl",
    header: "Today's change",
    render: (row) => formatCurrency(row.unrealizedPnl),
  },
  {
    key: "risk",
    header: "Risk Level",
    render: (row) => {
      const risk = buildRiskLabelDisplay(row);
      if (!risk.label) {
        return <StatusBadge status="suppressed" />;
      }
      return <span className="capitalize">{risk.label}</span>;
    },
  },
];

export default function PortfolioPage() {
  const suppressedRiskLabels = portfolioSnapshot.positions.filter(
    (position) => !buildRiskLabelDisplay(position).label,
  ).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Your portfolio"
        description="Simple portfolio view with clear risk labels and suppression when audit evidence is missing."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total value"
          value={formatCurrency(portfolioSnapshot.currentEquity)}
          caption="Current account value"
        />
        <MetricCard
          label="Cash"
          value={formatCurrency(portfolioSnapshot.cash)}
          caption="Funds available for new trades"
        />
        <MetricCard
          label="Today's change"
          value={formatCurrency(portfolioSnapshot.dailyPnl)}
          caption="Change since previous day"
        />
        <MetricCard
          label="Risk labels hidden"
          value={String(suppressedRiskLabels)}
          caption="Hidden when audit basis is missing"
        />
      </div>

      <SectionCard
        title="Portfolio summary"
        description="Risk labels are only shown when an auditable basis exists."
      >
        <DataTable
          rows={portfolioSnapshot.positions}
          getRowKey={(row) => row.symbol}
          columns={columns}
          emptyMessage="No open positions."
        />
      </SectionCard>

      <RecommendationCard
        title="Portfolio guidance"
        recommendation={{
          observed:
            "Most holdings remain within position-size limits, with one asset missing risk audit metadata.",
          inferred:
            "Overall exposure is controlled, but missing risk evidence should be fixed before scaling up.",
          uncertainty:
            "Risk behavior can change quickly if market volatility rises.",
        }}
        note="Review missing audit evidence before increasing allocation."
      />
    </div>
  );
}
