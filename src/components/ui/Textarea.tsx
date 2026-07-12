import type { TextareaHTMLAttributes } from "react";

export function Textarea({
  label,
  hint,
  required,
  ...textareaProps
}: { label: string; hint?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex w-full flex-col gap-[7px] text-sm">
      <span className="font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-red">*</span>}
      </span>
      <textarea
        {...textareaProps}
        required={required}
        className="rounded-input border border-line bg-white px-3.5 py-3 text-[15px] text-ink outline-none transition-[border,box-shadow] placeholder:text-[#9AAAB6] focus:border-bridge focus:shadow-[0_0_0_3px_rgba(21,94,147,0.14)]"
      />
      {hint && <span className="text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}
