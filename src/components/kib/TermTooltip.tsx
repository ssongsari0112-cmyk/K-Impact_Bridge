"use client";

import { useState } from "react";
import glossary from "@/lib/data/glossary.json";

export function TermTooltip({ term }: { term: keyof typeof glossary | string }) {
  const [open, setOpen] = useState(false);
  const definition = (glossary as Record<string, string>)[term];

  if (!definition) return <>{term}</>;

  return (
    <span
      className="relative inline-block cursor-help border-b border-dotted border-ink-soft"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((value) => !value)}
    >
      {term}
      {open && (
        <span className="absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[240px] -translate-x-1/2 rounded-input bg-harbor px-3 py-2 text-xs font-normal text-white shadow-kib-2">
          {definition}
        </span>
      )}
    </span>
  );
}
