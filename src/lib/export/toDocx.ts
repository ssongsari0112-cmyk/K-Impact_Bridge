import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import type { Project } from "@/lib/types";
import { isProjectBrief } from "@/lib/types";

export async function renderProposalDocx(project: Project): Promise<Buffer> {
  const brief = isProjectBrief(project.proposalDraft) ? project.proposalDraft : null;

  const children: Paragraph[] = [
    new Paragraph({
      text: brief ? brief.projectTitle : `${project.title} · 사업기획서`,
      heading: HeadingLevel.TITLE,
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: brief
            ? `K-Impact Bridge · 사업기획서 초안 | 사업 목적: ${brief.objectiveLabel} | ${brief.generatedBy}`
            : "K-Impact Bridge · Project Brief",
          italics: true,
          color: "5B6B78",
        }),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  const heading = (text: string) =>
    children.push(new Paragraph({ text, heading: HeadingLevel.HEADING_1 }));
  const body = (text: string) => children.push(new Paragraph({ text }), new Paragraph({ text: "" }));
  const bullet = (text: string) => children.push(new Paragraph({ text, bullet: { level: 0 } }));

  if (brief) {
    if (brief.isDemo) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "※ 이 초안은 AI API 미연결 상태에서 프로젝트 데이터와 외교부 공공데이터를 규칙 기반 템플릿에 결합해 생성했습니다. 예산·성과 수치는 추정 전제값이므로 제출 전 검증이 필요합니다.",
              color: "8A6A1F",
              italics: true,
            }),
          ],
        }),
        new Paragraph({ text: "" })
      );
    }

    heading("1. 사업 요약");
    body(brief.summary);

    heading("2. 배경 및 필요성");
    body(brief.background);

    heading("3. 수혜 대상");
    body(brief.beneficiaries);

    heading("4. 사업 목표");
    brief.goals.forEach(bullet);
    children.push(new Paragraph({ text: "" }));

    let index = 5;
    for (const section of brief.sections) {
      heading(`${index}. ${section.title}`);
      body(section.content);
      index += 1;
    }

    heading(`${index}. 수행 주체별 역할 분담`);
    brief.roles.forEach((role) => bullet(`${role.actor} — ${role.role}`));
    children.push(new Paragraph({ text: "" }));
    index += 1;

    heading(`${index}. 추진 일정`);
    brief.phases.forEach((phase) => {
      bullet(`[${phase.period}] ${phase.title}: ${phase.activities.join(", ")}`);
    });
    children.push(new Paragraph({ text: "" }));
    index += 1;

    heading(`${index}. 성과지표 (KPI)`);
    brief.kpis.forEach((kpi) => {
      bullet(`${kpi.indicator} — 기준값: ${kpi.baseline} / 목표값: ${kpi.target}`);
    });
    children.push(new Paragraph({ text: "" }));
    index += 1;

    heading(`${index}. 예산 계획`);
    brief.budget.forEach((line) => bullet(`${line.item} — ${line.share}% (${line.note})`));
    body(brief.budgetNote);
    index += 1;

    heading(`${index}. 리스크 및 대응 방안`);
    brief.risks.forEach((risk) => bullet(`[${risk.level}] ${risk.risk} → ${risk.mitigation}`));
    children.push(new Paragraph({ text: "" }));
    index += 1;

    heading(`${index}. ODA 연계 전략`);
    body(brief.odaLinkage);
    index += 1;

    const facts = brief.countryFacts;
    heading(`${index}. 근거 데이터 · 외교부 국가정보 (${facts.countryName})`);
    bullet(`1인당 GDP: ${facts.gdpPerCapita ?? "확인 불가"}`);
    bullet(`경제성장률: ${facts.gdpGrowthRate ?? "확인 불가"}`);
    bullet(`주요 산업: ${facts.majorIndustry ?? "확인 불가"}`);
    bullet(`정부 형태: ${facts.governmentForm ?? "확인 불가"}`);
    bullet(`대한민국과의 수교: ${facts.diplomaticRelations ?? "확인 불가"}`);
    bullet(`재외공관: ${facts.missionStatus ?? "확인 불가"}`);
    bullet(`대한민국 누적 ODA 지원 실적: ${facts.odaStatus ?? "확인 불가"}`);
    bullet(`출처: ${facts.sourceUrl}`);
    children.push(new Paragraph({ text: "" }));
  } else {
    body(
      "아직 사업기획서 초안이 생성되지 않았습니다. 워크스페이스의 Project Brief 탭에서 먼저 생성해주세요."
    );
  }

  heading("References");
  project.citations.forEach((citation, i) => {
    children.push(
      new Paragraph({
        text: `[${i + 1}] ${citation.sourceName}, ${citation.title} — ${citation.url}${
          citation.isDemo ? " (Demo)" : ""
        }`,
      })
    );
  });

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBuffer(doc);
}
