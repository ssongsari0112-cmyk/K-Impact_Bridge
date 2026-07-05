import Link from "next/link";
import { Waypoints } from "lucide-react";

const FOOTER_LINKS = {
  제품: [
    { href: "#intro", label: "서비스 소개" },
    { href: "#map", label: "국가 지도" },
    { href: "#pipeline", label: "작동 방식" },
    { href: "#features", label: "주요 기능" },
  ],
  시작하기: [
    { href: "/onboarding", label: "무료로 프로젝트 시작하기" },
    { href: "/profile-builder", label: "기업 프로필 등록하기" },
    { href: "/login", label: "로그인" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Waypoints size={14} strokeWidth={2.5} />
              </span>
              <span className="text-sm font-semibold text-slate-900">K-Impact Bridge</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              한국의 기술이 세계의 문제에 닿는 길을 만든다.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <h3 className="text-sm font-medium text-slate-400">{section}</h3>
                <ul className="mt-3 space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-slate-600 hover:text-slate-900">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} K-Impact Bridge. All rights reserved.</span>
          <span>외교 공공데이터·AI 기반 국제개발협력 Strategy Copilot</span>
        </div>
      </div>
    </footer>
  );
}
