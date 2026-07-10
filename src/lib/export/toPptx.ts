import PptxGenJS from "pptxgenjs";
import type { Project } from "@/lib/types";

const HARBOR = "123A66";
const BRIDGE = "3794FF";
const INK_SOFT = "5B6B78";

function addTitleSlide(pres: PptxGenJS, project: Project) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.12, fill: { color: BRIDGE } });
  slide.addText(project.title, {
    x: 0.6,
    y: 2.3,
    w: 8.8,
    fontSize: 30,
    bold: true,
    color: HARBOR,
  });
  slide.addText("K-Impact Bridge · 전략 발표자료", {
    x: 0.6,
    y: 3.2,
    fontSize: 14,
    color: INK_SOFT,
  });
  return slide;
}

function addBodySlide(pres: PptxGenJS, title: string, bullets: string[]) {
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };
  slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.08, fill: { color: BRIDGE } });
  slide.addText(title, { x: 0.5, y: 0.4, fontSize: 22, bold: true, color: HARBOR });
  slide.addText(
    bullets.map((text) => ({ text, options: { bullet: true, breakLine: true } })),
    { x: 0.5, y: 1.3, w: 9, h: 4.5, fontSize: 14, color: "16242F", lineSpacingMultiple: 1.3 }
  );
  return slide;
}

export async function renderPitchPptx(project: Project): Promise<Buffer> {
  const pres = new PptxGenJS();
  const report = project.strategyReport;

  addTitleSlide(pres, project);

  addBodySlide(pres, "Problem", [
    report?.countryDetail ?? "선택된 국가 정보가 없습니다.",
  ]);

  addBodySlide(pres, "Why This Country", [
    project.selectedCountry
      ? `${project.selectedCountry.country} · Opportunity Score ${project.selectedCountry.opportunityScore}`
      : "선택된 국가가 없습니다.",
    ...(project.selectedCountry?.reasons ?? []),
  ]);

  addBodySlide(pres, "Technology", [report?.techAnalysis ?? "기술 분석 데이터가 없습니다."]);

  addBodySlide(pres, "Partner", [
    project.selectedPartner
      ? `${project.selectedPartner.name} · Match Score ${project.selectedPartner.matchScore}`
      : "선택된 파트너가 없습니다.",
    ...(project.selectedPartner?.synergy ?? []),
  ]);

  addBodySlide(
    pres,
    "Value Chain",
    (report?.valueChain ?? []).map((row) => `${row.actor}: ${row.role}`)
  );

  addBodySlide(
    pres,
    "Expected Impact",
    (report?.expectedImpact ?? []).map((row) => `${row.metric}: ${row.value}`)
  );

  addBodySlide(
    pres,
    "Risk & Mitigation",
    (report?.risks ?? []).map((row) => `[${row.level}] ${row.risk} → ${row.mitigation}`)
  );

  addBodySlide(
    pres,
    "Roadmap",
    (report?.roadmap ?? []).map((row) => `${row.month}: ${row.milestone}`)
  );

  const referencesSlide = addBodySlide(
    pres,
    "References",
    project.citations.map(
      (citation) => `${citation.sourceName}, ${citation.title}${citation.isDemo ? " (Demo)" : ""}`
    )
  );
  referencesSlide.addText("K-Impact Bridge · 외교 공공데이터·AI 기반 국제개발협력 Strategy Copilot", {
    x: 0.5,
    y: 6.9,
    fontSize: 9,
    color: INK_SOFT,
  });

  const output = await pres.write({ outputType: "nodebuffer" });
  return output as Buffer;
}
