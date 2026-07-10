"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Project, StrategyReport } from "@/lib/types";

const STRATEGY_BRIDGE_NODES = [
  { title: "프로필 · 국가 · 파트너", subtitle: "데이터 종합" },
  { title: "AI 전략 분석", subtitle: "Value Chain · 리스크 · 로드맵" },
  { title: "전략 리포트", subtitle: "11개 섹션 생성" },
];

const NEXT_STEP: Record<Project["status"], string> = {
  profile: "전략 리포트를 생성해 워크스페이스 전체를 채워보세요.",
  country: "국가 분석이 반영되었습니다. 전략 리포트를 생성해보세요.",
  partner: "파트너 매칭이 반영되었습니다. 전략 리포트를 생성해보세요.",
  report_ready: "전략 리포트가 준비되었습니다. Proposal 탭에서 기획서 초안을 생성해보세요.",
};

export function OverviewTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const mergeCitations = useProjectStore((state) => state.mergeCitations);
  const [loading, setLoading] = useState(false);

  async function generateStrategyReport() {
    setLoading(true);
    const response = await fetch("/api/agents/strategy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });
    const result = (await response.json()) as { data: StrategyReport; isDemo: boolean };
    updateProject(project.id, { strategyReport: result.data, status: "report_ready" });
    const reportCitations = result.data.similarProjects.map((item) => item.citation);
    mergeCitations(reportCitations, project.id);
    setLoading(false);
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Card>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">프로젝트</h2>
        <p className="mt-2 font-semibold text-harbor">{project.title}</p>
        <p className="mt-1 text-sm text-ink-soft">Mode: {project.mode}</p>
        <p className="text-sm text-ink-soft">Status: {project.status}</p>
      </Card>
      <Card>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">조직</h2>
        {project.profile ? (
          <>
            <p className="mt-2 font-semibold text-harbor">{project.profile.name}</p>
            <p className="mt-1 text-sm text-ink-soft">{project.profile.oneLiner}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.profile.sdgs.map((sdg) => (
                <SdgBadge key={sdg} label={sdg} />
              ))}
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">프로필 정보가 없습니다.</p>
        )}
      </Card>

      <Card className="sm:col-span-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge-soft text-bridge">
            <Sparkles size={14} />
          </span>
          <h2 className="text-sm font-semibold text-bridge">다음 할 일</h2>
        </div>
        <p className="mt-2 text-sm text-ink-soft">{NEXT_STEP[project.status]}</p>

        {loading ? (
          <div className="mt-6">
            <BridgeLineLoading nodes={STRATEGY_BRIDGE_NODES} />
          </div>
        ) : (
          !project.strategyReport && (
            <Button className="mt-4" onClick={generateStrategyReport}>
              전략 리포트 생성
            </Button>
          )
        )}
      </Card>
    </div>
  );
}
