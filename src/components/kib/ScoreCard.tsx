import { cn } from "@/lib/utils";

export function scoreTier(score: number): "high" | "mid" | "low" {
  if (score >= 75) return "high";
  if (score >= 50) return "mid";
  return "low";
}

const TIER_COLOR = {
  high: { text: "text-green", bar: "bg-green" },
  mid: { text: "text-amber", bar: "bg-amber" },
  low: { text: "text-red", bar: "bg-red" },
};

export function ScoreCard({
  label = "Opportunity Score",
  score,
  className,
}: {
  label?: string;
  score: number;
  className?: string;
}) {
  const t = TIER_COLOR[scoreTier(score)];
  return (
    <div
      className={cn(
        "min-w-[150px] rounded-card border border-line bg-white px-5 py-4",
        className
      )}
    >
      <div className="text-xs font-semibold tracking-wide text-ink-soft">{label}</div>
      <div className={cn("font-display text-[32px] font-bold leading-[1.15]", t.text)}>
        {score}
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist">
        <div className={cn("h-full rounded-full", t.bar)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
