import { OpportunityCard } from "@/components/ui/opportunity-card";
import { BotStatusCard } from "@/components/ui/bot-status-card";
import { PageHeader } from "@/components/ui/page-header";
import { PortfolioSummaryCard } from "@/components/ui/portfolio-summary-card";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard } from "@/components/ui/table-card";
import { formatDateTime } from "@/lib/format";
import {
  dashboardBot,
  dashboardPortfolio,
  dashboardStats,
  marketPulse,
  recentActivity,
  topOpportunities,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="A guided overview of your portfolio, market pulse, opportunities, and bot status."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} subtitle={item.subtitle} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <PortfolioSummaryCard
          currentValue={dashboardPortfolio.currentValue}
          dailyPnl={dashboardPortfolio.dailyPnl}
          cash={dashboardPortfolio.cash}
        />
        <BotStatusCard
          status={dashboardBot.status}
          mode={dashboardBot.mode}
          openPositions={dashboardBot.openPositions}
          todayActions={dashboardBot.todayActions}
          cumulativePnl={dashboardBot.cumulativePnl}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <SectionBlock
          title="Market pulse"
          description="How major sectors look right now based on mock event signals."
        >
          <div className="space-y-2">
            {marketPulse.map((item) => (
              <div key={item.sector} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{item.sector}</p>
                  <StatusBadge status={item.sentiment} />
                </div>
                <p className="mt-1 text-sm text-slate-700">{item.note}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <div className="xl:col-span-2">
          <SectionBlock
            title="Top opportunities"
            description="Validated ideas with Suggested Action, Confidence, and Risk Level."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              {topOpportunities.slice(0, 2).map((item) => (
                <OpportunityCard key={item.id} item={item} />
              ))}
            </div>
          </SectionBlock>
        </div>
      </div>

      <TableCard
        title="Recent activity"
        description="Latest platform actions across manual, assisted, and bot modes."
        hasRows={recentActivity.length > 0}
      >
        <div className="space-y-2">
          {recentActivity.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white p-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{item.message}</p>
                <p className="text-xs text-slate-500">{formatDateTime(item.time)}</p>
              </div>
              <StatusBadge status={item.mode} />
            </div>
          ))}
        </div>
      </TableCard>
    </div>
  );
}
