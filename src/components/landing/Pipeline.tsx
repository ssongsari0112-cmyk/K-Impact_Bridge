import {
  Database,
  Cpu,
  Globe2,
  Workflow,
  ShieldAlert,
  FileBarChart2,
  FileOutput,
  type LucideIcon,
} from "lucide-react";

interface Step {
  icon: LucideIcon;
  label: string;
}

const STEPS: Step[] = [
  { icon: Database, label: "공공데이터" },
  { icon: Cpu, label: "AI 분석" },
  { icon: Globe2, label: "국가·파트너 추천" },
  { icon: Workflow, label: "Value Chain 설계" },
  { icon: ShieldAlert, label: "리스크 분석" },
  { icon: FileBarChart2, label: "전략 리포트" },
  { icon: FileOutput, label: "사업기획서 초안" },
];

export default function Pipeline() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-bridge">서비스 작동 방식</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            공공데이터가 실행 가능한 전략이 되기까지
          </h2>
          <p className="mt-4 text-ink-soft">
            하나의 파이프라인 안에서 AI Multi-Agent가 순서대로 협업합니다.
          </p>
        </div>

        <div className="mt-16 flex items-start gap-1 overflow-x-auto pb-6 lg:justify-between lg:overflow-visible">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;
            return (
              <div key={step.label} className="flex shrink-0 items-start">
                <div className="flex w-28 flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-bridge-soft text-bridge">
                    <Icon size={22} />
                  </div>
                  <p className="mt-3 text-xs font-medium leading-snug text-ink-soft">
                    {step.label}
                  </p>
                </div>
                {!isLast && (
                  <div className="relative mx-1 mt-7 h-px w-10 shrink-0 bg-bridge-soft sm:w-14 lg:w-full">
                    <span
                      className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-bridge shadow-[0_0_6px_#9FC8FF] [animation:move-right_2.4s_linear_infinite]"
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
