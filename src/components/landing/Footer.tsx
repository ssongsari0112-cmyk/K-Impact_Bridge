import Link from "next/link";
import { Waypoints } from "lucide-react";

const FOOTER_LINKS = {
  제품: [
    { href: "/", label: "서비스 소개" },
    { href: "/map", label: "국가 지도" },
    { href: "/how-it-works", label: "작동 방식" },
    { href: "/features", label: "주요 기능" },
  ],
  시작하기: [
    { href: "/onboarding", label: "프로젝트 시작하기" },
    { href: "/profile/new", label: "기업 프로필 등록하기" },
    { href: "/login", label: "로그인" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-bridge text-white">
                <Waypoints size={14} strokeWidth={2.5} />
              </span>
              <span className="text-sm font-semibold text-harbor">K-Impact Bridge</span>
            </div>
            <p className="mt-3 text-sm text-ink-soft">
              한국의 기술과 세계의 문제를 잇는, K-Impact Bridge
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section}>
                <h3 className="text-sm font-medium text-ink-soft">{section}</h3>
                <ul className="mt-3 space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-ink hover:text-bridge">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1.5 border-t border-line pt-6 text-xs text-ink-soft">
          <p>© {new Date().getFullYear()} K-Impact Bridge. All rights reserved.</p>
          <p>2026 외교부 공공데이터·AI 활용 공모전 출품작</p>
          <p>
            이 서비스에 사용된 공공데이터의 출처는 References 및 각 출처 칩에서 확인할 수
            있습니다.
          </p>
          <p>
            문의:{" "}
            <a href="mailto:contact@kimpactbridge.example" className="hover:text-bridge">
              contact@kimpactbridge.example
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
