"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendPoint {
  label: string;
  value: number;
}

type FormatMode = "currency" | "percent" | "number";

function formatValue(value: number, mode: FormatMode): string {
  if (mode === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }

  if (mode === "percent") {
    return `${value.toFixed(2)}%`;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function LineTrendChart({
  data,
  color = "#0284c7",
  formatMode = "number",
}: {
  data: TrendPoint[];
  color?: string;
  formatMode?: FormatMode;
}) {
  if (typeof window === "undefined") {
    return <div className="h-64 w-full rounded-lg bg-slate-100" />;
  }

  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) => formatValue(Number(value), formatMode)}
          />
          <Tooltip
            formatter={(value) => {
              const numericValue = typeof value === "number" ? value : Number(value ?? 0);
              return formatValue(numericValue, formatMode);
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
