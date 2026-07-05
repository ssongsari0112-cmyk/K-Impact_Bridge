import { DEMO_ORGANIZATION, DEMO_PROJECTS } from "@/data/demo";

export default function OverviewTabPage() {
  const project = DEMO_PROJECTS[0];

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
        <h2 className="text-sm font-medium text-foreground/60">프로젝트</h2>
        <p className="mt-2 font-semibold">{project.title}</p>
        <p className="mt-1 text-sm text-foreground/70">Mode: {project.mode}</p>
        <p className="text-sm text-foreground/70">Status: {project.status}</p>
      </div>
      <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
        <h2 className="text-sm font-medium text-foreground/60">조직</h2>
        <p className="mt-2 font-semibold">{DEMO_ORGANIZATION.name}</p>
        <p className="mt-1 text-sm text-foreground/70">{DEMO_ORGANIZATION.description}</p>
      </div>
    </div>
  );
}
