"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreCard } from "@/components/kib/ScoreCard";
import { CitationChip } from "@/components/kib/CitationChip";
import type { Project } from "@/lib/types";

export function PartnerTab({ project }: { project: Project }) {
  const router = useRouter();
  const partner = project.selectedPartner;

  if (!partner) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">파트너 없이 진행 중인 프로젝트입니다.</p>
        <Button
          className="mt-4"
          onClick={() => router.push(`/discover/partner?projectId=${project.id}`)}
        >
          파트너 매칭 받기
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-bold text-harbor">{partner.name}</h2>
        <ScoreCard label="Match Score" score={partner.matchScore} className="min-w-0 border-0 p-0" />
      </div>

      <ul className="mt-4 space-y-1.5">
        {partner.synergy.map((point) => (
          <li key={point} className="relative pl-4 text-sm text-ink">
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-bridge" />
            {point}
          </li>
        ))}
      </ul>

      {partner.risk && (
        <p className="mt-4 border-t border-dashed border-line pt-3.5 text-sm text-ink">
          <span className="font-semibold text-ink-soft">리스크: </span>
          {partner.risk}
        </p>
      )}
      {partner.recommendation && (
        <p className="mt-1.5 text-sm text-ink">
          <span className="font-semibold text-ink-soft">AI Recommendation: </span>
          {partner.recommendation}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {partner.citations.map((citation) => (
            <CitationChip
              key={citation.id}
              label={citation.sourceName}
              href={citation.url}
              demo={citation.isDemo}
            />
          ))}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => router.push(`/discover/partner?projectId=${project.id}`)}
        >
          파트너 변경
        </Button>
      </div>
    </Card>
  );
}
