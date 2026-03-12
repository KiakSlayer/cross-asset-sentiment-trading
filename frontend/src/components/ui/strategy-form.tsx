"use client";

import { useMemo, useState } from "react";

interface StrategyFormState {
  initialCapital: string;
  sectors: string[];
  dateFrom: string;
  dateTo: string;
  riskProfile: string;
  holdingHorizon: string;
  stopLoss: string;
  takeProfit: string;
}

const sectorOptions = ["Technology", "Energy", "Healthcare", "Financials", "Consumer"];

export function StrategyForm() {
  const [form, setForm] = useState<StrategyFormState>({
    initialCapital: "50000",
    sectors: ["Technology", "Healthcare"],
    dateFrom: "2024-01-01",
    dateTo: "2025-12-31",
    riskProfile: "Balanced",
    holdingHorizon: "1-4 weeks",
    stopLoss: "5%",
    takeProfit: "12%",
  });

  const summary = useMemo(() => {
    return `You plan to start with $${Number(form.initialCapital).toLocaleString()} across ${form.sectors.join(", ")} with a ${form.riskProfile.toLowerCase()} risk profile, ${form.holdingHorizon} holding horizon, ${form.stopLoss} stop-loss, and ${form.takeProfit} take-profit target.`;
  }, [form]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Strategy setup</h3>
      <p className="text-sm text-slate-600">Set preferences in plain language. This is mock input for demo only.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Initial capital</span>
          <input
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            value={form.initialCapital}
            onChange={(e) => setForm((prev) => ({ ...prev, initialCapital: e.target.value }))}
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Date range</span>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="rounded-xl border border-slate-300 px-3 py-2"
              value={form.dateFrom}
              onChange={(e) => setForm((prev) => ({ ...prev, dateFrom: e.target.value }))}
            />
            <input
              type="date"
              className="rounded-xl border border-slate-300 px-3 py-2"
              value={form.dateTo}
              onChange={(e) => setForm((prev) => ({ ...prev, dateTo: e.target.value }))}
            />
          </div>
        </label>

        <div className="text-sm md:col-span-2">
          <span className="mb-2 block text-slate-700">Sectors / ETFs</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {sectorOptions.map((sector) => {
              const selected = form.sectors.includes(sector);
              return (
                <button
                  key={sector}
                  type="button"
                  className={`rounded-xl border px-3 py-2 text-left ${selected ? "border-sky-500 bg-sky-50 text-sky-800" : "border-slate-300 bg-white text-slate-700"}`}
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      sectors: selected
                        ? prev.sectors.filter((item) => item !== sector)
                        : [...prev.sectors, sector],
                    }))
                  }
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </div>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Risk profile</span>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            value={form.riskProfile}
            onChange={(e) => setForm((prev) => ({ ...prev, riskProfile: e.target.value }))}
          >
            <option>Conservative</option>
            <option>Balanced</option>
            <option>Growth</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Holding horizon</span>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            value={form.holdingHorizon}
            onChange={(e) => setForm((prev) => ({ ...prev, holdingHorizon: e.target.value }))}
          >
            <option>1-3 days</option>
            <option>1-4 weeks</option>
            <option>1-3 months</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Stop-loss preference</span>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            value={form.stopLoss}
            onChange={(e) => setForm((prev) => ({ ...prev, stopLoss: e.target.value }))}
          >
            <option>3%</option>
            <option>5%</option>
            <option>8%</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block text-slate-700">Take-profit preference</span>
          <select
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            value={form.takeProfit}
            onChange={(e) => setForm((prev) => ({ ...prev, takeProfit: e.target.value }))}
          >
            <option>8%</option>
            <option>12%</option>
            <option>15%</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Your setup summary</p>
        <p className="mt-1">{summary}</p>
      </div>
    </div>
  );
}
