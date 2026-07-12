"use client";

import Link from "next/link";
import { Building2, FolderKanban } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { SdgBadge } from "@/components/kib/SdgBadge";
import { BridgeRule } from "@/components/ui/BridgeRule";
import { useProjectStore } from "@/lib/store/useProjectStore";

const STATUS_LABEL: Record<string, string> = {
  profile: "리포트 생성 대기",
  country: "국가 분석 중",
  partner: "파트너 매칭 중",
  report_ready: "리포트 생성 완료",
};

export default function DashboardPage() {
  const hasHydrated = useProjectStore((state) => state.hasHydrated);
  const projectsRecord = useProjectStore((state) => state.projects);
  const draftProfile = useProjectStore((state) => state.draftProfile);

  const projects = Object.values(projectsRecord);
  const profile = projects[0]?.profile ?? draftProfile;

  return (
    <AppShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-harbor">Dashboard</h1>
          <BridgeRule className="mt-3" />
        </div>
        <LinkButton href="/onboarding" size="sm">
          + 새 국제개발협력 프로젝트 만들기
        </LinkButton>
      </div>

      {!hasHydrated ? (
        <p className="mt-8 text-sm text-ink-soft">불러오는 중…</p>
      ) : (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge-soft text-bridge">
                <Building2 size={14} />
              </span>
              <h2 className="text-sm font-semibold text-bridge">내 프로필</h2>
            </div>
            {profile ? (
              <>
                <p className="mt-3 font-semibold text-harbor">{profile.name}</p>
                <p className="mt-1 text-sm text-ink-soft">{profile.oneLiner}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {profile.sdgs.map((sdg) => (
                    <SdgBadge key={sdg} label={sdg} />
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">
                아직 프로필이 없습니다.{" "}
                <Link href="/profile/new" className="font-semibold text-bridge hover:text-harbor">
                  프로필 만들기
                </Link>
              </p>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge-soft text-bridge">
                <FolderKanban size={14} />
              </span>
              <h2 className="text-sm font-semibold text-bridge">진행 중인 Project Workspace</h2>
            </div>
            {projects.length === 0 ? (
              <p className="mt-3 text-sm text-ink-soft">
                아직 만든 프로젝트가 없습니다. 온보딩부터 시작해보세요.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {projects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/projects/${project.id}?tab=overview`}
                      className="block rounded-input border border-line p-3 text-sm transition-colors hover:border-bridge hover:bg-bridge-soft"
                    >
                      <p className="font-medium text-ink">{project.title}</p>
                      <p className="mt-1 text-ink-soft">
                        {STATUS_LABEL[project.status] ?? project.status}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      )}
    </AppShell>
  );
}
