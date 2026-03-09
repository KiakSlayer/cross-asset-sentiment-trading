"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StatusPoint {
  label: string;
  value: number;
}

export function StatusBarChart({
  data,
  color = "#0f766e",
}: {
  data: StatusPoint[];
  color?: string;
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
