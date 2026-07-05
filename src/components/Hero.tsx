import Link from "next/link";
import { ArrowRight, ShieldCheck, Waypoints } from "lucide-react";

export default function Hero() {
  return (
    <section id="intro" className="relative scroll-mt-20 overflow-hidden bg-white">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-100/60 blur-3xl"
      />

      <div className="mx-auto max-w-3xl px-6 pb-20 pt-20 text-center lg:pt-28">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700">
          <Waypoints size={14} className="text-blue-600" />
          외교 공공데이터·AI 기반 국제개발협력 Strategy Copilot
        </div>

        <h1 className="mt-6 text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.4rem]">
          한국의 기술이 세계의 문제를 해결하는 길,
          <br className="hidden sm:block" />
          <span className="text-blue-600">K-Impact Bridge</span>가 찾아드립니다.
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-500 sm:text-lg">
          회사소개서 하나만 업로드하면, AI가 우리 기술을 ODA·SDG 관점으로 분석하고
          적합한 국가와 NGO를 추천한 뒤, 출처가 포함된 국제개발협력 전략 리포트와
          사업기획서 초안을 생성합니다.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-transform hover:scale-[1.03] hover:bg-blue-700"
          >
            무료로 프로젝트 시작하기
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            데모 보기
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-blue-600" />
          모든 추천에는 공식 출처와 하이퍼링크가 표시됩니다
        </div>
      </div>
    </section>
  );
}
