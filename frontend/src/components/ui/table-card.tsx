import { EmptyState } from "@/components/ui/empty-state";
import { SectionBlock } from "@/components/ui/section-block";

export function TableCard({
  title,
  description,
  hasRows,
  children,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description?: string;
  hasRows: boolean;
  children: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return (
    <SectionBlock title={title} description={description}>
      {hasRows ? (
        children
      ) : (
        <EmptyState
          title={emptyTitle ?? "No records yet"}
          description={emptyDescription ?? "Data will appear here when records are available."}
        />
      )}
    </SectionBlock>
  );
}
