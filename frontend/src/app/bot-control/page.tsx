import { BotStatusCard } from "@/components/ui/bot-status-card";
import { PageHeader } from "@/components/ui/page-header";
import { SectionBlock } from "@/components/ui/section-block";
import { StatCard } from "@/components/ui/stat-card";
import { WarningBanner } from "@/components/ui/warning-banner";
import { botControlSummary } from "@/lib/mock-data";

export default function BotControlPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bot Control"
        description="Monitor bot status, risk settings, and regime notes before start, pause, or stop actions."
      />

      <BotStatusCard
        status={botControlSummary.status}
        mode={botControlSummary.mode}
        openPositions={botControlSummary.openPositions}
        todayActions={botControlSummary.todayActions}
        cumulativePnl={botControlSummary.cumulativePnl}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current mode" value={botControlSummary.mode} subtitle="Manual / Assisted / Bot" />
        <StatCard label="Open positions" value={String(botControlSummary.openPositions)} subtitle="Active now" />
        <StatCard label="Today's actions" value={String(botControlSummary.todayActions)} subtitle="Orders created today" />
        <StatCard label="Cumulative P/L" value={botControlSummary.cumulativePnl} subtitle="Paper trading only" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionBlock title="Risk settings" description="Current protection settings for bot actions.">
          <ul className="space-y-2 text-sm text-slate-700">
            {botControlSummary.riskSettings.map((setting) => (
              <li key={setting} className="rounded-lg bg-slate-50 px-3 py-2">{setting}</li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Controls" description="Demo controls (no live execution in this scaffold).">
          <div className="grid grid-cols-3 gap-2">
            <button type="button" className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">Start</button>
            <button type="button" className="rounded-xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white">Pause</button>
            <button type="button" className="rounded-xl bg-rose-600 px-3 py-2 text-sm font-semibold text-white">Stop</button>
          </div>
          <p className="mt-3 text-xs text-slate-500">Buttons are mock controls for UI scaffolding only.</p>
        </SectionBlock>
      </div>

      <SectionBlock title="Warning panel" description="Important safety messages before bot activation.">
        <div className="space-y-2">
          {botControlSummary.warnings.map((message, index) => (
            <WarningBanner key={message} title="Action required" message={message} tone={index === 0 ? "error" : "warning"} />
          ))}
        </div>
      </SectionBlock>

      <WarningBanner
        title="Current regime summary"
        message={botControlSummary.regimeSummary}
        tone="info"
      />
    </div>
  );
}

