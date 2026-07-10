import { Check, X } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const ROWS = [
  { label: "역할", generic: "글쓰기 보조", kib: "국제개발협력 진출의 공동 전략가" },
  {
    label: "데이터",
    generic: "학습 시점의 일반 지식",
    kib: "외교부·KOICA 공공데이터 실시간 참조",
  },
  {
    label: "출처",
    generic: "환각 가능성",
    kib: "모든 사실에 공식 출처 링크 (출처 없으면 표시 안 함)",
  },
  {
    label: "결과물",
    generic: "텍스트 답변",
    kib: "국가 추천 → 파트너 → 리포트 → 제출용 기획서까지",
  },
  {
    label: "전문성",
    generic: "ODA 맥락 이해 부족",
    kib: "Multi-Agent가 국가·외교·리스크를 나눠 분석",
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow n={6}>WHY DIFFERENT</SectionEyebrow>
          <h2 className="mt-3 tracking-tight">
            <span className="block text-xl font-light text-ink-soft sm:text-2xl">
              복잡한 프롬프트 없이,
            </span>
            <span className="mt-1 block text-3xl font-extrabold text-harbor sm:text-4xl">
              처음부터 <span className="text-bridge">국제개발협력 전문가</span>처럼
            </span>
          </h2>
        </Reveal>

        {/* Desktop table */}
        <Reveal className="mt-14 hidden overflow-hidden rounded-card border border-line bg-white shadow-kib-1 md:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line bg-white text-left">
                <th className="w-32 px-6 py-4 font-semibold text-ink-soft">구분</th>
                <th className="px-6 py-4 font-semibold text-ink-soft">일반 생성형 AI</th>
                <th className="px-6 py-4 font-semibold text-bridge">K-Impact Bridge</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-line last:border-b-0">
                  <td className="px-6 py-4 font-semibold text-ink">{row.label}</td>
                  <td className="px-6 py-4 text-ink-soft">
                    <span className="flex items-start gap-2">
                      <X size={15} className="mt-0.5 shrink-0 text-red" />
                      {row.generic}
                    </span>
                  </td>
                  <td className="bg-bridge-soft/40 px-6 py-4 font-medium text-harbor">
                    <span className="flex items-start gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-green" />
                      {row.kib}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        {/* Mobile: two stacked cards */}
        <div className="mt-14 flex flex-col gap-4 md:hidden">
          <Reveal className="rounded-card border border-line bg-white p-6">
            <h3 className="font-semibold text-ink-soft">일반 생성형 AI</h3>
            <ul className="mt-3 space-y-2.5">
              {ROWS.map((row) => (
                <li key={row.label} className="flex items-start gap-2 text-sm text-ink-soft">
                  <X size={14} className="mt-0.5 shrink-0 text-red" />
                  <span>
                    <b className="font-semibold text-ink">{row.label}: </b>
                    {row.generic}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="rounded-card border border-bridge/30 bg-bridge-soft/40 p-6">
            <h3 className="font-semibold text-bridge">K-Impact Bridge</h3>
            <ul className="mt-3 space-y-2.5">
              {ROWS.map((row) => (
                <li key={row.label} className="flex items-start gap-2 text-sm text-ink">
                  <Check size={14} className="mt-0.5 shrink-0 text-green" />
                  <span>
                    <b className="font-semibold text-harbor">{row.label}: </b>
                    {row.kib}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
