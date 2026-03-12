export function WhyThisMattersCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-teal-200 bg-teal-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Why this matters</p>
      <p className="mt-1 text-sm text-slate-700">{text}</p>
    </div>
  );
}
