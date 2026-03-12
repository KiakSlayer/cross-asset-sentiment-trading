"use client";

export interface FilterGroup {
  id: string;
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: FilterGroup[];
  onChange: (id: string, value: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {filters.map((filter) => (
          <label key={filter.id} className="text-sm">
            <span className="mb-1 block text-slate-600">{filter.label}</span>
            <select
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              value={filter.value}
              onChange={(event) => onChange(filter.id, event.target.value)}
            >
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
