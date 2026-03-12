import { StatusBadge } from "@/components/ui/status-badge";

export function BotStatusCard({
  status,
  mode,
  openPositions,
  todayActions,
  cumulativePnl,
}: {
  status: "active" | "paused" | "stopped";
  mode: "manual" | "assisted" | "bot";
  openPositions: number;
  todayActions: number;
  cumulativePnl: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Bot status</h3>
        <StatusBadge status={status} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-slate-500">Current mode</p>
          <div className="mt-1"><StatusBadge status={mode} /></div>
        </div>
        <div>
          <p className="text-xs text-slate-500">Open positions</p>
          <p className="text-lg font-semibold text-slate-900">{openPositions}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Today&apos;s actions</p>
          <p className="text-lg font-semibold text-slate-900">{todayActions}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Cumulative P/L</p>
          <p className="text-lg font-semibold text-slate-900">{cumulativePnl}</p>
        </div>
      </div>
    </article>
  );
}

