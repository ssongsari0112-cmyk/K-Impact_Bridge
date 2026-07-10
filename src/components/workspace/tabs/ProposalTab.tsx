"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Project, ProposalDraft } from "@/lib/types";

const PROPOSAL_BRIDGE_NODES = [
  { title: "전략 리포트", subtitle: "핵심 내용 요약" },
  { title: "AI 기획서 작성", subtitle: "15개 섹션 초안" },
  { title: "사업기획서", subtitle: "KOICA 제출 형식" },
];

export function ProposalTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const [loading, setLoading] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  async function generateProposal() {
    setLoading(true);
    const response = await fetch("/api/agents/proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });
    const result = (await response.json()) as { data: ProposalDraft };
    updateProject(project.id, { proposalDraft: result.data });
    setLoading(false);
  }

  async function regenerateSection(index: number) {
    setRegeneratingIndex(index);
    const response = await fetch("/api/agents/proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project, sectionIndex: index }),
    });
    const result = (await response.json()) as { data: ProposalDraft };
    const current = project.proposalDraft;
    if (current) {
      const baseSection = result.data.sections[index];
      const sections = current.sections.map((section, i) =>
        i === index
          ? { ...baseSection, content: `${baseSection.content} (AI가 방금 다시 작성한 버전입니다.)` }
          : section
      );
      updateProject(project.id, { proposalDraft: { ...current, sections } });
    }
    setRegeneratingIndex(null);
  }

  if (loading) {
    return (
      <div className="mt-4">
        <BridgeLineLoading nodes={PROPOSAL_BRIDGE_NODES} />
      </div>
    );
  }

  if (!project.proposalDraft) {
    return (
      <Card>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">
          사업기획서 초안
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          전략 리포트 내용을 바탕으로 KOICA 제출용 사업기획서 15개 섹션을 생성합니다.
        </p>
        <Button className="mt-4" onClick={generateProposal}>
          기획서 생성
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {project.proposalDraft.sections.map((section, index) => (
        <Card key={section.title}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-harbor">{section.title}</h3>
            <button
              type="button"
              onClick={() => regenerateSection(index)}
              disabled={regeneratingIndex !== null}
              className="flex items-center gap-1 text-xs font-semibold text-bridge hover:text-harbor disabled:opacity-40"
            >
              <RefreshCw size={12} className={regeneratingIndex === index ? "animate-spin" : ""} />
              다시 생성
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{section.content}</p>
        </Card>
      ))}
    </div>
  );
}
