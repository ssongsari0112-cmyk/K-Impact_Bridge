"use client";

import { useEffect, useState } from "react";
import { CircleCheckBig, LoaderCircle, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";

const ANALYSIS_STEPS = [
  "기업 프로필 분석 완료",
  "외교부 국가정보 수집",
  "ODA 사업 데이터 분석",
  "국가 위험도 분석",
  "적합한 협력기관 탐색",
  "AI 추천 결과 생성 중...",
];

const STEP_INTERVAL_MS = 1050;

// 데모 시연 영상 — 실제 파일은 이 경로에 추후 추가 (mp4 또는 gif)
const DEMO_MEDIA_SRC = "/demo/demo-analysis.mp4";
const IS_GIF = DEMO_MEDIA_SRC.toLowerCase().endsWith(".gif");

export function AnalysisScreen({ className }: { className?: string }) {
  const [activeStep, setActiveStep] = useState(0);
  const [mediaReady, setMediaReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((step) => (step < ANALYSIS_STEPS.length - 1 ? step + 1 : step));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const mediaVisible = mediaReady && !mediaFailed;

  return (
    <div className={cn("mx-auto w-full max-w-5xl", className)}>
      <div className="flex flex-col items-center text-center">
        <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
          <span className="absolute inset-0 rounded-full bg-bridge/10 [animation:glow-pulse_1.6s_ease-in-out_infinite]" />
          <LoaderCircle
            size={52}
            strokeWidth={2.2}
            className="relative animate-spin text-bridge"
          />
        </div>
        <h2 className="mt-6 text-xl font-bold tracking-tight text-harbor sm:text-2xl">
          AI가 외교부 공공데이터를 분석하고 있습니다
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          잠시만 기다려주세요. 분석이 끝나면 결과 화면으로 자동 이동합니다.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-stretch">
        <div className="rounded-card border border-line bg-white p-6 shadow-kib-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            분석 진행 상황
          </span>
          <ul className="mt-4 flex flex-col gap-4">
            {ANALYSIS_STEPS.map((step, index) => {
              const status = index < activeStep ? "done" : index === activeStep ? "active" : "pending";
              return (
                <li key={step} className="flex items-center gap-3">
                  {status === "done" && (
                    <CircleCheckBig size={18} className="shrink-0 text-green" />
                  )}
                  {status === "active" && (
                    <LoaderCircle size={18} className="shrink-0 animate-spin text-bridge" />
                  )}
                  {status === "pending" && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-line" />
                  )}
                  <span
                    className={cn(
                      "text-sm transition-colors",
                      status === "done" && "text-ink",
                      status === "active" && "font-semibold text-harbor",
                      status === "pending" && "text-ink-soft/50"
                    )}
                  >
                    {step}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative aspect-video overflow-hidden rounded-card border border-line shadow-kib-2 lg:aspect-auto">
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-harbor via-harbor to-bridge px-6 text-center transition-opacity duration-300",
              mediaVisible ? "opacity-0" : "opacity-100"
            )}
          >
            <MousePointerClick
              size={26}
              className="text-white/80 [animation:drift_2.4s_ease-in-out_infinite]"
            />
            <p className="font-mono text-[11px] uppercase tracking-wide text-white/70">
              demo-analysis {IS_GIF ? ".gif" : ".mp4"} 준비 중
            </p>
            <p className="max-w-[240px] text-[11px] leading-relaxed text-white/55">
              외교부 국가정보 페이지를 조회하는 시연 영상이 이 자리에 자동 재생됩니다
            </p>
          </div>

          {IS_GIF ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={DEMO_MEDIA_SRC}
              alt="외교부 국가정보 조회 데모"
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                mediaVisible ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setMediaReady(true)}
              onError={() => setMediaFailed(true)}
            />
          ) : (
            <video
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                mediaVisible ? "opacity-100" : "opacity-0"
              )}
              autoPlay
              muted
              loop
              playsInline
              onCanPlay={() => setMediaReady(true)}
              onError={() => setMediaFailed(true)}
            >
              <source src={DEMO_MEDIA_SRC} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
