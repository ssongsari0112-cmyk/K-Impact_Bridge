"use client";

import { Card } from "@/components/ui/Card";
import { PlaceholderSection } from "@/components/workspace/PlaceholderSection";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Project } from "@/lib/types";

export function ImpactTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const report = project.strategyReport;

  if (!report) {
    return (
      <PlaceholderSection
        title="Expected Impact"
        agent="Impact Agent"
        description="Overview 탭에서 전략 리포트를 생성하면 정량·정성 기대효과가 이곳에 표시됩니다."
      />
    );
  }

  function updateValue(index: number, value: string) {
    if (!report) return;
    const expectedImpact = report.expectedImpact.map((row, i) =>
      i === index ? { ...row, value } : row
    );
    updateProject(project.id, { strategyReport: { ...report, expectedImpact } });
  }

  return (
    <Card>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">기대효과</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {report.expectedImpact.map((row, index) => (
          <div key={row.metric} className="rounded-input border border-line p-3.5">
            <div className="text-xs font-semibold text-ink-soft">{row.metric}</div>
            <input
              value={row.value}
              onChange={(event) => updateValue(index, event.target.value)}
              className="mt-1 w-full rounded-input border border-transparent bg-transparent px-1 py-1 font-display text-lg font-bold text-bridge outline-none transition-colors hover:border-line focus:border-bridge focus:bg-mist"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
