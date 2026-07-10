"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldTopology from "world-atlas/countries-110m.json";
import { ScoreCard } from "@/components/kib/ScoreCard";

interface CountryInfo {
  name: string;
  score: number;
  technologies: string[];
  companyCount: number;
  companies: string[];
  partner: string;
}

const COUNTRY_DATA: Record<string, CountryInfo> = {
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

const DEFAULT_SELECTED = "116";
const DEFAULT_ROTATION: [number, number, number] = [-105, -15, 0];
const DRAG_CLICK_THRESHOLD = 4; // px — beyond this, a pointer-up is treated as a drag, not a click

export default function WorldMap() {
  const [selected, setSelected] = useState<string>(DEFAULT_SELECTED);
  const [rotation, setRotation] = useState<[number, number, number]>(DEFAULT_ROTATION);
  const [isDragging, setIsDragging] = useState(false);
  const info = COUNTRY_DATA[selected];

  const lastPointer = useRef<{ x: number; y: number } | null>(null);
  const dragDistance = useRef(0);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPointer.current = { x: event.clientX, y: event.clientY };
    dragDistance.current = 0;
    setIsDragging(true);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!lastPointer.current) return;
    const dx = event.clientX - lastPointer.current.x;
    const dy = event.clientY - lastPointer.current.y;
    dragDistance.current += Math.abs(dx) + Math.abs(dy);
    lastPointer.current = { x: event.clientX, y: event.clientY };

    setRotation(([lambda, phi, gamma]) => [
      lambda + dx * 0.4,
      Math.max(-80, Math.min(80, phi - dy * 0.4)),
      gamma,
    ]);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    lastPointer.current = null;
    setIsDragging(false);
  }

  function selectCountry(id: string) {
    if (dragDistance.current > DRAG_CLICK_THRESHOLD) return;
    setSelected(id);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div
        className={`relative aspect-square w-full touch-none select-none overflow-hidden rounded-[2rem] border border-line bg-mist ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale: 220, rotate: rotation }}
          className="h-full w-full"
        >
          <Geographies geography={worldTopology}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const match = COUNTRY_DATA[geo.id as string];
                const isSelected = geo.id === selected;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => match && selectCountry(geo.id as string)}
                    style={{
                      default: {
                        fill: match ? (isSelected ? "#3794FF" : "#9FC8FF") : "#E1E8EE",
                        stroke: "#ffffff",
                        strokeWidth: 0.4,
                        outline: "none",
                        cursor: match ? "pointer" : "default",
                        transition: "fill 150ms ease",
                      },
                      hover: {
                        fill: match ? "#3794FF" : "#CFD9E1",
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

        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-ink-soft">
          드래그해서 돌려보고, 파란색 국가를 클릭해보세요
        </p>
      </div>

      <div className="rounded-card border border-line bg-white p-6 shadow-kib-1">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-harbor">{info.name}</h3>
          <ScoreCard score={info.score} className="min-w-0 border-0 p-0" />
        </div>

        <p className="mt-5 text-xs font-medium text-ink-soft">
          매칭 기술 {info.technologies.length}개
        </p>
        <ul className="mt-2 space-y-1.5">
          {info.technologies.map((tech) => (
            <li key={tech} className="text-sm text-ink">
              · {tech}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs font-medium text-ink-soft">
          매칭 기업 {info.companyCount}개
        </p>
        <ul className="mt-2 space-y-1.5">
          {info.companies.map((company) => (
            <li key={company} className="text-sm text-ink">
              · {company}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs font-medium text-ink-soft">추천 파트너</p>
        <p className="mt-1 text-sm font-semibold text-harbor">{info.partner}</p>
      </div>
    </div>
  );
}
