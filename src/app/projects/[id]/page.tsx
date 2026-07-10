"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { WorkspaceTabs } from "@/components/workspace/WorkspaceTabs";
import { DownloadMenu } from "@/components/workspace/DownloadMenu";
import { BridgeRule } from "@/components/ui/BridgeRule";
import { OverviewTab } from "@/components/workspace/tabs/OverviewTab";
import { CountryTab } from "@/components/workspace/tabs/CountryTab";
import { PartnerTab } from "@/components/workspace/tabs/PartnerTab";
import { ValueChainTab } from "@/components/workspace/tabs/ValueChainTab";
import { RiskTab } from "@/components/workspace/tabs/RiskTab";
import { ImpactTab } from "@/components/workspace/tabs/ImpactTab";
import { RoadmapTab } from "@/components/workspace/tabs/RoadmapTab";
import { ProposalTab } from "@/components/workspace/tabs/ProposalTab";
import { ReferencesTab } from "@/components/workspace/tabs/ReferencesTab";
import { ChatTab } from "@/components/workspace/tabs/ChatTab";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { WorkspaceTabSlug } from "@/lib/constants";

function WorkspaceContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const projectId = params.id;
  const tab = (searchParams.get("tab") as WorkspaceTabSlug) ?? "overview";

  const hasHydrated = useProjectStore((state) => state.hasHydrated);
  const project = useProjectStore((state) => state.projects[projectId]);

  if (!hasHydrated) {
    return (
      <AppShell>
        <p className="text-sm text-ink-soft">불러오는 중…</p>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <p className="text-sm text-ink-soft">
          프로젝트를 찾을 수 없습니다.{" "}
          <Link href="/dashboard" className="font-semibold text-bridge hover:text-harbor">
            대시보드로 돌아가기
          </Link>
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-harbor">{project.title}</h1>
          <p className="mt-1 font-mono text-xs text-ink-soft">Project ID: {project.id}</p>
          <BridgeRule className="mt-4" />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/projects/${project.id}/report`}
            className="flex items-center gap-1.5 rounded-input border border-line px-3.5 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-bridge hover:text-bridge"
          >
            <FileText size={14} />
            전체 리포트 보기
          </Link>
          <DownloadMenu project={project} />
        </div>
      </div>

      <div className="mt-6">
        <WorkspaceTabs projectId={project.id} />
        <div className="mt-6">
          {tab === "overview" && <OverviewTab project={project} />}
          {tab === "country" && <CountryTab project={project} />}
          {tab === "partner" && <PartnerTab project={project} />}
          {tab === "value-chain" && <ValueChainTab project={project} />}
          {tab === "risk" && <RiskTab project={project} />}
          {tab === "impact" && <ImpactTab project={project} />}
          {tab === "roadmap" && <RoadmapTab project={project} />}
          {tab === "proposal" && <ProposalTab project={project} />}
          {tab === "references" && <ReferencesTab project={project} />}
          {tab === "chat" && <ChatTab project={project} />}
        </div>
      </div>
    </AppShell>
  );
}

export default function ProjectWorkspacePage() {
  return (
    <Suspense fallback={null}>
      <WorkspaceContent />
    </Suspense>
  );
}
