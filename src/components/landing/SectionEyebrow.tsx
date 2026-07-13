import { cn } from "@/lib/utils";

export function SectionEyebrow({
  children,
  className,
}: {
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
      {children}
    </p>
  );
}
