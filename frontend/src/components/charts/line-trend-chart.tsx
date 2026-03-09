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

export function LineTrendChart({
  data,
  color = "#0284c7",
  valueFormatter,
}: {
  data: TrendPoint[];
  color?: string;
  valueFormatter?: (value: number) => string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickFormatter={(value) =>
              valueFormatter ? valueFormatter(Number(value)) : String(value)
            }
          />
          <Tooltip
            formatter={(value: number) =>
              valueFormatter ? valueFormatter(Number(value)) : value.toString()
            }
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
