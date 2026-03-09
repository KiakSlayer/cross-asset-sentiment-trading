import type { RecommendationExplanation } from "@/types/domain";

export function RecommendationCard({
  title,
  recommendation,
  note,
}: {
  title: string;
  recommendation: RecommendationExplanation;
  note?: string;
}) {
  return (
    <article className="rounded-2xl border border-teal-200 bg-teal-50 p-4">
      <h4 className="text-base font-bold text-slate-900">{title}</h4>
      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">What was observed:</span>{" "}
          {recommendation.observed}
        </p>
        <p>
          <span className="font-semibold text-slate-900">What was inferred:</span>{" "}
          {recommendation.inferred}
        </p>
        <p>
          <span className="font-semibold text-slate-900">What the uncertainty is:</span>{" "}
          {recommendation.uncertainty}
        </p>
      </div>
      {note ? <p className="mt-3 text-xs text-slate-600">{note}</p> : null}
    </article>
  );
}
