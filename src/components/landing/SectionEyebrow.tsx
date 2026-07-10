import { cn } from "@/lib/utils";

export function SectionEyebrow({
  n,
  children,
  className,
}: {
  n?: number;
  children: string;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-display text-xs font-semibold uppercase tracking-[0.14em] text-harbor",
        className
      )}
    >
      {typeof n === "number" && (
        <span className="text-bridge">{String(n).padStart(2, "0")}. </span>
      )}
      {children}
    </p>
  );
}
