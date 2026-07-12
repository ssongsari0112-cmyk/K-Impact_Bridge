import { FileText, FileType2, Presentation } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const DOCS = [
  { icon: FileText, label: "전략 리포트", ext: "PDF", rotate: "-rotate-6", offset: "sm:-mr-10" },
  { icon: FileType2, label: "사업기획서", ext: "DOCX", rotate: "rotate-0", offset: "sm:z-10" },
  { icon: Presentation, label: "발표자료", ext: "PPTX", rotate: "rotate-6", offset: "sm:-ml-10" },
];

export default function OutputPreview() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <SectionEyebrow>OUTPUT</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            손에 남는 것: 세 개의 문서
          </h2>
        </Reveal>

        <Reveal className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          {DOCS.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.label}
                className={`w-48 shrink-0 rounded-card border border-line bg-white p-6 text-left shadow-kib-2 transition-transform hover:-translate-y-1 hover:rotate-0 ${doc.rotate} ${doc.offset}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bridge-soft text-bridge">
                  <Icon size={18} />
                </div>
                <p className="mt-4 font-semibold text-harbor">{doc.label}</p>
                <p className="mt-1 font-mono text-xs text-ink-soft">{doc.ext}</p>
                <div className="mt-6 space-y-1.5">
                  <div className="h-1.5 w-full rounded-full bg-mist" />
                  <div className="h-1.5 w-4/5 rounded-full bg-mist" />
                  <div className="h-1.5 w-3/5 rounded-full bg-mist" />
                </div>
              </div>
            );
          })}
        </Reveal>

        <Reveal className="mt-10 text-sm text-ink-soft">
          모든 문서 마지막 장에는 References가 자동으로 붙습니다
        </Reveal>
      </div>
    </section>
  );
}
