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

// K-Impact Score 100점 세부 배점 — 기준 및 배점표는 docs/country-scoring.md 참고
export interface ScoreBreakdown {
  techFit: number; // 기술·역량과 국가 수요의 적합성 (0~35)
  needSeverity: number; // 국가의 문제 심각성과 개발 수요 (0~25)
  odaLinkage: number; // 사업화 및 국제개발협력 연계 가능성 (0~20)
  partnerBase: number; // 파트너 및 수행 기반 (0~10)
  koreaTie: number; // 한국과의 정책·협력 연계성 (0~10)
}

export interface PartnerLead {
  name: string; // 확인된 기관명 또는 파트너 유형
  isConfirmedOrg: boolean; // true = 실제 기관명, false = 파트너 유형(추정 명칭 아님)
}

export interface CountryOpportunity {
  country: string;
  countryCode: string; // "KH" → 국기 이모지
  opportunityScore: number; // K-Impact Score 총점 (0~100)
  reasons: string[]; // 추천 이유 3개: [국가 문제, 역량 연결, 사업/협력 가능성]
  sdgs: string[]; // 관련 SDGs (최대 3개, 국가 수요·역량 동시 연결분)
  confidence: "high" | "mid" | "low";
  citations: Citation[];
  needHeadline: string; // "이 국가가 지금 필요로 하는 것" — 구체적 문제 문장
  howWeCanHelp: string; // "귀사가 도울 수 있는 방법"
  sectors: string[]; // 주요 수요 분야 태그 2~4개
  businessIdea: string; // 추천 사업 아이디어 1개
  partners: PartnerLead[]; // 예상 협력 파트너
  scoreBreakdown: ScoreBreakdown;
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
