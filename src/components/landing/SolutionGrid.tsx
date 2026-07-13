import {
  FileSearch,
  Globe2,
  Handshake,
  FileBarChart2,
  FileOutput,
  Link2,
  type LucideIcon,
} from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";
import { CitationChip } from "@/components/kib/CitationChip";
import { ScoreCard } from "@/components/kib/ScoreCard";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  preview: React.ReactNode;
}

const FEATURES: Feature[] = [
  {
    icon: FileSearch,
    title: "AI Profile Builder",
    description: "문서에서 기술·SDG·역량을 자동 추출",
    preview: <CitationChip label="AquaSense_소개서.pdf" />,
  },
  {
    icon: Globe2,
    title: "Opportunity Discovery",
    description: "공공데이터 기반 국가별 기회 점수",
    preview: <ScoreCard score={88} className="min-w-0 border-0 p-0" />,
  },
  {
    icon: Handshake,
    title: "Partner Matching",
    description: "기업–NGO 매칭과 그 이유까지",
    preview: <ScoreCard label="Match Score" score={91} className="min-w-0 border-0 p-0" />,
  },
  {
    icon: FileBarChart2,
    title: "Strategy Report",
    description: "Value Chain·리스크·로드맵 자동 설계",
    preview: <CitationChip label="KOICA Open Data" />,
  },
  {
    icon: FileOutput,
    title: "Proposal Draft",
    description: "KOICA 등 제출용 기획서 초안",
    preview: <CitationChip label="15개 섹션 초안" />,
  },
  {
    icon: Link2,
    title: "Citation Layer",
    description: "모든 사실에 공식 출처 링크",
    preview: <CitationChip label="외교부 LOD" />,
  },
];

export default function SolutionGrid() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>SOLUTION</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            국제개발협력 진출의 전 과정을 하나로
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title}>
                <div className="flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-kib-1 transition-shadow hover:shadow-kib-2">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bridge-soft text-bridge">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-semibold text-harbor">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {feature.description}
                  </p>
                  <div className="mt-4 border-t border-dashed border-line pt-4">
                    {feature.preview}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
