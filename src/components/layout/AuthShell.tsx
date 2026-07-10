import Link from "next/link";
import type { ReactNode } from "react";
import { Waypoints } from "lucide-react";
import { BridgeRule } from "@/components/ui/BridgeRule";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-1 items-center justify-center bg-mist px-6 py-16">
      <div className="w-full max-w-sm rounded-card border border-line bg-white p-8 shadow-kib-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge text-white">
            <Waypoints size={14} strokeWidth={2.5} />
          </span>
          <span className="text-sm font-semibold text-harbor">K-Impact Bridge</span>
        </Link>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-harbor">{title}</h1>
        <BridgeRule className="mt-3 w-16" />
        <p className="mt-3 text-sm text-ink-soft">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-sm text-ink-soft">{footer}</div>
      </div>
    </div>
  );
}
