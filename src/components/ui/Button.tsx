import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "amber";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-bridge text-white hover:bg-harbor",
  secondary: "bg-white text-bridge border border-line hover:bg-bridge-soft hover:border-bridge",
  ghost: "bg-transparent text-ink-soft hover:bg-mist hover:text-ink",
  amber: "bg-amber text-[#3D2A08] hover:brightness-[0.96]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-[13.5px] px-3.5 py-1.5 rounded-input",
  md: "text-[15px] px-5 py-2.5 rounded-input",
  lg: "text-[16px] px-6 py-3.5 rounded-xl",
};

const BASE =
  "inline-flex items-center gap-2 font-semibold transition-all duration-150 border border-transparent focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-bridge/35 disabled:pointer-events-none disabled:opacity-40";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(BASE, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
