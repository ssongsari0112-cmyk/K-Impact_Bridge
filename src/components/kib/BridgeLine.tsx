"use client";

import { Fragment, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface BridgeNode {
  title: string;
  subtitle: string;
}

export function BridgeLine({
  nodes,
  loading = false,
  className,
}: {
  nodes: BridgeNode[];
  loading?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("rounded-card bg-mist px-7 py-9", className)}>
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-0 sm:flex-row">
        {nodes.map((node, index) => (
          <Fragment key={node.title}>
            <div
              className={cn(
                "shrink-0 rounded-xl border border-line bg-white px-4.5 py-3.5 text-center shadow-kib-1 transition-shadow",
                loading && "animate-pulse"
              )}
            >
              <b className="block text-sm text-harbor">{node.title}</b>
              <span className="text-xs text-ink-soft">{node.subtitle}</span>
            </div>
            {index < nodes.length - 1 && (
              <div className="relative my-3 h-8 w-0.5 shrink-0 bg-bridge sm:my-0 sm:mx-2 sm:h-0.5 sm:w-auto sm:flex-1">
                <span
                  className={cn(
                    "absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-harbor sm:bottom-auto sm:left-auto sm:right-0 sm:top-1/2 sm:-translate-x-0 sm:-translate-y-1/2",
                    loading && "[animation:glow-pulse_1.4s_ease-in-out_infinite]"
                  )}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

const LOADING_MESSAGES = [
  "데이터 수집 중…",
  "기술 추출 중…",
  "SDG 매핑 중…",
  "출처 검증 중…",
  "결과 정리 중…",
];

export function BridgeLineLoading({
  nodes,
  className,
}: {
  nodes: BridgeNode[];
  className?: string;
}) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((index) => (index + 1) % LOADING_MESSAGES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      <BridgeLine nodes={nodes} loading className={className} />
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-bridge" />
        <span className="font-mono text-xs">{LOADING_MESSAGES[messageIndex]}</span>
      </div>
    </div>
  );
}
