import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import {
  buildConfidenceDisplay,
  buildRecommendationExplanation,
  getEligibleOpportunities,
} from "@/lib/gating";
import { OPPORTUNITY_IC_THRESHOLD, opportunitySignals } from "@/lib/mock-data";
import type { OpportunitySignal } from "@/types/domain";

const columns: TableColumn<OpportunitySignal>[] = [
  {
    key: "asset",
    header: "Asset",
    render: (row) => <span className="font-semibold text-slate-900">{row.assetSymbol}</span>,
  },
  {
    key: "quality",
    header: "Signal quality score",
    render: (row) => `${row.informationCoefficient.toFixed(2)} (minimum ${row.icThreshold.toFixed(2)})`,
  },
  {
    key: "validation",
    header: "Check status",
    render: (row) => <StatusBadge status={row.validationStatus} />,
  },
  {
    key: "confidence",
    header: "Confidence",
    render: (row) => {
      const confidence = buildConfidenceDisplay(row);
      return confidence.label
        ? `${confidence.label} (${Math.round((confidence.score ?? 0) * 100)}%)`
        : confidence.suppressedReason;
    },
  },
  {
    key: "updated",
    header: "Updated",
    render: (row) => formatDateTime(row.generatedAt),
  },
];

export default function OpportunitiesPage() {
  const eligible = getEligibleOpportunities(opportunitySignals, OPPORTUNITY_IC_THRESHOLD);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="This feed only shows signals that passed required checks and cleared the configured quality threshold."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Signals scanned"
          value={String(opportunitySignals.length)}
          caption="All incoming signals before filtering"
        />
        <MetricCard
          label="Feed eligible"
          value={String(eligible.length)}
          caption="Only passed signals above quality threshold"
        />
        <MetricCard
          label="Quality threshold"
          value={OPPORTUNITY_IC_THRESHOLD.toFixed(2)}
          caption="Configured minimum score"
        />
        <MetricCard
          label="Suppressed labels"
          value={String(
            eligible.filter((signal) => !buildConfidenceDisplay(signal).label).length,
          )}
          caption="Hidden when audit evidence is missing"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Eligible opportunities" description="Filtered output with auditable notes.">
            <DataTable
              rows={eligible}
              getRowKey={(row) => row.id}
              columns={columns}
              emptyMessage="No opportunities are ready right now."
            />
          </SectionCard>
        </div>
        <ExplainerCard
          title="Why this matters"
          body="An item appears here only if required checks pass and quality stays above the configured threshold. Confidence and suggestions are hidden when audit evidence is missing."
        />
      </div>

      <SectionCard
        title="Opportunity cards"
        description="Each card explains what happened and why it matters in plain language."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {eligible.map((signal) => {
            const recommendation = buildRecommendationExplanation(signal);
            if (!recommendation) {
              return (
                <article
                  key={signal.id}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">{signal.assetSymbol}</p>
                    <StatusBadge status="suppressed" />
                  </div>
                  <p className="text-sm text-slate-700">
                    Suggested action is hidden because auditable evidence is incomplete.
                  </p>
                </article>
              );
            }

            return (
              <RecommendationCard
                key={signal.id}
                title={`${signal.assetSymbol} opportunity`}
                recommendation={recommendation}
                note={signal.recommendationText ?? "Wait for clearer confirmation."}
              />
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
