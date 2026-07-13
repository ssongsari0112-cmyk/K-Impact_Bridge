import type { Citation, PartnerLead } from "@/lib/types";

// 국가 선정 기준 문서(2-2~2-5)의 국가 고유 항목을 담은 참고 데이터.
// "기술·역량과 국가 수요의 적합성"(35점)만 사용자 프로필에 따라 동적으로 계산하고,
// 나머지 4개 항목(문제 심각성/ODA 연계/파트너 기반/한국 협력 연계성, 합 65점)은
// 국가 자체의 성질이라 고정값으로 둔다. 실제 서비스 전환 시 이 파일을 공공데이터
// 연동 결과로 대체하면 된다.

export interface CountryKnowledge {
  country: string;
  countryCode: string;
  needHeadline: string; // "이 국가가 지금 필요로 하는 것" — 구체적 문제 문장
  problemReason: string; // 추천 이유 1 (짧은 문장)
  helpContext: string; // "귀사의 {기술}을(를) 활용하여 {helpContext}" 완성용
  sectors: string[]; // 주요 수요 분야 태그 2~4개
  sdgs: string[]; // 이 국가의 개발 수요와 연결된 SDG (최대 3개 노출)
  keywords: string[]; // 기술 매칭용 키워드 (소문자 비교)
  businessIdea: string; // 추천 사업 아이디어 1개
  partners: PartnerLead[];
  odaLinkageReason: string; // 추천 이유 3 (사업/협력 가능성)
  citations: Citation[];
  fixedScores: {
    needSeverity: number; // 0~25
    odaLinkage: number; // 0~20
    partnerBase: number; // 0~10
    koreaTie: number; // 0~10
  };
}

export const COUNTRY_KNOWLEDGE_BASE: CountryKnowledge[] = [
  {
    country: "캄보디아",
    countryCode: "KH",
    needHeadline: "농촌 지역의 안전한 식수 공급과 실시간 수질 관리체계 구축이 필요합니다.",
    problemReason: "농촌 지역 식수 안전성 개선 수요가 매우 높음",
    helpContext: "농촌 식수원의 수질 상태를 실시간으로 확인하고 이상 징후를 조기에 감지",
    sectors: ["물·위생", "농촌개발", "디지털 인프라"],
    sdgs: ["SDG 6", "SDG 9", "SDG 11"],
    keywords: ["수질", "water quality", "정수", "clean water", "위생", "sanitation"],
    businessIdea: "농촌 지역 AI 수질 모니터링 시범사업",
    partners: [
      { name: "KOICA", isConfirmedOrg: true },
      { name: "현지 수자원 담당 정부기관", isConfirmedOrg: false },
      { name: "물·위생 분야 NGO", isConfirmedOrg: false },
    ],
    odaLinkageReason: "관련 KOICA 물·보건 사업과 현지 수행기관이 존재해 시범사업 연계 가능",
    citations: [
      {
        id: "cite_kh_1",
        sourceName: "KOICA Open Data",
        title: "ODA Project Dataset · Cambodia Water & Sanitation",
        url: "https://data.koica.go.kr",
        isDemo: false,
        usedIn: ["country"],
      },
      {
        id: "cite_kh_2",
        sourceName: "ODA Korea",
        title: "대한민국 ODA 통합 정보포털 · 캄보디아 협력 현황",
        url: "https://www.odakorea.go.kr",
        isDemo: false,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 23, odaLinkage: 17, partnerBase: 8, koreaTie: 8 },
  },
  {
    country: "베트남",
    countryCode: "VN",
    needHeadline: "지역 보건소의 의료 인력 부족과 원격진료 기반 확충이 필요합니다.",
    problemReason: "디지털 헬스케어·에듀테크 수요가 확대되는 중",
    helpContext: "원격진료 및 의료·학습 데이터 관리 시스템을 구축해 인력 부족 문제를 완화",
    sectors: ["보건의료", "디지털교육"],
    sdgs: ["SDG 3", "SDG 4", "SDG 9"],
    keywords: ["헬스케어", "healthcare", "원격진료", "telemedicine", "에듀테크", "edtech"],
    businessIdea: "지역 보건소 원격진료 지원사업",
    partners: [
      { name: "KOICA", isConfirmedOrg: true },
      { name: "현지 보건부 산하 기관", isConfirmedOrg: false },
      { name: "디지털헬스 스타트업 협회", isConfirmedOrg: false },
    ],
    odaLinkageReason: "한국 기업 진출 사례가 다수이고 관련 정책 수요가 확인됨",
    citations: [
      {
        id: "cite_vn_1",
        sourceName: "KOICA Open Data",
        title: "ODA Project Dataset · Vietnam Digital Health",
        url: "https://data.koica.go.kr",
        isDemo: false,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 20, odaLinkage: 16, partnerBase: 7, koreaTie: 8 },
  },
  {
    country: "케냐",
    countryCode: "KE",
    needHeadline: "농업 생산성 향상을 위한 스마트 관개와 작물 모니터링 기술이 필요합니다.",
    problemReason: "스마트농업·관개 기술 수요가 빠르게 증가",
    helpContext: "스마트 관개 시스템과 작물 모니터링 기술로 농업 생산성을 향상",
    sectors: ["스마트농업", "재생에너지"],
    sdgs: ["SDG 2", "SDG 7", "SDG 9"],
    keywords: [
      "스마트팜",
      "smart farm",
      "농업",
      "agriculture",
      "관개",
      "irrigation",
      "작물",
      "crop",
    ],
    businessIdea: "IoT 기반 스마트 관개 시스템 구축",
    partners: [
      { name: "현지 농업부 산하 기관", isConfirmedOrg: false },
      { name: "동아프리카 농업기술 NGO", isConfirmedOrg: false },
      { name: "지역 농과대학 연구기관", isConfirmedOrg: false },
    ],
    odaLinkageReason: "동아프리카 농업 기술 협력 거점으로 성장 중이며 현지 네트워크 연계 가능",
    citations: [
      {
        id: "cite_ke_1",
        sourceName: "MOFA Insight",
        title: "외교부 아프리카 협력 브리핑 · 2025",
        url: "https://www.mofa.go.kr",
        isDemo: true,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 19, odaLinkage: 13, partnerBase: 6, koreaTie: 5 },
  },
  {
    country: "르완다",
    countryCode: "RW",
    needHeadline: "제한된 의료 인력으로 인한 질병 조기진단 역량 부족 문제 해결이 필요합니다.",
    problemReason: "헬스케어 AI 진단 기술 수요 확인",
    helpContext: "AI 기반 질병 조기진단 도구로 제한된 의료 인력의 진단 역량을 보완",
    sectors: ["보건의료", "디지털전환"],
    sdgs: ["SDG 3", "SDG 9"],
    keywords: ["질병 진단", "disease diagnosis", "조기진단", "early diagnosis", "의료 인력"],
    businessIdea: "AI 기반 질병 조기진단 지원사업",
    partners: [
      { name: "르완다 보건부", isConfirmedOrg: false },
      { name: "국제기구 현지 사무소", isConfirmedOrg: false },
    ],
    odaLinkageReason: "정부 주도 디지털 전환 정책과 정합성이 높아 시범사업 추진이 용이",
    citations: [
      {
        id: "cite_rw_1",
        sourceName: "MOFA Insight",
        title: "외교부 아프리카 협력 브리핑 · 2025",
        url: "https://www.mofa.go.kr",
        isDemo: true,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 17, odaLinkage: 12, partnerBase: 5, koreaTie: 5 },
  },
  {
    country: "탄자니아",
    countryCode: "TZ",
    needHeadline: "농촌 지역의 안정적인 수자원 확보와 관개 인프라 확충이 필요합니다.",
    problemReason: "동아프리카 농업·수자원 인프라 협력이 초기 단계",
    helpContext: "수자원 관리 및 관개 기술을 접목해 농촌 지역 물 접근성을 개선",
    sectors: ["물·위생", "스마트농업"],
    sdgs: ["SDG 6", "SDG 2"],
    keywords: ["수자원", "water resource", "관개", "irrigation", "위생", "sanitation"],
    businessIdea: "농촌 소규모 관개·정수 통합 시범사업",
    partners: [
      { name: "현지 수자원부", isConfirmedOrg: false },
      { name: "동아프리카 수자원 협력 NGO", isConfirmedOrg: false },
    ],
    odaLinkageReason: "KOICA 신규 사업 발굴 지역으로 언급되어 초기 협력 여지가 있음",
    citations: [
      {
        id: "cite_tz_1",
        sourceName: "Demo NGO DB",
        title: "동아프리카 수자원 협력 기초 조사 (샘플)",
        url: "https://data.koica.go.kr",
        isDemo: true,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 16, odaLinkage: 9, partnerBase: 4, koreaTie: 3 },
  },
  {
    country: "우간다",
    countryCode: "UG",
    needHeadline: "모자보건 취약 지역의 의료 접근성 개선이 필요합니다.",
    problemReason: "여성·아동 대상 보건의료 접근성 부족",
    helpContext: "모바일·원격 기반 의료 서비스로 취약 지역의 의료 접근성을 개선",
    sectors: ["보건의료", "여성·아동보호"],
    sdgs: ["SDG 3", "SDG 5"],
    keywords: ["보건", "health", "의료", "medical", "여성", "women", "아동", "child"],
    businessIdea: "모자보건 모바일 헬스케어 시범사업",
    partners: [
      { name: "현지 보건부", isConfirmedOrg: false },
      { name: "여성·아동보건 전문 NGO", isConfirmedOrg: false },
    ],
    odaLinkageReason: "모자보건 분야 국제기구 사업이 활발해 연계 가능성이 있음",
    citations: [
      {
        id: "cite_ug_1",
        sourceName: "MOFA Insight",
        title: "외교부 아프리카 협력 브리핑 · 2025",
        url: "https://www.mofa.go.kr",
        isDemo: true,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 18, odaLinkage: 10, partnerBase: 5, koreaTie: 4 },
  },
  {
    country: "몽골",
    countryCode: "MN",
    needHeadline: "전력 공급이 어려운 유목 지역을 위한 소규모 재생에너지 시스템이 필요합니다.",
    problemReason: "재생에너지 접근성 및 기후 대응 수요 확인",
    helpContext: "소규모 태양광·재생에너지 시스템으로 전력 접근성을 개선",
    sectors: ["재생에너지", "기후대응"],
    sdgs: ["SDG 7", "SDG 13"],
    keywords: [
      "태양광",
      "solar power",
      "재생에너지",
      "renewable energy",
      "기후변화",
      "climate change",
    ],
    businessIdea: "유목 지역 소규모 태양광 발전 시범사업",
    partners: [
      { name: "KF", isConfirmedOrg: true },
      { name: "현지 에너지부 산하 기관", isConfirmedOrg: false },
    ],
    odaLinkageReason: "한·몽 개발협력 관계가 활발해 기존 사업과의 연계가 용이",
    citations: [
      {
        id: "cite_mn_1",
        sourceName: "KF 통계센터",
        title: "한·몽골 협력 통계 브리핑",
        url: "https://www.kf.or.kr",
        isDemo: true,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 17, odaLinkage: 11, partnerBase: 5, koreaTie: 7 },
  },
  {
    country: "필리핀",
    countryCode: "PH",
    needHeadline: "태풍·홍수 등 반복되는 자연재해에 대응할 조기경보체계 구축이 필요합니다.",
    problemReason: "반복되는 자연재해로 조기경보·방재 인프라 수요가 높음",
    helpContext: "재해 조기경보 및 디지털 모니터링 시스템으로 방재 대응력을 강화",
    sectors: ["재난안전", "디지털인프라"],
    sdgs: ["SDG 9", "SDG 11"],
    keywords: ["재난", "disaster", "방재", "재해", "조기경보", "early warning"],
    businessIdea: "태풍·홍수 조기경보 모니터링 시범사업",
    partners: [
      { name: "현지 재난관리청", isConfirmedOrg: false },
      { name: "국제기구 현지 사무소", isConfirmedOrg: false },
    ],
    odaLinkageReason: "재난안전 분야 기존 ODA 사업과 정부 정책 우선순위가 모두 확인됨",
    citations: [
      {
        id: "cite_ph_1",
        sourceName: "KOICA Open Data",
        title: "ODA Project Dataset · Philippines Disaster Risk Reduction",
        url: "https://data.koica.go.kr",
        isDemo: false,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 19, odaLinkage: 14, partnerBase: 6, koreaTie: 6 },
  },
  {
    country: "네팔",
    countryCode: "NP",
    needHeadline: "학교 간 교육 격차를 줄이기 위한 디지털 교육 인프라와 재해 대응 역량 강화가 필요합니다.",
    problemReason: "산간 지역 교육 접근성과 재해 대응 역량 부족",
    helpContext: "디지털 학습 플랫폼과 재해 대응 교육 콘텐츠로 교육 격차를 완화",
    sectors: ["교육접근성", "재난안전"],
    sdgs: ["SDG 4", "SDG 11"],
    keywords: [
      "교육",
      "education",
      "학습",
      "learning",
      "디지털 학습",
      "digital learning",
      "지진",
      "earthquake",
    ],
    businessIdea: "산간 학교 디지털 학습환경 구축사업",
    partners: [
      { name: "현지 교육부", isConfirmedOrg: false },
      { name: "교육 분야 국제 NGO", isConfirmedOrg: false },
    ],
    odaLinkageReason: "교육·재난 분야 국제기구 사업이 진행 중이며 후속 사업 여지가 있음",
    citations: [
      {
        id: "cite_np_1",
        sourceName: "외교부 LOD",
        title: "Country Information · Nepal",
        url: "https://opendata.mofa.go.kr",
        isDemo: false,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 16, odaLinkage: 10, partnerBase: 4, koreaTie: 4 },
  },
  {
    country: "인도네시아",
    countryCode: "ID",
    needHeadline: "해양 플라스틱 오염과 연안 어업 자원 관리를 위한 모니터링 체계가 필요합니다.",
    problemReason: "해양환경 오염 및 연안 자원 관리 수요 확인",
    helpContext: "데이터 기반 해양 모니터링 기술로 연안 자원 관리 체계를 지원",
    sectors: ["해양환경", "디지털인프라"],
    sdgs: ["SDG 14", "SDG 9"],
    keywords: ["해양", "ocean", "해양환경", "marine pollution", "연안", "coastal"],
    businessIdea: "연안 해양환경 데이터 모니터링 시범사업",
    partners: [
      { name: "현지 해양수산부 산하 기관", isConfirmedOrg: false },
      { name: "해양환경 전문 NGO", isConfirmedOrg: false },
    ],
    odaLinkageReason: "해양환경 분야 정책 우선순위가 확인되나 관련 사업 이력은 제한적",
    citations: [
      {
        id: "cite_id_1",
        sourceName: "MOFA Insight",
        title: "외교부 동남아 협력 브리핑 · 2025",
        url: "https://www.mofa.go.kr",
        isDemo: true,
        usedIn: ["country"],
      },
    ],
    fixedScores: { needSeverity: 15, odaLinkage: 9, partnerBase: 4, koreaTie: 5 },
  },
];
