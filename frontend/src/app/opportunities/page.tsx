"use client";

import { useMemo, useState } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { OpportunityCard } from "@/components/ui/opportunity-card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { WarningBanner } from "@/components/ui/warning-banner";
import { opportunityFilterOptions, topOpportunities } from "@/lib/mock-data";

export default function OpportunitiesPage() {
  const [sector, setSector] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [risk, setRisk] = useState("all");

  const filtered = useMemo(() => {
    return topOpportunities.filter((item) => {
      const sectorMatch = sector === "all" || item.sector === sector;
      const confidenceMatch = confidence === "all" || item.confidence === confidence;
      const riskMatch = risk === "all" || item.riskLevel === risk;
      return sectorMatch && confidenceMatch && riskMatch && item.validationStatus === "passed";
    });
  }, [confidence, risk, sector]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Opportunities"
        description="Validated opportunities with Suggested Action, Confidence, Risk Level, and plain-language context."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Validated opportunities" value={String(filtered.length)} subtitle="Currently visible" />
        <StatCard label="Confidence focus" value={confidence === "all" ? "All" : confidence} subtitle="Filter" />
        <StatCard label="Risk focus" value={risk === "all" ? "All" : risk} subtitle="Filter" />
      </div>

      <FilterBar
        filters={[
          {
            id: "sector",
            label: "Sector",
            value: sector,
            options: opportunityFilterOptions.sector.map((item) => ({ label: item, value: item })),
          },
          {
            id: "confidence",
            label: "Confidence",
            value: confidence,
            options: opportunityFilterOptions.confidence.map((item) => ({ label: item, value: item })),
          },
          {
            id: "risk",
            label: "Risk Level",
            value: risk,
            options: opportunityFilterOptions.risk.map((item) => ({ label: item, value: item })),
          },
        ]}
        onChange={(id, value) => {
          if (id === "sector") setSector(value);
          if (id === "confidence") setConfidence(value);
          if (id === "risk") setRisk(value);
        }}
      />

      <WarningBanner
        title="Validation gate"
        message="Only opportunities with passed validation are shown in this feed."
        tone="info"
      />

      {filtered.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((item) => (
            <OpportunityCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No opportunities match your filters"
          description="Try broadening sector, confidence, or risk level filters."
        />
      )}
    </div>
  );
}
