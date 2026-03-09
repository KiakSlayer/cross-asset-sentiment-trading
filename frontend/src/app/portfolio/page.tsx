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
    header: "Avg Entry",
    render: (row) => formatCurrency(row.averageEntryPrice),
  },
  {
    key: "price",
    header: "Current Price",
    render: (row) => formatCurrency(row.currentPrice),
  },
  {
    key: "pnl",
    header: "Unrealized P/L",
    render: (row) => formatCurrency(row.unrealizedPnl),
  },
  {
    key: "risk",
    header: "Risk Label",
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
        title="Portfolio"
        description="Portfolio view with beginner-friendly risk labels and auditable suppression when evidence is missing."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total equity"
          value={formatCurrency(portfolioSnapshot.currentEquity)}
          caption="Current account value"
        />
        <MetricCard
          label="Cash"
          value={formatCurrency(portfolioSnapshot.cash)}
          caption="Funds available for new trades"
        />
        <MetricCard
          label="Daily P/L"
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
        title="Open positions"
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
        title="Portfolio recommendation"
        recommendation={{
          observed:
            "Most holdings remain within configured position size limits, with one defensive asset missing risk audit metadata.",
          inferred:
            "Portfolio exposure is generally controlled, but unlabeled risk items should be reviewed before scale-up.",
          uncertainty:
            "Risk behavior can change if volatility rises quickly across assets.",
        }}
        note="Risk labels without audit basis are intentionally hidden from the user interface."
      />
    </div>
  );
}

