export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-2xl bg-white" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 animate-pulse rounded-2xl bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}
