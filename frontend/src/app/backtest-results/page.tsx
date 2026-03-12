import { LineTrendChart } from "@/components/charts/line-trend-chart";
import { ChartCard } from "@/components/ui/chart-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { TableCard } from "@/components/ui/table-card";
import { WhyThisMattersCard } from "@/components/ui/why-this-matters-card";
import {
  backtestMetrics,
  backtestTradeSummary,
  benchmarkGrowthData,
  portfolioGrowthData,
} from "@/lib/mock-data";

export default function BacktestResultsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Backtest Results"
        description="Review strategy test performance versus benchmark using simple metrics."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {backtestMetrics.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} subtitle={item.subtitle} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Portfolio growth"
          description="How the strategy test value changed over time."
          hasData={portfolioGrowthData.length > 0}
        >
          <LineTrendChart data={portfolioGrowthData} formatMode="currency" />
        </ChartCard>

        <ChartCard
          title="Benchmark comparison"
          description="How the benchmark moved over the same period."
          hasData={benchmarkGrowthData.length > 0}
        >
          <LineTrendChart data={benchmarkGrowthData} formatMode="currency" color="#0f766e" />
        </ChartCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <TableCard
          title="Trade summary"
          description="Simple summary of strategy test trading behavior."
          hasRows={backtestTradeSummary.length > 0}
        >
          <div className="space-y-2">
            {backtestTradeSummary.map((row) => (
              <div key={row.metric} className="flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                <span className="text-slate-600">{row.metric}</span>
                <span className="font-semibold text-slate-900">{row.value}</span>
              </div>
            ))}
          </div>
        </TableCard>

        <SectionBlock title="What this means" description="A plain-language readout of the strategy test.">
          <WhyThisMattersCard text="The strategy outperformed the benchmark in this test window, but it should still pass Forward Test before any bot activation." />
        </SectionBlock>
      </div>
    </div>
  );
}
