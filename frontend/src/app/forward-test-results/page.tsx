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
    header: "Run status",
    render: (row) => <StatusBadge status={row.runStatus} />,
  },
  {
    key: "pass",
    header: "Pass gate",
    render: (row) => <StatusBadge status={row.passStatus} />,
  },
  {
    key: "return",
    header: "Observed return",
    render: (row) => formatPct(row.observedReturnPct),
  },
  {
    key: "drawdown",
    header: "Largest drop seen",
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
        title="Forward test results"
        description="This live-like trial checks whether the strategy still behaves safely before autonomous mode can be enabled."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendationCard
            title="What this suggests"
            recommendation={{
              observed: `Most recent completed trial run returned ${formatPct(latest.observedReturnPct)} with a largest drop of ${formatPct(latest.observedMaxDrawdownPct)}.`,
              inferred:
                latest.passStatus === "passed"
                  ? "The strategy is currently eligible for autonomous activation checks."
                  : "The strategy should stay in paper mode until this trial is marked as passed.",
              uncertainty:
                "Market conditions can change quickly, so this gate is continuously re-checked.",
            }}
            note={latest.decisionReason}
          />
        </div>
        <ExplainerCard
          title="Why this matters"
          body="Forward testing confirms that recent market behavior still supports the strategy before any autonomous action."
        />
      </div>

      <SectionCard
        title="Forward test log"
        description="Every run includes a pass gate and a clear decision reason."
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
