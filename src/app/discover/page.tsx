"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AnalysisScreen } from "@/components/kib/AnalysisScreen";
import { CountryCard } from "@/components/kib/CountryCard";
import { DemoBanner } from "@/components/kib/DemoBanner";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { CountryOpportunity } from "@/lib/types";

const INITIAL_COUNT = 3;
// 분석 화면이 최소 이만큼은 보이도록 유지 (발표용 데모 흐름, 5~8초)
const MIN_ANALYSIS_MS = 5200;
const MAX_ANALYSIS_MS = 7800;

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const hasHydrated = useProjectStore((state) => state.hasHydrated);
  const draftProfile = useProjectStore((state) => state.draftProfile);
  const setDraftCountry = useProjectStore((state) => state.setDraftCountry);
  const mergeCitations = useProjectStore((state) => state.mergeCitations);
  const updateProject = useProjectStore((state) => state.updateProject);
  const project = useProjectStore((state) => (projectId ? state.projects[projectId] : null));

  const [loading, setLoading] = useState(true);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [opportunities, setOpportunities] = useState<CountryOpportunity[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const profile = project?.profile ?? draftProfile;

  useEffect(() => {
    if (!hasHydrated) return;
    if (!profile) {
      router.replace("/profile/new");
      return;
    }
    let cancelled = false;
    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_ANALYSIS_MS + Math.random() * (MAX_ANALYSIS_MS - MIN_ANALYSIS_MS))
    );
    (async () => {
      const [response] = await Promise.all([
        fetch("/api/agents/opportunity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        }),
        minDelay,
      ]);
      const result = (await response.json()) as { data: CountryOpportunity[]; isDemo: boolean };
      if (cancelled) return;
      setOpportunities(result.data);
      setIsDemoResult(result.isDemo);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, hasHydrated]);

  function selectCountry(opportunity: CountryOpportunity) {
    if (projectId) {
      updateProject(projectId, { selectedCountry: opportunity, status: "country" });
      mergeCitations(opportunity.citations, projectId);
      router.push(`/projects/${projectId}?tab=country`);
      return;
    }
    setDraftCountry(opportunity);
    mergeCitations(opportunity.citations);
    router.push("/discover/partner");
  }

  return (
    <AppShell wide>
      {loading ? (
        <div className="mt-6">
          <AnalysisScreen />
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-harbor">AI 추천 국가</h2>
          <p className="mt-2 max-w-2xl text-sm text-ink-soft">
            AI는 기업의 기술, 사업 목적, SDGs, 외교부 국가정보, ODA 데이터를 종합 분석하여
            추천합니다.
          </p>

          <div className="mt-8">
            {isDemoResult && <DemoBanner className="mb-6" />}
            <div className="grid gap-6 lg:grid-cols-2 xl:gap-7">
              {opportunities.slice(0, visibleCount).map((opportunity) => (
                <CountryCard
                  key={opportunity.country}
                  opportunity={opportunity}
                  onSelect={() => selectCountry(opportunity)}
                />
              ))}
            </div>
            {visibleCount < opportunities.length && (
              <Button
                variant="ghost"
                className="mt-6"
                onClick={() => setVisibleCount((count) => count + 2)}
              >
                다른 국가 더 보기
              </Button>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverContent />
    </Suspense>
  );
}
