import { Check, X } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const COMPARISON_ROWS = [
  { before: "흩어진 데이터를 직접 찾는다", after: "공공데이터를 하나로 연결한다" },
  { before: "수백 페이지의 보고서를 읽는다", after: "AI가 핵심만 분석한다" },
  { before: "국가를 경험과 직감으로 선정한다", after: "데이터 기반으로 국가를 추천한다" },
  { before: "파트너를 직접 발굴한다", after: "적합한 기업을 자동 매칭한다" },
  { before: "사업을 처음부터 기획한다", after: "실행 가능한 사업 아이디어를 생성한다" },
  { before: "제안서를 직접 작성한다", after: "AI가 제안서 초안을 생성한다" },
];

export default function Insight() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>INSIGHT</SectionEyebrow>
          <h2 className="mt-3 tracking-tight">
            <span className="block text-xl font-light text-ink-soft sm:text-2xl">
              공공데이터는 이미 충분히 쌓여 있습니다.
            </span>
            <span className="mt-1 block text-3xl font-extrabold text-harbor sm:text-4xl">
              부족했던 건 <span className="text-bridge">연결하는 과정</span>이었습니다.
            </span>
          </h2>
          <p className="mt-4 text-ink-soft">
            외교부, KOICA, KF는 방대한 개발협력 데이터를 공개하고 있지만, 대부분 조회와
            다운로드에서 끝납니다. K-Impact Bridge는 이 데이터를 국가 추천, 파트너 매칭,
            전략 리포트로 이어지는 하나의 흐름으로 연결합니다.
          </p>
        </Reveal>

        <Reveal className="mt-16">
          <h3 className="text-center text-xl font-bold text-harbor sm:text-2xl">
            AI가 바꾸는 ODA 사업 발굴 방식
          </h3>

          <div className="relative mt-10 flex flex-col items-center gap-4 md:flex-row md:items-stretch md:justify-center md:gap-0">
            {/* 기존 방식 — muted */}
            <div className="w-full rounded-3xl border border-line bg-mist p-7 sm:p-8 md:max-w-[19rem]">
              <h4 className="text-base font-bold text-ink-soft sm:text-lg">기존 방식</h4>
              <ul className="mt-5 flex flex-col gap-3.5">
                {COMPARISON_ROWS.map((row) => (
                  <li
                    key={row.before}
                    className="flex items-start gap-2.5 text-sm leading-snug text-ink-soft/80"
                  >
                    <X size={16} className="mt-0.5 shrink-0 text-ink-soft/40" />
                    {row.before}
                  </li>
                ))}
              </ul>
            </div>

            {/* VS badge */}
            <div className="relative z-10 flex shrink-0 items-center justify-center md:-mx-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-bridge text-sm font-extrabold text-white shadow-[0_0_24px_rgba(55,148,255,0.55)]">
                VS
              </span>
            </div>

            {/* K-Impact Bridge — emphasized */}
            <div className="w-full max-w-[26rem] rounded-3xl border border-bridge bg-harbor p-8 shadow-[0_20px_60px_rgba(18,58,102,0.35)] sm:p-10 md:scale-[1.06]">
              <h4 className="text-xl font-extrabold text-white sm:text-2xl">K-Impact Bridge</h4>
              <ul className="mt-6 flex flex-col gap-4">
                {COMPARISON_ROWS.map((row) => (
                  <li
                    key={row.after}
                    className="flex items-start gap-2.5 text-[15px] font-medium leading-snug text-white sm:text-base"
                  >
                    <Check size={18} className="mt-0.5 shrink-0 text-[#7DB8FF]" />
                    {row.after}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
