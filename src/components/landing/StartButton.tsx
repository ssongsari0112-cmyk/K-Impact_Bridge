"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { LinkButton } from "@/components/ui/Button";

type Variant = "primary" | "secondary" | "ghost" | "amber";
type Size = "sm" | "md" | "lg";

export function StartButton({
  children,
  variant,
  size,
  className,
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const isAuthenticated = useProjectStore((state) => state.isAuthenticated);
  const href = isAuthenticated ? "/onboarding" : "/signup";

  return (
    <LinkButton href={href} variant={variant} size={size} className={className} {...props}>
      {children}
    </LinkButton>
  );
}
