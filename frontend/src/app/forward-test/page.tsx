import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard } from "@/components/ui/table-card";
import { ValidationStatusBadge } from "@/components/ui/validation-status-badge";
import { WarningBanner } from "@/components/ui/warning-banner";
import {
  forwardTestMetrics,
  forwardVsBacktestComparison,
  forwardWarnings,
} from "@/lib/mock-data";

export default function ForwardTestPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Forward Test"
        description="Live-like paper trial performance before bot eligibility."
      />

      <WarningBanner
        title="Forward Test status"
        message="Forward test is running with moderate divergence from backtest expectations."
        tone="warning"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {forwardTestMetrics.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} subtitle={item.subtitle} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-lg font-bold text-slate-900">Bot eligibility</h3>
          <ValidationStatusBadge status="pending" />
        </div>
        <p className="mt-2 text-sm text-slate-600">
          Bot use remains on hold until forward-test divergence warnings are reduced.
        </p>
      </div>

      <TableCard
        title="Backtest vs Forward Test"
        description="Comparison of expectations and current trial behavior."
        hasRows={forwardVsBacktestComparison.length > 0}
      >
        <div className="space-y-2">
          {forwardVsBacktestComparison.map((row) => (
            <div key={row.metric} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-semibold text-slate-900">{row.metric}</p>
                <StatusBadge status={row.divergence.toLowerCase()} />
              </div>
              <p className="text-sm text-slate-700">Expected: {row.expected}</p>
              <p className="text-sm text-slate-700">Forward Test: {row.actual}</p>
            </div>
          ))}
        </div>
      </TableCard>

      <div className="grid gap-3">
        {forwardWarnings.map((message) => (
          <WarningBanner key={message} title="Divergence warning" message={message} tone="warning" />
        ))}
      </div>
    </div>
  );
}
