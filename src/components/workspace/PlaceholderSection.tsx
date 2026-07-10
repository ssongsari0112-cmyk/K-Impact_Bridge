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
    <div className="rounded-card border border-dashed border-bridge/25 bg-bridge-soft/40 p-10 text-center">
      <h2 className="text-lg font-bold text-harbor">{title}</h2>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-wide text-bridge/70">
        {agent} 연동 예정
      </p>
    </div>
  );
}
