import { DEMO_PARTNER_MATCHES } from "@/data/demo";

export default function PartnerTabPage() {
  return (
    <div className="space-y-4">
      {DEMO_PARTNER_MATCHES.map((partner) => (
        <div
          key={partner.name}
          className="rounded-xl border border-black/10 p-5 dark:border-white/10"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{partner.name}</h2>
            <span className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
              Match Score {partner.matchScore}
            </span>
          </div>
          <ul className="mt-3 list-inside list-disc text-sm text-foreground/70">
            {partner.matchReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-foreground/70">
            <span className="font-medium text-foreground/50">리스크: </span>
            {partner.risk}
          </p>
          <p className="mt-1 text-sm text-foreground/70">
            <span className="font-medium text-foreground/50">AI Recommendation: </span>
            {partner.recommendation}
          </p>
        </div>
      ))}
    </div>
  );
}
