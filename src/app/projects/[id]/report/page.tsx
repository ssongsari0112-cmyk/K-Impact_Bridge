"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { CitationChip } from "@/components/kib/CitationChip";
import { DownloadMenu } from "@/components/workspace/DownloadMenu";
import { BridgeRule } from "@/components/ui/BridgeRule";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { isProjectBrief } from "@/lib/types";

export default function ProjectReportPage() {
  const params = useParams<{ id: string }>();
  const hasHydrated = useProjectStore((state) => state.hasHydrated);
  const project = useProjectStore((state) => state.projects[params.id]);

  if (!hasHydrated) {
    return (
      <AppShell>
        <p className="text-sm text-ink-soft">불러오는 중…</p>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <p className="text-sm text-ink-soft">
          프로젝트를 찾을 수 없습니다.{" "}
          <Link href="/dashboard" className="font-semibold text-bridge hover:text-harbor">
            대시보드로 돌아가기
          </Link>
        </p>
      </AppShell>
    );
  }

  const report = project.strategyReport;
  // 구버전 기획서(섹션 배열만 있던 형태)가 저장돼 있으면 렌더링하지 않는다.
  const proposal = isProjectBrief(project.proposalDraft) ? project.proposalDraft : null;

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4 print:hidden">
        <Link
          href={`/projects/${project.id}?tab=overview`}
          className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-bridge"
        >
          <ArrowLeft size={14} />
          워크스페이스로 돌아가기
        </Link>
        <DownloadMenu project={project} />
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <div className="h-1.5 w-32 rounded-full bg-gradient-to-r from-harbor to-bridge" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-harbor">{project.title}</h1>
        <p className="mt-1 text-sm text-ink-soft">K-Impact Bridge · 전략 리포트 &amp; 사업기획서</p>
        {project.citations.some((c) => c.isDemo) && (
          <p className="mt-3 rounded-input bg-amber-soft px-3 py-2 text-xs text-[#6B4E17]">
            이 리포트에는 일부 데모 데이터가 포함되어 있습니다. 실제 협력 전 추가 검증이 필요합니다.
          </p>
        )}

        {report ? (
          <div className="mt-10 flex flex-col gap-8">
            <ReportSection title="Executive Summary" body={report.executiveSummary} />
            <ReportSection title="기술 분석" body={report.techAnalysis} />
            <ReportSection title="국가 상세" body={report.countryDetail} />
            <ReportSection title="파트너 상세" body={report.partnerDetail} />

            <Card>
              <BridgeRule className="mb-3 w-16" />
              <h2 className="text-lg font-bold text-harbor">Value Chain</h2>
              <div className="mt-3 flex flex-col divide-y divide-line">
                {report.valueChain.map((row) => (
                  <div key={row.actor} className="py-2.5 text-sm">
                    <span className="font-semibold text-ink">{row.actor}</span>
                    <span className="text-ink-soft"> — {row.role}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <BridgeRule className="mb-3 w-16" />
              <h2 className="text-lg font-bold text-harbor">기대효과</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {report.expectedImpact.map((row) => (
                  <div key={row.metric} className="rounded-input border border-line p-3">
                    <div className="text-xs text-ink-soft">{row.metric}</div>
                    <div className="font-display text-lg font-bold text-bridge">{row.value}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <BridgeRule className="mb-3 w-16" />
              <h2 className="text-lg font-bold text-harbor">리스크 및 대응전략</h2>
              <div className="mt-3 flex flex-col divide-y divide-line">
                {report.risks.map((row) => (
                  <div key={row.risk} className="py-2.5 text-sm">
                    <span className="font-semibold text-ink">
                      [{row.level}] {row.risk}
                    </span>
                    <p className="mt-0.5 text-ink-soft">{row.mitigation}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <BridgeRule className="mb-3 w-16" />
              <h2 className="text-lg font-bold text-harbor">실행 로드맵</h2>
              <div className="mt-3 flex flex-col gap-2">
                {report.roadmap.map((row) => (
                  <div key={row.month} className="flex gap-3 text-sm">
                    <span className="w-20 shrink-0 font-mono text-xs font-semibold text-bridge">
                      {row.month}
                    </span>
                    <span className="text-ink">{row.milestone}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <p className="mt-10 text-sm text-ink-soft">
            아직 전략 리포트가 생성되지 않았습니다. 워크스페이스의 Overview 탭에서 먼저 생성해주세요.
          </p>
        )}

        {proposal && (
          <div className="mt-10">
            <h2 className="text-xl font-bold tracking-tight text-harbor">
              사업기획서 초안 · {proposal.projectTitle}
            </h2>
            <p className="mt-1 font-mono text-xs text-ink-soft">
              사업 목적: {proposal.objectiveLabel} · {proposal.generatedBy}
            </p>

            <div className="mt-4 flex flex-col gap-4">
              <Card>
                <h3 className="font-semibold text-harbor">사업 요약</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{proposal.summary}</p>
              </Card>
              <Card>
                <h3 className="font-semibold text-harbor">배경 및 필요성</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{proposal.background}</p>
              </Card>
              <Card>
                <h3 className="font-semibold text-harbor">수혜 대상 및 사업 목표</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{proposal.beneficiaries}</p>
                <ol className="mt-2 flex flex-col gap-1">
                  {proposal.goals.map((goal, index) => (
                    <li key={goal} className="flex gap-2 text-sm leading-relaxed text-ink-soft">
                      <span className="font-mono text-xs font-bold text-bridge">{index + 1}</span>
                      {goal}
                    </li>
                  ))}
                </ol>
              </Card>

              {proposal.sections.map((section) => (
                <Card key={section.title}>
                  <h3 className="font-semibold text-harbor">{section.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink">{section.content}</p>
                </Card>
              ))}

              <Card>
                <h3 className="font-semibold text-harbor">추진 일정</h3>
                <div className="mt-2 flex flex-col gap-2">
                  {proposal.phases.map((phase) => (
                    <div key={phase.period} className="flex gap-3 text-sm">
                      <span className="w-24 shrink-0 font-mono text-xs font-semibold text-bridge">
                        {phase.period}
                      </span>
                      <span className="text-ink">
                        <b className="font-semibold">{phase.title}</b>
                        <span className="text-ink-soft"> — {phase.activities.join(", ")}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="font-semibold text-harbor">예산 계획</h3>
                <div className="mt-2 flex flex-col divide-y divide-line">
                  {proposal.budget.map((line) => (
                    <div key={line.item} className="flex justify-between gap-3 py-2 text-sm">
                      <span className="text-ink">{line.item}</span>
                      <span className="font-mono text-xs font-bold text-bridge">{line.share}%</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-ink-soft">{proposal.budgetNote}</p>
              </Card>

              <Card>
                <h3 className="font-semibold text-harbor">ODA 연계 전략</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">{proposal.odaLinkage}</p>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-bold tracking-tight text-harbor">References</h2>
          <ol className="mt-3 space-y-2 font-mono text-[13px] text-ink-soft">
            {project.citations.map((citation, index) => (
              <li key={citation.id} className="flex flex-wrap items-center gap-2">
                <span>
                  [{index + 1}] {citation.sourceName}, {citation.title}
                </span>
                <CitationChip label="원문" href={citation.url} demo={citation.isDemo} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppShell>
  );
}

function ReportSection({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <BridgeRule className="mb-3 w-16" />
      <h2 className="text-lg font-bold text-harbor">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink">{body}</p>
    </div>
  );
}
