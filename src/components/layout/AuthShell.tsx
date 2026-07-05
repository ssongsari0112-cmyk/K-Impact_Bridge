import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-1px)] flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="text-sm font-semibold">
          K-Impact Bridge
        </Link>
        <h1 className="mt-6 text-2xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-foreground/60">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-sm text-foreground/60">{footer}</div>
      </div>
    </div>
  );
}
