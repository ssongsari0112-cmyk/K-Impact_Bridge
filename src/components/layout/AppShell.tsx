import Link from "next/link";
import type { ReactNode } from "react";
import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-1 flex-col bg-mist">
      <header className="border-b-2 border-bridge/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge text-white">
              <Waypoints size={14} strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-harbor">K-Impact Bridge</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-ink-soft">
            <Link href="/dashboard" className="transition-colors hover:text-bridge">
              Dashboard
            </Link>
            <Link href="/profile/new" className="transition-colors hover:text-bridge">
              Profile Builder
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={cn(
          "mx-auto w-full flex-1 px-6 py-10 lg:px-10",
          wide ? "max-w-[1680px]" : "max-w-6xl"
        )}
      >
        {children}
      </main>
    </div>
  );
}
