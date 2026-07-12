import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";
import { CitationChip } from "@/components/kib/CitationChip";

const SOURCES = [
  { name: "외교부 LOD", usage: "국가별 외교 관계·협력 이력 분석" },
  { name: "KOICA Open Data", usage: "기존 ODA 사업과의 연계 분석" },
  { name: "MOFA Insight", usage: "지역별 개발협력 브리핑 반영" },
  { name: "KF 국제교류 데이터", usage: "문화·교육 교류 파트너 발굴" },
];

const CHIPS = ["KOICA Open Data", "ODA Korea", "MOFA Insight"];

export default function DataSources() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>DATA</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            대한민국 외교 데이터 위에서 작동합니다
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map((source) => (
            <Reveal key={source.name}>
              <div className="h-full rounded-card border border-line bg-mist p-6">
                <h3 className="font-semibold text-harbor">{source.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {source.name} → {source.usage}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 flex flex-col items-center gap-4 rounded-card border border-line bg-bridge-soft/40 p-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap justify-center gap-2">
            {CHIPS.map((label) => (
              <CitationChip key={label} label={label} />
            ))}
          </div>
          <span className="shrink-0 -rotate-6 rounded-chip bg-white px-4 py-1.5 text-xs font-bold text-bridge shadow-kib-2">
            출처 표시율 100%
          </span>
        </Reveal>
      </div>
    </section>
  );
}
