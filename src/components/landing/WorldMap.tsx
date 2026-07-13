"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldTopology from "world-atlas/countries-110m.json";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import koLocale from "i18n-iso-countries/langs/ko.json";
import { ExternalLink, Minus, Plus, RotateCcw } from "lucide-react";
import { ScoreCard } from "@/components/kib/ScoreCard";

countries.registerLocale(enLocale);
countries.registerLocale(koLocale);

interface DemoMatch {
  name: string;
  score: number;
  technologies: string[];
  companyCount: number;
  companies: string[];
  partner: string;
}

// numeric ISO 3166-1 코드(react-simple-maps geo.id) 기준. K-Impact Bridge 자체 매칭 데모 데이터.
const DEMO_MATCHES: Record<string, DemoMatch> = {
  "116": {
    name: "캄보디아",
    score: 88,
    technologies: ["AI 수질 모니터링", "IoT 수질 센서"],
    companyCount: 2,
    companies: ["AquaSense AI", "Demo Clean Water Tech"],
    partner: "Demo Water Impact NGO",
  },
  "704": {
    name: "베트남",
    score: 76,
    technologies: ["에듀테크 플랫폼", "디지털 헬스케어"],
    companyCount: 3,
    companies: ["Demo EduLeap", "Demo CareLink", "Demo SkillBridge"],
    partner: "Demo EduTech Alliance",
  },
  "404": {
    name: "케냐",
    score: 71,
    technologies: ["스마트팜 IoT", "태양광 관개 시스템"],
    companyCount: 2,
    companies: ["Demo AgriSense", "Demo SolarGrow"],
    partner: "Demo AgroImpact NGO",
  },
  "646": {
    name: "르완다",
    score: 65,
    technologies: ["헬스케어 AI 진단"],
    companyCount: 1,
    companies: ["Demo MediScan AI"],
    partner: "Demo HealthBridge NGO",
  },
};

interface CountryApiResponse {
  countryCode: string;
  sourceUrl: string;
  basic: {
    nameKo: string | null;
    nameEn: string | null;
    timezone: string | null;
    callingCode: string | null;
    currency: string | null;
    flagImageUrl: string | null;
  } | null;
  politics: {
    countryNameKo: string | null;
    governmentForm: string | null;
    congressComposition: string | null;
    mainPeople: string | null;
  } | null;
  economy: {
    gdp: string | null;
    gdpDesc: string | null;
    gdpPerCapita: string | null;
    gdpPerCapitaDesc: string | null;
    gdpGrowthRate: string | null;
    majorIndustry: string | null;
    currencyUnit: string | null;
  } | null;
  koreaRelation: {
    diplomaticRelations: string | null;
    missionStatus: string | null;
    investmentStatus: string | null;
    odaStatus: string | null;
    oksStatus: string | null;
  } | null;
  situation: { year: string | null; month: string | null; content: string | null }[];
}

const DEFAULT_SELECTED_NUMERIC = "116"; // 캄보디아
const DEFAULT_ROTATION: [number, number, number] = [-105, -15, 0];
const DRAG_CLICK_THRESHOLD = 4; // px — 이 값 이상 움직이면 드래그로 간주해 클릭 취소

const DEFAULT_SCALE = 220;
const MIN_SCALE = 160;
const MAX_SCALE = 1000;
const ZOOM_STEP_FACTOR = 1.3;

// 작은 나라·섬나라는 지구본에서 정확히 클릭하기 어려워서, 이름으로 바로 찾을 수 있는 선택 목록을 만든다.
const COUNTRY_OPTIONS = (worldTopology.objects.countries.geometries as { id: string }[])
  .map((geo) => {
    const alpha2 = countries.numericToAlpha2(geo.id);
    if (!alpha2) return null;
    const nameKo = countries.getName(alpha2, "ko") ?? countries.getName(alpha2, "en") ?? alpha2;
    return { numericId: geo.id, nameKo };
  })
  .filter((entry): entry is { numericId: string; nameKo: string } => entry !== null)
  .sort((a, b) => a.nameKo.localeCompare(b.nameKo, "ko"));

function formatNumber(value: string | null): string | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n.toLocaleString("ko-KR") : value;
}

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-line pt-4 first:border-t-0 first:pt-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-bridge">{title}</p>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="text-sm">
      <span className="font-medium text-ink-soft">{label}: </span>
      <span className="whitespace-pre-line text-ink">{value}</span>
    </div>
  );
}

export default function WorldMap() {
  const [selectedNumeric, setSelectedNumeric] = useState<string>(DEFAULT_SELECTED_NUMERIC);
  const [rotation, setRotation] = useState<[number, number, number]>(DEFAULT_ROTATION);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [isDragging, setIsDragging] = useState(false);
  const [countryData, setCountryData] = useState<CountryApiResponse | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const demoMatch = DEMO_MATCHES[selectedNumeric];
  const cache = useRef<Map<string, CountryApiResponse>>(new Map());
  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const dragDistance = useRef(0);

  useEffect(() => {
    // selectCountry()가 ISO 코드 없는 지역은 이미 걸러내므로 여기서는 항상 유효한 값이다.
    const alpha2 = countries.numericToAlpha2(selectedNumeric);
    if (!alpha2) return;

    const cached = cache.current.get(alpha2);
    if (cached) {
      setCountryData(cached);
      setLoadError(false);
      return;
    }

    let cancelled = false;
    setIsLoadingInfo(true);
    setLoadError(false);

    fetch(`/api/country/${alpha2}`)
      .then((res) => {
        if (!res.ok) throw new Error(`request failed: ${res.status}`);
        return res.json() as Promise<CountryApiResponse>;
      })
      .then((data) => {
        if (cancelled) return;
        cache.current.set(alpha2, data);
        setCountryData(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingInfo(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedNumeric]);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    // 포인터를 여기서 바로 캡처하지 않는다 — 캡처를 걸면 바로 아래 SVG의 클릭 이벤트가
    // 가려져서 국가 클릭이 씹힐 수 있다. 실제로 드래그가 시작될 때(handlePointerMove)만
    // 캡처해서, 단순 클릭은 항상 자연스럽게 국가(Geography)의 onClick으로 전달되게 한다.
    lastPointer.current = { x: event.clientX, y: event.clientY };
    dragDistance.current = 0;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!lastPointer.current) return;
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    dragDistance.current += Math.abs(dx) + Math.abs(dy);
    lastPointer.current = { x: event.clientX, y: event.clientY };

    if (!isDragging && dragDistance.current > DRAG_CLICK_THRESHOLD) {
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
    }

    setRotation(([lambda, phi, gamma]) => [
      lambda + dx * 0.4,
      Math.max(-80, Math.min(80, phi - dy * 0.4)),
      gamma,
    ]);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    lastPointer.current = null;
    setIsDragging(false);
  }

  function zoomBy(factor: number) {
    setScale((prev) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor)));
  }

  function handleWheel(event: ReactWheelEvent<HTMLDivElement>) {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? ZOOM_STEP_FACTOR : 1 / ZOOM_STEP_FACTOR);
  }

  function resetView() {
    setScale(DEFAULT_SCALE);
    setRotation(DEFAULT_ROTATION);
  }

  function selectCountry(numericId: string) {
    if (dragDistance.current > DRAG_CLICK_THRESHOLD) return;
    if (!countries.numericToAlpha2(numericId)) return; // ISO 코드가 없는 지역은 무시
    setSelectedNumeric(numericId);
  }

  const displayName =
    countryData?.basic?.nameKo ?? demoMatch?.name ?? countryData?.basic?.nameEn ?? "국가 정보";

  return (
    <div>
      <label className="mb-3 block text-sm">
        <span className="mr-2 font-medium text-ink-soft">국가 검색</span>
        <select
          value={selectedNumeric}
          onChange={(event) => setSelectedNumeric(event.target.value)}
          className="rounded-input border border-line bg-white px-3 py-1.5 text-sm text-ink"
        >
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option.numericId} value={option.numericId}>
              {option.nameKo}
            </option>
          ))}
        </select>
        <span className="ml-2 text-xs text-ink-soft">
          작은 나라는 지구본에서 클릭하기 어려우니 검색을 이용하세요
        </span>
      </label>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div
        className={`relative aspect-square w-full touch-none select-none overflow-hidden rounded-[2rem] border border-line bg-mist ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <div className="absolute right-4 top-4 z-10 flex flex-col overflow-hidden rounded-input border border-line bg-white shadow-kib-1">
          <button
            type="button"
            onClick={() => zoomBy(ZOOM_STEP_FACTOR)}
            aria-label="확대"
            className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:bg-mist hover:text-bridge"
          >
            <Plus size={16} />
          </button>
          <div className="h-px bg-line" />
          <button
            type="button"
            onClick={() => zoomBy(1 / ZOOM_STEP_FACTOR)}
            aria-label="축소"
            className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:bg-mist hover:text-bridge"
          >
            <Minus size={16} />
          </button>
          <div className="h-px bg-line" />
          <button
            type="button"
            onClick={resetView}
            aria-label="원래 보기로"
            className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:bg-mist hover:text-bridge"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale, rotate: rotation }}
          className="h-full w-full"
        >
          <Geographies geography={worldTopology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const id = geo.id as string;
                const match = DEMO_MATCHES[id];
                const isSelected = id === selectedNumeric;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => selectCountry(id)}
                    style={{
                      default: {
                        fill: isSelected ? "#3794FF" : match ? "#9FC8FF" : "#E1E8EE",
                        stroke: "#ffffff",
                        strokeWidth: 0.4,
                        outline: "none",
                        cursor: "pointer",
                        transition: "fill 150ms ease",
                      },
                      hover: {
                        fill: "#3794FF",
                        stroke: "#ffffff",
                        strokeWidth: 0.4,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#123A66",
                        stroke: "#ffffff",
                        strokeWidth: 0.4,
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-chip bg-white/80 px-3 py-1 text-xs text-ink-soft backdrop-blur-sm">
          드래그로 회전 · 스크롤/버튼으로 확대해서 국가를 클릭해보세요
        </p>
      </div>

      <div className="max-h-[36rem] overflow-y-auto rounded-card border border-line bg-white p-6 shadow-kib-1">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {countryData?.basic?.flagImageUrl && (
              <img
                src={countryData.basic.flagImageUrl}
                alt=""
                className="h-5 w-7 rounded-sm object-cover"
              />
            )}
            <h3 className="text-lg font-semibold text-harbor">{displayName}</h3>
          </div>
          {demoMatch && <ScoreCard score={demoMatch.score} className="min-w-0 border-0 p-0" />}
        </div>

        {demoMatch && (
          <div className="mt-4 rounded-input bg-bridge-soft/50 p-3.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-bridge">
              K-Impact Bridge 매칭 결과
            </p>
            <p className="mt-2 text-xs font-medium text-ink-soft">
              매칭 기술 {demoMatch.technologies.length}개
            </p>
            <ul className="mt-1 space-y-1">
              {demoMatch.technologies.map((tech) => (
                <li key={tech} className="text-sm text-ink">
                  · {tech}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-medium text-ink-soft">
              매칭 기업 {demoMatch.companyCount}개
            </p>
            <ul className="mt-1 space-y-1">
              {demoMatch.companies.map((company) => (
                <li key={company} className="text-sm text-ink">
                  · {company}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs font-medium text-ink-soft">추천 파트너</p>
            <p className="mt-1 text-sm font-semibold text-harbor">{demoMatch.partner}</p>
          </div>
        )}

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            외교부 국가정보
          </p>

          {isLoadingInfo && (
            <div className="mt-3 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-3.5 animate-pulse rounded bg-mist" />
              ))}
            </div>
          )}

          {!isLoadingInfo && loadError && (
            <p className="mt-3 text-sm text-ink-soft">
              국가 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </p>
          )}

          {!isLoadingInfo && !loadError && countryData && (
            <div className="mt-3 space-y-4">
              <InfoSection title="기본정보">
                <InfoRow label="영문명" value={countryData.basic?.nameEn ?? null} />
                <InfoRow label="통화" value={countryData.basic?.currency ?? null} />
                <InfoRow label="시간대" value={countryData.basic?.timezone ?? null} />
                <InfoRow label="국가전화번호" value={countryData.basic?.callingCode ?? null} />
                {!countryData.basic && <p className="text-sm text-ink-soft">정보 없음</p>}
              </InfoSection>

              <InfoSection title="정치현황">
                <InfoRow label="정부형태" value={countryData.politics?.governmentForm ?? null} />
                <InfoRow
                  label="의회구성"
                  value={countryData.politics?.congressComposition ?? null}
                />
                <InfoRow label="주요인사" value={countryData.politics?.mainPeople ?? null} />
                {!countryData.politics && <p className="text-sm text-ink-soft">정보 없음</p>}
              </InfoSection>

              <InfoSection title="경제현황">
                <InfoRow
                  label="GDP"
                  value={
                    countryData.economy?.gdp
                      ? `${formatNumber(countryData.economy.gdp)}달러 ${
                          countryData.economy.gdpDesc ?? ""
                        }`
                      : null
                  }
                />
                <InfoRow
                  label="1인당 GDP"
                  value={
                    countryData.economy?.gdpPerCapita
                      ? `${formatNumber(countryData.economy.gdpPerCapita)}달러`
                      : null
                  }
                />
                <InfoRow
                  label="경제성장률"
                  value={countryData.economy?.gdpGrowthRate ? `${countryData.economy.gdpGrowthRate}%` : null}
                />
                <InfoRow label="주요산업" value={countryData.economy?.majorIndustry ?? null} />
                {!countryData.economy && <p className="text-sm text-ink-soft">정보 없음</p>}
              </InfoSection>

              <InfoSection title="우리나라와의 관계">
                <InfoRow
                  label="수교"
                  value={countryData.koreaRelation?.diplomaticRelations ?? null}
                />
                <InfoRow label="공관현황" value={countryData.koreaRelation?.missionStatus ?? null} />
                <InfoRow label="투자현황" value={countryData.koreaRelation?.investmentStatus ?? null} />
                <InfoRow label="ODA현황" value={countryData.koreaRelation?.odaStatus ?? null} />
                <InfoRow label="교민현황" value={countryData.koreaRelation?.oksStatus ?? null} />
                {!countryData.koreaRelation && <p className="text-sm text-ink-soft">정보 없음</p>}
              </InfoSection>

              {countryData.situation.length > 0 && (
                <InfoSection title="주요정세">
                  <ul className="space-y-1.5">
                    {countryData.situation.map((entry, index) => (
                      <li key={index} className="text-sm text-ink">
                        <span className="text-ink-soft">
                          {entry.year}
                          {entry.month ? `.${entry.month}` : ""}
                        </span>{" "}
                        {entry.content}
                      </li>
                    ))}
                  </ul>
                </InfoSection>
              )}

              <a
                href={countryData.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 border-t border-line pt-4 text-xs font-medium text-bridge hover:text-harbor"
              >
                출처: 외교부 공공데이터(data.go.kr) 원문 보기
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
