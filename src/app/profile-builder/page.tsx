"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Field } from "@/components/ui/Field";

type InputMode = "upload" | "manual";

const DEMO_PROJECT_ID = "project_001";

export default function ProfileBuilderPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("upload");

  function goToWorkspace() {
    router.push(`/projects/${DEMO_PROJECT_ID}/overview`);
  }

  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Profile Builder</h1>
      <p className="mt-2 text-sm text-foreground/60">
        회사소개서를 업로드하거나 직접 입력해 조직 프로필을 만드세요.
      </p>

      <div className="mt-6 inline-flex rounded-full border border-black/10 p-1 text-sm dark:border-white/10">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`rounded-full px-4 py-1.5 ${
            mode === "upload" ? "bg-foreground text-background" : "text-foreground/60"
          }`}
        >
          파일 업로드
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-full px-4 py-1.5 ${
            mode === "manual" ? "bg-foreground text-background" : "text-foreground/60"
          }`}
        >
          직접 입력
        </button>
      </div>

      {mode === "upload" ? (
        <div className="mt-8 max-w-xl">
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 px-6 py-16 text-center text-sm text-foreground/60 dark:border-white/20">
            <span>PDF / PPT / DOCX 파일을 업로드하세요</span>
            <span className="text-xs text-foreground/40">
              업로드 후 AI가 기업명·핵심 기술·SDG·해외 진출 경험 등을 자동으로 추출합니다
            </span>
            <input
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length) goToWorkspace();
              }}
            />
          </label>
        </div>
      ) : (
        <form
          className="mt-8 grid max-w-xl gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            goToWorkspace();
          }}
        >
          <Field label="기업명" name="name" placeholder="AquaSense AI" />
          <Field
            label="한 줄 소개"
            name="summary"
            placeholder="AI 기반 수질 모니터링 솔루션을 통해 개발도상국의 식수 안전성을 개선하고자 합니다."
          />
          <Field label="보유 기술" name="technologies" placeholder="AI, IoT, Water Monitoring" />
          <Field label="대표 제품" name="product" placeholder="수질 이상 탐지 IoT 센서" />
          <Field label="해결하고 싶은 문제" name="problem" placeholder="개발도상국 농촌 지역의 식수 안전성" />
          <Field label="관심 국가" name="targetCountries" placeholder="캄보디아, 라오스" />
          <Field label="희망 협력 분야" name="collaborationFields" placeholder="Water, Health" />
          <Field label="해외 진출 경험" name="globalExperience" placeholder="없음 / 있음 (설명)" />
          <Field label="참고 URL" name="referenceUrl" type="url" placeholder="https://" />
          <button
            type="submit"
            className="mt-2 justify-self-start rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90"
          >
            프로필 생성
          </button>
        </form>
      )}
    </AppShell>
  );
}
