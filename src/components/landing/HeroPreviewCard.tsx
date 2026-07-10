import { countryFlag } from "@/lib/types";
import { CitationChip } from "@/components/kib/CitationChip";
import { cn } from "@/lib/utils";
import opportunityMock from "@/lib/ai/mocks/opportunity.json";

const TOP_THREE = opportunityMock.slice(0, 3);
const CHIPS = [
  { label: "KOICA Open Data", href: "https://data.koica.go.kr" },
  { label: "외교부 LOD", href: "https://www.mofa.go.kr" },
];

export function HeroPreviewCard() {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-kib-3">
      <div className="flex items-center gap-2 bg-harbor px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="flex-1 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">
          opportunity_report
        </span>
      </div>

      <div className="p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
          Countries Matched
        </p>
        <p className="mt-1 flex items-baseline gap-2 font-display text-4xl font-extrabold text-bridge">
          03
          <span className="font-sans text-xs font-semibold text-ink-soft">Top Opportunities</span>
        </p>

        <div className="mt-4 flex flex-col gap-2">
          {TOP_THREE.map((country, index) => (
            <div
              key={country.country}
              className={cn(
                "flex items-center justify-between gap-3 rounded-input border-l-4 px-3.5 py-2.5",
                index === 0 ? "border-bridge bg-bridge-soft" : "border-line bg-mist"
              )}
            >
              <div>
                <span className="block font-mono text-[10px] font-semibold uppercase tracking-wide text-bridge">
                  {index === 0 ? "Best Match" : `Match #${index + 1}`}
                </span>
                <span className="text-sm font-semibold text-ink">
                  {countryFlag(country.countryCode)} {country.country}
                </span>
              </div>
              <span className="font-display text-lg font-bold text-bridge">
                {country.opportunityScore}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-line pt-4">
          {CHIPS.map((chip) => (
            <CitationChip key={chip.label} label={chip.label} href={chip.href} />
          ))}
        </div>
      </div>
    </div>
  );
}
