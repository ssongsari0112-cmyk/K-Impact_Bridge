"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StepProgress } from "@/components/kib/StepProgress";
import { Button } from "@/components/ui/Button";
import { ONBOARDING_GOALS } from "@/lib/constants";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { Mode } from "@/lib/types";
import { cn } from "@/lib/utils";
import profileMock from "@/lib/ai/mocks/profile.aquasense.json";

const STEP_LABELS = ["목적", "프로필", "국가", "파트너", "리포트"];

// 여러 목적을 골랐을 때 이후 플로우를 결정할 대표 모드의 우선순위.
// has_partner는 파트너 직접 입력 단계로 이어지므로 가장 우선한다.
const MODE_PRIORITY: Mode[] = ["has_partner", "find_partner", "new_opportunity", "oda_ready", "idea"];

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";
  const setDraftMode = useProjectStore((state) => state.setDraftMode);
  const setDraftProfile = useProjectStore((state) => state.setDraftProfile);

  const [selected, setSelected] = useState<Mode[]>([]);

  useEffect(() => {
    if (!isDemo) return;
    setDraftMode("new_opportunity");
    setDraftProfile(profileMock);
    router.replace("/discover");
  }, [isDemo, router, setDraftMode, setDraftProfile]);

  function toggleGoal(mode: Mode) {
    setSelected((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    );
  }

  function proceed() {
    if (selected.length === 0) return;
    const primaryMode = MODE_PRIORITY.find((mode) => selected.includes(mode)) ?? selected[0];
    setDraftMode(primaryMode);
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
          해당하는 항목을 모두 선택할 수 있습니다. (중복 선택 가능)
        </p>
        <div className="mt-8 flex flex-col gap-3 text-left">
          {ONBOARDING_GOALS.map((goal) => {
            const mode = goal.id as Mode;
            const isActive = selected.includes(mode);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(mode)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-card border px-4 py-3.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-bridge bg-bridge-soft text-harbor"
                    : "border-line bg-white text-ink hover:border-bridge hover:bg-bridge-soft"
                )}
              >
                {goal.label}
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isActive ? "border-bridge bg-bridge text-white" : "border-line bg-white"
                  )}
                >
                  {isActive && <Check size={14} />}
                </span>
              </button>
            );
          })}
        </div>
        <Button
          className="mt-8 justify-center"
          onClick={proceed}
          disabled={selected.length === 0}
        >
          다음
        </Button>
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
