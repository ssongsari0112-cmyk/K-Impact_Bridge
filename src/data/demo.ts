import type { CountryOpportunity, Organization, PartnerMatch, Project } from "@/types";

export const DEMO_ORGANIZATION: Organization = {
  id: "org_001",
  type: "company",
  name: "AquaSense AI",
  description: "AI 기반 수질 모니터링 스타트업",
  technologies: ["AI", "IoT", "Water Monitoring"],
  sdgs: ["SDG 6", "SDG 9", "SDG 11"],
  targetRegions: ["Southeast Asia"],
  createdAt: "2026-06-01",
};

export const DEMO_PROJECTS: Project[] = [
  {
    id: "project_001",
    organizationId: "org_001",
    title: "Cambodia AI Water Monitoring Project",
    mode: "new_opportunity",
    status: "draft",
    selectedCountry: "Cambodia",
    selectedPartner: "Demo Water Impact NGO",
  },
];

export const DEMO_COUNTRY_OPPORTUNITIES: CountryOpportunity[] = [
  {
    country: "Cambodia",
    opportunityScore: 88,
    reasons: [
      "SDG6 연계 가능성",
      "KOICA 기존 물/보건 사업과 연계 가능",
      "한국과의 개발협력 기반 존재",
    ],
    evidence: [
      {
        id: "cite_001",
        projectId: "project_001",
        sourceName: "KOICA Open Data",
        title: "ODA Project Dataset",
        url: "https://data.koica.go.kr",
        usedIn: ["country_analysis"],
      },
    ],
  },
];

export const DEMO_PARTNER_MATCHES: PartnerMatch[] = [
  {
    name: "Demo Water Impact NGO",
    matchScore: 91,
    matchReasons: [
      "캄보디아 식수 개선 사업 경험",
      "SDG6 활동 이력",
      "현지 커뮤니티 네트워크 보유",
    ],
    risk: "기술 기반 사업 수행 경험은 제한적",
    recommendation: "기업이 기술 교육 프로그램을 함께 제공하는 조건으로 협력 가능",
  },
];
