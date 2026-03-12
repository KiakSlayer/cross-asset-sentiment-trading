"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { TableCard } from "@/components/ui/table-card";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import { tradeHistoryRows } from "@/lib/mock-data";

export default function TradeHistoryPage() {
  const [mode, setMode] = useState("all");
  const [symbol, setSymbol] = useState("all");

  const symbols = Array.from(new Set(tradeHistoryRows.map((row) => row.symbol)));

  const filteredRows = useMemo(() => {
    return tradeHistoryRows.filter((row) => {
      const modeMatch = mode === "all" || row.mode === mode;
      const symbolMatch = symbol === "all" || row.symbol === symbol;
      return modeMatch && symbolMatch;
    });
  }, [mode, symbol]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trade History"
        description="Review executed and canceled trades with mode badges: manual, assisted, and bot."
      />

      <FilterBar
        filters={[
          {
            id: "mode",
            label: "Mode",
            value: mode,
            options: ["all", "manual", "assisted", "bot"].map((item) => ({ label: item, value: item })),
          },
          {
            id: "symbol",
            label: "Symbol",
            value: symbol,
            options: ["all", ...symbols].map((item) => ({ label: item, value: item })),
          },
        ]}
        onChange={(id, value) => {
          if (id === "mode") setMode(value);
          if (id === "symbol") setSymbol(value);
        }}
      />

      <TableCard
        title="Trades"
        description="Most recent trade events across all control modes."
        hasRows={filteredRows.length > 0}
        emptyTitle="No trades for selected filters"
        emptyDescription="Try choosing a different mode or symbol."
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead>
              <tr>
                {[
                  "Time",
                  "Symbol",
                  "Side",
                  "Quantity",
                  "Price",
                  "Notional",
                  "Mode",
                  "Status",
                ].map((header) => (
                  <th key={header} className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 text-sm text-slate-700">{formatDateTime(row.timestamp)}</td>
                  <td className="px-3 py-3 text-sm font-semibold text-slate-900">{row.symbol}</td>
                  <td className="px-3 py-3 text-sm text-slate-700"><StatusBadge status={row.side} /></td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatNumber(row.quantity)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCurrency(row.price)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{formatCurrency(row.quantity * row.price)}</td>
                  <td className="px-3 py-3 text-sm text-slate-700"><StatusBadge status={row.mode} /></td>
                  <td className="px-3 py-3 text-sm text-slate-700"><StatusBadge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableCard>

      {!filteredRows.length ? (
        <EmptyState
          title="No matching trades"
          description="Once new trades arrive, they will appear here automatically."
        />
      ) : null}
    </div>
  );
}
