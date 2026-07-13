import { NextResponse } from "next/server";
import { buildBrief, rewriteSection, type BriefRequest } from "@/lib/ai/brief";
import { BUSINESS_OBJECTIVES, DEFAULT_BUSINESS_OBJECTIVE } from "@/lib/constants";
import type { BusinessObjectiveId, Project } from "@/lib/types";

interface ProposalRequestBody {
  project?: Project;
  objectiveId?: string;
  note?: string;
  sectionIndex?: number; // 지정하면 해당 서술형 섹션만 다시 생성한다
}

function toObjectiveId(value: unknown): BusinessObjectiveId {
  const match = BUSINESS_OBJECTIVES.find((objective) => objective.id === value);
  return match?.id ?? DEFAULT_BUSINESS_OBJECTIVE;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ProposalRequestBody;

  if (!body.project) {
    return NextResponse.json({ error: "project가 필요합니다." }, { status: 400 });
  }

  const briefRequest: BriefRequest = {
    project: body.project,
    objectiveId: toObjectiveId(body.objectiveId),
    note: body.note,
  };

  try {
    if (typeof body.sectionIndex === "number") {
      const section = await rewriteSection(briefRequest, body.sectionIndex);
      return NextResponse.json({ data: section });
    }

    const brief = await buildBrief(briefRequest);
    return NextResponse.json({ data: brief, isDemo: brief.isDemo });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "사업기획서 생성 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
