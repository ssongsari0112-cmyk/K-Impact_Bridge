"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WORKSPACE_TABS } from "@/lib/constants";

export function WorkspaceTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 border-b border-black/10 pb-3 dark:border-white/10">
      {WORKSPACE_TABS.map((tab) => {
        const href = `/projects/${projectId}/${tab.slug}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`rounded-full px-3 py-1.5 text-sm ${
              isActive
                ? "bg-foreground text-background"
                : "text-foreground/60 hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
