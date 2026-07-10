"use client";

import { Card } from "@/components/ui/Card";
import { PlaceholderSection } from "@/components/workspace/PlaceholderSection";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Project } from "@/lib/types";

export function RoadmapTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const report = project.strategyReport;

  if (!report) {
    return (
      <PlaceholderSection
        title="Roadmap"
        agent="Strategy Agent"
        description="Overview 탭에서 전략 리포트를 생성하면 실행 로드맵이 이곳에 표시됩니다."
      />
    );
  }

  function updateMilestone(index: number, milestone: string) {
    if (!report) return;
    const roadmap = report.roadmap.map((row, i) => (i === index ? { ...row, milestone } : row));
    updateProject(project.id, { strategyReport: { ...report, roadmap } });
  }

  return (
    <Card>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">실행 로드맵</h2>
      <div className="mt-5 flex flex-col gap-0">
        {report.roadmap.map((row, index) => (
          <div key={row.month} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span className="h-3 w-3 shrink-0 rounded-full bg-bridge" />
              {index < report.roadmap.length - 1 && (
                <span className="w-px flex-1 bg-line" style={{ minHeight: "2.25rem" }} />
              )}
            </div>
            <div className="pb-6">
              <span className="font-mono text-xs font-semibold text-bridge">{row.month}</span>
              <input
                value={row.milestone}
                onChange={(event) => updateMilestone(index, event.target.value)}
                className="mt-0.5 block w-full min-w-[240px] rounded-input border border-transparent bg-transparent px-1 py-0.5 text-sm text-ink outline-none transition-colors hover:border-line focus:border-bridge focus:bg-mist"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
