"use client";

import { Card } from "@/components/ui/Card";
import { PlaceholderSection } from "@/components/workspace/PlaceholderSection";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Project } from "@/lib/types";

export function ValueChainTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const report = project.strategyReport;

  if (!report) {
    return (
      <PlaceholderSection
        title="Value Chain"
        agent="Strategy Agent"
        description="Overview 탭에서 전략 리포트를 생성하면 기업·파트너·정부·현지사회 간 역할 분담이 이곳에 표시됩니다."
      />
    );
  }

  function updateRole(index: number, role: string) {
    if (!report) return;
    const valueChain = report.valueChain.map((row, i) => (i === index ? { ...row, role } : row));
    updateProject(project.id, { strategyReport: { ...report, valueChain } });
  }

  return (
    <Card>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">
        Value Chain · 역할 분담
      </h2>
      <div className="mt-4 flex flex-col divide-y divide-line">
        {report.valueChain.map((row, index) => (
          <div key={row.actor} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr] sm:gap-4">
            <span className="font-semibold text-harbor">{row.actor}</span>
            <input
              value={row.role}
              onChange={(event) => updateRole(index, event.target.value)}
              className="rounded-input border border-transparent bg-transparent px-2 py-1 text-sm text-ink outline-none transition-colors hover:border-line focus:border-bridge focus:bg-mist"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
