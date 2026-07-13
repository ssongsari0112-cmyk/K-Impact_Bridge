"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Waypoints } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjectStore } from "@/lib/store/useProjectStore";

export function AppShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const router = useRouter();
  const isAuthenticated = useProjectStore((state) => state.isAuthenticated);
  const userEmail = useProjectStore((state) => state.userEmail);
  const logout = useProjectStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

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
            {isAuthenticated ? (
              <div className="flex items-center gap-3 border-l border-line pl-5">
                <span className="max-w-[160px] truncate text-ink-soft" title={userEmail ?? undefined}>
                  {userEmail}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-semibold text-ink-soft transition-colors hover:text-bridge"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="border-l border-line pl-5 font-semibold text-bridge transition-colors hover:text-harbor"
              >
                로그인
              </Link>
            )}
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
