"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { DemoBanner } from "@/components/kib/DemoBanner";
import { useProjectStore } from "@/lib/store/useProjectStore";
import type { OrgProfile, PartnerMatch } from "@/lib/types";
import { cn } from "@/lib/utils";

type InputMode = "upload" | "manual";
type Phase = "form" | "loading" | "confirm" | "partner-entry";

const PROFILE_BRIDGE_NODES = [
  { title: "회사소개서", subtitle: "업로드/직접입력" },
  { title: "AI 분석", subtitle: "기술·SDG 추출" },
  { title: "프로필", subtitle: "확인 및 수정" },
];

export default function ProfileBuilderPage() {
  const router = useRouter();
  const draftMode = useProjectStore((state) => state.draftMode);
  const setDraftProfile = useProjectStore((state) => state.setDraftProfile);
  const createProject = useProjectStore((state) => state.createProject);

  const [mode, setMode] = useState<InputMode>("upload");
  const [phase, setPhase] = useState<Phase>("form");
  const [isDemoResult, setIsDemoResult] = useState(false);
  const [profile, setProfile] = useState<OrgProfile | null>(null);
  const [partnerDraft, setPartnerDraft] = useState({ name: "", synergy: "", risk: "", recommendation: "" });

  async function runProfileAnalysis(input: Record<string, unknown>) {
    setPhase("loading");
    const response = await fetch("/api/agents/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const result = (await response.json()) as { data: OrgProfile; isDemo: boolean };
    setProfile(result.data);
    setIsDemoResult(result.isDemo);
    setPhase("confirm");
  }

  function updateProfileField<K extends keyof OrgProfile>(key: K, value: OrgProfile[K]) {
    setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function continueWithProfile() {
    if (!profile) return;
    setDraftProfile(profile);
    if (draftMode === "has_partner") {
      setPhase("partner-entry");
      return;
    }
    router.push("/discover");
  }

  function submitPartnerAndCreateProject() {
    if (!profile) return;
    setDraftProfile(profile);
    const partner: PartnerMatch = {
      name: partnerDraft.name || "미입력 파트너",
      matchScore: 100,
      synergy: partnerDraft.synergy
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      risk: partnerDraft.risk,
      recommendation: partnerDraft.recommendation,
      isDemo: false,
      citations: [],
    };
    const id = createProject(partner);
    router.push(`/projects/${id}?tab=overview`);
  }

  return (
    <AppShell>
      <h1 className="text-2xl font-bold tracking-tight text-harbor">Profile Builder</h1>
      <p className="mt-2 text-sm text-ink-soft">
        회사소개서를 업로드하거나 직접 입력해 조직 프로필을 만드세요.
      </p>

      {phase === "form" && (
        <>
          <div className="mt-6 inline-flex rounded-chip border border-line bg-white p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("upload")}
              className={cn(
                "rounded-chip px-4 py-1.5 font-medium transition-colors",
                mode === "upload" ? "bg-bridge text-white" : "text-ink-soft hover:text-ink"
              )}
            >
              파일 업로드
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={cn(
                "rounded-chip px-4 py-1.5 font-medium transition-colors",
                mode === "manual" ? "bg-bridge text-white" : "text-ink-soft hover:text-ink"
              )}
            >
              직접 입력
            </button>
          </div>

          {mode === "upload" ? (
            <div className="mt-8 max-w-xl">
              <label className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-white px-6 py-16 text-center text-sm text-ink-soft transition-colors hover:border-bridge hover:bg-bridge-soft">
                <span className="font-medium text-ink">PDF / PPT / DOCX 파일을 업로드하세요</span>
                <span className="text-xs text-ink-soft">
                  업로드 후 AI가 기업명·핵심 기술·SDG·해외 진출 경험 등을 자동으로 추출합니다
                </span>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  className="hidden"
                  onChange={(event) => {
                    if (event.target.files?.length) {
                      runProfileAnalysis({ fileName: event.target.files[0].name });
                    }
                  }}
                />
              </label>
            </div>
          ) : (
            <form
              className="mt-8 grid max-w-xl gap-4"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                runProfileAnalysis(Object.fromEntries(formData.entries()));
              }}
            >
              <Field label="기업명" name="name" placeholder="AquaSense AI" />
              <Textarea
                label="한 줄 소개"
                name="summary"
                placeholder="AI 기반 수질 모니터링 솔루션을 통해 개발도상국의 식수 안전성을 개선하고자 합니다."
                rows={2}
              />
              <Field label="보유 기술" name="technologies" placeholder="AI, IoT, Water Monitoring" />
              <Field label="대표 제품" name="product" placeholder="수질 이상 탐지 IoT 센서" />
              <Field label="해결하고 싶은 문제" name="problem" placeholder="개발도상국 농촌 지역의 식수 안전성" />
              <Field label="관심 국가" name="targetCountries" placeholder="캄보디아, 라오스" />
              <Field label="희망 협력 분야" name="collaborationFields" placeholder="Water, Health" />
              <Field label="해외 진출 경험" name="globalExperience" placeholder="없음 / 있음 (설명)" />
              <Field label="참고 URL" name="referenceUrl" type="url" placeholder="https://" />
              <Button type="submit" className="mt-2 justify-self-start">
                분석 시작
              </Button>
            </form>
          )}
        </>
      )}

      {phase === "loading" && (
        <div className="mt-12">
          <BridgeLineLoading nodes={PROFILE_BRIDGE_NODES} />
        </div>
      )}

      {phase === "confirm" && profile && (
        <div className="mt-8 max-w-xl">
          {isDemoResult && <DemoBanner className="mb-5" />}
          <Card>
            <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">
              프로필 확인 · 자유롭게 수정할 수 있습니다
            </h2>
            <div className="mt-4 flex flex-col gap-4">
              <Field
                label="기업명"
                value={profile.name}
                onChange={(event) => updateProfileField("name", event.target.value)}
              />
              <Textarea
                label="한 줄 소개"
                rows={2}
                value={profile.oneLiner}
                onChange={(event) => updateProfileField("oneLiner", event.target.value)}
              />
              <Field
                label="보유 기술 (쉼표로 구분)"
                value={profile.technologies.join(", ")}
                onChange={(event) =>
                  updateProfileField(
                    "technologies",
                    event.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                  )
                }
              />
              <Field
                label="관심 지역 (쉼표로 구분)"
                value={profile.regionsOfInterest.join(", ")}
                onChange={(event) =>
                  updateProfileField(
                    "regionsOfInterest",
                    event.target.value.split(",").map((v) => v.trim()).filter(Boolean)
                  )
                }
              />
              <div>
                <span className="text-sm font-semibold text-ink">연계 SDG</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {profile.sdgs.map((sdg) => (
                    <SdgBadge key={sdg} label={sdg} />
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <Button className="mt-5" onClick={continueWithProfile}>
            이 프로필로 계속
          </Button>
        </div>
      )}

      {phase === "partner-entry" && (
        <div className="mt-8 max-w-xl">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">
            이미 협력할 파트너가 있으시군요 — 파트너 정보를 입력해주세요
          </h2>
          <form
            className="mt-4 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitPartnerAndCreateProject();
            }}
          >
            <Field
              label="파트너명"
              value={partnerDraft.name}
              onChange={(event) => setPartnerDraft((p) => ({ ...p, name: event.target.value }))}
              required
            />
            <Textarea
              label="협력 시너지 (줄바꿈으로 구분)"
              rows={3}
              value={partnerDraft.synergy}
              onChange={(event) => setPartnerDraft((p) => ({ ...p, synergy: event.target.value }))}
            />
            <Field
              label="리스크"
              value={partnerDraft.risk}
              onChange={(event) => setPartnerDraft((p) => ({ ...p, risk: event.target.value }))}
            />
            <Field
              label="비고"
              value={partnerDraft.recommendation}
              onChange={(event) =>
                setPartnerDraft((p) => ({ ...p, recommendation: event.target.value }))
              }
            />
            <Button type="submit" className="justify-self-start">
              프로젝트 생성
            </Button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
