export function PlaceholderSection({
  title,
  agent,
  description,
}: {
  title: string;
  agent: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-black/20 p-8 text-center dark:border-white/20">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-foreground/60">{description}</p>
      <p className="mt-4 text-xs uppercase tracking-wide text-foreground/40">
        {agent} 연동 예정
      </p>
    </div>
  );
}
