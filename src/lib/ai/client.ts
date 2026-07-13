import profileMock from "./mocks/profile.aquasense.json";
import partnerMock from "./mocks/partner.json";
import strategyMock from "./mocks/strategy.json";
import type { OrgProfile } from "@/lib/types";
import { rankCountries } from "@/lib/scoring/countryScoring";
import { analyzeProfileFile, analyzeProfileText } from "@/lib/ai/gemini";

// proposal 에이전트는 mock을 쓰지 않는다 — 프로젝트 실데이터 + 외교부 공공데이터를
// 종합해 lib/ai/brief.ts가 직접 기획서를 만든다.
const MOCKS: Record<string, unknown> = {
  profile: profileMock,
  partner: partnerMock,
  strategy: strategyMock,
};

// GOOGLE_API_KEY가 있으면 profile 분석에 실제 Gemini를 쓴다. (opportunity는 항상
// 외교부 공공데이터로 실시간 계산되므로 이 플래그와 무관하다 — countryScoring.ts 참고)
const canUseGoogleAI = () =>
  Boolean(process.env.GOOGLE_API_KEY) && process.env.NEXT_PUBLIC_FORCE_MOCK !== "true";

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
function isManualProfileInput(input: unknown): input is Record<string, unknown> {
  return (
    typeof input === "object" &&
    input !== null &&
    !("fileBase64" in input) &&
    ("name" in input || "summary" in input || "technologies" in input)
  );
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

// 파일 업로드 경로: 클라이언트가 base64로 인코딩한 파일 내용을 함께 보낸다.
function isFileUploadInput(
  input: unknown
): input is { fileName: string; mimeType: string; fileBase64: string } {
  if (typeof input !== "object" || input === null) return false;
  const record = input as Record<string, unknown>;
  return typeof record.fileBase64 === "string" && typeof record.mimeType === "string";
}

// discover 화면은 확정된 OrgProfile을 그대로 body로 보낸다 (기술/SDG 배열 존재로 판별).
function isOrgProfileInput(input: unknown): input is OrgProfile {
  return (
    typeof input === "object" &&
    input !== null &&
    Array.isArray((input as Partial<OrgProfile>).technologies) &&
    Array.isArray((input as Partial<OrgProfile>).sdgs)
  );
}

export async function runAgent(agent: string, input: unknown): Promise<AgentResult> {
  if (agent === "opportunity" && isOrgProfileInput(input)) {
    // 외교부 공공데이터포털에서 실시간으로 받아온 경제현황·대한민국과의 관계 데이터로
    // 국가 선정 기준 문서의 100점 배점표를 계산한다.
    return { data: await rankCountries(input), isDemo: false };
  }

  if (agent === "profile" && canUseGoogleAI()) {
    try {
      if (isFileUploadInput(input) && input.mimeType === "application/pdf") {
        // Gemini는 PDF를 직접 첨부해 문서 이해가 가능하다. PPT/DOCX는 아래 mock으로 폴백.
        const profile = await analyzeProfileFile(input.fileBase64, input.mimeType, input.fileName);
        return { data: profile, isDemo: false };
      }
      if (isManualProfileInput(input)) {
        const profile = await analyzeProfileText(input);
        return { data: profile, isDemo: false };
      }
    } catch (error) {
      console.error("[runAgent] Gemini 분석 실패, mock으로 대체합니다:", error);
      // 아래 mock 경로로 자연스럽게 폴백
    }
  }

  // ── mock 경로: 키 없음 / 강제 mock / PDF 외 파일 형식 / 실제 호출 실패 시 ──
  await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));

  if (agent === "profile" && isManualProfileInput(input)) {
    // 직접 입력한 값은 그대로 프로필로 사용한다 (Demo 데이터 아님).
    return { data: buildProfileFromManualInput(input), isDemo: false };
  }

  return { data: MOCKS[agent], isDemo: true };
}
