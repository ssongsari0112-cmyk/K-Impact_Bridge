import { GoogleGenAI, Type } from "@google/genai";
import type { OrgProfile } from "@/lib/types";

// Google AI Studio(Gemini) 연동. GOOGLE_API_KEY 환경변수가 있을 때만 사용된다.
// gemini-2.0-flash 등 특정 버전은 이 키의 무료 티어에서 quota가 0으로 막혀 있어서
// (2026-07 기준 확인) 별칭 모델(gemini-flash-latest)을 사용한다.
const MODEL = "gemini-flash-latest";

function getClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY가 설정되지 않았습니다.");
  return new GoogleGenAI({ apiKey });
}

const PROFILE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    oneLiner: { type: Type.STRING },
    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
    sdgs: { type: Type.ARRAY, items: { type: Type.STRING } },
    useCases: { type: Type.ARRAY, items: { type: Type.STRING } },
    regionsOfInterest: { type: Type.ARRAY, items: { type: Type.STRING } },
    confidence: { type: Type.NUMBER },
  },
  required: [
    "name",
    "oneLiner",
    "technologies",
    "sdgs",
    "useCases",
    "regionsOfInterest",
    "confidence",
  ],
};

const SYSTEM_INSTRUCTION = `당신은 국제개발협력(ODA) 전문 애널리스트입니다. 기업 또는 NGO의 소개 자료를
분석해서 아래 스키마에 맞는 조직 프로필을 한국어로 추출하세요.

- name: 조직명
- oneLiner: 한 줄 소개 (50자 내외)
- technologies: 핵심 기술·제품·서비스 (3~6개)
- sdgs: 실제로 연관된 UN SDG만 "SDG 6" 형식으로, 최대 4개
- useCases: 국제개발협력 현장에서 활용 가능한 시나리오 (2~4개)
- regionsOfInterest: 언급된 관심 지역·국가 (없으면 빈 배열)
- confidence: 이 분석의 신뢰도 (0~1). 자료가 빈약할수록 낮게 잡는다.

반드시 제공된 자료에 실제로 나타난 내용만 근거로 작성하고, 확인되지 않은 사실을 지어내지 마세요.`;

function parseProfileResponse(text: string, fallbackName: string): OrgProfile {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("AI 응답을 JSON으로 파싱하지 못했습니다.");
  }

  const obj = json as Record<string, unknown>;
  const asStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];

  return {
    name: typeof obj.name === "string" && obj.name.trim() ? obj.name.trim() : fallbackName,
    oneLiner: typeof obj.oneLiner === "string" ? obj.oneLiner.trim() : "",
    technologies: asStringArray(obj.technologies),
    sdgs: asStringArray(obj.sdgs),
    useCases: asStringArray(obj.useCases),
    regionsOfInterest: asStringArray(obj.regionsOfInterest),
    confidence:
      typeof obj.confidence === "number" ? Math.min(1, Math.max(0, obj.confidence)) : 0.7,
  };
}

// 직접 입력 폼의 텍스트를 Gemini로 분석해 더 정제된 프로필(특히 SDG 추론)을 만든다.
export async function analyzeProfileText(rawInput: Record<string, unknown>): Promise<OrgProfile> {
  const ai = getClient();
  const inputSummary = Object.entries(rawInput)
    .filter(([, value]) => typeof value === "string" && value.trim() !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      { role: "user", parts: [{ text: `${SYSTEM_INSTRUCTION}\n\n[입력 자료]\n${inputSummary}` }] },
    ],
    config: { responseMimeType: "application/json", responseSchema: PROFILE_RESPONSE_SCHEMA },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini 응답이 비어있습니다.");
  return parseProfileResponse(text, String(rawInput.name ?? "분석된 조직"));
}

// PDF 회사소개서를 Gemini에 직접 첨부해 분석한다 (Gemini의 문서 이해 기능 사용).
export async function analyzeProfileFile(
  base64Data: string,
  mimeType: string,
  fileName: string
): Promise<OrgProfile> {
  const ai = getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: [
      {
        role: "user",
        parts: [{ text: SYSTEM_INSTRUCTION }, { inlineData: { mimeType, data: base64Data } }],
      },
    ],
    config: { responseMimeType: "application/json", responseSchema: PROFILE_RESPONSE_SCHEMA },
  });

  const text = response.text;
  if (!text) throw new Error("Gemini 응답이 비어있습니다.");
  return parseProfileResponse(text, fileName.replace(/\.[^.]+$/, ""));
}
