import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WorldMap from "@/components/landing/WorldMap";
import { ConfidenceBadge } from "@/components/kib/ConfidenceBadge";
import { CitationChip } from "@/components/kib/CitationChip";

const SCORE_FACTORS = [
  { title: "기술 매칭도", description: "보유 기술이 현지 수요와 얼마나 정확히 맞아떨어지는지" },
  { title: "정책 정합성", description: "해당 국가의 ODA·개발협력 정책 방향과의 일치 여부" },
  { title: "사업 연계 가능성", description: "KOICA 등 기존 사업과 이어서 확장할 수 있는지" },
];

const SOURCE_CHIPS = [
  { label: "KOICA Open Data", href: "https://data.koica.go.kr" },
  { label: "ODA Korea", href: "https://www.odakorea.go.kr" },
  { label: "MOFA Insight", href: "https://www.mofa.go.kr" },
];

export default function MapPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex-1 bg-mist px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium text-bridge">국가별 기회 지도</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
              한국의 기술이 필요한 국가를 지도에서 확인하세요
            </h1>
            <p className="mt-4 text-ink-soft">
              국가를 클릭하면 매칭되는 기술과 기업, 추천 파트너를 바로 볼 수 있습니다.
            </p>
          </div>

          <div className="mt-14">
            <WorldMap />
          </div>

          <div className="mt-16 rounded-card border border-line bg-white p-8 sm:p-10">
            <h2 className="text-xl font-bold text-harbor">Opportunity Score는 어떻게 계산되나요?</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-3">
              {SCORE_FACTORS.map((factor) => (
                <div key={factor.title}>
                  <h3 className="font-semibold text-ink">{factor.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2 border-t border-dashed border-line pt-6">
              <ConfidenceBadge level="high" />
              <ConfidenceBadge level="mid" />
              <ConfidenceBadge level="low" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-6">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                근거 출처
              </span>
              {SOURCE_CHIPS.map((chip) => (
                <CitationChip key={chip.label} label={chip.label} href={chip.href} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
