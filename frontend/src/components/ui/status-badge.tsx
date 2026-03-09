import type {
  DegradationStatus,
  RunStatus,
  ValidationStatus,
} from "@/types/domain";

type TradeStatus = "filled" | "canceled" | "rejected";

type SupportedStatus =
  | ValidationStatus
  | RunStatus
  | DegradationStatus
  | TradeStatus
  | "eligible"
  | "blocked";

const statusStyles: Record<SupportedStatus, string> = {
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
};

export function StatusBadge({ status }: { status: SupportedStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
