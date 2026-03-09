import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime, formatPct } from "@/lib/format";
import { forwardTestRuns } from "@/lib/mock-data";
import type { ForwardTestSummary } from "@/types/domain";

const columns: TableColumn<ForwardTestSummary>[] = [
  {
    key: "strategy",
    header: "Strategy",
    render: (row) => row.strategyName,
  },
  {
    key: "run",
    header: "Run Status",
    render: (row) => <StatusBadge status={row.runStatus} />,
  },
  {
    key: "pass",
    header: "Pass Gate",
    render: (row) => <StatusBadge status={row.passStatus} />,
  },
  {
    key: "return",
    header: "Observed Return",
    render: (row) => formatPct(row.observedReturnPct),
  },
  {
    key: "drawdown",
    header: "Observed Drawdown",
    render: (row) => formatPct(row.observedMaxDrawdownPct),
  },
  {
    key: "env",
    header: "Environment",
    render: (row) => row.environment,
  },
  {
    key: "window",
    header: "Window",
    render: (row) => `${formatDateTime(row.startedAt)} - ${formatDateTime(row.endedAt)}`,
  },
];

export default function ForwardTestResultsPage() {
  const latest = forwardTestRuns[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Forward Test Results"
        description="Forward testing is a separate validation layer and must pass before autonomous trading can be enabled."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationCard
            title="Forward test interpretation"
            recommendation={{
              observed: `Most recent completed trial run returned ${formatPct(latest.observedReturnPct)} with ${formatPct(latest.observedMaxDrawdownPct)} drawdown.`,
              inferred:
                latest.passStatus === "passed"
                  ? "The strategy is currently eligible for autonomous activation checks."
                  : "The strategy should remain in paper mode until pass status is achieved.",
              uncertainty:
                "Future market regimes can change quickly, so this gate is continuously re-checked.",
            }}
            note={latest.decisionReason}
          />
        </div>
        <ExplainerCard
          title="Why a separate trial?"
          body="Forward testing checks if historical behavior still holds in fresh market data before real automation is allowed."
        />
      </div>

      <SectionCard
        title="Forward test log"
        description="Every run includes a clear pass gate and decision reason."
      >
        <DataTable
          rows={forwardTestRuns}
          getRowKey={(row) => row.id}
          columns={columns}
          emptyMessage="No forward test runs are available yet."
        />
      </SectionCard>
    </div>
  );
}

