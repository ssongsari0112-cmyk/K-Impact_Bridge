import { LinkButton } from "@/components/ui/Button";
import { StartButton } from "@/components/landing/StartButton";
import { Reveal } from "@/components/landing/Reveal";
import { Watermark } from "@/components/landing/Watermark";

export default function FinalCta() {
  return (
    <section className="bg-white px-6 pb-24">
      <Reveal className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-br from-bridge via-bridge to-harbor px-8 py-16 text-center shadow-[0_20px_60px_rgba(55,148,255,0.28)] sm:px-16">
        <Watermark className="text-[clamp(48px,9vw,112px)]">CONNECT</Watermark>
        <h2 className="relative z-[1] text-3xl font-bold tracking-tight text-white sm:text-4xl">
          한국의 기술이 세계의 문제에 닿는 길
          <br />
          지금 만들어 보세요
        </h2>
        <div className="relative z-[1] mt-8 flex flex-wrap items-center justify-center gap-4">
          <StartButton
            variant="amber"
            size="lg"
            className="shadow-[0_8px_24px_rgba(232,163,61,0.35)] hover:scale-[1.03]"
          >
            프로젝트 시작하기
          </StartButton>
          <LinkButton
            href="/onboarding?demo=true"
            variant="ghost"
            size="lg"
            className="border border-white/40 text-white hover:bg-white/10 hover:text-white"
          >
            3분 데모 보기
          </LinkButton>
        </div>
      </Reveal>
    </section>
  );
}
