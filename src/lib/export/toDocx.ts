import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import type { Project } from "@/lib/types";

export async function renderProposalDocx(project: Project): Promise<Buffer> {
  const draft = project.proposalDraft;

  const children: Paragraph[] = [
    new Paragraph({
      text: `${project.title} · 사업기획서`,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "K-Impact Bridge · Proposal Draft", italics: true, color: "5B6B78" }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  if (draft) {
    for (const section of draft.sections) {
      children.push(
        new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: section.content }),
        new Paragraph({ text: "" })
      );
    }
  } else {
    children.push(
      new Paragraph({
        text: "아직 사업기획서 초안이 생성되지 않았습니다. 워크스페이스의 Proposal 탭에서 먼저 생성해주세요.",
      })
    );
  }

  children.push(new Paragraph({ text: "References", heading: HeadingLevel.HEADING_1 }));
  project.citations.forEach((citation, index) => {
    children.push(
      new Paragraph({
        text: `[${index + 1}] ${citation.sourceName}, ${citation.title} — ${citation.url}${
          citation.isDemo ? " (Demo)" : ""
        }`,
      })
    );
  });

  const doc = new Document({
    sections: [{ children }],
  });

  return Packer.toBuffer(doc);
}
