import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatPct } from "@/lib/format";
import { backtestRuns } from "@/lib/mock-data";
import type { BacktestSummary } from "@/types/domain";

const columns: TableColumn<BacktestSummary>[] = [
  {
    key: "strategy",
    header: "Strategy",
    render: (row) => row.strategyName,
  },
  {
    key: "status",
    header: "Run Status",
    render: (row) => <StatusBadge status={row.runStatus} />,
  },
  {
    key: "validation",
    header: "Validation",
    render: (row) => <StatusBadge status={row.validationStatus} />,
  },
  {
    key: "return",
    header: "Total Return",
    render: (row) => formatPct(row.totalReturnPct),
  },
  {
    key: "drawdown",
    header: "Max Drawdown",
    render: (row) => formatPct(row.maxDrawdownPct),
  },
  {
    key: "window",
    header: "Walk-Forward Windows",
    render: (row) => row.walkForwardWindows,
  },
  {
    key: "ended",
    header: "Completed",
    render: (row) => formatDateTime(row.endedAt),
  },
];

export default function BacktestResultsPage() {
  const chartData = backtestRuns.map((run) => ({
    label: run.id,
    value: run.totalReturnPct,
  }));

  const latestPassed = backtestRuns.find((run) => run.validationStatus === "passed");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Backtest Results"
        description="Historical checks use walk-forward validation only, so each result comes from rolling train/test windows."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title="Return by backtest run"
            description="Quick view of how each walk-forward run performed."
          >
            <LineTrendChart data={chartData} formatMode="percent" />
          </SectionCard>
        </div>
        <ExplainerCard
          title="Historical check note"
          body="A strong backtest does not unlock autonomous mode. It only allows the strategy to move into forward testing."
        />
      </div>

      {latestPassed ? (
        <RecommendationCard
          title="Backtest interpretation"
          recommendation={{
            observed: `Latest passed run returned ${formatPct(latestPassed.totalReturnPct)} with max drawdown ${formatPct(latestPassed.maxDrawdownPct)}.`,
            inferred:
              "Historical behavior is stable enough to continue paper forward testing.",
            uncertainty:
              "Live market behavior can differ, so the strategy remains in trial mode.",
          }}
          note="Recommendation text is beginner-oriented and mock-data based."
        />
      ) : null}

      <SectionCard title="Backtest run log" description="Detailed status of each historical validation run.">
        <DataTable
          rows={backtestRuns}
          getRowKey={(row) => row.id}
          columns={columns}
          emptyMessage="No backtest runs are available yet."
        />
      </SectionCard>
    </div>
  );
}


