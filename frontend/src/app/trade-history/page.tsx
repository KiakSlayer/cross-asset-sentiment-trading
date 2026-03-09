import { DataTable, type TableColumn } from "@/components/ui/data-table";
import { ExplainerCard } from "@/components/ui/explainer-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDateTime, formatNumber } from "@/lib/format";
import { tradeHistory } from "@/lib/mock-data";
import type { TradeRecord } from "@/types/domain";

const columns: TableColumn<TradeRecord>[] = [
  {
    key: "time",
    header: "Time",
    render: (row) => formatDateTime(row.timestamp),
  },
  {
    key: "symbol",
    header: "Asset",
    render: (row) => <span className="font-semibold text-slate-900">{row.symbol}</span>,
  },
  {
    key: "side",
    header: "Side",
    render: (row) => <span className="capitalize">{row.side}</span>,
  },
  {
    key: "qty",
    header: "Quantity",
    render: (row) => formatNumber(row.quantity),
  },
  {
    key: "price",
    header: "Price",
    render: (row) => formatCurrency(row.price),
  },
  {
    key: "notional",
    header: "Trade Value",
    render: (row) => formatCurrency(row.notionalValue),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

export default function TradeHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Trade History"
        description="Timeline of recent paper-mode orders with clear status labels and simple wording."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title="Recent orders" description="Most recent activity from the demo account.">
            <DataTable
              rows={tradeHistory}
              getRowKey={(row) => row.id}
              columns={columns}
              emptyMessage="No trade history is available yet."
            />
          </SectionCard>
        </div>
        <ExplainerCard
          title="How to read this"
          body="Filled means the trade executed. Canceled means it was stopped before execution. Rejected means the risk rules blocked it."
        />
      </div>
    </div>
  );
}

