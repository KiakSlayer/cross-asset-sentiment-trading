import { ExplainerCard } from "@/components/ui/explainer-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { strategyChecklist, strategyControlSummary } from "@/lib/mock-data";

export default function StrategySetupPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategy Setup"
        description="Use this setup checklist to configure the strategy in plain language before running historical and forward checks."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard
            title="Setup checklist"
            description="These items are required before signals can move toward autonomous mode."
          >
            <ul className="space-y-3">
              {strategyChecklist.map((item) => (
                <li key={item} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  {item}
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
        <ExplainerCard
          title="Plain-language tip"
          body="A strategy should read like instructions for a friend: what to watch, when to act, and when to pause."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SectionCard title="Current controls" description="Mock settings for this demo strategy.">
          <dl className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between gap-3">
              <dt className="font-semibold text-slate-900">Watchlist assets</dt>
              <dd>{strategyControlSummary.watchlist.join(", ")}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="font-semibold text-slate-900">Refresh cadence</dt>
              <dd>Every {strategyControlSummary.refreshMinutes} minutes</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="font-semibold text-slate-900">Risk budget</dt>
              <dd>{strategyControlSummary.riskBudgetPct}% of account</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="font-semibold text-slate-900">Max per position</dt>
              <dd>{strategyControlSummary.maxSinglePositionPct}%</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="font-semibold text-slate-900">Forward test gate</dt>
              <dd>{strategyControlSummary.forwardTestRequired ? "Required" : "Optional"}</dd>
            </div>
          </dl>
        </SectionCard>

        <RecommendationCard
          title="Setup recommendation"
          recommendation={{
            observed:
              "Your watchlist mixes crypto, equity, and defensive assets.",
            inferred:
              "This can help diversify opportunities across different market moods.",
            uncertainty:
              "Cross-asset links can shift, so relationship checks must stay active.",
          }}
          note="This recommendation is demo-only and based on mock setup data."
        />
      </div>
    </div>
  );
}
