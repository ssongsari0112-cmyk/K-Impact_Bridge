import { cn } from "@/lib/utils";

export function CitationChip({
  label,
  href,
  demo = false,
  className,
}: {
  label: string;
  href?: string;
  demo?: boolean;
  className?: string;
}) {
  const content = (
    <>
      <span
        className={cn(
          "h-[7px] w-[7px] shrink-0 rounded-full",
          demo ? "bg-amber" : "bg-bridge"
        )}
      />
      {label}
      {!demo && <span className="font-display text-[11px] opacity-55">↗</span>}
    </>
  );

  const chipClasses = cn(
    "inline-flex items-center gap-[7px] rounded-chip py-1 pl-[9px] pr-3 text-[12.5px] font-medium transition-colors",
    demo
      ? "border border-[#F0D9AE] bg-amber-soft text-[#7A5A1D]"
      : "border border-[#C9E1FF] bg-bridge-soft text-harbor hover:border-bridge hover:bg-[#DCEBFF]",
    className
  );

  if (href && !demo) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={chipClasses}>
        {content}
      </a>
    );
  }

  return <span className={chipClasses}>{content}</span>;
}
