import { Upload, Search, FileDown } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const STEPS = [
  {
    icon: Upload,
    title: "올리기",
    description: "회사소개서 PDF/PPT/DOCX 업로드 (또는 직접 입력)",
    time: "프로필 3분",
  },
  {
    icon: Search,
    title: "찾기",
    description: "AI가 적합 국가 TOP 3와 파트너를 출처와 함께 추천",
    time: "추천 즉시",
  },
  {
    icon: FileDown,
    title: "받기",
    description: "전략 리포트·사업기획서 초안을 PDF/DOCX/PPTX로 다운로드",
    time: "리포트 1분",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow n={4}>HOW IT WORKS</SectionEyebrow>
          <h2 className="mt-3 tracking-tight">
            <span className="block text-xl font-light text-ink-soft sm:text-2xl">
              업로드 한 번이면,
            </span>
            <span className="mt-1 block text-3xl font-extrabold text-harbor sm:text-4xl">
              <span className="text-bridge">3단계</span>로 끝납니다
            </span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title}>
                <div className="relative h-full rounded-card border border-line bg-white p-7 shadow-kib-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-bridge font-display text-sm font-bold text-bridge">
                      {index + 1}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-bridge-soft text-bridge">
                      <Icon size={20} />
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-harbor">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {step.description}
                  </p>
                  <p className="mt-4 font-mono text-xs font-semibold text-bridge">{step.time}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
