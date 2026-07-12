import { Building2, Heart } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";
import { Watermark } from "@/components/landing/Watermark";
import { LinkButton } from "@/components/ui/Button";

const GROUPS = [
  {
    icon: Building2,
    label: "기업 · 스타트업",
    headline: "해외 진출과 ODA 참여, 첫 지도를 그려드립니다",
    tags: ["#스마트팜", "#에듀테크", "#헬스케어", "#환경기술"],
    href: "/onboarding?type=company",
    cta: "기업으로 시작하기",
  },
  {
    icon: Heart,
    label: "NGO · 수행기관",
    headline: "우리 사업에 맞는 기술 파트너를 찾아드립니다",
    tags: ["#신규사업기획", "#공동제안서"],
    href: "/onboarding?type=ngo",
    cta: "NGO로 시작하기",
  },
];

export default function ForWhom() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>FOR WHOM</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            처음이어도
            <br />
            이미 하고 있어도
          </h2>
        </Reveal>

        <Reveal className="relative mt-14 overflow-hidden rounded-[2rem] bg-gradient-to-br from-bridge via-bridge to-harbor px-6 py-16 sm:px-14">
          <Watermark className="text-[clamp(40px,7vw,88px)]">FOR WHOM</Watermark>
          <div className="relative z-[1] flex flex-col gap-5">
            {GROUPS.map((group, index) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.label}
                  className="flex max-w-lg flex-col gap-4 rounded-card bg-white p-6 shadow-kib-3 sm:flex-row sm:items-center"
                  style={{ marginLeft: index === 0 ? 0 : "auto" }}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bridge-soft text-bridge">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-bridge">
                      {group.label}
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-harbor">{group.headline}</h3>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {group.tags.map((tag) => (
                        <span key={tag} className="text-xs font-medium text-ink-soft">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <LinkButton href={group.href} size="sm" className="mt-4">
                      {group.cta}
                    </LinkButton>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
