"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { ONBOARDING_GOALS } from "@/lib/constants";

export default function OnboardingPage() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((goalId) => goalId !== id) : [...prev, id]
    );
  }

  const hasSelection = selectedGoals.length > 0;

  return (
    <AppShell>
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-2xl font-semibold">무엇을 하고 싶으신가요?</h1>
        <p className="mt-2 text-sm text-foreground/60">해당하는 항목을 모두 선택해주세요.</p>
        <div className="mt-8 flex flex-col gap-3 text-left">
          {ONBOARDING_GOALS.map((goal) => {
            const isSelected = selectedGoals.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                aria-pressed={isSelected}
                className={`rounded-xl border px-4 py-3 text-sm transition-colors ${
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                }`}
              >
                {goal.label}
              </button>
            );
          })}
        </div>
        <Link
          href="/profile-builder"
          aria-disabled={!hasSelection}
          className={`mt-8 inline-block rounded-full px-6 py-3 text-sm font-medium ${
            hasSelection
              ? "bg-foreground text-background hover:opacity-90"
              : "pointer-events-none bg-black/10 text-foreground/40 dark:bg-white/10"
          }`}
        >
          다음
        </Link>
      </div>
    </AppShell>
  );
}
