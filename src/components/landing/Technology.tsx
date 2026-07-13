import { Bot, Database, ShieldCheck, FileStack } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const ITEMS = [
  {
    icon: Bot,
    title: "Multi-Agent Architecture",
    description: "국가·외교·파트너·리스크를 전담 에이전트가 나눠 분석",
  },
  {
    icon: Database,
    title: "공공데이터 RAG",
    description: "외교부·KOICA 데이터를 검색해 근거 기반으로 답변",
  },
  {
    icon: ShieldCheck,
    title: "Citation Layer",
    description: "출처 없는 사실은 결과물에 올리지 않는 검증 단계",
  },
  {
    icon: FileStack,
    title: "문서 파이프라인",
    description: "PDF/PPT/DOCX 분석부터 제출용 문서 생성까지",
  },
];

export default function Technology() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>TECHNOLOGY</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            국제개발협력을 가장 깊이 이해하는 AI 구조
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <div className="h-full rounded-card border border-line bg-white p-6 shadow-kib-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-harbor text-white">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-semibold text-harbor">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
