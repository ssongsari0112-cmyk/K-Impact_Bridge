import type { InputHTMLAttributes } from "react";

export function Field({
  label,
  hint,
  ...inputProps
}: { label: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex max-w-[520px] flex-col gap-[7px] text-sm">
      <span className="font-semibold text-ink">{label}</span>
      <input
        {...inputProps}
        className="rounded-input border border-line bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-[border,box-shadow] placeholder:text-[#9AAAB6] focus:border-bridge focus:shadow-[0_0_0_3px_rgba(21,94,147,0.14)]"
      />
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
