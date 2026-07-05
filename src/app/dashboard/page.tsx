import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { DEMO_COUNTRY_OPPORTUNITIES, DEMO_ORGANIZATION, DEMO_PROJECTS } from "@/data/demo";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link
          href="/onboarding"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          + 새 국제개발협력 프로젝트 만들기
        </Link>
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
          <h2 className="text-sm font-medium text-foreground/60">내 프로필</h2>
          <p className="mt-2 font-semibold">{DEMO_ORGANIZATION.name}</p>
          <p className="mt-1 text-sm text-foreground/70">{DEMO_ORGANIZATION.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {DEMO_ORGANIZATION.sdgs.map((sdg) => (
              <span
                key={sdg}
                className="rounded-full border border-black/10 px-2 py-0.5 text-xs dark:border-white/10"
              >
                {sdg}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
          <h2 className="text-sm font-medium text-foreground/60">진행 중인 Project Workspace</h2>
          <ul className="mt-3 space-y-2">
            {DEMO_PROJECTS.map((project) => (
              <li key={project.id}>
                <Link
                  href={`/projects/${project.id}/overview`}
                  className="block rounded-lg border border-black/10 p-3 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                >
                  <p className="font-medium">{project.title}</p>
                  <p className="mt-1 text-foreground/60">{project.status}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
          <h2 className="text-sm font-medium text-foreground/60">AI 추천 기회</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {DEMO_COUNTRY_OPPORTUNITIES.map((opportunity) => (
              <li key={opportunity.country} className="rounded-lg border border-black/10 p-3 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{opportunity.country}</span>
                  <span className="text-foreground/60">{opportunity.opportunityScore}점</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
