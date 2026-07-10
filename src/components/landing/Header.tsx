"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Waypoints, X } from "lucide-react";
import { StartButton } from "@/components/landing/StartButton";

const NAV_LINKS = [
  { href: "/", label: "서비스 소개" },
  { href: "/map", label: "국가 지도" },
  { href: "/how-it-works", label: "작동 방식" },
  { href: "/features", label: "주요 기능" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-bridge text-white">
            <Waypoints size={16} strokeWidth={2.5} />
          </span>
          <span className="text-base font-semibold tracking-tight text-harbor">
            K-Impact Bridge
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-ink-soft hover:text-ink">
            로그인
          </Link>
          <StartButton size="sm" className="hover:scale-[1.03] shadow-kib-1">
            시작하기
          </StartButton>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-mist md:hidden"
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-line px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-ink-soft">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-input border border-line px-5 py-2.5 text-center text-sm font-medium text-ink"
            >
              로그인
            </Link>
            <StartButton onClick={() => setIsMenuOpen(false)} className="justify-center">
              시작하기
            </StartButton>
          </div>
        </div>
      )}
    </header>
  );
}
