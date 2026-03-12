export function UncertaintyNote({ note }: { note: string }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Uncertainty note</p>
      <p className="mt-1 text-sm text-slate-700">{note}</p>
    </div>
  );
}
