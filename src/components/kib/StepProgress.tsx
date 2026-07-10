import { cn } from "@/lib/utils";

export interface StepItem {
  label: string;
  state: "done" | "now" | "pending";
}

export function StepProgress({ items, className }: { items: StepItem[]; className?: string }) {
  return (
    <div
      className={cn(
        "flex max-w-xl flex-wrap items-center gap-2.5 sm:flex-nowrap sm:gap-0",
        className
      )}
    >
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center">
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border font-display text-[13px] font-semibold",
                item.state === "done" && "border-bridge bg-bridge text-white",
                item.state === "now" && "border-2 border-bridge bg-white text-bridge",
                item.state === "pending" && "border-line bg-mist text-ink-soft"
              )}
            >
              {item.state === "done" ? "✓" : index + 1}
            </span>
            <span
              className={cn(
                "text-[13px] font-semibold",
                item.state === "pending" ? "text-ink-soft" : "text-ink"
              )}
            >
              {item.label}
            </span>
          </div>
          {index < items.length - 1 && (
            <div
              className={cn(
                "mx-2.5 hidden h-px w-10 sm:block sm:flex-1",
                item.state === "done" ? "bg-bridge" : "bg-line"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
