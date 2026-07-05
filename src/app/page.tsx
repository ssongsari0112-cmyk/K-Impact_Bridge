import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import WorldMap from "@/components/WorldMap";
import Pipeline from "@/components/Pipeline";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Header />
      <main className="flex flex-col">
        <Hero />

        <section id="map" className="scroll-mt-20 bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-medium text-blue-600">국가별 기회 지도</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                한국의 기술이 필요한 국가를 지도에서 확인하세요
              </h2>
              <p className="mt-4 text-slate-500">
                국가를 클릭하면 매칭되는 기술과 기업, 추천 파트너를 바로 볼 수 있습니다.
              </p>
            </div>

            <div className="mt-14">
              <WorldMap />
            </div>
          </div>
        </section>

        <Pipeline />
        <FeatureCards />

        <section id="cta" className="scroll-mt-20 bg-white px-6 pb-24">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-blue-600 px-8 py-16 text-center sm:px-16">
            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              한국의 기술이 세계의 문제에 닿는 길을 만드세요.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-blue-100">
              지금 바로 프로젝트를 시작하고, AI가 제안하는 국가와 파트너를 확인해보세요.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-blue-600 shadow-lg transition-transform hover:scale-[1.03]"
              >
                무료로 프로젝트 시작하기
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/profile-builder"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                기업 프로필 등록하기
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
