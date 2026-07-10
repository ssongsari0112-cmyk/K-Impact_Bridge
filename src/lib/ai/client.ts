import profileMock from "./mocks/profile.aquasense.json";
import opportunityMock from "./mocks/opportunity.json";
import partnerMock from "./mocks/partner.json";
import strategyMock from "./mocks/strategy.json";
import proposalMock from "./mocks/proposal.json";

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

export async function runAgent(agent: string, input: unknown): Promise<AgentResult> {
  void input;

  if (isMock()) {
    // 실제 AI처럼 느껴지도록 1.5~3초 지연 (로딩 애니메이션 보여줄 시간)
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));
    return { data: MOCKS[agent], isDemo: true };
  }

  // ── 키 발급 후 이 아래만 채우면 됨 ──
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const res = await anthropic.messages.create({ ... prompts/[agent].ts ... });
  // return { data: parse(res), isDemo: false };
  throw new Error("실제 AI 연동은 prompts/ 작성 후 활성화");
}
