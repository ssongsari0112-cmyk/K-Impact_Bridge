// 외교부 공공데이터포털(data.go.kr) 오픈API 연동.
// serviceKey는 opendata.mofa.go.kr 자체 페이지의 공개 스크립트(js/frotoma/mofa/openapi.js)에서
// 확인한 값이다. 실제 서비스로 전환할 때는 data.go.kr에서 직접 발급받은 본인 서비스키로
// MOFA_SERVICE_KEY 환경변수를 채워 넣는 것을 권장한다.
const FALLBACK_SERVICE_KEY =
  "87BcUziFM5gNuIq1kHT7v5UOUt%2FFCfPv8t4XMCgxYqfFcmvZHDM08GVMSVn5Ps5uIS5vP6YI0w7lZ%2B52dpASzg%3D%3D";

const SERVICE_KEY = process.env.MOFA_SERVICE_KEY ?? FALLBACK_SERVICE_KEY;

const REVALIDATE_SECONDS = 60 * 60 * 6; // 6시간 캐시 — 국가 개황 정보는 자주 바뀌지 않음

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) throw new Error(`MOFA API request failed: ${res.status}`);
  return res.json();
}

function firstItem(json: unknown): Record<string, unknown> | null {
  const items = (json as { response?: { body?: { items?: { item?: unknown } } } })?.response?.body
    ?.items?.item;
  return Array.isArray(items) && items.length > 0 ? (items[0] as Record<string, unknown>) : null;
}

function allItems(json: unknown): Record<string, unknown>[] {
  const items = (json as { response?: { body?: { items?: { item?: unknown } } } })?.response?.body
    ?.items?.item;
  return Array.isArray(items) ? (items as Record<string, unknown>[]) : [];
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function buildDataGoKrUrl(servicePath: string, alpha2: string): string {
  const query = new URLSearchParams({
    pageNo: "1",
    numOfRows: "10",
    returnType: "JSON",
  });
  query.set("cond[country_iso_alp2::EQ]", alpha2);
  return `https://apis.data.go.kr/1262000/${servicePath}?serviceKey=${SERVICE_KEY}&${query.toString()}`;
}

export interface CountryBasicInfo {
  isoAlpha2: string;
  isoAlpha3: string | null;
  nameKo: string | null;
  nameEn: string | null;
  timezone: string | null;
  callingCode: string | null;
  currency: string | null;
  flagImageUrl: string | null;
}

export async function getCountryBasicInfo(alpha2: string): Promise<CountryBasicInfo | null> {
  const subject = encodeURIComponent(`http://opendata.mofa.go.kr/core/resource/Country/${alpha2}`);
  const json = await fetchJson(
    `https://opendata.mofa.go.kr/lod/rest/getCountryInformation?subject=${subject}`
  );
  const rows = Array.isArray(json)
    ? (json as Array<{ predicatename: string; object: string }>)
    : [];
  if (rows.length === 0) return null;

  const byName = new Map(rows.map((row) => [row.predicatename, row.object]));
  return {
    isoAlpha2: byName.get("ISO2자리코드") ?? alpha2,
    isoAlpha3: byName.get("ISO3자리코드") ?? null,
    nameKo: byName.get("ISO국가명") ?? null,
    nameEn: byName.get("ISO국가영문명") ?? null,
    timezone: byName.get("TimeZone") ?? null,
    callingCode: byName.get("국제전화번호") ?? null,
    currency: byName.get("통화") ?? null,
    flagImageUrl: byName.get("이미지") ?? null,
  };
}

export interface CountryPolitics {
  countryNameKo: string | null;
  governmentForm: string | null;
  congressComposition: string | null;
  mainPeople: string | null;
}

export async function getCountryPolitics(alpha2: string): Promise<CountryPolitics | null> {
  const json = await fetchJson(
    buildDataGoKrUrl("OverviewPoliticService/getOverviewPoliticList", alpha2)
  );
  const item = firstItem(json);
  if (!item) return null;
  return {
    countryNameKo: str(item.country_nm),
    governmentForm: str(item.government_form),
    congressComposition: str(item.congress_composition),
    mainPeople: str(item.main_people),
  };
}

export interface CountryEconomy {
  gdp: string | null;
  gdpDesc: string | null;
  gdpPerCapita: string | null;
  gdpPerCapitaDesc: string | null;
  gdpGrowthRate: string | null;
  majorIndustry: string | null;
  currencyUnit: string | null;
}

export async function getCountryEconomy(alpha2: string): Promise<CountryEconomy | null> {
  const json = await fetchJson(
    buildDataGoKrUrl("OverviewEconomicService/OverviewEconomicList", alpha2)
  );
  const item = firstItem(json);
  if (!item) return null;
  return {
    gdp: str(item.gdp),
    gdpDesc: str(item.gdp_desc),
    gdpPerCapita: str(item.gdp_per_capita),
    gdpPerCapitaDesc: str(item.gdp_per_capita_desc),
    gdpGrowthRate: str(item.gdp_growth_rate),
    majorIndustry: str(item.major_industry),
    currencyUnit: str(item.currency_unit),
  };
}

export interface CountryKoreaRelation {
  diplomaticRelations: string | null;
  missionStatus: string | null;
  investmentStatus: string | null;
  odaStatus: string | null;
  oksStatus: string | null;
}

export async function getCountryKoreaRelation(
  alpha2: string
): Promise<CountryKoreaRelation | null> {
  const json = await fetchJson(
    buildDataGoKrUrl("OverviewKorRelationService/getOverviewKorRelationList", alpha2)
  );
  const item = firstItem(json);
  if (!item) return null;
  return {
    diplomaticRelations: str(item.diplomatic_relations),
    missionStatus: str(item.mission_status),
    investmentStatus: str(item.investment_status),
    odaStatus: str(item.oda_status),
    oksStatus: str(item.oks_status),
  };
}

export interface CountrySituationItem {
  year: string | null;
  month: string | null;
  content: string | null;
}

export async function getCountrySituation(alpha2: string): Promise<CountrySituationItem[]> {
  const json = await fetchJson(
    buildDataGoKrUrl("OverviewSituationService/getOverviewSituationList", alpha2)
  );
  return allItems(json)
    .slice(0, 5)
    .map((item) => ({
      year: str(item.year),
      month: str(item.month),
      content: str(item.situation_info_cn),
    }))
    .filter((entry) => entry.content);
}
