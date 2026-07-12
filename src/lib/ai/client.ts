import profileMock from "./mocks/profile.aquasense.json";
import opportunityMock from "./mocks/opportunity.json";
import partnerMock from "./mocks/partner.json";
import strategyMock from "./mocks/strategy.json";
import proposalMock from "./mocks/proposal.json";
import type { OrgProfile } from "@/lib/types";

const MOCKS: Record<string, unknown> = {
  profile: profileMock,
  opportunity: opportunityMock,
  partner: partnerMock,
  strategy: strategyMock,
  proposal: proposalMock,
};

const isMock = () =>
  !process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_FORCE_MOCK === "true";

export interface AgentResult<T = unknown> {
  data: T;
  isDemo: boolean;
}

function splitList(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

// 직접 입력 폼(파일 업로드가 아닌 수동 입력)에서 온 요청인지 판별한다.
// 파일 업로드 경로는 { fileName } 형태로만 보내므로 그걸로 구분한다.
function isManualProfileInput(input: unknown): input is Record<string, unknown> {
  return typeof input === "object" && input !== null && !("fileName" in input);
}

function buildProfileFromManualInput(input: Record<string, unknown>): OrgProfile {
  return {
    name: asText(input.name) || "이름 미입력 조직",
    oneLiner: asText(input.summary),
    technologies: splitList(input.technologies),
    sdgs: [],
    useCases: [asText(input.problem), asText(input.collaborationFields)].filter(Boolean),
    regionsOfInterest: splitList(input.targetCountries),
    confidence: 0.75,
  };
}

export async function runAgent(agent: string, input: unknown): Promise<AgentResult> {
  if (isMock()) {
    // 실제 AI처럼 느껴지도록 1.5~3초 지연 (로딩 애니메이션 보여줄 시간)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

    if (agent === "profile" && isManualProfileInput(input)) {
      // 직접 입력한 값은 그대로 프로필로 사용한다 (Demo 데이터 아님).
      return { data: buildProfileFromManualInput(input), isDemo: false };
    }

    return { data: MOCKS[agent], isDemo: true };
  }

  // ── 키 발급 후 이 아래만 채우면 됨 ──
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const res = await anthropic.messages.create({ ... prompts/[agent].ts ... });
  // return { data: parse(res), isDemo: false };
  throw new Error("실제 AI 연동은 prompts/ 작성 후 활성화");
}
