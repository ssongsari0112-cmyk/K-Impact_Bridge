"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, Check, Heart } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StepProgress } from "@/components/kib/StepProgress";
import { Button } from "@/components/ui/Button";
import {
  COMPANY_GOALS,
  GOAL_SECTION_COPY,
  NGO_GOALS,
  ONBOARDING_ORG_TYPES,
  ONBOARDING_STEPS,
  ONBOARDING_STORAGE_KEY,
} from "@/lib/constants";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { OrgType } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";
import profileMock from "@/lib/ai/mocks/profile.aquasense.json";

const ORG_ICON = { company: Building2, ngo: Heart } as const;

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "true";

  const setDraftMode = useProjectStore((state) => state.setDraftMode);
  const setDraftProfile = useProjectStore((state) => state.setDraftProfile);
  const saveOnboarding = useProjectStore((state) => state.saveOnboarding);
  const storeOrgType = useProjectStore((state) => state.orgType);
  const hasHydrated = useProjectStore((state) => state.hasHydrated);

  const [orgType, setOrgType] = useState<OrgType | null>(storeOrgType);
  const [goals, setGoals] = useState<string[]>([]);

  useEffect(() => {
    if (!isDemo) return;
    // 기존 원클릭 데모 플로우는 그대로 유지
    setDraftMode("new_opportunity");
    setDraftProfile(profileMock);
    router.replace("/discover");
  }, [isDemo, router, setDraftMode, setDraftProfile]);

  useEffect(() => {
    // 새로고침 등으로 스토어가 뒤늦게 복원되는 경우, 회원가입 때 고른 유형을 반영
    if (hasHydrated && storeOrgType) {
      setOrgType((current) => current ?? storeOrgType);
    }
  }, [hasHydrated, storeOrgType]);

  function selectOrgType(type: OrgType) {
    if (type === orgType) return;
    setOrgType(type);
    setGoals([]); // 조직 유형 변경 시 이전 목표 초기화
  }

  function toggleGoal(id: string) {
    setGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  function handleNext() {
    if (!orgType || goals.length === 0) return;

    saveOnboarding(orgType, goals);
    try {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ organizationType: orgType, goals })
      );
    } catch {
      // localStorage 접근 불가 환경 무시
    }

    router.push(`/profile/new?type=${orgType}`);
  }

  const goalList = orgType === "company" ? COMPANY_GOALS : orgType === "ngo" ? NGO_GOALS : [];
  const goalCopy = orgType ? GOAL_SECTION_COPY[orgType] : null;
  const canProceed = orgType !== null && goals.length > 0;

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
      <div className="mx-auto max-w-2xl">
        <StepProgress
          className="mx-auto justify-center"
          items={ONBOARDING_STEPS.map((label, index) => ({
            label,
            state: index === 0 ? "now" : "pending",
          }))}
        />

        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-harbor sm:text-3xl">
            조직 정보를 설정해주세요
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            조직 유형과 현재 필요한 목표를 선택하면
            <br />
            가장 적합한 국가, 파트너 및 사업 기회를 추천해드립니다.
          </p>
        </div>

        {/* 1. 조직 유형 선택 */}
        <section className="mt-10">
          <h2 className="text-lg font-bold text-harbor">어떤 조직인가요?</h2>
          <p className="mt-1 text-sm text-ink-soft">서비스를 이용할 조직 유형을 선택해주세요.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ONBOARDING_ORG_TYPES.map((option) => {
              const Icon = ORG_ICON[option.value];
              const isActive = orgType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOrgType(option.value)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative flex flex-col rounded-card border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bridge",
                    isActive
                      ? "border-bridge bg-bridge-soft"
                      : "border-line bg-white hover:border-bridge/50"
                  )}
                >
                  {isActive && (
                    <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-bridge text-white">
                      <Check size={14} />
                    </span>
                  )}
                  <span
                    className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-full",
                      isActive ? "bg-bridge text-white" : "bg-mist text-ink-soft"
                    )}
                  >
                    <Icon size={22} />
                  </span>
                  <span className="mt-4 text-base font-bold text-harbor">{option.title}</span>
                  <span className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-bridge">
                    {option.en}
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. 목표 선택 (조직 유형 선택 후 노출) */}
        {orgType && goalCopy && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-harbor">{goalCopy.title}</h2>
            <p className="mt-1 text-sm text-ink-soft">{goalCopy.subtitle}</p>

            <div className="mt-5 flex flex-col gap-3">
              {goalList.map((goal) => {
                const isActive = goals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-start justify-between gap-4 rounded-card border px-5 py-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bridge",
                      isActive
                        ? "border-bridge bg-bridge-soft"
                        : "border-line bg-white hover:border-bridge/50"
                    )}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-harbor">{goal.label}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {goal.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                        isActive ? "border-bridge bg-bridge text-white" : "border-line bg-white"
                      )}
                    >
                      {isActive && <Check size={14} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <p
              className={cn(
                "mt-4 text-sm font-medium",
                goals.length > 0 ? "text-bridge" : "text-ink-soft"
              )}
            >
              {goals.length > 0
                ? `${goals.length}개 목표가 선택되었습니다.`
                : "한 개 이상의 목표를 선택해주세요."}
            </p>
          </section>
        )}

        <div className="mt-10 flex justify-end">
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed}
            className="justify-center px-8"
          >
            다음
          </Button>
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
