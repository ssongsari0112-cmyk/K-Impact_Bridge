"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { StepProgress } from "@/components/kib/StepProgress";
import { ONBOARDING_GOALS } from "@/lib/constants";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Mode } from "@/lib/types";
import profileMock from "@/lib/ai/mocks/profile.aquasense.json";

const STEP_LABELS = ["목적", "프로필", "국가", "파트너", "리포트"];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const setDraftMode = useProjectStore((state) => state.setDraftMode);
  const setDraftProfile = useProjectStore((state) => state.setDraftProfile);

  useEffect(() => {
    if (!isDemo) return;
    setDraftMode("new_opportunity");
    setDraftProfile(profileMock);
    router.replace("/discover");
  }, [isDemo, router, setDraftMode, setDraftProfile]);

  function selectGoal(mode: Mode) {
    setDraftMode(mode);
    router.push("/profile/new");
  }

  if (isDemo) {
    return (
      <AppShell>
        <div className="mx-auto max-w-xl text-center text-sm text-ink-soft">
          AquaSense AI 데모 시나리오를 불러오는 중…
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-xl text-center">
        <StepProgress
          className="mx-auto justify-center"
          items={STEP_LABELS.map((label, index) => ({
            label,
            state: index === 0 ? "now" : "pending",
          }))}
        />
        <h1 className="mt-8 text-2xl font-bold tracking-tight text-harbor">
          무엇을 하고 싶으신가요?
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          해당하는 항목을 선택하면 바로 다음 단계로 이동합니다.
        </p>
        <div className="mt-8 flex flex-col gap-3 text-left">
          {ONBOARDING_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => selectGoal(goal.id as Mode)}
              className="rounded-card border border-line bg-white px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:border-bridge hover:bg-bridge-soft"
            >
              {goal.label}
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingContent />
    </Suspense>
  );
}
