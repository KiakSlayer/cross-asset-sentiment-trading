"use client";

import { UncertaintyNote } from "@/components/ui/uncertainty-note";
import { ValidationStatusBadge } from "@/components/ui/validation-status-badge";
import { WhatHappenedCard } from "@/components/ui/what-happened-card";
import { WhyThisMattersCard } from "@/components/ui/why-this-matters-card";

export interface OpportunityCardData {
  id: string;
  sector: string;
  etf: string;
  suggestedAction: string;
  confidence: string;
  riskLevel: string;
  whatHappened: string;
  whyThisMatters: string;
  uncertaintyNote: string;
  validationStatus: "pending" | "passed" | "failed" | "suppressed";
}

export function OpportunityCard({
  item,
  onSimulate,
}: {
  item: OpportunityCardData;
  onSimulate?: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900">{item.sector}</p>
          <p className="text-xs text-slate-600">ETF: {item.etf}</p>
        </div>
        <ValidationStatusBadge status={item.validationStatus} />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-xs text-slate-500">Suggested Action</p>
          <p className="text-sm font-semibold text-slate-900">{item.suggestedAction}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-xs text-slate-500">Confidence</p>
          <p className="text-sm font-semibold text-slate-900">{item.confidence}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-2">
          <p className="text-xs text-slate-500">Risk Level</p>
          <p className="text-sm font-semibold text-slate-900">{item.riskLevel}</p>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <WhatHappenedCard text={item.whatHappened} />
        <WhyThisMattersCard text={item.whyThisMatters} />
        <UncertaintyNote note={item.uncertaintyNote} />
      </div>

      <button
        type="button"
        className="mt-3 w-full rounded-xl bg-sky-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        onClick={() => onSimulate?.(item.id)}
      >
        Simulate
      </button>
    </article>
  );
}
