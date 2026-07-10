"use client";

import { useState } from "react";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { cn } from "@/lib/utils";
import type { Project, StrategyReport } from "@/lib/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "assistant",
    content:
      '이 프로젝트에 대해 궁금한 점을 물어보세요. 예: "리스크 부분 더 보수적으로 바꿔줘"',
  },
];

type TabTarget = "risk" | "roadmap" | "impact" | "valueChain";

const KEYWORD_MAP: { keywords: string[]; target: TabTarget; label: string }[] = [
  { keywords: ["리스크", "위험", "risk"], target: "risk", label: "리스크" },
  { keywords: ["로드맵", "일정", "roadmap"], target: "roadmap", label: "로드맵" },
  { keywords: ["기대효과", "impact", "효과"], target: "impact", label: "기대효과" },
  { keywords: ["밸류체인", "value chain", "역할"], target: "valueChain", label: "Value Chain" },
];

function applyEdit(report: StrategyReport, target: TabTarget): StrategyReport {
  switch (target) {
    case "risk":
      return {
        ...report,
        risks: report.risks.map((row) => ({
          ...row,
          mitigation: `${row.mitigation} (요청에 따라 더 보수적으로 조정됨)`,
        })),
      };
    case "roadmap":
      return {
        ...report,
        roadmap: report.roadmap.map((row) => ({
          ...row,
          milestone: `${row.milestone} (요청에 따라 일정 여유를 반영함)`,
        })),
      };
    case "impact":
      return {
        ...report,
        expectedImpact: report.expectedImpact.map((row) => ({
          ...row,
          value: `${row.value} · 재검토 반영`,
        })),
      };
    case "valueChain":
      return {
        ...report,
        valueChain: report.valueChain.map((row) => ({
          ...row,
          role: `${row.role} (요청에 따라 역할 범위를 명확화함)`,
        })),
      };
  }
}

export function ChatTab({ project }: { project: Project }) {
  const updateProject = useProjectStore((state) => state.updateProject);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    const match = KEYWORD_MAP.find((entry) =>
      entry.keywords.some((keyword) => text.toLowerCase().includes(keyword.toLowerCase()))
    );

    if (!match) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "죄송해요, 어떤 항목을 수정할지 파악하지 못했어요. 예: 리스크, 로드맵, 기대효과, Value Chain 중 하나를 언급해주세요.",
        },
      ]);
      return;
    }

    if (!project.strategyReport) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "먼저 Overview 탭에서 전략 리포트를 생성한 뒤에 수정할 수 있어요.",
        },
      ]);
      return;
    }

    const updated = applyEdit(project.strategyReport, match.target);
    updateProject(project.id, { strategyReport: updated });
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `${match.label} 탭 내용을 반영했어요. 해당 탭에서 확인해보세요.` },
    ]);
  }

  return (
    <div className="flex h-[28rem] flex-col rounded-card border border-line bg-white shadow-kib-1">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm",
              message.role === "assistant" ? "bg-mist text-ink" : "ml-auto bg-bridge text-white"
            )}
          >
            {message.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-line p-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 rounded-chip border border-line bg-white px-4 py-2 text-sm text-ink outline-none transition-[border,box-shadow] placeholder:text-[#9AAAB6] focus:border-bridge focus:shadow-[0_0_0_3px_rgba(21,94,147,0.14)]"
        />
        <button
          type="submit"
          className="rounded-chip bg-bridge px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-harbor"
        >
          전송
        </button>
      </form>
    </div>
  );
}
