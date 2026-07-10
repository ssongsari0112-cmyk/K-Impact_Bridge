import type { PartnerMatch } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreCard } from "@/components/kib/ScoreCard";
import { CitationChip } from "@/components/kib/CitationChip";

export function PartnerCard({
  partner,
  onSelect,
}: {
  partner: PartnerMatch;
  onSelect: () => void;
}) {
  return (
    <Card className="hover:border-bridge/30">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-bold text-harbor">{partner.name}</h3>
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

      <p className="mt-4 border-t border-dashed border-line pt-3.5 text-sm text-ink">
        <span className="font-semibold text-ink-soft">리스크: </span>
        {partner.risk}
      </p>
      <p className="mt-1.5 text-sm text-ink">
        <span className="font-semibold text-ink-soft">AI Recommendation: </span>
        {partner.recommendation}
      </p>

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
        <Button size="sm" onClick={onSelect}>
          이 파트너와 진행
        </Button>
      </div>
    </Card>
  );
}
