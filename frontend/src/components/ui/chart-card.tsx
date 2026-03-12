import { EmptyState } from "@/components/ui/empty-state";
import { SectionBlock } from "@/components/ui/section-block";

export function ChartCard({
  title,
  description,
  hasData,
  children,
}: {
  title: string;
  description?: string;
  hasData: boolean;
  children: React.ReactNode;
}) {
  return (
    <SectionBlock title={title} description={description}>
      {hasData ? children : <EmptyState title="No chart data" description="Chart data will appear here once available." />}
    </SectionBlock>
  );
}
