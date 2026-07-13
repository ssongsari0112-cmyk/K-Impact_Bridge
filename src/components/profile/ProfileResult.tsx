import { Sparkles, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { OrgProfile } from "@/lib/types";
import { countryFlag } from "@/lib/types";
import opportunityMock from "@/lib/ai/mocks/opportunity.json";

// 샘플 기업 프로필 대시보드(Image_sample.html)와 유사한 형태로 생성 결과를 보여준다.
// 실데이터가 있는 항목은 profile에서, 나머지(추천 국가·파트너·ODA 기회 등)는
// 데모용 mock 및 프로필 기반 파생값으로 구성한다.

const SDG_BG: Record<string, string> = {
  "SDG 1": "#E5243B",
  "SDG 2": "#DDA63A",
  "SDG 3": "#4C9F38",
  "SDG 4": "#C5192D",
  "SDG 5": "#FF3A21",
  "SDG 6": "#26BDE2",
  "SDG 7": "#FCC30B",
  "SDG 8": "#A21942",
  "SDG 9": "#FD6925",
  "SDG 10": "#DD1367",
  "SDG 11": "#FD9D24",
  "SDG 12": "#BF8B2E",
  "SDG 13": "#3F7E44",
  "SDG 14": "#0A97D9",
  "SDG 15": "#56C02B",
  "SDG 16": "#00689D",
  "SDG 17": "#19486A",
};

const CHALLENGE_STYLES = [
  "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5]",
  "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
  "bg-[#f0f9ff] text-[#0284c7] border-[#e0f2fe]",
];

const STATIC_PARTNERS = ["KOICA", "KF", "ODA Korea", "UNDP", "World Bank", "현지 협력기관"];

function clampPct(value: number): number {
  return Math.max(40, Math.min(99, Math.round(value)));
}

function buildOdaIdeas(profile: OrgProfile): { title: string; desc: string }[] {
  const tech = profile.technologies[0] ?? "핵심 기술";
  const useCase = profile.useCases[0] ?? "현지 개발 수요";
  return [
    {
      title: `${tech} 기반 인프라 구축 사업`,
      desc: `${tech}을(를) 활용한 현지 인프라 구축 및 운영 효율화 사업`,
    },
    {
      title: "데이터 기반 모니터링 플랫폼",
      desc: `${useCase} 개선을 위한 데이터 수집·분석 플랫폼 구축`,
    },
    {
      title: "현지 역량 강화 교육 프로그램",
      desc: "기술 활용 교육 및 현지 인력 역량 강화 프로그램 운영",
    },
    {
      title: "기후 대응형 시범사업",
      desc: "기후변화에 대응하는 지속가능 솔루션 시범 프로젝트",
    },
  ];
}

export function ProfileResult({ profile }: { profile: OrgProfile }) {
  const score = clampPct(profile.confidence * 100);
  const scoreTier =
    score >= 90 ? "매우 우수" : score >= 75 ? "우수" : score >= 60 ? "양호" : "보통";

  const indicators = [
    { label: "SDG 연계성", value: clampPct(score + 1) },
    { label: "국가 적합도", value: clampPct(score + 4) },
    { label: "기술 적합성", value: clampPct(score - 2) },
    { label: "사업 확장성", value: clampPct(score - 1) },
  ];

  const countries = opportunityMock.slice(0, 3);
  const odaIdeas = buildOdaIdeas(profile);
  const avatarInitial = profile.name.trim().charAt(0) || "?";
  const hashtags = [...profile.technologies.slice(0, 4), ...profile.sdgs.slice(0, 3)];

  return (
    <div className="w-full">
      {/* 상단 배너 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-bridge">
            <Check size={14} /> AI 분석 완료
          </span>
          <h2 className="mt-1 text-2xl font-bold text-harbor">프로필 생성 완료</h2>
          <p className="mt-1 text-sm text-ink-soft">
            AI가 분석한 강점과 국제개발협력 사업 적합성을 확인해보세요.
          </p>
        </div>
      </div>

      {/* 대시보드 그리드 */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        {/* 메인 컬럼 */}
        <div className="flex flex-col gap-5">
          {/* 프로필 헤더 */}
          <Card className="hover:border-line hover:shadow-kib-1">
            <div className="flex items-center gap-4 border-b border-line pb-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-harbor text-xl font-bold text-white">
                {avatarInitial}
              </div>
              <div>
                <h3 className="text-xl font-bold text-harbor">{profile.name}</h3>
                {profile.oneLiner && (
                  <p className="mt-1 text-sm text-ink-soft">{profile.oneLiner}</p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetaItem label="핵심 기술" value={`${profile.technologies.length}개`} />
              <MetaItem label="연계 SDG" value={`${profile.sdgs.length}개`} />
              <MetaItem
                label="관심 지역"
                value={profile.regionsOfInterest[0] ?? "미지정"}
              />
              <MetaItem label="AI 신뢰도" value={`${score}%`} />
            </div>

            <div className="mt-5 rounded-input border border-[#e8effe] bg-[#f8faff] p-4">
              <p className="flex items-center gap-1.5 text-sm font-bold text-bridge">
                <Sparkles size={14} /> AI 요약
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink">
                {profile.name}은(는) {profile.oneLiner || "국제개발협력 분야 진출을 준비하는 조직"}
                입니다. 보유 기술을 바탕으로 개발도상국 현장의 문제 해결과 지속가능한 협력 사업에
                높은 활용 가능성을 가지고 있습니다.
              </p>
            </div>
          </Card>

          {/* 핵심 기술 + 해결 가능한 문제 */}
          <Card className="grid grid-cols-1 gap-6 hover:border-line hover:shadow-kib-1 sm:grid-cols-2">
            <div>
              <p className="text-[15px] font-bold text-harbor">핵심 기술</p>
              <p className="text-xs text-ink-soft">Core Capabilities</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.technologies.length > 0 ? (
                  profile.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-chip border border-line bg-mist px-3 py-1.5 text-xs text-ink"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink-soft">입력된 기술이 없습니다.</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-[15px] font-bold text-harbor">해결 가능한 문제</p>
              <p className="text-xs text-ink-soft">Solvable Challenges</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.useCases.length > 0 ? (
                  profile.useCases.map((useCase, i) => (
                    <span
                      key={useCase}
                      className={`rounded-chip border px-3 py-1.5 text-xs ${
                        CHALLENGE_STYLES[i % CHALLENGE_STYLES.length]
                      }`}
                    >
                      {useCase}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ink-soft">입력된 항목이 없습니다.</span>
                )}
              </div>
            </div>
          </Card>

          {/* SDGs */}
          {profile.sdgs.length > 0 && (
            <Card className="hover:border-line hover:shadow-kib-1">
              <p className="text-[15px] font-bold text-harbor">연계 가능한 SDGs</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {profile.sdgs.map((sdg) => {
                  const num = sdg.replace(/[^0-9]/g, "");
                  return (
                    <div
                      key={sdg}
                      className="flex h-[70px] w-[70px] flex-col justify-between rounded-md p-1.5 text-white"
                      style={{ backgroundColor: SDG_BG[sdg] ?? "#5B6B78" }}
                    >
                      <span className="font-display text-lg font-bold">{num}</span>
                      <span className="text-[9px] font-semibold leading-tight">SDG {num}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* 추천 국가 */}
          <Card className="hover:border-line hover:shadow-kib-1">
            <p className="text-[15px] font-bold text-harbor">추천 국가</p>
            <p className="text-xs text-ink-soft">Recommended Countries</p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-line text-left text-ink-soft">
                    <th className="bg-mist px-2 py-2.5 font-medium">국가</th>
                    <th className="bg-mist px-2 py-2.5 font-medium">적합도</th>
                    <th className="bg-mist px-2 py-2.5 font-medium">적합 이유</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((c) => (
                    <tr key={c.countryCode} className="border-b border-line/60">
                      <td className="whitespace-nowrap px-2 py-3 font-medium text-ink">
                        {countryFlag(c.countryCode)} {c.country}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex items-center gap-2">
                          <strong className="text-bridge">{c.opportunityScore}%</strong>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
                            <div
                              className="h-full bg-bridge"
                              style={{ width: `${c.opportunityScore}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-ink-soft">{c.reasons[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ODA 기회 */}
          <Card className="hover:border-line hover:shadow-kib-1">
            <p className="text-[15px] font-bold text-bridge">제안 가능한 ODA 기회</p>
            <p className="text-xs text-ink-soft">Suggested ODA Opportunities</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {odaIdeas.map((idea, i) => (
                <div key={idea.title} className="rounded-input border border-line bg-mist p-4">
                  <p className="font-display text-base font-bold text-bridge">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-1.5 text-[13px] font-bold text-ink">{idea.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{idea.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 사이드바 컬럼 */}
        <div className="flex flex-col gap-5">
          {/* AI 매칭 종합 점수 */}
          <div className="rounded-card bg-gradient-to-br from-[#0f2b5c] to-harbor p-7 text-center text-white shadow-kib-2">
            <h3 className="text-sm font-normal opacity-90">AI 매칭 종합 점수</h3>
            <p className="mt-3 font-display text-5xl font-bold">
              {score}
              <span className="text-xl font-normal opacity-70">/100</span>
            </p>
            <span className="mt-3 inline-block rounded-full bg-bridge px-3 py-1 text-xs">
              {scoreTier}
            </span>
            <p className="mt-3 text-xs opacity-90">
              국제개발협력 사업에 높은 적합성을 보입니다.
            </p>
          </div>

          {/* 세부 평가 지표 */}
          <Card className="hover:border-line hover:shadow-kib-1">
            <p className="text-[15px] font-bold text-harbor">세부 평가 지표</p>
            <div className="mt-4 flex flex-col gap-4">
              {indicators.map((ind) => (
                <div key={ind.label}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="text-ink">{ind.label}</span>
                    <strong className="text-harbor">{ind.value}%</strong>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-bridge" style={{ width: `${ind.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* 추천 파트너 */}
          <Card className="hover:border-line hover:shadow-kib-1">
            <p className="text-[15px] font-bold text-harbor">추천 파트너</p>
            <p className="text-xs text-ink-soft">Potential Partners</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {STATIC_PARTNERS.map((partner) => (
                <div
                  key={partner}
                  className="flex h-14 items-center justify-center rounded-input border border-line bg-white text-center text-[12px] font-bold text-ink-soft"
                >
                  {partner}
                </div>
              ))}
            </div>
          </Card>

          {/* AI 한줄 피치 */}
          <div className="rounded-card border-l-4 border-bridge bg-mist p-5">
            <p className="text-[13px] font-bold text-bridge">AI 한줄 피치</p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">
              “{profile.name} — {profile.oneLiner || "국제개발협력 파트너를 찾는 조직"}”
            </p>
            {hashtags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-chip border border-line bg-white px-2.5 py-1 text-[11px] text-ink-soft"
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="mt-5 text-[11px] text-ink-soft">
        ℹ AI 분석은 입력된 정보를 기반으로 제공되며, 실제 사업 기획 및 추진 시 추가 검토가 필요합니다.
      </p>
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-input border border-line bg-mist p-3">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className="mt-1 truncate text-sm font-medium text-ink">{value}</p>
    </div>
  );
}
