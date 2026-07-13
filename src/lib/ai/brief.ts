import { COUNTRY_KNOWLEDGE_BASE, type CountryKnowledge } from "@/lib/data/countryKnowledge";
import {
  getCountryEconomy,
  getCountryKoreaRelation,
  getCountryPolitics,
  type CountryEconomy,
  type CountryKoreaRelation,
  type CountryPolitics,
} from "@/lib/mofa/client";
import { GEMINI_MODEL_LABEL, generateProjectBrief, rewriteBriefSection } from "@/lib/ai/gemini";
import {
  OPENAI_MODEL_LABEL,
  generateProjectBrief as generateProjectBriefOpenAi,
  rewriteBriefSection as rewriteBriefSectionOpenAi,
} from "@/lib/ai/openai";
import type { AiBriefPayload, AiBriefSection } from "@/lib/ai/briefPrompt";
import { findObjective, type BusinessObjective } from "@/lib/constants";
import type {
  BriefBudgetLine,
  BriefKpi,
  BriefPhase,
  BriefRisk,
  BriefRole,
  BusinessObjectiveId,
  Citation,
  CountryFactSheet,
  CountryOpportunity,
  OrgProfile,
  PartnerMatch,
  Project,
  ProposalDraft,
} from "@/lib/types";

// AI 사업기획서(Project Brief) 생성기.
//
// 입력: 기업 프로필 + 매칭된 NGO + 추천 국가 + 사용자가 선택한 사업 목적
//       + 외교부 공공데이터(경제현황·정치현황·대한민국과의 관계=ODA 실적)
// 출력: ProposalDraft
//
// API 키가 있으면 위 데이터를 컨텍스트로 넘겨 LLM이 초안을 쓰고, 없거나 호출이 실패하면
// 같은 데이터로 규칙 기반 템플릿 초안을 만든다. 템플릿 경로의 결과는 isDemo=true로 표시해
// 화면에서 데모 데이터임을 명시한다.
//
// 프로바이더는 OPENAI_API_KEY > GOOGLE_API_KEY 순으로 고른다. (프로필 분석은 여전히 Gemini만
// 사용한다 — lib/ai/client.ts 참고)

const TEMPLATE_LABEL = "규칙 기반 템플릿 (AI 미연결)";

export interface BriefRequest {
  project: Project;
  objectiveId: BusinessObjectiveId;
  note?: string; // 사용자가 추가로 남긴 요청사항
}

interface BriefProvider {
  label: string;
  generate: (contextText: string) => Promise<AiBriefPayload>;
  rewrite: (contextText: string, section: AiBriefSection) => Promise<AiBriefSection>;
}

function selectProvider(): BriefProvider | null {
  if (process.env.NEXT_PUBLIC_FORCE_MOCK === "true") return null;

  if (process.env.OPENAI_API_KEY) {
    return {
      label: OPENAI_MODEL_LABEL,
      generate: generateProjectBriefOpenAi,
      rewrite: rewriteBriefSectionOpenAi,
    };
  }

  if (process.env.GOOGLE_API_KEY) {
    return {
      label: GEMINI_MODEL_LABEL,
      generate: generateProjectBrief,
      rewrite: rewriteBriefSection,
    };
  }

  return null;
}

// ── 입력 데이터 수집 ──────────────────────────────────────────────────────────

interface BriefContext {
  profile: OrgProfile;
  country: CountryOpportunity;
  partner: PartnerMatch | null;
  knowledge: CountryKnowledge | null;
  objective: BusinessObjective;
  facts: CountryFactSheet;
  note: string;
}

function mofaSourceUrl(alpha2: string): string {
  return `https://opendata.mofa.go.kr/lod/view.do?uri=${encodeURIComponent(
    `http://opendata.mofa.go.kr/core/resource/Country/${alpha2}`
  )}`;
}

// 외교부 API의 텍스트 필드는 여러 줄 연혁(수교 이력, ODA 세부내역 등)으로 오는 경우가 많아
// 빈 줄을 걷어내고, 문장에 넣을 때는 firstLine()으로 대표 줄만 쓴다.
function cleanMultiline(value: string | null | undefined): string | null {
  if (!value) return null;
  const cleaned = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  return cleaned || null;
}

function firstLine(value: string | null): string | null {
  return cleanMultiline(value)?.split("\n")[0] ?? null;
}

// gdp_per_capita는 단위 없는 숫자("2754")로, 기준연도·출처는 gdp_per_capita_desc에
// ("(2024년 기준, IMF)") 따로 담겨 온다. 둘을 합쳐 사람이 읽을 수 있는 값으로 만든다.
function formatGdpPerCapita(economy: CountryEconomy | null): string | null {
  const raw = economy?.gdpPerCapita?.trim();
  if (!raw) return null;
  const amount = Number(raw.replace(/[^\d.]/g, ""));
  const value = Number.isFinite(amount) ? `${amount.toLocaleString("ko-KR")}달러` : raw;
  return [value, economy?.gdpPerCapitaDesc?.trim()].filter(Boolean).join(" ");
}

function formatGrowthRate(economy: CountryEconomy | null): string | null {
  const raw = economy?.gdpGrowthRate?.trim();
  if (!raw) return null;
  return raw.includes("%") ? raw : `${raw}%`;
}

function buildFactSheet(
  country: CountryOpportunity,
  economy: CountryEconomy | null,
  relation: CountryKoreaRelation | null,
  politics: CountryPolitics | null
): CountryFactSheet {
  return {
    countryCode: country.countryCode,
    countryName: country.country,
    gdpPerCapita: formatGdpPerCapita(economy),
    gdpGrowthRate: formatGrowthRate(economy),
    majorIndustry: cleanMultiline(economy?.majorIndustry),
    governmentForm: cleanMultiline(politics?.governmentForm),
    diplomaticRelations: cleanMultiline(relation?.diplomaticRelations),
    missionStatus: cleanMultiline(relation?.missionStatus),
    odaStatus: cleanMultiline(relation?.odaStatus),
    sourceUrl: mofaSourceUrl(country.countryCode),
    isLive: Boolean(economy || relation || politics),
  };
}

async function collectContext(request: BriefRequest): Promise<BriefContext> {
  const { project, objectiveId, note } = request;
  const { profile, selectedCountry: country, selectedPartner: partner } = project;

  if (!profile) throw new Error("기업 프로필이 없어 사업기획서를 생성할 수 없습니다.");
  if (!country) throw new Error("추천 국가가 선택되지 않아 사업기획서를 생성할 수 없습니다.");

  const [economy, relation, politics] = await Promise.all([
    getCountryEconomy(country.countryCode).catch(() => null),
    getCountryKoreaRelation(country.countryCode).catch(() => null),
    getCountryPolitics(country.countryCode).catch(() => null),
  ]);

  return {
    profile,
    country,
    partner,
    knowledge:
      COUNTRY_KNOWLEDGE_BASE.find((item) => item.countryCode === country.countryCode) ?? null,
    objective: findObjective(objectiveId),
    facts: buildFactSheet(country, economy, relation, politics),
    note: note?.trim() ?? "",
  };
}

// ── 공통 파생값 ───────────────────────────────────────────────────────────────

// 앞 단어의 한글 종성 유무에 맞는 조사를 붙인다. ("센서를" / "기술을")
// 영문 조직명처럼 한글이 아닌 경우는 판별이 불가능하므로 "은(는)" 형태를 유지한다.
function josa(word: string, withJong: string, withoutJong: string): string {
  const last = word.trim().slice(-1);
  const code = last.charCodeAt(0);
  if (Number.isNaN(code) || code < 0xac00 || code > 0xd7a3) {
    return `${word}${withJong}(${withoutJong})`;
  }
  return `${word}${(code - 0xac00) % 28 !== 0 ? withJong : withoutJong}`;
}

function primarySector(context: BriefContext): string {
  return context.country.sectors[0] ?? "국제개발협력";
}

function primaryTechnology(profile: OrgProfile): string {
  return profile.technologies[0] ?? profile.oneLiner ?? "보유 기술";
}

function partnerName(context: BriefContext): string {
  return context.partner?.name ?? "현지 협력 NGO(미선정)";
}

// CountryOpportunity.howWeCanHelp는 추천 화면용 2인칭 문장("귀사의 ~을 활용하여 ~할 수 있습니다")이라
// 기획서 본문에 그대로 넣으면 문체가 깨진다. 같은 근거(helpContext)로 3인칭 문장을 다시 만든다.
function helpStatement(context: BriefContext): string {
  const { knowledge, country } = context;
  if (knowledge) return `${knowledge.helpContext}하는 것을 목표로 합니다.`;
  return country.needHeadline;
}

const BENEFICIARIES_BY_SECTOR: Record<string, string> = {
  "물·위생": "안전한 식수 접근이 제한된 농촌 지역 주민과 마을 상수도 운영 주체",
  보건의료: "1차 의료 접근성이 낮은 지역 주민과 지역 보건소 종사자",
  스마트농업: "관개·영농 정보가 부족한 소규모 자영농과 농민 협동조합",
  농촌개발: "농촌 지역 주민과 지방정부 담당 부서",
  재생에너지: "전력망이 닿지 않는 지역의 가구와 학교·보건소 등 공공시설",
  디지털교육: "학습 자원이 부족한 지역의 학생과 교사",
  교육접근성: "산간·오지 지역 학생과 교사",
  재난안전: "자연재해에 상시 노출된 지역 주민과 지방 재난관리 당국",
  "여성·아동보호": "모자보건이 취약한 계층의 여성과 영유아",
  기후대응: "기후 취약 지역의 주민과 지역 공동체",
  해양환경: "연안 지역 어민과 해양환경 관리 기관",
  "디지털 인프라": "공공 디지털 서비스를 이용하는 주민과 행정기관",
  디지털인프라: "공공 디지털 서비스를 이용하는 주민과 행정기관",
  디지털전환: "공공 디지털 서비스를 이용하는 주민과 행정기관",
};

function beneficiariesFor(context: BriefContext): string {
  for (const sector of context.country.sectors) {
    const match = BENEFICIARIES_BY_SECTOR[sector];
    if (match) return match;
  }
  return "사업 대상 지역 주민과 현지 공공기관";
}

// 사업 기간을 4단계로 나눈다. (12개월 → 1~2 / 3~5 / 6~10 / 11~12개월)
function phasePeriods(durationMonths: number): string[] {
  const b1 = Math.max(1, Math.round(durationMonths * 0.15));
  const b2 = Math.max(b1 + 1, Math.round(durationMonths * 0.4));
  const b3 = Math.max(b2 + 1, Math.round(durationMonths * 0.85));
  return [
    `1~${b1}개월`,
    `${b1 + 1}~${b2}개월`,
    `${b2 + 1}~${b3}개월`,
    `${b3 + 1}~${durationMonths}개월`,
  ];
}

// ── Gemini 경로: 컨텍스트 직렬화 ───────────────────────────────────────────────

// 여러 줄로 오는 외교부 필드를 한 줄 불릿 안에 넣기 위해 " / "로 이어붙인다.
function inline(value: string | null): string {
  return value ? value.split("\n").join(" / ") : "확인 불가";
}

function serializeContext(context: BriefContext): string {
  const { profile, country, partner, knowledge, objective, facts, note } = context;

  const lines: string[] = [
    "## 사업 목적 (사용자 선택)",
    `- ${objective.label}: ${objective.description}`,
    `- 사업 기간: ${objective.durationMonths}개월`,
    `- 추정 총사업비 규모(전제값, 실제 산정 필요): 약 ${objective.budgetScaleEok}억 원`,
    "",
    "## 기업 정보",
    `- 조직명: ${profile.name}`,
    `- 한 줄 소개: ${profile.oneLiner || "(미입력)"}`,
    `- 보유 기술: ${profile.technologies.join(", ") || "(미입력)"}`,
    `- 활용 사례: ${profile.useCases.join(" / ") || "(미입력)"}`,
    `- 연관 SDG: ${profile.sdgs.join(", ") || "(미분석)"}`,
    "",
    "## 협력 NGO 정보",
    partner
      ? [
          `- 기관명: ${partner.name}`,
          `- 매칭 점수: ${partner.matchScore}점`,
          `- 협력 시너지: ${partner.synergy.join(" / ")}`,
          `- 파악된 리스크: ${partner.risk}`,
          `- 협력 권고: ${partner.recommendation}`,
          partner.isDemo ? "- 주의: 이 NGO 정보는 샘플 데이터입니다." : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "- 아직 파트너 NGO가 선정되지 않았습니다. 파트너 발굴 자체를 사업 초기 과업으로 다루세요.",
    "",
    "## 추천 국가 (K-Impact Score)",
    `- 국가: ${country.country} (${country.countryCode})`,
    `- 총점: ${country.opportunityScore}/100 (기술적합 ${country.scoreBreakdown.techFit}, 수요심각성 ${country.scoreBreakdown.needSeverity}, ODA연계 ${country.scoreBreakdown.odaLinkage}, 파트너기반 ${country.scoreBreakdown.partnerBase}, 한국연계 ${country.scoreBreakdown.koreaTie})`,
    `- 현지 수요: ${country.needHeadline}`,
    `- 기여 방안: ${country.howWeCanHelp}`,
    `- 수요 분야: ${country.sectors.join(", ")}`,
    `- 추천 사업 아이디어: ${country.businessIdea}`,
    `- 추천 근거: ${country.reasons.join(" / ")}`,
    `- 예상 협력 기관: ${country.partners.map((p) => p.name).join(", ")}`,
    `- 연관 SDG: ${country.sdgs.join(", ")}`,
    "",
    "## 외교부 공공데이터 국가정보 (data.go.kr / opendata.mofa.go.kr)",
    facts.isLive ? "" : "- 주의: 외교부 API 응답을 받지 못했습니다. 아래 항목은 비어 있습니다.",
    `- 1인당 GDP: ${inline(facts.gdpPerCapita)}`,
    `- 경제성장률: ${inline(facts.gdpGrowthRate)}`,
    `- 주요 산업: ${inline(facts.majorIndustry)}`,
    `- 정부 형태: ${inline(facts.governmentForm)}`,
    `- 대한민국과의 수교: ${inline(facts.diplomaticRelations)}`,
    `- 재외공관 현황: ${inline(facts.missionStatus)}`,
    "",
    "## ODA 관련 데이터",
    `- 대한민국 누적 ODA 지원 실적: ${inline(facts.odaStatus)}`,
    `- ODA 연계 가능성: ${knowledge?.odaLinkageReason ?? "확인 불가"}`,
  ];

  if (note) {
    lines.push("", "## 사용자 추가 요청사항", `- ${note}`);
  }

  return lines.filter((line) => line !== "").join("\n");
}

// ── 템플릿 경로: 같은 데이터로 규칙 기반 초안 작성 ──────────────────────────────

const TITLE_BY_OBJECTIVE: Record<BusinessObjectiveId, (c: BriefContext) => string> = {
  tech_pilot: (c) => `${c.country.country} ${c.country.businessIdea}`,
  capacity_building: (c) =>
    `${c.country.country} ${primarySector(c)} 분야 현지 역량강화 및 기술이전 사업`,
  infra_improvement: (c) => `${c.country.country} ${primarySector(c)} 인프라 구축·개선 사업`,
  market_entry: (c) => `${c.country.country} ${primarySector(c)} 시장 진출 기반 구축 사업`,
  oda_linkage: (c) => `${c.country.country} ${primarySector(c)} 분야 ODA 연계 협력사업`,
};

const BUDGET_BY_OBJECTIVE: Record<BusinessObjectiveId, BriefBudgetLine[]> = {
  tech_pilot: [
    { item: "장비·센서 도입", share: 35, note: "실증 대상지 규모에 따라 변동" },
    { item: "시스템 구축 및 현지화", share: 20, note: "현지 언어·환경 대응 개발 포함" },
    { item: "현지 인력 교육", share: 15, note: "운영 인력 및 파트너 실무자 대상" },
    { item: "현지 운영·모니터링", share: 15, note: "실증 기간 중 운영비" },
    { item: "사업관리 및 성과평가", share: 10, note: "중간·종료 평가 포함" },
    { item: "예비비", share: 5, note: "환율·물가 변동 대응" },
  ],
  capacity_building: [
    { item: "교육 프로그램 개발·운영", share: 30, note: "커리큘럼 설계 및 실습 과정" },
    { item: "현지 교육 인프라 구축", share: 20, note: "교육장·실습 장비" },
    { item: "기술이전 및 상주 지원", share: 20, note: "초기 상주 엔지니어 파견" },
    { item: "교재 제작 및 현지화", share: 10, note: "현지어 번역 포함" },
    { item: "사업관리 및 성과평가", share: 12, note: "교육 이수·역량 진단 포함" },
    { item: "예비비", share: 8, note: "환율·물가 변동 대응" },
  ],
  infra_improvement: [
    { item: "설비·시설 구축", share: 45, note: "본 사업의 핵심 지출 항목" },
    { item: "설계 및 인허가", share: 10, note: "현지 규제 대응 비용 포함" },
    { item: "기자재 도입", share: 15, note: "운영 장비 및 예비 부품" },
    { item: "유지보수 체계 구축", share: 12, note: "사업 종료 후 지속 운영 대비" },
    { item: "사업관리 및 성과평가", share: 10, note: "시공 감리 포함" },
    { item: "예비비", share: 8, note: "공사 지연·물가 변동 대응" },
  ],
  market_entry: [
    { item: "현지 실증 및 레퍼런스 확보", share: 30, note: "후속 수주의 근거 자료 확보" },
    { item: "파트너십 구축", share: 20, note: "현지 기관·유통 채널 협력" },
    { item: "인증 및 규제 대응", share: 20, note: "현지 인증 취득 비용" },
    { item: "현지 마케팅·홍보", share: 15, note: "현지 설명회·전시 참가" },
    { item: "사업관리", share: 10, note: "현지 법인·사무 지원" },
    { item: "예비비", share: 5, note: "환율·물가 변동 대응" },
  ],
  oda_linkage: [
    { item: "시설·기자재", share: 40, note: "공모 사업 제안서 기준 주요 항목" },
    { item: "역량강화 및 기술이전", share: 20, note: "현지 수행기관 인수인계 포함" },
    { item: "현지 운영비", share: 15, note: "사업 기간 중 운영 인건비" },
    { item: "사업관리(PMC)", share: 12, note: "사업관리 전문 인력" },
    { item: "성과평가 및 모니터링", share: 8, note: "KOICA 성과관리 체계 대응" },
    { item: "예비비", share: 5, note: "환율·물가 변동 대응" },
  ],
};

interface PhaseTemplate {
  title: string;
  activities: string[];
}

const MIDDLE_PHASES_BY_OBJECTIVE: Record<BusinessObjectiveId, [PhaseTemplate, PhaseTemplate]> = {
  tech_pilot: [
    {
      title: "시스템 설계 및 현지화",
      activities: ["현지 환경 맞춤 설계", "장비 조달 및 반입", "현지 운영 인력 선발·교육"],
    },
    {
      title: "설치 및 실증 운영",
      activities: ["대상지 설치 및 시운전", "실증 데이터 수집·분석", "운영 매뉴얼 현지어 이관"],
    },
  ],
  capacity_building: [
    {
      title: "교육과정 설계 및 교육인력 선발",
      activities: ["직무 역량 진단", "커리큘럼·교재 현지화", "핵심 교육인력(ToT) 선발"],
    },
    {
      title: "교육 운영 및 기술이전",
      activities: ["집합·실습 교육 운영", "현장 OJT 및 상주 지원", "이수자 역량 평가"],
    },
  ],
  infra_improvement: [
    {
      title: "기본설계 및 인허가",
      activities: ["현장 측량 및 기본설계", "현지 인허가 취득", "시공사 선정"],
    },
    {
      title: "시공 및 시운전",
      activities: ["설비·시설 시공", "기자재 설치 및 시운전", "운영 인력 인수인계 교육"],
    },
  ],
  market_entry: [
    {
      title: "규제 대응 및 파트너십 구축",
      activities: ["현지 인증 요건 확인", "유통·운영 파트너 발굴", "협력 계약 체결"],
    },
    {
      title: "레퍼런스 실증 및 현지 검증",
      activities: ["소규모 실증 운영", "현지 고객 피드백 수집", "레퍼런스 자료화"],
    },
  ],
  oda_linkage: [
    {
      title: "사업계획 확정 및 공모 대응",
      activities: ["사업계획서 정교화", "공모 트랙 검토 및 제안서 제출", "협력 기관 컨소시엄 구성"],
    },
    {
      title: "본사업 착수 및 구축",
      activities: ["현지 사무소 개설", "시설·기자재 구축", "현지 수행체계 운영"],
    },
  ],
};

function buildPhases(context: BriefContext): BriefPhase[] {
  const periods = phasePeriods(context.objective.durationMonths);
  const [middle1, middle2] = MIDDLE_PHASES_BY_OBJECTIVE[context.objective.id];

  return [
    {
      period: periods[0],
      title: "착수 및 현지 실사",
      activities: [
        `${context.country.country} 현지 수요조사 및 대상지 선정`,
        `${partnerName(context)}와 협력 협약(MOU) 체결`,
        "현지 인허가 요건 및 규제 확인",
      ],
    },
    { period: periods[1], ...middle1 },
    { period: periods[2], ...middle2 },
    {
      period: periods[3],
      title: "성과평가 및 확산",
      activities: [
        "성과지표 측정 및 종료 평가",
        "현지 파트너 이관 및 지속운영 체계 확정",
        "후속 사업·확대 적용 방안 도출",
      ],
    },
  ];
}

function buildRoles(context: BriefContext): BriefRole[] {
  const { profile, country, partner } = context;
  const tech = primaryTechnology(profile);

  const roles: BriefRole[] = [
    {
      actor: profile.name,
      role: `${tech} 공급과 시스템 구축, 현지 인력 기술 교육을 담당합니다.`,
    },
  ];

  if (partner) {
    roles.push({
      actor: partner.name,
      role: `${country.country} 현장 운영과 주민·지방정부 커뮤니케이션, 사업 모니터링을 담당합니다.`,
    });
  } else {
    roles.push({
      actor: "현지 협력 NGO (미선정)",
      role: "현장 운영을 맡을 파트너 발굴을 사업 착수 단계의 우선 과업으로 둡니다.",
    });
  }

  for (const lead of country.partners) {
    if (lead.name === partner?.name) continue;
    roles.push({
      actor: lead.name,
      role: lead.isConfirmedOrg
        ? "사업비 지원과 성과 관리, 현지 협력 채널 연계를 담당합니다."
        : "인허가와 정책 연계, 현지 인프라 접점을 담당합니다. (구체 기관은 착수 단계에서 확정)",
    });
  }

  return roles;
}

function buildKpis(context: BriefContext): BriefKpi[] {
  const { objective, country } = context;
  const sector = primarySector(context);

  const objectiveKpi: Record<BusinessObjectiveId, BriefKpi> = {
    tech_pilot: {
      indicator: "실증 시스템 정상 가동률",
      baseline: "미측정 (착수 조사 시 확정)",
      target: "실증 기간 중 90% 이상",
    },
    capacity_building: {
      indicator: "교육 이수자 중 독립 운영 가능 인력 비율",
      baseline: "0명",
      target: "이수자의 70% 이상",
    },
    infra_improvement: {
      indicator: "구축 설비의 서비스 가동률",
      baseline: "미측정 (착수 조사 시 확정)",
      target: "준공 후 12개월간 85% 이상",
    },
    market_entry: {
      indicator: "확보한 현지 레퍼런스·파트너십 건수",
      baseline: "0건",
      target: "3건 이상",
    },
    oda_linkage: {
      indicator: "ODA 공모 사업 제안서 제출·선정",
      baseline: "0건",
      target: "제안 1건 이상 제출 및 선정",
    },
  };

  return [
    {
      indicator: `${sector} 분야 수혜 인구`,
      baseline: "0명",
      target: `${objective.durationMonths}개월 내 대상 지역 주민 확대 (착수 조사에서 목표치 확정)`,
    },
    objectiveKpi[objective.id],
    {
      indicator: `현지 인력 교육 이수자 (${country.country})`,
      baseline: "0명",
      target: "파트너 기관 실무자 및 지역 운영 인력 대상 교육 과정 이수",
    },
    {
      indicator: "사업 종료 후 현지 자립 운영 체계",
      baseline: "미구축",
      target: "운영 매뉴얼 현지어 이관 및 유지보수 주체 확정",
    },
  ];
}

function buildRisks(context: BriefContext): BriefRisk[] {
  const { partner, facts, profile, country } = context;
  const risks: BriefRisk[] = [];

  if (partner) {
    risks.push({
      risk: `파트너 리스크: ${partner.risk}`,
      mitigation:
        partner.recommendation ||
        "사업 초기 기술 교육 프로그램을 병행해 파트너의 수행 역량을 보완합니다.",
      level: "mid",
    });
  } else {
    risks.push({
      risk: "현장 운영을 맡을 파트너 NGO가 아직 선정되지 않았습니다.",
      mitigation: "착수 단계에서 현지 등록 NGO 실사를 진행하고 협약 체결 후 본 사업에 착수합니다.",
      level: "high",
    });
  }

  risks.push({
    risk: `${country.country} 현지 전력·통신 인프라의 불안정성으로 시스템 운영이 중단될 수 있습니다.`,
    mitigation: "보조 전원과 오프라인 데이터 캐싱을 설계에 반영하고, 정기 점검 체계를 둡니다.",
    level: "mid",
  });

  risks.push({
    risk: `인허가 지연 위험 (정부 형태: ${facts.governmentForm ?? "확인 불가"})`,
    mitigation: facts.missionStatus
      ? "주재 공관과 기존 ODA 협력 채널을 활용해 인허가 절차를 사전 협의합니다."
      : "현지 법무·행정 자문을 착수 단계에 배치해 인허가 리스크를 조기에 파악합니다.",
    level: facts.missionStatus ? "low" : "mid",
  });

  risks.push({
    risk: `${primaryTechnology(profile)}의 현지 환경 적합성이 검증되지 않았습니다.`,
    mitigation: "착수 단계 현지 실사에서 소규모 테스트를 선행하고, 결과에 따라 설계를 조정합니다.",
    level: "mid",
  });

  return risks;
}

function buildBackground(context: BriefContext): string {
  const { country, facts } = context;
  const parts: string[] = [];

  const economyBits: string[] = [];
  if (facts.gdpPerCapita) economyBits.push(`1인당 GDP ${facts.gdpPerCapita}`);
  if (facts.gdpGrowthRate) economyBits.push(`경제성장률 ${facts.gdpGrowthRate}`);
  if (facts.majorIndustry) economyBits.push(`주요 산업은 ${facts.majorIndustry}`);

  if (economyBits.length > 0) {
    parts.push(`외교부 공공데이터 기준 ${country.country}는 ${economyBits.join(", ")} 수준입니다.`);
  }

  parts.push(country.needHeadline);

  const treaty = firstLine(facts.diplomaticRelations);
  const oda = firstLine(facts.odaStatus);

  const relationBits: string[] = [];
  if (treaty) relationBits.push(`대한민국과는 ${treaty} 이후 협력 관계를 이어오고 있으며`);
  if (oda) relationBits.push(`누적 ODA 지원 실적은 ${oda}입니다`);
  if (facts.missionStatus) relationBits.push("주재 공관이 설치되어 있어 사업 추진 기반이 있습니다");

  if (relationBits.length > 0) {
    parts.push(`${relationBits.join(", ")}.`);
  }

  if (!facts.isLive) {
    parts.push(
      "※ 외교부 공공데이터 API 응답을 받지 못해 국가 경제·협력 현황은 반영되지 않았습니다."
    );
  }

  return parts.join(" ");
}

function buildSummary(context: BriefContext): string {
  const { profile, country, objective } = context;
  const tech = primaryTechnology(profile);

  return [
    `${profile.name}의 ${josa(tech, "을", "를")} ${partnerName(context)}의 ${country.country} 현장 네트워크와 결합해 ${helpStatement(context)}`,
    `사업 목적은 '${objective.label}'이며, ${objective.durationMonths}개월간 총사업비 약 ${objective.budgetScaleEok}억 원 규모(추정)로 추진합니다.`,
    `${country.country}는 K-Impact Score ${country.opportunityScore}점으로 후보국 중 가장 높은 적합도를 보였습니다.`,
  ].join(" ");
}

function buildGoals(context: BriefContext): string[] {
  const { objective, country, profile } = context;
  const sector = primarySector(context);

  const objectiveGoal: Record<BusinessObjectiveId, string> = {
    tech_pilot: `${primaryTechnology(profile)}의 현지 적용 가능성을 실증하고 확산 근거를 확보한다.`,
    capacity_building: `현지 인력과 기관이 사업 종료 후 독립적으로 운영할 수 있는 역량을 확보한다.`,
    infra_improvement: `${sector} 서비스에 대한 대상 지역의 접근성을 실질적으로 개선한다.`,
    market_entry: `현지 파트너십과 레퍼런스를 확보해 후속 사업 진출 기반을 구축한다.`,
    oda_linkage: `KOICA 등 공적개발원조 공모 사업에 제안 가능한 수준의 사업 체계를 갖춘다.`,
  };

  return [
    `${country.country}의 ${sector} 분야 현지 개발 수요에 대응한다.`,
    objectiveGoal[objective.id],
    `${partnerName(context)}와의 협력 체계를 통해 사업 종료 후에도 지속 운영되는 구조를 만든다.`,
  ];
}

function buildSections(context: BriefContext): { title: string; content: string }[] {
  const { profile, country, partner, knowledge, objective, note } = context;
  const tech = primaryTechnology(profile);

  const sections = [
    {
      title: "기술 · 솔루션 개요",
      content: [
        `${josa(profile.name, "은", "는")} ${profile.oneLiner || `${tech}를 보유한 조직`}입니다.`,
        profile.technologies.length > 0
          ? `핵심 기술은 ${profile.technologies.join(", ")}이며,`
          : "",
        profile.useCases.length > 0
          ? `${profile.useCases.join(", ")} 등의 활용 사례를 보유하고 있습니다.`
          : "국제개발협력 현장 적용을 위한 현지화가 필요합니다.",
        `본 사업에서는 이 기술로 ${helpStatement(context)}`,
      ]
        .filter(Boolean)
        .join(" "),
    },
    {
      title: "협력 파트너와 협업 구조",
      content: partner
        ? [
            `${josa(partner.name, "은", "는")} 매칭 점수 ${partner.matchScore}점으로 본 사업의 현장 파트너로 추천되었습니다.`,
            partner.synergy.length > 0 ? `협력 시너지: ${partner.synergy.join(" / ")}.` : "",
            `${josa(profile.name, "이", "가")} 기술과 교육을, ${josa(partner.name, "이", "가")} 현장 운영과 지역사회 접점을 맡는 역할 분담을 전제로 설계했습니다.`,
            partner.isDemo
              ? "※ 이 NGO 정보는 샘플 데이터이므로 실제 협력 전 기관 실사가 필요합니다."
              : "",
          ]
            .filter(Boolean)
            .join(" ")
        : `아직 현장 파트너가 선정되지 않았습니다. ${country.country} 내 ${primarySector(context)} 분야에서 활동하는 등록 NGO를 대상으로 착수 단계에서 실사와 협약을 진행하는 것을 전제로 설계했습니다.`,
    },
    {
      title: "추진 전략",
      content: [
        `사업 목적인 '${objective.label}'에 맞춰 ${objective.description}`,
        `${objective.durationMonths}개월을 착수·설계·실행·평가의 4단계로 나누어 추진하며, 각 단계 종료 시점에 성과지표를 점검해 다음 단계 진입 여부를 결정합니다.`,
        knowledge ? `현지 수요 분야는 ${knowledge.sectors.join(", ")}입니다.` : "",
      ]
        .filter(Boolean)
        .join(" "),
    },
    {
      title: "지속가능성 및 확산 계획",
      content: [
        "사업 종료 후에도 현지에서 자립적으로 운영되도록 운영 매뉴얼의 현지어 이관, 유지보수 주체 확정, 현지 인력 교육을 사업 기간 내에 완료합니다.",
        `1차 성과가 검증되면 ${country.country} 내 인접 지역으로 확대하고, 유사한 수요를 가진 인접국으로의 수평 확산을 검토합니다.`,
      ].join(" "),
    },
  ];

  if (note) {
    sections.push({
      title: "사용자 추가 요청 반영",
      content: `기획 시 다음 요청사항을 반영했습니다: ${note}`,
    });
  }

  return sections;
}

function buildOdaLinkage(context: BriefContext): string {
  const { country, facts, knowledge } = context;
  const parts: string[] = [];

  const oda = firstLine(facts.odaStatus);
  if (oda) {
    parts.push(`대한민국은 ${country.country}에 ${oda} 규모의 ODA를 지원해왔습니다.`);
  }
  if (knowledge) parts.push(`${knowledge.odaLinkageReason}.`);

  parts.push(
    "본 사업은 KOICA의 민관협력 사업 공모 트랙(CTS·IPP 등) 연계를 검토할 수 있으며, 공모 요건과 접수 일정은 착수 전 별도 확인이 필요합니다."
  );

  return parts.join(" ");
}

function buildCitations(context: BriefContext): Citation[] {
  const { country, partner, facts } = context;

  const citations: Citation[] = [
    {
      id: `cite_brief_${facts.countryCode}_mofa`,
      sourceName: "외교부 공공데이터(LOD)",
      title: `${country.country} 국가정보 · 경제현황 · 대한민국과의 관계(ODA 실적)`,
      url: facts.sourceUrl,
      isDemo: !facts.isLive,
      usedIn: ["proposal", "country"],
    },
    ...country.citations.map((citation) => ({
      ...citation,
      usedIn: Array.from(new Set([...citation.usedIn, "proposal"])),
    })),
    ...(partner?.citations ?? []).map((citation) => ({
      ...citation,
      usedIn: Array.from(new Set([...citation.usedIn, "proposal"])),
    })),
  ];

  const byId = new Map(citations.map((citation) => [citation.id, citation]));
  return Array.from(byId.values());
}

function buildTemplateBrief(context: BriefContext): ProposalDraft {
  const { country, profile, objective, facts } = context;

  return {
    projectTitle: TITLE_BY_OBJECTIVE[objective.id](context),
    objectiveId: objective.id,
    objectiveLabel: objective.label,
    summary: buildSummary(context),
    background: buildBackground(context),
    beneficiaries: beneficiariesFor(context),
    goals: buildGoals(context),
    sections: buildSections(context),
    roles: buildRoles(context),
    phases: buildPhases(context),
    kpis: buildKpis(context),
    budget: BUDGET_BY_OBJECTIVE[objective.id],
    budgetNote: `총사업비 약 ${objective.budgetScaleEok}억 원 규모로 추정했습니다. 이는 ${objective.label} 유형의 통상 사업 규모를 전제로 한 참고값이며, 실제 예산은 현지 실사 후 산정해야 합니다.`,
    risks: buildRisks(context),
    sdgs: Array.from(new Set([...country.sdgs, ...profile.sdgs])).slice(0, 4),
    odaLinkage: buildOdaLinkage(context),
    countryFacts: facts,
    citations: buildCitations(context),
    isDemo: true,
    generatedBy: TEMPLATE_LABEL,
    generatedAt: new Date().toISOString(),
  };
}

// ── 조립 ─────────────────────────────────────────────────────────────────────

// AI가 예산 비중을 100%에서 벗어나게 주는 경우가 있어 보정한다.
function normalizeBudget(lines: BriefBudgetLine[], fallback: BriefBudgetLine[]): BriefBudgetLine[] {
  if (lines.length === 0) return fallback;
  const total = lines.reduce((sum, line) => sum + (Number(line.share) || 0), 0);
  if (total <= 0) return fallback;
  return lines.map((line) => ({
    ...line,
    share: Math.round(((Number(line.share) || 0) / total) * 1000) / 10,
  }));
}

function fromAiPayload(
  context: BriefContext,
  payload: AiBriefPayload,
  generatedBy: string
): ProposalDraft {
  const { country, profile, objective, facts } = context;
  const template = BUDGET_BY_OBJECTIVE[objective.id];

  return {
    projectTitle: payload.projectTitle || TITLE_BY_OBJECTIVE[objective.id](context),
    objectiveId: objective.id,
    objectiveLabel: objective.label,
    summary: payload.summary,
    background: payload.background,
    beneficiaries: payload.beneficiaries || beneficiariesFor(context),
    goals: payload.goals ?? [],
    sections: payload.sections ?? [],
    roles: payload.roles ?? [],
    phases: payload.phases ?? [],
    kpis: payload.kpis ?? [],
    budget: normalizeBudget(payload.budget ?? [], template),
    budgetNote: payload.budgetNote,
    risks: payload.risks ?? [],
    // SDG·출처·국가정보는 AI가 아니라 실데이터에서 그대로 가져온다.
    sdgs: Array.from(new Set([...country.sdgs, ...profile.sdgs])).slice(0, 4),
    odaLinkage: payload.odaLinkage,
    countryFacts: facts,
    citations: buildCitations(context),
    isDemo: false,
    generatedBy,
    generatedAt: new Date().toISOString(),
  };
}

export async function buildBrief(request: BriefRequest): Promise<ProposalDraft> {
  const context = await collectContext(request);
  const provider = selectProvider();

  if (provider) {
    try {
      const payload = await provider.generate(serializeContext(context));
      return fromAiPayload(context, payload, provider.label);
    } catch (error) {
      console.error(
        `[buildBrief] ${provider.label} 생성 실패, 템플릿 초안으로 대체합니다:`,
        error
      );
    }
  }

  // AI 미연결(또는 호출 실패) — 같은 실데이터로 템플릿 초안을 만든다.
  await new Promise((resolve) => setTimeout(resolve, 1800 + Math.random() * 1200));
  return buildTemplateBrief(context);
}

// 서술형 섹션 1개만 다시 생성한다.
export async function rewriteSection(
  request: BriefRequest,
  sectionIndex: number
): Promise<AiBriefSection> {
  const context = await collectContext(request);
  const current = request.project.proposalDraft?.sections[sectionIndex];
  if (!current) throw new Error("다시 생성할 섹션을 찾을 수 없습니다.");

  const provider = selectProvider();
  if (provider) {
    try {
      return await provider.rewrite(serializeContext(context), current);
    } catch (error) {
      console.error(`[rewriteSection] ${provider.label} 재작성 실패, 템플릿으로 대체합니다:`, error);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800));

  // AI 미연결 상태에서는 같은 데이터로 템플릿 섹션을 다시 만들어 준다.
  const regenerated = buildSections(context).find((section) => section.title === current.title);
  return regenerated ?? current;
}
