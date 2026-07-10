import { Map, Users, FileWarning } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const CARDS = [
  {
    icon: Map,
    title: "정보의 미로",
    description: "우리 기술이 어느 나라의 어떤 문제에 필요한지 알기 어렵습니다",
  },
  {
    icon: Users,
    title: "파트너의 부재",
    description: "함께할 NGO·현지 기관을 찾을 방법이 없습니다",
  },
  {
    icon: FileWarning,
    title: "경험의 장벽",
    description: "KOICA·ODA 사업기획서, 어디서부터 써야 할지 막막합니다",
  },
];

export default function Problem() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow n={2}>PROBLEM</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            좋은 기술을 가지고도, 왜 세계로 나가기 어려울까요?
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title}>
                <div className="h-full rounded-card border border-line bg-white p-6 shadow-kib-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bridge-soft text-bridge">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 font-semibold text-harbor">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {card.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-6 text-center text-sm text-ink-soft">
          NGO도 마찬가지입니다 — 새로운 기술 파트너를 찾기 어렵습니다
        </Reveal>
      </div>
    </section>
  );
}
