import { ChevronDown } from "lucide-react";
import { SectionEyebrow } from "@/components/landing/SectionEyebrow";
import { Reveal } from "@/components/landing/Reveal";

const FAQS = [
  {
    q: "국제개발협력이 처음인데 쓸 수 있나요?",
    a: "네, 그런 분들을 위해 만들어졌습니다. 용어마다 설명이 붙고, 질문에 답하기만 하면 됩니다.",
  },
  {
    q: "회사소개서가 없으면요?",
    a: "직접 입력 폼으로 시작할 수 있습니다. 모든 칸에 예시가 있습니다.",
  },
  {
    q: "AI 추천을 어떻게 믿죠?",
    a: "모든 추천에 공식 출처 링크와 신뢰도 점수가 붙습니다. 출처가 없는 정보는 표시하지 않습니다.",
  },
  {
    q: "이미 파트너가 있는데요?",
    a: "매칭 단계를 건너뛰고 전략 설계부터 시작할 수 있습니다.",
  },
  {
    q: "업로드한 자료는 안전한가요?",
    a: "프로필 생성 목적으로만 사용되며 외부에 공유되지 않습니다.",
  },
  {
    q: "생성된 기획서를 그대로 제출해도 되나요?",
    a: "초안입니다. 워크스페이스에서 수정한 뒤 DOCX로 받아 다듬어 제출하세요.",
  },
];

export default function Faq() {
  return (
    <section className="bg-mist px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-harbor sm:text-4xl">
            자주 묻는 질문
          </h2>
        </Reveal>

        <Reveal className="mt-12 flex flex-col gap-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-card border border-line bg-white p-5 open:shadow-kib-1"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink">
                {item.q}
                <ChevronDown
                  size={18}
                  className="shrink-0 text-ink-soft transition-transform group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
