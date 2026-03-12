export function StatCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {subtitle ? <p className="mt-2 text-xs text-slate-600">{subtitle}</p> : null}
    </article>
  );
}
