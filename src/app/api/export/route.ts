import { NextResponse } from "next/server";
import { renderStrategyPdf } from "@/lib/export/toPdf";
import { renderProposalDocx } from "@/lib/export/toDocx";
import { renderPitchPptx } from "@/lib/export/toPptx";
import type { Project } from "@/lib/types";

export const runtime = "nodejs";

const CONTENT_TYPE: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

const SUFFIX: Record<string, string> = {
  pdf: "전략리포트.pdf",
  docx: "사업기획서.docx",
  pptx: "발표자료.pptx",
};

export async function POST(request: Request) {
  const body = (await request.json()) as { project: Project; format: "pdf" | "docx" | "pptx" };
  const { project, format } = body;

  if (!project || !CONTENT_TYPE[format]) {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  let buffer: Buffer;
  if (format === "pdf") {
    buffer = await renderStrategyPdf(project);
  } else if (format === "docx") {
    buffer = await renderProposalDocx(project);
  } else {
    buffer = await renderPitchPptx(project);
  }

  const filename = `${project.title}_${SUFFIX[format]}`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": CONTENT_TYPE[format],
      "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    },
  });
}
