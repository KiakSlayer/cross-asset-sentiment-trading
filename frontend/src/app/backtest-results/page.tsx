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
    header: "Run status",
    render: (row) => <StatusBadge status={row.runStatus} />,
  },
  {
    key: "validation",
    header: "Check status",
    render: (row) => <StatusBadge status={row.validationStatus} />,
  },
  {
    key: "return",
    header: "Total return",
    render: (row) => formatPct(row.totalReturnPct),
  },
  {
    key: "drawdown",
    header: "Largest drop",
    render: (row) => formatPct(row.maxDrawdownPct),
  },
  {
    key: "window",
    header: "Test windows",
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
        title="Strategy test results"
        description="Historical strategy tests use rolling windows to check consistency before moving to forward testing."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title="Performance by test run"
            description="Simple view of how each historical test performed."
          >
            <LineTrendChart data={chartData} formatMode="percent" />
          </SectionCard>
        </div>
        <ExplainerCard
          title="Why this matters"
          body="A good historical test is helpful, but autonomous mode still stays locked until forward testing passes."
        />
      </div>

      {latestPassed ? (
        <RecommendationCard
          title="What this suggests"
          recommendation={{
            observed: `Latest passed run returned ${formatPct(latestPassed.totalReturnPct)} with a largest drop of ${formatPct(latestPassed.maxDrawdownPct)}.`,
            inferred:
              "Historical behavior looks stable enough to continue paper forward testing.",
            uncertainty:
              "Real market behavior can differ, so this is not a guarantee of future results.",
          }}
          note="Continue forward testing before enabling autonomous mode."
        />
      ) : null}

      <SectionCard title="Test run log" description="Detailed status of each historical strategy test.">
        <DataTable
          rows={backtestRuns}
          getRowKey={(row) => row.id}
          columns={columns}
          emptyMessage="No strategy test runs are available yet."
        />
      </SectionCard>
    </div>
  );
}
