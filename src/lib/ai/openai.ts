import OpenAI from "openai";
import {
  buildBriefPrompt,
  buildSectionRewritePrompt,
  type AiBriefPayload,
  type AiBriefSection,
} from "@/lib/ai/briefPrompt";

// OpenAI 연동. OPENAI_API_KEY 환경변수가 있을 때만 사용된다.
// 모델은 OPENAI_MODEL로 바꿀 수 있다 (Structured Outputs를 지원하는 모델이어야 한다).
const DEFAULT_MODEL = "gpt-4.1-mini";

const MODEL = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;

export const OPENAI_MODEL_LABEL = `OpenAI · ${MODEL}`;

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
  return new OpenAI({ apiKey });
}

// Structured Outputs(strict)는 모든 object에 additionalProperties:false와
// 전체 필드의 required 명시를 요구한다.
function object(properties: Record<string, unknown>) {
  return {
    type: "object",
    properties,
    required: Object.keys(properties),
    additionalProperties: false,
  };
}

const stringArray = { type: "array", items: { type: "string" } };

const BRIEF_JSON_SCHEMA = object({
  projectTitle: { type: "string" },
  summary: { type: "string" },
  background: { type: "string" },
  beneficiaries: { type: "string" },
  goals: stringArray,
  sections: {
    type: "array",
    items: object({ title: { type: "string" }, content: { type: "string" } }),
  },
  roles: {
    type: "array",
    items: object({ actor: { type: "string" }, role: { type: "string" } }),
  },
  phases: {
    type: "array",
    items: object({
      period: { type: "string" },
      title: { type: "string" },
      activities: stringArray,
    }),
  },
  kpis: {
    type: "array",
    items: object({
      indicator: { type: "string" },
      baseline: { type: "string" },
      target: { type: "string" },
    }),
  },
  budget: {
    type: "array",
    items: object({
      item: { type: "string" },
      share: { type: "number" },
      note: { type: "string" },
    }),
  },
  budgetNote: { type: "string" },
  risks: {
    type: "array",
    items: object({
      risk: { type: "string" },
      mitigation: { type: "string" },
      level: { type: "string", enum: ["high", "mid", "low"] },
    }),
  },
  odaLinkage: { type: "string" },
});

const SECTION_JSON_SCHEMA = object({
  title: { type: "string" },
  content: { type: "string" },
});

async function completeJson<T>(prompt: string, schemaName: string, schema: unknown): Promise<T> {
  const client = getClient();

  const response = await client.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: {
      type: "json_schema",
      json_schema: { name: schemaName, strict: true, schema: schema as Record<string, unknown> },
    },
  });

  const choice = response.choices[0];

  // strict 스키마를 못 맞추면 모델이 refusal을 돌려준다 (content는 비어 있다).
  if (choice?.message.refusal) {
    throw new Error(`OpenAI가 응답을 거부했습니다: ${choice.message.refusal}`);
  }

  const text = choice?.message.content;
  if (!text) throw new Error("OpenAI 응답이 비어있습니다.");

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("OpenAI 응답을 JSON으로 파싱하지 못했습니다.");
  }
}

export async function generateProjectBrief(contextText: string): Promise<AiBriefPayload> {
  return completeJson<AiBriefPayload>(
    buildBriefPrompt(contextText),
    "project_brief",
    BRIEF_JSON_SCHEMA
  );
}

export async function rewriteBriefSection(
  contextText: string,
  section: AiBriefSection
): Promise<AiBriefSection> {
  const result = await completeJson<Partial<AiBriefSection>>(
    buildSectionRewritePrompt(contextText, section),
    "brief_section",
    SECTION_JSON_SCHEMA
  );

  if (!result.content) throw new Error("OpenAI 섹션 응답이 비어있습니다.");
  return { title: result.title || section.title, content: result.content };
}
