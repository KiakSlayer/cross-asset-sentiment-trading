import { StatusBarChart } from "@/components/charts/status-bar-chart";
import { ChartCard } from "@/components/ui/chart-card";
import { PageHeader } from "@/components/ui/page-header";
import { PortfolioSummaryCard } from "@/components/ui/portfolio-summary-card";
import { SectionBlock } from "@/components/ui/section-block";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard } from "@/components/ui/table-card";
import { WarningBanner } from "@/components/ui/warning-banner";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  allocationData,
  holdings,
  portfolioSnapshot,
  riskSummary,
  sectorExposure,
} from "@/lib/mock-data";

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portfolio"
        description="Track your holdings, allocation, P/L, sector exposure, and risk summary in one place."
      />

      <PortfolioSummaryCard
        currentValue={portfolioSnapshot.currentEquity}
        dailyPnl={portfolioSnapshot.dailyPnl}
        cash={portfolioSnapshot.cash}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartCard
          title="Allocation chart"
          description="Current portfolio allocation by sector and cash."
          hasData={allocationData.length > 0}
        >
          <StatusBarChart data={allocationData} />
        </ChartCard>

        <SectionBlock title="Sector exposure" description="Exposure overview with quick notes.">
          <div className="space-y-2">
            {sectorExposure.map((item) => (
              <div key={item.sector} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{item.sector}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.exposure}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">{item.note}</p>
              </div>
            ))}
          </div>
        </SectionBlock>
      </div>

      <TableCard
        title="Holdings table"
        description="Realized and unrealized P/L by holding."
        hasRows={holdings.length > 0}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                {[
                  "Symbol",
                  "Sector",
                  "Quantity",
                  "Avg Price",
                  "Current Price",
                  "Realized P/L",
                  "Unrealized P/L",
                  "Risk Level",
                ].map((header) => (
                  <th key={header} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {holdings.map((row) => (
                <tr key={row.symbol} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-sm font-semibold text-slate-900">{row.symbol}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{row.sector}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatNumber(row.quantity)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCurrency(row.averagePrice)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCurrency(row.currentPrice)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCurrency(row.realizedPnl)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCurrency(row.unrealizedPnl)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700"><StatusBadge status={row.riskLevel} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>

      <SectionBlock title="Risk summary" description="Key guardrails and observations.">
        <div className="space-y-2">
          {riskSummary.map((item) => (
            <WarningBanner key={item} title="Risk note" message={item} tone="info" />
          ))}
        </div>
      </SectionBlock>
    </div>
  );
}
