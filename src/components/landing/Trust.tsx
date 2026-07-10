import { Lock, EyeOff } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";
import { DemoBanner } from "@/components/kib/DemoBanner";

export default function Trust() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow n={13}>TRUST</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            신뢰와 보안
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-card border border-line bg-mist p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bridge-soft text-bridge">
                <Lock size={20} />
              </div>
              <h3 className="mt-5 font-semibold text-harbor">데이터 암호화</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                모든 통신은 SSL로 암호화되어 전송됩니다.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-card border border-line bg-mist p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-bridge-soft text-bridge">
                <EyeOff size={20} />
              </div>
              <h3 className="mt-5 font-semibold text-harbor">외부 비공유</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                업로드한 자료는 프로필 생성 목적으로만 사용되며 외부에 공유되지 않습니다.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="flex h-full flex-col rounded-card border border-line bg-mist p-6">
              <h3 className="font-semibold text-harbor">데모 데이터 명시 원칙</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                실제 협력 전 검증이 필요한 데이터는 이렇게 표시됩니다.
              </p>
              <div className="mt-4">
                <DemoBanner />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
