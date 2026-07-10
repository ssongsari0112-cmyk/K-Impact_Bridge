import { Card } from "@/components/ui/Card";
import { CitationChip } from "@/components/kib/CitationChip";
import type { Project } from "@/lib/types";

export function ReferencesTab({ project }: { project: Project }) {
  if (project.citations.length === 0) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">아직 이 프로젝트에 사용된 출처가 없습니다.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">References</h2>
      <p className="mt-1 text-xs text-ink-soft">
        이 프로젝트의 국가·파트너·전략 분석에 사용된 모든 출처입니다.
      </p>
      <ol className="mt-4 space-y-3 text-sm text-ink">
        {project.citations.map((citation, index) => (
          <li key={citation.id} className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[13px] text-ink-soft">[{index + 1}]</span>
            <span className="font-mono text-[13px]">
              {citation.sourceName}, {citation.title}
            </span>
            <CitationChip label="원문 보기" href={citation.url} demo={citation.isDemo} />
          </li>
        ))}
      </ol>
    </Card>
  );
}
