export const WORKSPACE_TABS = [
  { slug: "overview", label: "Overview" },
  { slug: "country", label: "Country" },
  { slug: "partner", label: "Partner" },
  { slug: "value-chain", label: "Value Chain" },
  { slug: "risk", label: "Risk" },
  { slug: "impact", label: "Expected Impact" },
  { slug: "roadmap", label: "Roadmap" },
  { slug: "proposal", label: "Proposal" },
  { slug: "references", label: "References" },
  { slug: "chat", label: "AI Chat" },
] as const;

export type WorkspaceTabSlug = (typeof WORKSPACE_TABS)[number]["slug"];

export const ONBOARDING_STEPS = ["조직", "목표", "프로필", "국가·파트너", "AI 리포트"] as const;

export interface OrgTypeOption {
  value: "company" | "ngo";
  title: string;
  en: string;
  description: string;
}

export const ONBOARDING_ORG_TYPES: OrgTypeOption[] = [
  {
    value: "company",
    title: "기업",
    en: "Company",
    description:
      "기술, 제품 또는 서비스를 통해 글로벌 시장과 국제개발협력 사업에 진출하고 싶습니다.",
  },
  {
    value: "ngo",
    title: "NGO / 비영리기관",
    en: "NGO · NPO",
    description:
      "국제개발협력 사업을 수행하며 함께할 기업과 기술 파트너를 찾고 있습니다.",
  },
];

export interface OnboardingGoal {
  id: string;
  label: string;
  description: string;
}

export const COMPANY_GOALS: OnboardingGoal[] = [
  {
    id: "find-country",
    label: "우리 기술이 필요한 국가를 찾고 싶어요",
    description: "기업의 기술과 서비스가 필요한 국가를 추천받습니다.",
  },
  {
    id: "find-ngo",
    label: "함께 협력할 NGO를 찾고 싶어요",
    description: "사업 분야와 국가 경험이 적합한 NGO를 찾습니다.",
  },
  {
    id: "find-oda-opportunity",
    label: "KOICA·ODA 사업 기회를 찾고 싶어요",
    description:
      "기업의 기술 및 사업 분야와 관련성이 높은 국제개발협력 사업 기회를 확인합니다.",
  },
  {
    id: "find-technology-market",
    label: "우리 기술의 글로벌 활용처를 찾고 싶어요",
    description: "보유 기술이 국제개발 현장에서 활용될 수 있는 국가와 분야를 탐색합니다.",
  },
  {
    id: "develop-project-idea",
    label: "사업 아이디어를 구체화하고 싶어요",
    description: "기업의 기술을 활용한 국제개발협력 사업 아이디어를 설계합니다.",
  },
  {
    id: "receive-ai-strategy",
    label: "AI 맞춤 전략을 추천받고 싶어요",
    description: "국가, 사업 분야, 협력 파트너를 종합한 맞춤형 진출 전략을 추천받습니다.",
  },
];

export const NGO_GOALS: OnboardingGoal[] = [
  {
    id: "find-company",
    label: "함께 사업할 기업을 찾고 싶어요",
    description: "사업에 필요한 기술, 제품 또는 서비스를 보유한 기업을 찾습니다.",
  },
  {
    id: "find-country",
    label: "사업에 적합한 국가를 찾고 싶어요",
    description: "기관의 전문 분야와 국가별 개발 수요를 바탕으로 적합한 국가를 추천받습니다.",
  },
  {
    id: "find-oda-opportunity",
    label: "KOICA·ODA 사업 기회를 찾고 싶어요",
    description: "기관의 전문 분야 및 사업 경험과 연관된 국제개발협력 사업 기회를 확인합니다.",
  },
  {
    id: "find-technology",
    label: "필요한 기술을 가진 기업을 추천받고 싶어요",
    description: "현장 문제를 해결할 수 있는 기술과 서비스를 보유한 기업을 탐색합니다.",
  },
  {
    id: "develop-project",
    label: "새로운 사업 아이디어를 만들고 싶어요",
    description: "현장 수요와 기업의 기술을 결합한 신규 국제개발협력 사업을 설계합니다.",
  },
  {
    id: "receive-ai-project-design",
    label: "AI 프로젝트 설계를 받고 싶어요",
    description: "국가, 대상자, 현장 수요, 협력 파트너를 반영한 프로젝트 초안을 생성합니다.",
  },
];

export const GOAL_SECTION_COPY: Record<"company" | "ngo", { title: string; subtitle: string }> = {
  company: {
    title: "어떤 목표를 가지고 계신가요?",
    subtitle: "현재 기업에 필요한 목표를 모두 선택해주세요. 복수 선택이 가능합니다.",
  },
  ngo: {
    title: "어떤 도움이 필요하신가요?",
    subtitle: "현재 기관에 필요한 지원을 모두 선택해주세요. 복수 선택이 가능합니다.",
  },
};

export const ONBOARDING_STORAGE_KEY = "k-impact-bridge-onboarding";
