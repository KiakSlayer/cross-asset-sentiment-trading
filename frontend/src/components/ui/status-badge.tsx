type SupportedStatus =
  | "pending"
  | "passed"
  | "failed"
  | "suppressed"
  | "running"
  | "canceled"
  | "filled"
  | "rejected"
  | "healthy"
  | "warning"
  | "degraded"
  | "halted"
  | "eligible"
  | "blocked"
  | "manual"
  | "assisted"
  | "bot"
  | "active"
  | "paused"
  | "stopped"
  | "low"
  | "medium"
  | "high"
  | "buy"
  | "sell"
  | string;

function getStatusStyle(status: SupportedStatus): string {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    passed: "bg-emerald-100 text-emerald-800",
    failed: "bg-rose-100 text-rose-800",
    suppressed: "bg-slate-200 text-slate-700",
    running: "bg-sky-100 text-sky-800",
    canceled: "bg-slate-200 text-slate-700",
    filled: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    healthy: "bg-emerald-100 text-emerald-800",
    warning: "bg-amber-100 text-amber-800",
    degraded: "bg-orange-100 text-orange-800",
    halted: "bg-rose-100 text-rose-800",
    eligible: "bg-emerald-100 text-emerald-800",
    blocked: "bg-rose-100 text-rose-800",
    manual: "bg-slate-200 text-slate-700",
    assisted: "bg-sky-100 text-sky-800",
    bot: "bg-emerald-100 text-emerald-800",
    active: "bg-emerald-100 text-emerald-800",
    paused: "bg-amber-100 text-amber-800",
    stopped: "bg-slate-200 text-slate-700",
    low: "bg-emerald-100 text-emerald-800",
    medium: "bg-amber-100 text-amber-800",
    high: "bg-rose-100 text-rose-800",
    buy: "bg-emerald-100 text-emerald-800",
    sell: "bg-rose-100 text-rose-800",
  };

  return styles[status] ?? "bg-slate-200 text-slate-700";
}

export function StatusBadge({ status }: { status: SupportedStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(status)}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
