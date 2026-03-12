export function WhatHappenedCard({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What happened</p>
      <p className="mt-1 text-sm text-slate-700">{text}</p>
    </div>
  );
}
