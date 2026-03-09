import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  buildConfidenceDisplay,
  buildRecommendationExplanation,
  getEligibleOpportunities,
} from "@/lib/gating";
import {
  dashboardStats,
  equityCurveData,
  OPPORTUNITY_IC_THRESHOLD,
  opportunitySignals,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const eligibleSignals = getEligibleOpportunities(opportunitySignals, OPPORTUNITY_IC_THRESHOLD);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Quick overview of what the system observed, what it inferred, and how much uncertainty is present before any action."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <MetricCard key={item.label} label={item.label} value={item.value} caption={item.caption} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            title="Equity trend (demo)"
            description="Simple view of account value over recent weeks in paper mode."
          >
            <LineTrendChart data={equityCurveData} formatMode="currency" />
          </SectionCard>
        </div>
        <ExplainerCard
          title="Why this is beginner-safe"
          body="Only opportunities that pass quality checks are shown. Autonomous mode stays locked until forward testing and model health checks are both approved."
        />
      </div>

      <SectionCard
        title="Top opportunity explanations"
        description="Each recommendation uses plain language and includes uncertainty."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {eligibleSignals.slice(0, 2).map((signal) => {
            const recommendation = buildRecommendationExplanation(signal);
            const confidence = buildConfidenceDisplay(signal);

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
                    Recommendation hidden because audit evidence is incomplete.
                  </p>
                </article>
              );
            }

            return (
              <RecommendationCard
                key={signal.id}
                title={`${signal.assetSymbol} suggestion`}
                recommendation={recommendation}
                note={
                  confidence.label
                    ? `${confidence.label} (${Math.round((confidence.score ?? 0) * 100)}%)`
                    : confidence.suppressedReason ?? "Confidence note hidden."
                }
              />
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
