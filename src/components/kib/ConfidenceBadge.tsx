import { cn } from "@/lib/utils";

const LABELS: Record<"high" | "mid" | "low", string> = {
  high: "신뢰도 높음 · 공식 출처",
  mid: "신뢰도 보통 · 추가 검토 필요",
  low: "데이터 부족",
};

const STYLES: Record<"high" | "mid" | "low", string> = {
  high: "bg-green-soft text-green before:bg-green",
  mid: "bg-amber-soft text-[#8A6420] before:bg-amber",
  low: "bg-red-soft text-red before:bg-red",
};

export function ConfidenceBadge({
  level,
  label,
  className,
}: {
  level: "high" | "mid" | "low";
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-chip px-3 py-1 text-[12.5px] font-semibold",
        "before:block before:h-2 before:w-2 before:rounded-full",
        STYLES[level],
        className
      )}
    >
      {label ?? LABELS[level]}
    </span>
  );
}
