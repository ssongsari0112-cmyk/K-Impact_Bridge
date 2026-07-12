import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import HowItWorks from "@/components/landing/HowItWorks";
import Pipeline from "@/components/landing/Pipeline";

const STAGE_DETAILS = [
  {
    label: "공공데이터",
    description: "외교부·KOICA·MOFA Insight 등 공공데이터를 수집합니다.",
  },
  {
    label: "AI 분석",
    description: "업로드한 회사소개서에서 기술·SDG·핵심 역량을 추출합니다.",
  },
  {
    label: "국가·파트너 추천",
    description: "Opportunity Score와 매칭 파트너를 근거와 함께 제시합니다.",
  },
  {
    label: "Value Chain 설계",
    description: "기업·파트너·정부·현지사회의 역할 분담을 설계합니다.",
  },
  {
    label: "리스크 분석",
    description: "예상되는 리스크와 대응 전략을 정리합니다.",
  },
  {
    label: "전략 리포트",
    description: "위 내용을 출처가 포함된 하나의 전략 리포트로 종합합니다.",
  },
  {
    label: "사업기획서 초안",
    description: "KOICA 등 제출용 형식에 맞춘 사업기획서 초안을 생성합니다.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-ink">
      <Header />
      <main className="flex-1">
        <HowItWorks />
        <Pipeline />

        <section className="bg-mist px-6 py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-harbor">
              7단계 파이프라인 자세히 보기
            </h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {STAGE_DETAILS.map((stage, index) => (
                <div
                  key={stage.label}
                  className="flex gap-4 rounded-card border border-line bg-white p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bridge-soft font-display text-sm font-bold text-bridge">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-harbor">{stage.label}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
