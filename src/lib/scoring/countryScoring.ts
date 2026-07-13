import { COUNTRY_KNOWLEDGE_BASE, type CountryKnowledge } from "@/lib/data/countryKnowledge";
import type { Citation, CountryOpportunity, OrgProfile } from "@/lib/types";
import {
  getCountryEconomy,
  getCountryKoreaRelation,
  type CountryEconomy,
  type CountryKoreaRelation,
} from "@/lib/mofa/client";

// "적합 국가 TOP 3 선정 기준" 문서의 2장 배점표를 구현한다.
// 국가 자체의 성질에 해당하는 4개 항목(문제 심각성·ODA 연계·파트너 기반·한국 협력
// 연계성, 합 65점)은 외교부 공공데이터포털(data.go.kr)에서 실시간으로 받아온
// 경제현황·대한민국과의 관계 데이터를 근거로 계산한다. 국가별 "무엇이 필요한가"
// 서술과 기술 매칭 키워드는 공식 API에 없는 정보라 countryKnowledge.ts의 큐레이션을
// 함께 쓰되, 실제 산업 데이터(major_industry)가 있으면 그것도 매칭에 반영한다.

function normalize(text: string): string {
  return text.toLowerCase();
}

function buildProfileSignalText(profile: OrgProfile): string {
  return normalize([profile.oneLiner, ...profile.technologies, ...profile.useCases].join(" "));
}

function extractIndustryTokens(majorIndustry: string | null): string[] {
  if (!majorIndustry) return [];
  return majorIndustry
    .replace(/[0-9.%()]/g, "")
    .split(/[,·\s]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);
}

// 2-1. 기술·역량과 국가 수요의 적합성 (0~35)
// 실제 major_industry(공공데이터)가 있으면 키워드에 합쳐서 매칭 근거로 쓴다.
function scoreTechFit(
  profile: OrgProfile,
  country: CountryKnowledge,
  economy: CountryEconomy | null
): number {
  const profileText = buildProfileSignalText(profile);
  const allKeywords = [...country.keywords, ...extractIndustryTokens(economy?.majorIndustry ?? null)];

  const matchedKeywords = allKeywords.filter((keyword) => profileText.includes(normalize(keyword)))
    .length;
  const matchedSdgs = country.sdgs.filter((sdg) => profile.sdgs.includes(sdg)).length;

  if (matchedKeywords === 0) {
    // 키워드 근거가 전혀 없으면 SDG가 여럿 겹쳐도 "간접적으로 활용 가능" 수준 이상은 주지 않는다.
    return matchedSdgs >= 2 ? 11 : 4;
  }

  const signal = matchedSdgs * 2 + matchedKeywords;
  if (signal >= 5) return 32; // 31~35점 밴드
  if (signal >= 3) return 27; // 24~30점 밴드
  return 19; // 16~23점 밴드
}

// 2-2. 국가의 문제 심각성과 개발 수요 (0~25) — 실제 1인당 GDP(IMF/UNCTADstat) 기반.
// 세계은행 소득분류 경계값을 참고해 소득 수준이 낮을수록 개발 수요가 크다고 본다.
function parseNumber(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function deriveNeedSeverity(economy: CountryEconomy | null): number {
  const gdpPerCapita = parseNumber(economy?.gdpPerCapita ?? null);
  if (gdpPerCapita === null) return 13; // 데이터 없음 → 중간값, confidence에서 별도 표시
  if (gdpPerCapita < 1200) return 25;
  if (gdpPerCapita < 2000) return 21;
  if (gdpPerCapita < 3500) return 17;
  if (gdpPerCapita < 6000) return 12;
  return 7;
}

// 2-3. 사업화 및 국제개발협력 연계 가능성 (0~20) — 실제 누적 ODA 규모(OECD 집계) 기반.
function parseOdaAmountInEok(text: string | null): number {
  if (!text) return 0;
  const eok = text.match(/([\d,.]+)\s*억/);
  if (eok) return parseFloat(eok[1].replace(/,/g, ""));
  const baekman = text.match(/([\d,.]+)\s*백만/);
  if (baekman) return parseFloat(baekman[1].replace(/,/g, "")) / 100;
  return 0.5; // 텍스트는 있으나 숫자 형식을 못 읽은 경우 — 약한 신호로만 인정
}

function deriveOdaLinkage(relation: CountryKoreaRelation | null): number {
  const eok = parseOdaAmountInEok(relation?.odaStatus ?? null);
  if (eok >= 10) return 20;
  if (eok >= 5) return 16;
  if (eok >= 1) return 12;
  if (eok > 0) return 8;
  return 4;
}

// 2-4. 파트너 및 수행 기반 (0~10) — 실제 재외공관(대사관) 현황 텍스트 기반.
function derivePartnerBase(relation: CountryKoreaRelation | null): number {
  const mission = relation?.missionStatus ?? null;
  if (!mission) return 3;
  if (mission.includes("대사관") || mission.includes("대사:") || mission.includes("대사 :")) return 8;
  return 5;
}

// 2-5. 한국과의 정책·협력 연계성 (0~10) — 실제 수교 여부·투자·교민 현황 기반.
function deriveKoreaTie(relation: CountryKoreaRelation | null): number {
  if (!relation) return 3;
  let score = 0;
  if (relation.diplomaticRelations) score += 3;
  if (relation.investmentStatus) score += 4;
  if (relation.oksStatus) score += 3;
  return Math.min(10, score);
}

function pickTopTechnology(profile: OrgProfile): string {
  return profile.technologies[0] ?? (profile.oneLiner || "보유 기술");
}

function buildMofaSourceUrl(alpha2: string): string {
  return `https://opendata.mofa.go.kr/lod/view.do?uri=${encodeURIComponent(
    `http://opendata.mofa.go.kr/core/resource/Country/${alpha2}`
  )}`;
}

function buildCitations(country: CountryKnowledge): Citation[] {
  const liveCitation: Citation = {
    id: `cite_${country.countryCode}_live`,
    sourceName: "외교부 공공데이터(LOD)",
    title: `${country.country} 국가정보 · 경제현황·대한민국과의 관계`,
    url: buildMofaSourceUrl(country.countryCode),
    isDemo: false,
    usedIn: ["country"],
  };
  const verifiedExtra = country.citations.filter((citation) => !citation.isDemo);
  return [liveCitation, ...verifiedExtra];
}

function toConfidence(
  economy: CountryEconomy | null,
  relation: CountryKoreaRelation | null,
  techFit: number
): "high" | "mid" | "low" {
  if (techFit <= 4) return "low"; // 기술 연관성이 낮으면 신뢰도도 낮게 표시
  const hasEconomy = economy?.gdpPerCapita != null;
  const hasRelation = relation?.odaStatus != null || relation?.investmentStatus != null;
  if (hasEconomy && hasRelation) return "high";
  if (hasEconomy || hasRelation) return "mid";
  return "low";
}

function pickDisplaySdgs(profile: OrgProfile, country: CountryKnowledge): string[] {
  const overlap = country.sdgs.filter((sdg) => profile.sdgs.includes(sdg));
  return (overlap.length > 0 ? overlap : country.sdgs).slice(0, 3);
}

async function scoreCountryForProfile(
  profile: OrgProfile,
  country: CountryKnowledge
): Promise<CountryOpportunity> {
  const [economy, relation] = await Promise.all([
    getCountryEconomy(country.countryCode).catch(() => null),
    getCountryKoreaRelation(country.countryCode).catch(() => null),
  ]);

  const techFit = scoreTechFit(profile, country, economy);
  const needSeverity = deriveNeedSeverity(economy);
  const odaLinkage = deriveOdaLinkage(relation);
  const partnerBase = derivePartnerBase(relation);
  const koreaTie = deriveKoreaTie(relation);
  const total = techFit + needSeverity + odaLinkage + partnerBase + koreaTie;
  const topTech = pickTopTechnology(profile);

  const techReason =
    techFit >= 27
      ? `귀사의 ${topTech} 기술이 해당 문제 해결에 직접 활용 가능`
      : techFit >= 19
        ? `귀사의 ${topTech} 기술을 현지화하면 해당 문제 해결에 기여 가능`
        : `귀사의 기술을 활용하려면 추가 현지화 또는 파트너 협력이 필요`;

  const odaReason = relation?.odaStatus
    ? `대한민국의 누적 ODA 지원 실적이 확인되어 신규 사업 연계 가능 (${relation.odaStatus.split("\n")[0]})`
    : country.odaLinkageReason;

  return {
    country: country.country,
    countryCode: country.countryCode,
    opportunityScore: total,
    reasons: [country.problemReason, techReason, odaReason],
    sdgs: pickDisplaySdgs(profile, country),
    confidence: toConfidence(economy, relation, techFit),
    citations: buildCitations(country),
    needHeadline: country.needHeadline,
    howWeCanHelp: `귀사의 ${topTech}을(를) 활용하여 ${country.helpContext}할 수 있습니다.`,
    sectors: country.sectors,
    businessIdea: country.businessIdea,
    partners: country.partners,
    scoreBreakdown: { techFit, needSeverity, odaLinkage, partnerBase, koreaTie },
  };
}

// TOP N 국가를 반환한다. (discover 화면은 3개를 먼저 보여주고 "더 보기"로 확장)
export async function rankCountries(profile: OrgProfile, limit = 5): Promise<CountryOpportunity[]> {
  const results = await Promise.allSettled(
    COUNTRY_KNOWLEDGE_BASE.map((country) => scoreCountryForProfile(profile, country))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<CountryOpportunity> => r.status === "fulfilled")
    .map((r) => r.value)
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, limit);
}
