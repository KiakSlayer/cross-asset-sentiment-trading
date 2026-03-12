import { formatCurrency } from "@/lib/format";

export function PortfolioSummaryCard({
  currentValue,
  dailyPnl,
  cash,
}: {
  currentValue: number;
  dailyPnl: number;
  cash: number;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Your portfolio</h3>
      <p className="mt-2 text-sm text-slate-600">Overview of account value and available cash.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500">Current value</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(currentValue)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Today&apos;s change</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(dailyPnl)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Cash</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(cash)}</p>
        </div>
      </div>
    </article>
  );
}

