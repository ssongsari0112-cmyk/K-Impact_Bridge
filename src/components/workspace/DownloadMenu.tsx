"use client";

import { useState } from "react";
import { ChevronDown, Download, Loader2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

const FORMATS: { format: "pdf" | "docx" | "pptx"; label: string }[] = [
  { format: "pdf", label: "PDF (전략 리포트)" },
  { format: "docx", label: "DOCX (사업기획서)" },
  { format: "pptx", label: "PPTX (발표자료)" },
];

export function DownloadMenu({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  async function download(format: "pdf" | "docx" | "pptx") {
    setDownloading(format);
    setOpen(false);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project, format }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename="([^"]+)"/);
      a.download = match ? decodeURIComponent(match[1]) : `project.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(null);
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-input bg-bridge px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-harbor"
      >
        {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        다운로드
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-card border border-line bg-white shadow-kib-2">
          {FORMATS.map(({ format, label }) => (
            <button
              key={format}
              type="button"
              onClick={() => download(format)}
              className="block w-full px-4 py-2.5 text-left text-sm text-ink hover:bg-mist"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
