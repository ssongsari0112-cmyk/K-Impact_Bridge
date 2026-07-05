import { DEMO_COUNTRY_OPPORTUNITIES } from "@/data/demo";

export default function CountryTabPage() {
  return (
    <div className="space-y-4">
      {DEMO_COUNTRY_OPPORTUNITIES.map((opportunity) => (
        <div
          key={opportunity.country}
          className="rounded-xl border border-black/10 p-5 dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{opportunity.country}</h2>
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              Opportunity Score {opportunity.opportunityScore}
            </span>
          </div>
          <ul className="mt-3 list-inside list-disc text-sm text-foreground/70">
            {opportunity.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <div className="mt-4 border-t border-black/10 pt-3 text-xs text-foreground/50 dark:border-white/10">
            {opportunity.evidence.map((citation) => (
              <a
                key={citation.id}
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:underline"
              >
                [{citation.sourceName}] {citation.title}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
