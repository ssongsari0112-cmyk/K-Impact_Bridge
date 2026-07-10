"use client";

import { Card } from "@/components/ui/Card";
import { PlaceholderSection } from "@/components/workspace/PlaceholderSection";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/types";

const LEVEL_STYLE: Record<"high" | "mid" | "low", string> = {
  high: "bg-red-soft text-red before:bg-red",
  mid: "bg-amber-soft text-[#8A6420] before:bg-amber",
  low: "bg-green-soft text-green before:bg-green",
};

const LEVEL_LABEL: Record<"high" | "mid" | "low", string> = {
  high: "리스크 높음",
  mid: "리스크 보통",
  low: "리스크 낮음",
};

export function RiskTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const report = project.strategyReport;

  if (!report) {
    return (
      <PlaceholderSection
        title="Risk"
        agent="Risk Agent"
        description="Overview 탭에서 전략 리포트를 생성하면 리스크와 대응전략이 이곳에 표시됩니다."
      />
    );
  }

  function updateMitigation(index: number, mitigation: string) {
    if (!report) return;
    const risks = report.risks.map((row, i) => (i === index ? { ...row, mitigation } : row));
    updateProject(project.id, { strategyReport: { ...report, risks } });
  }

  return (
    <Card>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">리스크 · 대응전략</h2>
      <div className="mt-4 flex flex-col divide-y divide-line">
        {report.risks.map((row, index) => (
          <div key={row.risk} className="py-3.5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-ink">{row.risk}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-chip px-3 py-1 text-[12.5px] font-semibold",
                  "before:block before:h-2 before:w-2 before:rounded-full",
                  LEVEL_STYLE[row.level]
                )}
              >
                {LEVEL_LABEL[row.level]}
              </span>
            </div>
            <input
              value={row.mitigation}
              onChange={(event) => updateMitigation(index, event.target.value)}
              className="mt-1.5 w-full rounded-input border border-transparent bg-transparent px-2 py-1 text-sm text-ink-soft outline-none transition-colors hover:border-line focus:border-bridge focus:bg-mist"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
