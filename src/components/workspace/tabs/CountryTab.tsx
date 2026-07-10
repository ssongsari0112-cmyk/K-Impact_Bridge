"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreCard } from "@/components/kib/ScoreCard";
import { ConfidenceBadge } from "@/components/kib/ConfidenceBadge";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { CitationChip } from "@/components/kib/CitationChip";
import { countryFlag } from "@/lib/types";
import type { Project } from "@/lib/types";

export function CountryTab({ project }: { project: Project }) {
  const router = useRouter();
  const country = project.selectedCountry;

  if (!country) {
    return (
      <Card>
        <p className="text-sm text-ink-soft">아직 선택된 국가가 없습니다.</p>
        <Button className="mt-4" onClick={() => router.push(`/discover?projectId=${project.id}`)}>
          국가 선택하기
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{countryFlag(country.countryCode)}</span>
            <h2 className="text-lg font-bold text-harbor">{country.country}</h2>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {country.sdgs.map((sdg) => (
              <SdgBadge key={sdg} label={sdg} />
            ))}
          </div>
        </div>
        <ScoreCard score={country.opportunityScore} className="min-w-0 border-0 p-0" />
      </div>

      <div className="mt-3">
        <ConfidenceBadge level={country.confidence} />
      </div>

      <ul className="mt-4 space-y-1.5">
        {country.reasons.map((reason) => (
          <li key={reason} className="relative pl-4 text-sm text-ink">
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-bridge" />
            {reason}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-3.5">
        <div className="flex flex-wrap gap-2">
          {country.citations.map((citation) => (
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
          onClick={() => router.push(`/discover?projectId=${project.id}`)}
        >
          국가 변경
        </Button>
      </div>
    </Card>
  );
}
