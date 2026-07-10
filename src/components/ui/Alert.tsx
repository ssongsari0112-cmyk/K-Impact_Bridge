import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AlertKind = "info" | "demo" | "warn";

const KIND_CLASSES: Record<AlertKind, string> = {
  info: "bg-bridge-soft border-[#C9E1FF] text-harbor",
  demo: "bg-amber-soft border-[#F0D9AE] text-[#6B4E17]",
  warn: "bg-red-soft border-[#EDCBC8] text-[#8F3A34]",
};

const KIND_ICON: Record<AlertKind, string> = {
  info: "ℹ️",
  demo: "🧪",
  warn: "⚠️",
};

export function Alert({
  kind = "info",
  title,
  children,
  className,
}: {
  kind?: AlertKind;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex max-w-2xl gap-3 rounded-input border px-4 py-3.5 text-sm",
        KIND_CLASSES[kind],
        className
      )}
    >
      <span className="shrink-0 text-base leading-relaxed">{KIND_ICON[kind]}</span>
      <div>
        <b className="mb-0.5 block">{title}</b>
        {children}
      </div>
    </div>
  );
}
