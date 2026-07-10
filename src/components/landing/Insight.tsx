import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const BEFORE_STEPS = ["데이터 조회", "직접 해석", "따로 기획", "따로 파트너 탐색", "따로 제안서"];
const AFTER_STEPS = ["공공데이터", "AI 분석", "국가·파트너 추천", "전략", "기획서"];

function FlowRow({
  steps,
  variant,
}: {
  steps: string[];
  variant: "before" | "after";
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <span
            className={
              variant === "before"
                ? "rounded-chip border border-line bg-white px-4 py-2 text-sm text-ink-soft"
                : "rounded-chip border border-bridge/30 bg-bridge-soft px-4 py-2 text-sm font-medium text-harbor"
            }
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <span
              className={
                variant === "before"
                  ? "mx-2 h-px w-6 border-t border-dashed border-line sm:w-10"
                  : "mx-2 h-0.5 w-6 rounded-full bg-bridge sm:w-10"
              }
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Insight() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow n={3}>INSIGHT</SectionEyebrow>
          <h2 className="mt-3 tracking-tight">
            <span className="block text-xl font-light text-ink-soft sm:text-2xl">
              데이터는 이미 있습니다.
            </span>
            <span className="mt-1 block text-3xl font-extrabold text-harbor sm:text-4xl">
              없는 것은 <span className="text-bridge">&lsquo;연결&rsquo;</span>입니다.
            </span>
          </h2>
          <p className="mt-4 text-ink-soft">
            외교부, KOICA, KF에는 방대한 개발협력 데이터가 있습니다. 문제는 그 데이터가
            조회에서 멈춘다는 것 — K-Impact Bridge는 데이터를 실행 전략으로 바꿉니다.
          </p>
        </Reveal>

        <Reveal className="mt-14 rounded-card bg-mist p-8 sm:p-10">
          <div className="flex flex-col gap-8">
            <div>
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-ink-soft">
                Before
              </p>
              <FlowRow steps={BEFORE_STEPS} variant="before" />
            </div>
            <div>
              <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wide text-bridge">
                After · K-Impact Bridge
              </p>
              <FlowRow steps={AFTER_STEPS} variant="after" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
