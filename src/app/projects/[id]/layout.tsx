import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";

export default async function ProjectWorkspaceLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Project Workspace</h1>
      <p className="mt-1 text-sm text-foreground/60">Project ID: {id}</p>
      <div className="mt-6">
        <WorkspaceTabs projectId={id} />
        <div className="mt-6">{children}</div>
      </div>
    </AppShell>
  );
}
