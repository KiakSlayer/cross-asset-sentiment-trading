export function ExplainerCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <aside className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-slate-700">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-2">{body}</p>
    </aside>
  );
}
