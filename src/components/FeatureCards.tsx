import {
  FileSearch,
  Globe2,
  Handshake,
  FileBarChart2,
  FileOutput,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  span?: "wide";
}

const FEATURES: Feature[] = [
  {
    icon: FileSearch,
    title: "AI Profile Builder",
    description:
      "회사소개서(PDF/PPT/DOCX)를 업로드하면 기업명·핵심 기술·산업 분야·SDG를 AI가 자동으로 추출합니다.",
    span: "wide",
  },
  {
    icon: Globe2,
    title: "Opportunity Discovery",
    description: "외교부·KOICA·MOFA Insight·KF 데이터를 기반으로 적합 국가를 추천합니다.",
  },
  {
    icon: Handshake,
    title: "Partner Matching",
    description: "기업 기술과 NGO 사업 간 시너지를 분석해 협력 파트너를 매칭합니다.",
  },
  {
    icon: FileBarChart2,
    title: "Strategy Report",
    description: "Value Chain, 리스크, 기대효과, 실행 로드맵을 담은 전략 리포트를 생성합니다.",
  },
  {
    icon: FileOutput,
    title: "Proposal Draft",
    description: "전략 리포트를 사업기획서 초안과 발표용 PPT 초안으로 자동 변환합니다.",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="scroll-mt-20 bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-blue-600">주요 기능</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            업로드부터 사업기획서까지, 하나의 흐름으로
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 ${
                  feature.span === "wide" ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">출처 기반 신뢰성</h3>
              <p className="mt-1 text-sm text-slate-500">
                모든 Fact에는 공식 출처와 하이퍼링크가 표시되어 검증 가능합니다.
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white">
            출처 표시율 100%
          </span>
        </div>
      </div>
    </section>
  );
}
