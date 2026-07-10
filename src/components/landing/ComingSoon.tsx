import { Radio, Globe, Network } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const ITEMS = [
  {
    icon: Radio,
    title: "실시간 Opportunity Feed",
    description: "새로운 공공데이터가 갱신될 때마다 추천 국가·점수가 자동으로 업데이트됩니다.",
  },
  {
    icon: Globe,
    title: "UN/World Bank 데이터 연동",
    description: "국내 데이터를 넘어 국제기구 개발협력 데이터까지 참조 범위를 넓힙니다.",
  },
  {
    icon: Network,
    title: "Consortium Builder",
    description: "여러 기업·NGO가 함께 참여하는 컨소시엄 구성을 AI가 제안합니다.",
  },
];

export default function ComingSoon() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow n={14}>ROADMAP</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            Coming Soon
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <div className="h-full rounded-card border border-dashed border-line bg-white p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-mist text-ink-soft">
                      <Icon size={20} />
                    </span>
                    <span className="rounded-chip border border-line px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold text-ink">{item.title}</h3>
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
