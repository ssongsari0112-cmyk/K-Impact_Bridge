"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { CountryCard } from "@/components/kib/CountryCard";
import { DemoBanner } from "@/components/kib/DemoBanner";
import { Button } from "@/components/ui/Button";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { CountryOpportunity } from "@/lib/types";

const DISCOVER_BRIDGE_NODES = [
  { title: "우리 기술", subtitle: "프로필 분석 완료" },
  { title: "공공데이터", subtitle: "ODA·SDG 매칭" },
  { title: "추천 국가", subtitle: "TOP 3 산출 중" },
];

const INITIAL_COUNT = 3;

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

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
    if (!profile) {
      router.replace("/profile/new");
      return;
    }
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/agents/opportunity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
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
  }, [profile]);

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
    <AppShell>
      <h1 className="text-2xl font-bold tracking-tight text-harbor">기회 탐색</h1>
      <p className="mt-2 text-sm text-ink-soft">
        AI가 분석한 국가별 Opportunity Score입니다. 진행할 국가를 하나 선택해주세요.
      </p>

      {loading ? (
        <div className="mt-12">
          <BridgeLineLoading nodes={DISCOVER_BRIDGE_NODES} />
        </div>
      ) : (
        <div className="mt-8 w-full max-w-3xl">
          {isDemoResult && <DemoBanner className="mb-5" />}
          <div className="flex flex-col gap-4">
            {opportunities.slice(0, visibleCount).map((opportunity, index) => (
              <CountryCard
                key={opportunity.country}
                opportunity={opportunity}
                rank={index + 1}
                onSelect={() => selectCountry(opportunity)}
              />
            ))}
          </div>
          {visibleCount < opportunities.length && (
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => setVisibleCount((count) => count + 2)}
            >
              다른 국가 더 보기
            </Button>
          )}
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
