"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { PartnerCard } from "@/components/kib/PartnerCard";
import { DemoBanner } from "@/components/kib/DemoBanner";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Dialog } from "@/components/ui/Dialog";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { PartnerMatch } from "@/lib/types";

const PARTNER_BRIDGE_NODES = [
  { title: "선택 국가", subtitle: "매칭 조건 확정" },
  { title: "NGO DB", subtitle: "시너지 분석 중" },
  { title: "추천 파트너", subtitle: "매칭 결과 산출" },
];

function DiscoverPartnerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const draftCountry = useProjectStore((state) => state.draftCountry);
  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const mergeCitations = useProjectStore((state) => state.mergeCitations);
  const project = useProjectStore((state) => (projectId ? state.projects[projectId] : null));

  const country = project?.selectedCountry ?? draftCountry;

  const [loading, setLoading] = useState(true);
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [partners, setPartners] = useState<PartnerMatch[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [manualPartner, setManualPartner] = useState({
    name: "",
    synergy: "",
    risk: "",
    recommendation: "",
  });

  useEffect(() => {
    if (!country) {
      router.replace("/discover");
      return;
    }
    let cancelled = false;
    (async () => {
      const response = await fetch("/api/agents/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.country }),
      });
      const result = (await response.json()) as { data: PartnerMatch[]; isDemo: boolean };
      if (cancelled) return;
      setPartners(result.data);
      setIsDemoResult(result.isDemo);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  function finishWithPartner(partner: PartnerMatch | null) {
    if (projectId) {
      updateProject(projectId, { selectedPartner: partner, status: "partner" });
      if (partner) mergeCitations(partner.citations, projectId);
      router.push(`/projects/${projectId}?tab=partner`);
      return;
    }
    const id = createProject(partner);
    router.push(`/projects/${id}?tab=overview`);
  }

  function submitManualPartner() {
    const partner: PartnerMatch = {
      name: manualPartner.name || "미입력 파트너",
      matchScore: 100,
      synergy: manualPartner.synergy.split("\n").map((line) => line.trim()).filter(Boolean),
      risk: manualPartner.risk,
      recommendation: manualPartner.recommendation,
      isDemo: false,
      citations: [],
    };
    setDialogOpen(false);
    finishWithPartner(partner);
  }

  return (
    <AppShell>
      <h1 className="text-2xl font-bold tracking-tight text-harbor">파트너 매칭</h1>
      <p className="mt-2 text-sm text-ink-soft">
        {country?.country ?? ""} 지역에서 시너지가 높은 협력 파트너입니다.
      </p>

      {loading ? (
        <div className="mt-12">
          <BridgeLineLoading nodes={PARTNER_BRIDGE_NODES} />
        </div>
      ) : (
        <div className="mt-8 max-w-2xl">
          {isDemoResult && <DemoBanner className="mb-5" />}
          <div className="flex flex-col gap-4">
            {partners.map((partner) => (
              <PartnerCard
                key={partner.name}
                partner={partner}
                onSelect={() => finishWithPartner(partner)}
              />
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button variant="ghost" onClick={() => finishWithPartner(null)}>
              파트너 없이 진행
            </Button>
            <Button variant="secondary" onClick={() => setDialogOpen(true)}>
              직접 등록
            </Button>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} title="파트너 직접 등록">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitManualPartner();
          }}
        >
          <Field
            label="파트너명"
            value={manualPartner.name}
            onChange={(event) => setManualPartner((p) => ({ ...p, name: event.target.value }))}
            required
          />
          <Textarea
            label="협력 시너지 (줄바꿈으로 구분)"
            rows={3}
            value={manualPartner.synergy}
            onChange={(event) => setManualPartner((p) => ({ ...p, synergy: event.target.value }))}
          />
          <Field
            label="리스크"
            value={manualPartner.risk}
            onChange={(event) => setManualPartner((p) => ({ ...p, risk: event.target.value }))}
          />
          <Button type="submit" className="justify-center">
            등록하고 계속
          </Button>
        </form>
      </Dialog>
    </AppShell>
  );
}

export default function DiscoverPartnerPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverPartnerContent />
    </Suspense>
  );
}
