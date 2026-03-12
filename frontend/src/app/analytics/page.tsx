import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { StatusBarChart } from "@/components/charts/status-bar-chart";
import { ChartCard } from "@/components/ui/chart-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { TableCard } from "@/components/ui/table-card";
import { WarningBanner } from "@/components/ui/warning-banner";
import {
  analyticsReturnBreakdown,
  backtestForwardCompare,
  modelHealthSummary,
  monthlyPerformance,
  sectorHitRate,
  signalSourceEffectiveness,
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Performance and signal analytics in plain language to support retail decision making."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {analyticsReturnBreakdown.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} subtitle={item.subtitle} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Monthly performance" description="Month-by-month strategy returns." hasData={monthlyPerformance.length > 0}>
          <LineTrendChart data={monthlyPerformance} formatMode="percent" />
        </ChartCard>

        <ChartCard title="Sector hit rate" description="How often each sector call was successful." hasData={sectorHitRate.length > 0}>
          <StatusBarChart data={sectorHitRate} color="#0f766e" />
        </ChartCard>
      </div>

      <TableCard
        title="Signal source effectiveness"
        description="How each signal source is contributing in this mock setup."
        hasRows={signalSourceEffectiveness.length > 0}
      >
        <div className="space-y-2">
          {signalSourceEffectiveness.map((row) => (
            <div key={row.source} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="font-semibold text-slate-900">{row.source}</p>
              <p className="text-sm text-slate-700">Contribution: {row.contribution}</p>
              <p className="text-sm text-slate-700">Consistency: {row.consistency}</p>
            </div>
          ))}
        </div>
      </TableCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <TableCard
          title="Backtest vs Forward Test"
          description="Quick comparison of key performance metrics."
          hasRows={backtestForwardCompare.length > 0}
        >
          <div className="space-y-2">
            {backtestForwardCompare.map((row) => (
              <div key={row.metric} className="rounded-lg bg-slate-50 p-3 text-sm">
                <p className="font-semibold text-slate-900">{row.metric}</p>
                <p className="text-slate-700">Backtest: {row.backtest}</p>
                <p className="text-slate-700">Forward Test: {row.forward}</p>
              </div>
            ))}
          </div>
        </TableCard>

        <SectionBlock title="Model health summary" description="Current model health state for bot-readiness.">
          <WarningBanner
            title={`Model health: ${modelHealthSummary.status}`}
            message={modelHealthSummary.note}
            tone={modelHealthSummary.status === "warning" ? "warning" : "info"}
          />
        </SectionBlock>
      </div>
    </div>
  );
}
