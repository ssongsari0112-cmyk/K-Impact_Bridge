import { ShieldCheck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { StartButton } from "@/components/landing/StartButton";
import { Watermark } from "@/components/landing/Watermark";
import { HeroPreviewCard } from "@/components/landing/HeroPreviewCard";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:py-20">
        <div>
          <h1 className="leading-[1.2] tracking-tight">
            <span className="block text-2xl font-light text-ink-soft sm:text-3xl">
              한국의 기술과 세계의 문제를 잇는,
            </span>
            <span className="mt-1 block text-4xl font-extrabold text-bridge sm:text-5xl lg:text-[3.2rem]">
              K-Impact Bridge
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
            회사소개서 하나만 올리면, AI가 적합한 국가와 파트너를 찾고 출처가 담긴 전략
            리포트와 사업기획서 초안까지 만들어드립니다.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <StartButton
              variant="amber"
              size="lg"
              className="shadow-[0_8px_24px_rgba(232,163,61,0.35)] hover:scale-[1.03]"
            >
              프로젝트 시작하기
            </StartButton>
            <LinkButton href="/onboarding?demo=true" variant="secondary" size="lg">
              3분 데모 보기
            </LinkButton>
          </div>

          <div className="mt-7 flex items-center gap-2 text-xs text-ink-soft/80">
            <ShieldCheck size={16} className="text-bridge" />
            모든 추천에는 KOICA·외교부 공식 출처가 함께 표시됩니다
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-bridge via-bridge to-harbor px-6 py-14 shadow-[0_20px_60px_rgba(55,148,255,0.28)] sm:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl"
          />
          <Watermark className="text-[clamp(48px,8vw,96px)]">BRIDGE</Watermark>
          <div className="relative z-[1] flex justify-center">
            <HeroPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}
