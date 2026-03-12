import { StatusBadge } from "@/components/ui/status-badge";

export function ValidationStatusBadge({
  status,
}: {
  status: "pending" | "passed" | "failed" | "suppressed";
}) {
  return <StatusBadge status={status} />;
}
