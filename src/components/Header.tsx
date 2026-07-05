"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Waypoints, X } from "lucide-react";

const NAV_LINKS = [
  { href: "#intro", label: "서비스 소개" },
  { href: "#map", label: "국가 지도" },
  { href: "#pipeline", label: "작동 방식" },
  { href: "#features", label: "주요 기능" },
  { href: "#cta", label: "시작하기" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Waypoints size={16} strokeWidth={2.5} />
          </span>
          <span className="text-base font-semibold tracking-tight text-slate-900">
            K-Impact Bridge
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-slate-500 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            로그인
          </Link>
          <Link
            href="/onboarding"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-transform hover:scale-[1.03] hover:bg-blue-700"
          >
            무료로 시작하기
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-slate-200 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-slate-500">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-center text-sm font-medium text-slate-900"
            >
              로그인
            </Link>
            <Link
              href="/onboarding"
              onClick={() => setIsMenuOpen(false)}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
            >
              무료로 시작하기
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
