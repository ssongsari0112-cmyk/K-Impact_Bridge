import { cn } from "@/lib/utils";

const SDG_COLORS: Record<string, string> = {
  "SDG 2": "bg-[#DDA63A]",
  "SDG 3": "bg-[#4C9F38]",
  "SDG 4": "bg-[#C5192D]",
  "SDG 6": "bg-[#26BDE2]",
  "SDG 7": "bg-[#FCC30B]",
  "SDG 9": "bg-[#FD6925]",
  "SDG 11": "bg-[#FD9D24]",
};

export function SdgBadge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-md px-2 py-[3px] font-display text-[11.5px] font-bold text-white",
        SDG_COLORS[label] ?? "bg-ink-soft",
        className
      )}
    >
      {label}
    </span>
  );
}
