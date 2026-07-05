"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import worldTopology from "world-atlas/countries-110m.json";

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

export default function WorldMap() {
  const [selected, setSelected] = useState<string>(DEFAULT_SELECTED);
  const info = COUNTRY_DATA[selected];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50">
        <ComposableMap
          projection="geoOrthographic"
          projectionConfig={{ scale: 220, rotate: [-105, -15, 0] }}
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
                    onClick={() => match && setSelected(geo.id as string)}
                    style={{
                      default: {
                        fill: match ? (isSelected ? "#2563eb" : "#93c5fd") : "#e2e8f0",
                        stroke: "#ffffff",
                        strokeWidth: 0.4,
                        outline: "none",
                        cursor: match ? "pointer" : "default",
                        transition: "fill 150ms ease",
                      },
                      hover: {
                        fill: match ? "#2563eb" : "#cbd5e1",
                        stroke: "#ffffff",
                        strokeWidth: 0.4,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#1d4ed8",
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

        <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-slate-400">
          파란색 국가를 클릭해보세요
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{info.name}</h3>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            Opportunity {info.score}
          </span>
        </div>

        <p className="mt-5 text-xs font-medium text-slate-400">
          매칭 기술 {info.technologies.length}개
        </p>
        <ul className="mt-2 space-y-1.5">
          {info.technologies.map((tech) => (
            <li key={tech} className="text-sm text-slate-700">
              · {tech}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs font-medium text-slate-400">
          매칭 기업 {info.companyCount}개
        </p>
        <ul className="mt-2 space-y-1.5">
          {info.companies.map((company) => (
            <li key={company} className="text-sm text-slate-700">
              · {company}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-xs font-medium text-slate-400">추천 파트너</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{info.partner}</p>
      </div>
    </div>
  );
}
