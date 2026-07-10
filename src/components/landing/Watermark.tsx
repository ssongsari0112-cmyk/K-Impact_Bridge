import { cn } from "@/lib/utils";

export function Watermark({ children, className }: { children: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-display text-[clamp(56px,10vw,120px)] font-extrabold leading-none tracking-wide text-white/10",
        className
      )}
    >
      {children}
    </span>
  );
}
