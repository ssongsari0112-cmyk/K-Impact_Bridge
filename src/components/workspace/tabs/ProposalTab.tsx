"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, RefreshCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Textarea } from "@/components/ui/Textarea";
import { BridgeRule } from "@/components/ui/BridgeRule";
import { BridgeLineLoading } from "@/components/kib/BridgeLine";
import { CitationChip } from "@/components/kib/CitationChip";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { BUSINESS_OBJECTIVES, suggestObjectiveFromGoals } from "@/lib/constants";
import { countryFlag, isProjectBrief } from "@/lib/types";
import type { BusinessObjectiveId, Project, ProposalDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

const BRIEF_BRIDGE_NODES = [
  { title: "기업 · NGO · 국가", subtitle: "매칭 결과 종합" },
  { title: "외교부 · ODA 데이터", subtitle: "국가정보 조회" },
  { title: "AI 사업기획서", subtitle: "초안 작성 중" },
];

const RISK_LEVEL_STYLE: Record<"high" | "mid" | "low", string> = {
  high: "bg-red-soft text-[#8F3A34]",
  mid: "bg-amber-soft text-[#7A5A1D]",
  low: "bg-bridge-soft text-harbor",
};

const RISK_LEVEL_LABEL: Record<"high" | "mid" | "low", string> = {
  high: "높음",
  mid: "보통",
  low: "낮음",
};

export function ProposalTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const mergeCitations = useProjectStore((state) => state.mergeCitations);

  const brief = isProjectBrief(project.proposalDraft) ? project.proposalDraft : null;

  const [objectiveId, setObjectiveId] = useState<BusinessObjectiveId>(
    brief?.objectiveId ?? suggestObjectiveFromGoals(project.goals ?? [])
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  async function generateBrief() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/agents/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, objectiveId, note }),
      });
      const result = (await response.json()) as { data?: ProposalDraft; error?: string };
      if (!response.ok || !result.data) {
        setError(result.error ?? "사업기획서 생성에 실패했습니다.");
        return;
      }
      updateProject(project.id, { proposalDraft: result.data });
      mergeCitations(result.data.citations, project.id);
      setEditing(false);
    } catch {
      setError("사업기획서 생성 중 네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function regenerateSection(index: number) {
    if (!brief) return;
    setRegeneratingIndex(index);
    try {
      const response = await fetch("/api/agents/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, objectiveId: brief.objectiveId, sectionIndex: index }),
      });
      const result = (await response.json()) as {
        data?: { title: string; content: string };
        error?: string;
      };
      if (!response.ok || !result.data) return;
      const sections = brief.sections.map((section, i) => (i === index ? result.data! : section));
      updateProject(project.id, { proposalDraft: { ...brief, sections } });
    } finally {
      setRegeneratingIndex(null);
    }
  }

  if (!project.selectedCountry || !project.profile) {
    return (
      <Alert kind="warn" title="사업기획서를 만들 준비가 되지 않았습니다">
        기획서는 기업 프로필과 추천 국가를 종합해 생성됩니다.{" "}
        <Link href="/discover" className="font-semibold underline">
          국가 추천
        </Link>
        을 먼저 완료해주세요.
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="mt-4">
        <BridgeLineLoading nodes={BRIEF_BRIDGE_NODES} />
      </div>
    );
  }

  if (!brief || editing) {
    return (
      <BriefSetup
        project={project}
        objectiveId={objectiveId}
        onObjectiveChange={setObjectiveId}
        note={note}
        onNoteChange={setNote}
        onGenerate={generateBrief}
        onCancel={brief ? () => setEditing(false) : undefined}
        error={error}
      />
    );
  }

  return (
    <BriefDocument
      brief={brief}
      regeneratingIndex={regeneratingIndex}
      onRegenerateSection={regenerateSection}
      onEdit={() => setEditing(true)}
    />
  );
}

// ── 생성 전: 사업 목적 선택 ───────────────────────────────────────────────────

function BriefSetup({
  project,
  objectiveId,
  onObjectiveChange,
  note,
  onNoteChange,
  onGenerate,
  onCancel,
  error,
}: {
  project: Project;
  objectiveId: BusinessObjectiveId;
  onObjectiveChange: (id: BusinessObjectiveId) => void;
  note: string;
  onNoteChange: (value: string) => void;
  onGenerate: () => void;
  onCancel?: () => void;
  error: string | null;
}) {
  const country = project.selectedCountry!;
  const partner = project.selectedPartner;

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <Card>
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge-soft text-bridge">
            <Sparkles size={14} />
          </span>
          <h2 className="text-sm font-semibold text-bridge">AI 사업기획서 생성</h2>
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          아래 데이터를 종합해 {country.country}에서 추진할 국제개발협력 사업기획서 초안을
          생성합니다.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <InputChip label="기업" value={project.profile?.name ?? "-"} ok />
          <InputChip
            label="협력 NGO"
            value={partner?.name ?? "미선정 (파트너 발굴을 과업으로 포함)"}
            ok={Boolean(partner)}
          />
          <InputChip
            label="추천 국가"
            value={`${countryFlag(country.countryCode)} ${country.country} · ${country.opportunityScore}점`}
            ok
          />
          <InputChip label="외교부 국가정보 · ODA 실적" value="생성 시 실시간 조회" ok />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-harbor">사업 목적을 선택해주세요</h3>
        <p className="mt-1 text-sm text-ink-soft">
          선택한 목적에 따라 사업 기간, 역할 분담, 예산 구성, 성과지표가 달라집니다.
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          {BUSINESS_OBJECTIVES.map((objective) => {
            const selected = objective.id === objectiveId;
            return (
              <button
                key={objective.id}
                type="button"
                onClick={() => onObjectiveChange(objective.id)}
                className={cn(
                  "flex items-start gap-3 rounded-input border p-3.5 text-left transition-all",
                  selected
                    ? "border-bridge bg-bridge-soft shadow-kib-1"
                    : "border-line bg-white hover:border-bridge/40 hover:bg-mist"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                    selected ? "border-bridge bg-bridge text-white" : "border-line bg-white"
                  )}
                >
                  {selected && <Check size={10} strokeWidth={3.5} />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-harbor">{objective.label}</span>
                  <span className="mt-0.5 block text-[13px] leading-relaxed text-ink-soft">
                    {objective.description}
                  </span>
                  <span className="mt-1.5 block font-mono text-[11.5px] text-ink-soft">
                    사업 기간 {objective.durationMonths}개월 · 총사업비 약{" "}
                    {objective.budgetScaleEok}억 원 (추정)
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          <Textarea
            label="추가 요청사항 (선택)"
            rows={3}
            placeholder="예: 여성 수혜자 비율을 명시적으로 반영해주세요."
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
          />
        </div>

        {error && (
          <Alert kind="warn" title="생성 실패" className="mt-4">
            {error}
          </Alert>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={onGenerate}>
            <Sparkles size={15} />
            사업기획서 생성
          </Button>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              취소
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function InputChip({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-input border border-line px-3 py-2">
      <div className="flex items-center gap-1.5 text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">
        <span className={cn("h-1.5 w-1.5 rounded-full", ok ? "bg-bridge" : "bg-amber")} />
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm text-ink" title={value}>
        {value}
      </div>
    </div>
  );
}

// ── 생성 후: 기획서 본문 ───────────────────────────────────────────────────────

function BriefDocument({
  brief,
  regeneratingIndex,
  onRegenerateSection,
  onEdit,
}: {
  brief: ProposalDraft;
  regeneratingIndex: number | null;
  onRegenerateSection: (index: number) => void;
  onEdit: () => void;
}) {
  const facts = brief.countryFacts;

  return (
    <div className="flex max-w-3xl flex-col gap-5">
      {brief.isDemo && (
        <Alert kind="demo" title="템플릿으로 생성된 초안입니다">
          AI API(GOOGLE_API_KEY)가 연결되어 있지 않아, 프로젝트 데이터와 외교부 공공데이터를
          규칙 기반 템플릿에 결합해 초안을 만들었습니다. 예산·성과 수치는 추정 전제값이므로 실제
          제출 전 검증이 필요합니다.
        </Alert>
      )}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1">
            <span className="inline-block rounded-chip bg-bridge-soft px-2.5 py-1 text-[11.5px] font-bold text-harbor">
              {brief.objectiveLabel}
            </span>
            <h2 className="mt-2 text-xl font-bold tracking-tight text-harbor">
              {brief.projectTitle}
            </h2>
            <BridgeRule className="mt-3 w-16" />
          </div>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            <RefreshCw size={13} />
            목적 바꿔 다시 생성
          </Button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink">{brief.summary}</p>

        {brief.sdgs.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {brief.sdgs.map((sdg) => (
              <SdgBadge key={sdg} label={sdg} />
            ))}
          </div>
        )}

        <p className="mt-4 font-mono text-[11.5px] text-ink-soft">
          {brief.generatedBy} · {new Date(brief.generatedAt).toLocaleString("ko-KR")}
        </p>
      </Card>

      <BriefSection title="배경 및 필요성">
        <p className="text-sm leading-relaxed text-ink">{brief.background}</p>
      </BriefSection>

      <BriefSection title="수혜 대상">
        <p className="text-sm leading-relaxed text-ink">{brief.beneficiaries}</p>
      </BriefSection>

      <BriefSection title="사업 목표">
        <ol className="flex flex-col gap-2">
          {brief.goals.map((goal, index) => (
            <li key={goal} className="flex gap-2.5 text-sm leading-relaxed text-ink">
              <span className="font-mono text-xs font-bold text-bridge">{index + 1}</span>
              {goal}
            </li>
          ))}
        </ol>
      </BriefSection>

      {brief.sections.map((section, index) => (
        <Card key={section.title}>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-semibold text-harbor">{section.title}</h3>
            <button
              type="button"
              onClick={() => onRegenerateSection(index)}
              disabled={regeneratingIndex !== null}
              className="flex shrink-0 items-center gap-1 text-xs font-semibold text-bridge hover:text-harbor disabled:opacity-40"
            >
              <RefreshCw size={12} className={regeneratingIndex === index ? "animate-spin" : ""} />
              다시 생성
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-ink">{section.content}</p>
        </Card>
      ))}

      <BriefSection title="수행 주체별 역할 분담">
        <div className="flex flex-col divide-y divide-line">
          {brief.roles.map((role) => (
            <div key={role.actor} className="py-2.5 text-sm">
              <span className="font-semibold text-ink">{role.actor}</span>
              <p className="mt-0.5 leading-relaxed text-ink-soft">{role.role}</p>
            </div>
          ))}
        </div>
      </BriefSection>

      <BriefSection title="추진 일정">
        <div className="flex flex-col gap-4">
          {brief.phases.map((phase) => (
            <div key={phase.period} className="flex flex-col gap-1.5 sm:flex-row sm:gap-4">
              <span className="w-24 shrink-0 font-mono text-xs font-bold text-bridge">
                {phase.period}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{phase.title}</p>
                <ul className="mt-1 flex flex-col gap-0.5">
                  {phase.activities.map((activity) => (
                    <li key={activity} className="text-[13px] leading-relaxed text-ink-soft">
                      · {activity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </BriefSection>

      <BriefSection title="성과지표 (KPI)">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-line text-left text-[11.5px] uppercase tracking-wide text-ink-soft">
                <th className="pb-2 pr-3 font-semibold">지표</th>
                <th className="pb-2 pr-3 font-semibold">기준값</th>
                <th className="pb-2 font-semibold">목표값</th>
              </tr>
            </thead>
            <tbody>
              {brief.kpis.map((kpi) => (
                <tr key={kpi.indicator} className="border-b border-line last:border-0">
                  <td className="py-2.5 pr-3 font-medium text-ink">{kpi.indicator}</td>
                  <td className="py-2.5 pr-3 text-ink-soft">{kpi.baseline}</td>
                  <td className="py-2.5 text-ink-soft">{kpi.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BriefSection>

      <BriefSection title="예산 계획">
        <div className="flex flex-col gap-3">
          {brief.budget.map((line) => (
            <div key={line.item}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-ink">{line.item}</span>
                <span className="font-mono text-xs font-bold text-bridge">{line.share}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-mist">
                <div
                  className="h-full rounded-full bg-bridge"
                  style={{ width: `${Math.min(100, line.share)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-ink-soft">{line.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-input bg-amber-soft px-3 py-2 text-xs leading-relaxed text-[#6B4E17]">
          <AlertTriangle size={11} className="mr-1 inline" />
          {brief.budgetNote}
        </p>
      </BriefSection>

      <BriefSection title="리스크 및 대응 방안">
        <div className="flex flex-col divide-y divide-line">
          {brief.risks.map((risk) => (
            <div key={risk.risk} className="py-2.5">
              <div className="flex items-start gap-2">
                <span
                  className={cn(
                    "mt-0.5 shrink-0 rounded-md px-1.5 py-0.5 font-display text-[11px] font-bold",
                    RISK_LEVEL_STYLE[risk.level]
                  )}
                >
                  {RISK_LEVEL_LABEL[risk.level]}
                </span>
                <span className="text-sm font-semibold text-ink">{risk.risk}</span>
              </div>
              <p className="mt-1 pl-1 text-[13px] leading-relaxed text-ink-soft">
                → {risk.mitigation}
              </p>
            </div>
          ))}
        </div>
      </BriefSection>

      <BriefSection title="ODA 연계 전략">
        <p className="text-sm leading-relaxed text-ink">{brief.odaLinkage}</p>
      </BriefSection>

      <BriefSection title="근거 데이터 · 외교부 국가정보">
        <div className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
          <Fact label="1인당 GDP" value={facts.gdpPerCapita} />
          <Fact label="경제성장률" value={facts.gdpGrowthRate} />
          <Fact label="주요 산업" value={facts.majorIndustry} />
          <Fact label="정부 형태" value={facts.governmentForm} />
          <Fact label="대한민국과의 수교" value={facts.diplomaticRelations} />
          <Fact label="재외공관" value={facts.missionStatus} />
          <div className="sm:col-span-2">
            <Fact label="대한민국 누적 ODA 지원 실적" value={facts.odaStatus} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {brief.citations.map((citation) => (
            <CitationChip
              key={citation.id}
              label={citation.sourceName}
              href={citation.url}
              demo={citation.isDemo}
            />
          ))}
        </div>
      </BriefSection>
    </div>
  );
}

function BriefSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-bridge">{title}</h3>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <div className="text-[11.5px] font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </div>
      <div className="mt-0.5 whitespace-pre-line text-[13px] leading-relaxed text-ink">
        {value ?? <span className="text-ink-soft">확인 불가 (외교부 API 미응답)</span>}
      </div>
    </div>
  );
}
