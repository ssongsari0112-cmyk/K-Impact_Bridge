"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { CountryOpportunity, ScoreBreakdown } from "@/lib/types";
import { countryFlag } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ConfidenceBadge } from "@/components/kib/ConfidenceBadge";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { CitationChip } from "@/components/kib/CitationChip";
import { scoreTier } from "@/components/kib/ScoreCard";
import { cn } from "@/lib/utils";

const BREAKDOWN_LABELS: { key: keyof ScoreBreakdown; label: string; max: number }[] = [
  { key: "techFit", label: "기술·수요 적합성", max: 35 },
  { key: "needSeverity", label: "문제 심각성·개발 수요", max: 25 },
  { key: "odaLinkage", label: "사업 연계 가능성", max: 20 },
  { key: "partnerBase", label: "파트너 기반", max: 10 },
  { key: "koreaTie", label: "한국과의 협력 연계성", max: 10 },
];

const TIER_TEXT_COLOR: Record<"high" | "mid" | "low", string> = {
  high: "text-green",
  mid: "text-amber",
  low: "text-red",
};

export function CountryCard({
  opportunity,
  rank,
  onSelect,
}: {
  opportunity: CountryOpportunity;
  rank?: number;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const tierColor = TIER_TEXT_COLOR[scoreTier(opportunity.opportunityScore)];

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className="cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.015] hover:border-bridge/30 hover:shadow-kib-3 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-bridge/35"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          {rank && (
            <span className="mb-1.5 inline-block rounded-chip bg-harbor px-2.5 py-0.5 font-display text-[11px] font-bold text-white">
              TOP {rank}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{countryFlag(opportunity.countryCode)}</span>
            <h3 className="text-lg font-bold text-harbor">{opportunity.country}</h3>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] font-semibold text-ink-soft">K-Impact Score</p>
          <p className={cn("font-display text-[32px] font-bold leading-[1.15]", tierColor)}>
            {opportunity.opportunityScore}
            <span className="text-sm font-medium text-ink-soft">/100</span>
          </p>
        </div>
      </div>
      <p className="mt-1 text-[11px] leading-snug text-ink-soft">
        기업 또는 NGO의 역량과 국가 수요, 사업 기회, 협력 기반을 종합하여 산출한 점수입니다.
      </p>

      {/* 이 국가가 지금 필요로 하는 것 */}
      <div className="mt-4 rounded-input border border-bridge/20 bg-bridge-soft/50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-bridge">
          이 국가가 지금 필요로 하는 것
        </p>
        <p className="mt-1.5 text-sm font-medium leading-relaxed text-harbor">
          {opportunity.needHeadline}
        </p>
      </div>

      {/* 귀사가 도울 수 있는 방법 */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          귀사가 도울 수 있는 방법
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink">{opportunity.howWeCanHelp}</p>
      </div>

      {/* 추천 이유 3개 */}
      <ul className="mt-4 space-y-1.5">
        {opportunity.reasons.map((reason) => (
          <li key={reason} className="relative pl-4 text-sm text-ink">
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-bridge" />
            {reason}
          </li>
        ))}
      </ul>

      {/* 주요 수요 분야 */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {opportunity.sectors.map((sector) => (
          <span
            key={sector}
            className="rounded-chip border border-line bg-mist px-2.5 py-1 text-xs text-ink-soft"
          >
            #{sector}
          </span>
        ))}
      </div>

      {/* 관련 SDGs */}
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {opportunity.sdgs.map((sdg) => (
          <SdgBadge key={sdg} label={sdg} />
        ))}
      </div>

      {/* 추천 사업 아이디어 */}
      <div className="mt-4 rounded-input border border-dashed border-line p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-soft">
          추천 사업 아이디어
        </p>
        <p className="mt-1 text-sm font-semibold text-harbor">{opportunity.businessIdea}</p>
      </div>

      {/* 예상 협력 파트너 */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {opportunity.partners.map((partner) => (
          <span
            key={partner.name}
            className={cn(
              "rounded-chip px-2.5 py-1 text-xs font-medium",
              partner.isConfirmedOrg
                ? "bg-bridge-soft text-bridge"
                : "border border-line text-ink-soft"
            )}
          >
            {partner.name}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setExpanded((value) => !value);
        }}
        className="mt-4 flex items-center gap-1 text-xs font-semibold text-bridge"
      >
        {expanded ? "평가 결과 접기" : "국가 상세보기 (평가 결과·출처)"}
        <ChevronDown size={14} className={cn("transition-transform", expanded && "rotate-180")} />
      </button>

      {expanded && (
        <div className="mt-3 rounded-input bg-mist p-3.5">
          <ConfidenceBadge level={opportunity.confidence} />

          <div className="mt-3 flex flex-col gap-2.5">
            {BREAKDOWN_LABELS.map(({ key, label, max }) => {
              const value = opportunity.scoreBreakdown[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-soft">{label}</span>
                    <span className="font-semibold text-ink">
                      {value}/{max}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-bridge"
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-3.5"
        onClick={(event) => event.stopPropagation()}
      >
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
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setExpanded(true)}>
            국가 상세보기
          </Button>
          <Button size="sm" onClick={onSelect}>
            이 국가로 진행
          </Button>
        </div>
      </div>
    </Card>
  );
}
