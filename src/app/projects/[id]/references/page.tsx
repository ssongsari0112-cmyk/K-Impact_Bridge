import { DEMO_COUNTRY_OPPORTUNITIES } from "@/data/demo";

export default function ReferencesTabPage() {
  const citations = DEMO_COUNTRY_OPPORTUNITIES.flatMap((opportunity) => opportunity.evidence);

  return (
    <div className="rounded-xl border border-black/10 p-5 dark:border-white/10">
      <h2 className="text-sm font-medium text-foreground/60">References</h2>
      <ol className="mt-3 space-y-2 text-sm">
        {citations.map((citation, index) => (
          <li key={citation.id}>
            [{index + 1}] {citation.sourceName}, {citation.title},{" "}
            <a href={citation.url} target="_blank" rel="noopener noreferrer" className="underline">
              {citation.url}
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
