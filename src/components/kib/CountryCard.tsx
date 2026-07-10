"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CountryOpportunity } from "@/lib/types";
import { countryFlag } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreCard } from "@/components/kib/ScoreCard";
import { ConfidenceBadge } from "@/components/kib/ConfidenceBadge";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { CitationChip } from "@/components/kib/CitationChip";
import { cn } from "@/lib/utils";

export function CountryCard({
  opportunity,
  onSelect,
}: {
  opportunity: CountryOpportunity;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="hover:border-bridge/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{countryFlag(opportunity.countryCode)}</span>
            <h3 className="text-lg font-bold text-harbor">{opportunity.country}</h3>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {opportunity.sdgs.map((sdg) => (
              <SdgBadge key={sdg} label={sdg} />
            ))}
          </div>
        </div>
        <ScoreCard score={opportunity.opportunityScore} className="min-w-0 border-0 p-0" />
      </div>

      <ul className="mt-4 space-y-1.5">
        {opportunity.reasons.map((reason) => (
          <li key={reason} className="relative pl-4 text-sm text-ink">
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-bridge" />
            {reason}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-3 flex items-center gap-1 text-xs font-semibold text-bridge"
      >
        {expanded ? "상세 접기" : "상세 보기"}
        <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="mt-3 rounded-input bg-mist p-3.5 text-sm text-ink-soft">
          <ConfidenceBadge level={opportunity.confidence} />
          <p className="mt-2">
            개발수요, 유사 KOICA 사업 이력 등 상세 분석은 워크스페이스의 국가 탭에서 확인할 수 있습니다.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-3.5">
        <div className="flex flex-wrap gap-2">
          {opportunity.citations.map((citation) => (
            <CitationChip
              key={citation.id}
              label={citation.sourceName}
              href={citation.url}
              demo={citation.isDemo}
            />
          ))}
        </div>
        <Button size="sm" onClick={onSelect}>
          이 국가로 진행
        </Button>
      </div>
    </Card>
  );
}
