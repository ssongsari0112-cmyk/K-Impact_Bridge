"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { WORKSPACE_TABS, type WorkspaceTabSlug } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function WorkspaceTabs({ projectId }: { projectId: string }) {
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as WorkspaceTabSlug) ?? "overview";

  return (
    <nav className="flex gap-2 overflow-x-auto border-b-2 border-line">
      {WORKSPACE_TABS.map((tab) => {
        const isActive = tab.slug === activeTab;
        return (
          <Link
            key={tab.slug}
            href={`/projects/${projectId}?tab=${tab.slug}`}
            className={cn(
              "-mb-0.5 shrink-0 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "border-bridge text-bridge"
                : "border-transparent text-ink-soft hover:text-bridge"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
