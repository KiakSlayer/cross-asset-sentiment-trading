import { PageHeader } from "@/components/ui/page-header";
import { SectionBlock } from "@/components/ui/section-block";
import { StrategyForm } from "@/components/ui/strategy-form";
import { WhyThisMattersCard } from "@/components/ui/why-this-matters-card";

export default function StrategyLabPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Strategy Lab"
        description="Build a strategy test in plain language. Adjust preferences and review the setup summary before testing."
      />

      <StrategyForm />

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionBlock
          title="How this guided flow works"
          description="A simple sequence from setup to validation."
        >
          <ol className="space-y-2 text-sm text-slate-700">
            <li className="rounded-lg bg-slate-50 px-3 py-2">1. Choose sectors and ETFs you want to track.</li>
            <li className="rounded-lg bg-slate-50 px-3 py-2">2. Set risk profile and holding horizon.</li>
            <li className="rounded-lg bg-slate-50 px-3 py-2">3. Run Strategy test (historical check).</li>
            <li className="rounded-lg bg-slate-50 px-3 py-2">4. Move to Forward Test before bot use.</li>
          </ol>
        </SectionBlock>

        <WhyThisMattersCard text="Consistent setup inputs make it easier to compare strategy results over time and avoid accidental over-risking." />
      </div>
    </div>
  );
}
