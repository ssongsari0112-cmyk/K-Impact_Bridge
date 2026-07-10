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

export const ONBOARDING_GOALS = [
  { id: "new_opportunity", label: "우리 기술이 필요한 국가를 찾고 싶어요" },
  { id: "find_partner", label: "협력할 NGO를 찾고 싶어요" },
  { id: "oda_ready", label: "KOICA/ODA 사업을 준비하고 싶어요" },
  { id: "has_partner", label: "이미 협력할 파트너가 있어요" },
  { id: "idea", label: "사업 아이디어를 구체화하고 싶어요" },
] as const;
