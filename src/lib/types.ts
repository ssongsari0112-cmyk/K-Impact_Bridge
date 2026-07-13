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

// ── AI 사업기획서 (Project Brief) ──────────────────────────────────────────────

// 기획서 생성 직전에 사용자가 고르는 사업 목적. 목적에 따라 사업 기간·예산 구성·
// 역할 분담·KPI가 달라진다. (선택지 정의는 constants.ts의 BUSINESS_OBJECTIVES)
export type BusinessObjectiveId =
  | "tech_pilot"
  | "capacity_building"
  | "infra_improvement"
  | "market_entry"
  | "oda_linkage";

export interface BriefRole {
  actor: string;
  role: string;
}

export interface BriefPhase {
  period: string; // "1~3개월"
  title: string;
  activities: string[];
}

export interface BriefKpi {
  indicator: string;
  baseline: string;
  target: string;
}

export interface BriefBudgetLine {
  item: string;
  share: number; // 총사업비 대비 비중(%)
  note: string;
}

export interface BriefRisk {
  risk: string;
  mitigation: string;
  level: "high" | "mid" | "low";
}

// 외교부 공공데이터포털에서 받아온 국가정보 스냅샷. 기획서의 서술 근거가 무엇이었는지
// 화면에 그대로 보여주기 위해 기획서와 함께 저장한다.
export interface CountryFactSheet {
  countryCode: string;
  countryName: string;
  gdpPerCapita: string | null;
  gdpGrowthRate: string | null;
  majorIndustry: string | null;
  governmentForm: string | null;
  diplomaticRelations: string | null;
  missionStatus: string | null;
  odaStatus: string | null; // 대한민국 누적 ODA 지원 실적
  sourceUrl: string;
  isLive: boolean; // 외교부 API 응답을 실제로 받았는지 (false면 응답 실패)
}

export interface ProposalDraft {
  projectTitle: string;
  objectiveId: BusinessObjectiveId;
  objectiveLabel: string;
  summary: string; // 사업 요약 (Executive Summary)
  background: string; // 배경 및 필요성
  beneficiaries: string; // 수혜 대상
  goals: string[]; // 사업 목표
  sections: { title: string; content: string }[]; // 서술형 본문 섹션
  roles: BriefRole[]; // 수행 주체별 역할 분담
  phases: BriefPhase[]; // 추진 일정
  kpis: BriefKpi[]; // 성과지표
  budget: BriefBudgetLine[];
  budgetNote: string; // 총사업비 규모 및 산정 전제
  risks: BriefRisk[];
  sdgs: string[];
  odaLinkage: string; // ODA 연계 전략
  countryFacts: CountryFactSheet;
  citations: Citation[];
  isDemo: boolean; // true = AI 미연결 상태에서 템플릿으로 생성한 초안
  generatedBy: string; // "Gemini · gemini-flash-latest" | "규칙 기반 템플릿"
  generatedAt: string;
}

// 구버전(섹션 배열만 있던) 기획서가 localStorage에 남아 있을 수 있어 형태를 검증한다.
export function isProjectBrief(value: unknown): value is ProposalDraft {
  if (typeof value !== "object" || value === null) return false;
  const draft = value as Partial<ProposalDraft>;
  return (
    Array.isArray(draft.sections) &&
    Array.isArray(draft.phases) &&
    typeof draft.objectiveId === "string" &&
    typeof draft.countryFacts === "object" &&
    draft.countryFacts !== null
  );
}

export type ProjectStatus = "profile" | "country" | "partner" | "report_ready";

export interface Project {
  id: string;
  title: string;
  mode: Mode;
  status: ProjectStatus;
  goals: string[]; // 온보딩에서 선택한 목표 id — 기획서의 사업 목적 기본값으로 쓴다
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
