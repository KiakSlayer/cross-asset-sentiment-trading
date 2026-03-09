import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { RecommendationCard } from "@/components/ui/recommendation-card";
import { SectionCard } from "@/components/ui/section-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { evaluateBotActivationGate } from "@/lib/gating";
import { forwardTestRuns } from "@/lib/mock-data";

const riskControls = [
  "Maximum position size: 10% of account",
  "Hard stop-loss: 3% per position",
  "Max portfolio drawdown: 15%",
  "Daily loss guard: stop trading after threshold breach",
];

export default function BotControlPage() {
  const latestCompletedForward = forwardTestRuns.find(
    (run) => run.runStatus === "passed" || run.runStatus === "failed",
  );

  const gate = evaluateBotActivationGate({
    forwardTestGateStatus: latestCompletedForward?.passStatus ?? "pending",
    degradationStatus: "warning",
    requiresForwardTestPass: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bot Control"
        description="Autonomous mode can only activate when forward testing passes and model health stays healthy."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Forward test gate"
          value={gate.forwardTestGateStatus}
          caption="Must be passed before autonomous mode"
        />
        <MetricCard
          label="Model health"
          value={gate.degradationStatus}
          caption="Must be healthy for autonomous mode"
        />
        <MetricCard
          label="Autonomous mode"
          value={gate.canActivateAutonomousTrading ? "Eligible" : "Blocked"}
          caption="Calculated by architectural controls"
        />
        <MetricCard
          label="Active blockers"
          value={String(gate.blockers.length)}
          caption="Resolved blockers are required before activation"
        />
      </div>

      <SectionCard title="Activation gate" description="Centralized status used to allow or block autonomous execution.">
        <div className="mb-4 flex items-center gap-3">
          <StatusBadge status={gate.canActivateAutonomousTrading ? "eligible" : "blocked"} />
          <p className="text-sm text-slate-700">
            {gate.canActivateAutonomousTrading
              ? "All gates are clear. Autonomous mode may be enabled."
              : "Autonomous mode is blocked until all gate conditions pass."}
          </p>
        </div>

        {gate.blockers.length ? (
          <ul className="space-y-2">
            {gate.blockers.map((blocker) => (
              <li key={blocker} className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800">
                {blocker}
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            No blockers. All safety checks are currently satisfied.
          </p>
        )}
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Risk controls" description="These controls are always enforced in autonomous mode.">
          <ul className="space-y-2 text-sm text-slate-700">
            {riskControls.map((control) => (
              <li key={control} className="rounded-lg bg-slate-50 px-3 py-2">
                {control}
              </li>
            ))}
          </ul>
        </SectionCard>

        <RecommendationCard
          title="Activation recommendation"
          recommendation={{
            observed:
              "Forward testing passed, but model degradation monitor is currently in warning state.",
            inferred:
              "Keep the bot in paper mode and investigate model drift before enabling autonomous mode.",
            uncertainty:
              "If warning metrics normalize in the next monitoring cycle, the gate can reopen.",
          }}
          note="This recommendation is generated from gate status only and uses mock monitoring data."
        />
      </div>
    </div>
  );
}
