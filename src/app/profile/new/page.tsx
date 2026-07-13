"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { DemoBanner } from "@/components/kib/DemoBanner";
import { ProfileResult } from "@/components/profile/ProfileResult";
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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

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
            <div className="mt-8 w-full max-w-3xl">
              <label className="flex flex-col items-center justify-center gap-2 rounded-card border border-dashed border-line bg-white px-6 py-16 text-center text-sm text-ink-soft transition-colors hover:border-bridge hover:bg-bridge-soft">
                <span className="font-medium text-ink">PDF / PPT / DOCX 파일을 업로드하세요</span>
                <span className="text-xs text-ink-soft">
                  업로드 후 AI가 기업명·핵심 기술·SDG·해외 진출 경험 등을 자동으로 추출합니다
                </span>
                <input
                  type="file"
                  accept=".pdf,.ppt,.pptx,.doc,.docx"
                  className="hidden"
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    const fileBase64 = await fileToBase64(file);
                    runProfileAnalysis({
                      fileName: file.name,
                      mimeType: file.type || "application/octet-stream",
                      fileBase64,
                    });
                  }}
                />
              </label>
            </div>
          ) : (
            <form
              className="mt-8 grid w-full max-w-4xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                runProfileAnalysis(Object.fromEntries(formData.entries()));
              }}
            >
              <div className="sm:col-span-2">
                <Field label="기업명" name="name" required />
              </div>
              <div className="sm:col-span-2">
                <Textarea
                  label="한 줄 소개"
                  name="summary"
                  placeholder="예: AI 기반 수질 모니터링 솔루션을 통해 개발도상국의 식수 안전성을 개선하고자 합니다."
                  rows={2}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Field
                  label="보유 기술"
                  name="technologies"
                  placeholder="예: AI, IoT, Water Monitoring"
                  required
                />
              </div>
              <Field label="해결하고 싶은 문제" name="problem" placeholder="예: 개발도상국 농촌 지역의 식수 안전성" />
              <Field label="관심 국가" name="targetCountries" placeholder="예: 캄보디아, 라오스" />
              <Field label="희망 협력 분야" name="collaborationFields" placeholder="예: Water, Health" />
              <Field label="해외 진출 경험" name="globalExperience" placeholder="예: 없음 / 있음 (설명)" />
              <div className="sm:col-span-2">
                <Field label="참고 URL" name="referenceUrl" type="url" placeholder="https://" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="mt-2">
                  분석 시작
                </Button>
              </div>
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
        <div className="mt-8 w-full">
          {isDemoResult && <DemoBanner className="mb-5" />}

          <ProfileResult profile={profile} />

          <details className="mt-8 w-full max-w-3xl rounded-card border border-line bg-white">
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-bridge">
              프로필 정보 수정 ▾
            </summary>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 border-t border-line p-5 sm:grid-cols-2">
              <Field
                label="기업명"
                value={profile.name}
                onChange={(event) => updateProfileField("name", event.target.value)}
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
              <div className="sm:col-span-2">
                <Textarea
                  label="한 줄 소개"
                  rows={2}
                  value={profile.oneLiner}
                  onChange={(event) => updateProfileField("oneLiner", event.target.value)}
                />
              </div>
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
            </div>
          </details>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={continueWithProfile}>이 프로필로 계속 →</Button>
            <Button variant="secondary" onClick={() => setPhase("form")}>
              다시 작성
            </Button>
          </div>
        </div>
      )}

      {phase === "partner-entry" && (
        <div className="mt-8 w-full max-w-3xl">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-bridge">
            이미 협력할 파트너가 있으시군요 — 파트너 정보를 입력해주세요
          </h2>
          <form
            className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              submitPartnerAndCreateProject();
            }}
          >
            <div className="sm:col-span-2">
              <Field
                label="파트너명"
                value={partnerDraft.name}
                onChange={(event) => setPartnerDraft((p) => ({ ...p, name: event.target.value }))}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Textarea
                label="협력 시너지 (줄바꿈으로 구분)"
                rows={3}
                value={partnerDraft.synergy}
                onChange={(event) => setPartnerDraft((p) => ({ ...p, synergy: event.target.value }))}
              />
            </div>
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
            <div className="sm:col-span-2">
              <Button type="submit">프로젝트 생성</Button>
            </div>
          </form>
        </div>
      )}
    </AppShell>
  );
}
