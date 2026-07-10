export type Mode = "new_opportunity" | "find_partner" | "oda_ready" | "has_partner" | "idea";

export interface Citation {
  id: string;
  sourceName: string; // "KOICA Open Data"
  title: string;
  url: string;
  isDemo: boolean; // true면 앰버 칩으로 렌더링
  usedIn: string[]; // ["country", "strategy"] — References 탭이 이걸 모아 보여줌
}

export interface OrgProfile {
  name: string;
  oneLiner: string;
  technologies: string[];
  sdgs: string[]; // ["SDG 6", "SDG 9"]
  useCases: string[];
  regionsOfInterest: string[];
  confidence: number; // 0~1
}

export interface CountryOpportunity {
  country: string;
  countryCode: string; // "KH" → 국기 이모지
  opportunityScore: number;
  reasons: string[];
  sdgs: string[];
  confidence: "high" | "mid" | "low";
  citations: Citation[];
}

export interface PartnerMatch {
  name: string;
  matchScore: number;
  synergy: string[];
  risk: string;
  recommendation: string;
  isDemo: boolean;
  citations: Citation[];
}

export interface StrategyReport {
  executiveSummary: string;
  techAnalysis: string;
  countryDetail: string;
  partnerDetail: string;
  similarProjects: { title: string; year: string; citation: Citation }[];
  valueChain: { actor: string; role: string }[];
  expectedImpact: { metric: string; value: string }[];
  risks: { risk: string; mitigation: string; level: "high" | "mid" | "low" }[];
  roadmap: { month: string; milestone: string }[];
  generatedAt: string;
}

export interface ProposalDraft {
  sections: { title: string; content: string }[]; // 15개 섹션
  generatedAt: string;
}

export type ProjectStatus = "profile" | "country" | "partner" | "report_ready";

export interface Project {
  id: string;
  title: string;
  mode: Mode;
  status: ProjectStatus;
  profile: OrgProfile | null;
  selectedCountry: CountryOpportunity | null;
  selectedPartner: PartnerMatch | null;
  strategyReport: StrategyReport | null;
  proposalDraft: ProposalDraft | null;
  citations: Citation[]; // 프로젝트 전체 출처 풀
  createdAt: string;
  updatedAt: string;
}

export function countryFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}
