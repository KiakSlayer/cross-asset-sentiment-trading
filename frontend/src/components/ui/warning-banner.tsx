export function WarningBanner({
  title,
  message,
  tone = "warning",
}: {
  title: string;
  message: string;
  tone?: "warning" | "error" | "info";
}) {
  const toneStyles = {
    warning: "border-amber-200 bg-amber-50 text-amber-800",
    error: "border-rose-200 bg-rose-50 text-rose-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  } as const;

  return (
    <div className={`rounded-2xl border p-4 ${toneStyles[tone]}`}>
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm">{message}</p>
    </div>
  );
}
