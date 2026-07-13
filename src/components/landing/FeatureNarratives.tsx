import { Download } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";
import { Card } from "@/components/ui/Card";
import { ScoreCard } from "@/components/kib/ScoreCard";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { CitationChip } from "@/components/kib/CitationChip";
import { countryFlag } from "@/lib/types";
import { cn } from "@/lib/utils";
import opportunityMock from "@/lib/ai/mocks/opportunity.json";
import partnerMock from "@/lib/ai/mocks/partner.json";
import strategyMock from "@/lib/ai/mocks/strategy.json";
import proposalMock from "@/lib/ai/mocks/proposal.json";

const country = opportunityMock[0];
const partner = partnerMock[0];
const { valueChain, risks } = strategyMock;
const proposalSection = proposalMock.sections[0];

const RISK_STYLE: Record<string, string> = {
  high: "bg-red-soft text-red",
  mid: "bg-amber-soft text-[#8A6420]",
  low: "bg-green-soft text-green",
};

function CountryPreview() {
  return (
    <Card className="hover:border-bridge/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl leading-none">{countryFlag(country.countryCode)}</span>
            <h4 className="text-lg font-bold text-harbor">{country.country}</h4>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {country.sdgs.map((sdg) => (
              <SdgBadge key={sdg} label={sdg} />
            ))}
          </div>
        </div>
        <ScoreCard score={country.opportunityScore} className="min-w-0 border-0 p-0" />
      </div>
      <ul className="mt-4 space-y-1.5">
        {country.reasons.slice(0, 2).map((reason) => (
          <li key={reason} className="relative pl-4 text-sm text-ink">
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-bridge" />
            {reason}
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-line pt-3.5">
        {country.citations.map((citation) => (
          <CitationChip key={citation.id} label={citation.sourceName} demo={citation.isDemo} />
        ))}
      </div>
    </Card>
  );
}

function PartnerPreview() {
  return (
    <Card className="hover:border-bridge/30">
      <div className="flex items-start justify-between gap-4">
        <h4 className="text-lg font-bold text-harbor">{partner.name}</h4>
        <ScoreCard label="Match Score" score={partner.matchScore} className="min-w-0 border-0 p-0" />
      </div>
      <ul className="mt-4 space-y-1.5">
        {partner.synergy.slice(0, 2).map((point) => (
          <li key={point} className="relative pl-4 text-sm text-ink">
            <span className="absolute left-0 top-[9px] h-1.5 w-1.5 rounded-full bg-bridge" />
            {point}
          </li>
        ))}
      </ul>
      <p className="mt-4 border-t border-dashed border-line pt-3.5 text-sm text-ink">
        <span className="font-semibold text-ink-soft">AI Recommendation: </span>
        {partner.recommendation}
      </p>
    </Card>
  );
}

function ValueChainPreview() {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-bridge">Value Chain</p>
      <div className="mt-3 flex flex-col divide-y divide-line">
        {valueChain.slice(0, 3).map((row) => (
          <div key={row.actor} className="py-2.5 text-sm">
            <span className="font-semibold text-ink">{row.actor}</span>
            <span className="text-ink-soft"> — {row.role}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-bridge">Risk</p>
      <div className="mt-2 flex flex-col gap-2">
        {risks.slice(0, 2).map((row) => (
          <div key={row.risk} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "shrink-0 rounded-chip px-2.5 py-0.5 text-[11px] font-semibold",
                RISK_STYLE[row.level]
              )}
            >
              {row.level}
            </span>
            <span className="text-ink">{row.risk}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function ProposalPreview() {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wide text-bridge">Proposal</p>
      <h4 className="mt-2 font-semibold text-harbor">{proposalSection.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-soft line-clamp-3">
        {proposalSection.content}
      </p>
      <div className="mt-4 flex items-center gap-2 border-t border-dashed border-line pt-3.5">
        <span className="flex items-center gap-1.5 rounded-input bg-bridge px-3 py-1.5 text-xs font-semibold text-white">
          <Download size={12} />
          다운로드
        </span>
        <span className="rounded-input border border-line px-2.5 py-1.5 text-xs text-ink-soft">
          PDF
        </span>
        <span className="rounded-input border border-line px-2.5 py-1.5 text-xs text-ink-soft">
          DOCX
        </span>
        <span className="rounded-input border border-line px-2.5 py-1.5 text-xs text-ink-soft">
          PPTX
        </span>
      </div>
    </Card>
  );
}

const NARRATIVES = [
  {
    caption: "우리 기술, 어디에 필요할까?",
    headline: "국가 추천 옆에는 항상 이유와 출처가 붙습니다",
    visual: <CountryPreview />,
  },
  {
    caption: "누구와 함께 가야 할까?",
    headline: "왜 이 파트너인지까지 설명하는 매칭",
    visual: <PartnerPreview />,
  },
  {
    caption: "협력 구조는 어떻게 짜지?",
    headline: "역할 분담부터 리스크까지, AI가 먼저 설계합니다",
    visual: <ValueChainPreview />,
  },
  {
    caption: "기획서는 누가 쓰지?",
    headline: "제출 양식에 맞는 초안이 1분 안에",
    visual: <ProposalPreview />,
  },
];

export default function FeatureNarratives() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>FEATURES</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            화면으로 먼저 확인하세요
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20">
          {NARRATIVES.map((item, index) => {
            const flipped = index % 2 === 1;
            return (
              <Reveal
                key={item.headline}
                className={cn(
                  "grid items-center gap-10 lg:grid-cols-2",
                  flipped && "lg:[&>*:first-child]:order-2"
                )}
              >
                <div className={flipped ? "lg:text-right" : ""}>
                  <p className="text-sm font-semibold text-bridge">{item.caption}</p>
                  <h3 className="mt-3 text-2xl font-bold leading-snug tracking-tight text-harbor sm:text-3xl">
                    {item.headline}
                  </h3>
                </div>
                <div className="mx-auto w-full max-w-md">{item.visual}</div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
