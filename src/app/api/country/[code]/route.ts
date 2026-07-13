import { NextResponse } from "next/server";
import {
  getCountryBasicInfo,
  getCountryPolitics,
  getCountryEconomy,
  getCountryKoreaRelation,
  getCountrySituation,
} from "@/lib/mofa/client";

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const alpha2 = code.toUpperCase();

  if (!/^[A-Z]{2}$/.test(alpha2)) {
    return NextResponse.json({ error: "invalid country code" }, { status: 400 });
  }

  const [basic, politics, economy, koreaRelation, situation] = await Promise.allSettled([
    getCountryBasicInfo(alpha2),
    getCountryPolitics(alpha2),
    getCountryEconomy(alpha2),
    getCountryKoreaRelation(alpha2),
    getCountrySituation(alpha2),
  ]);

  return NextResponse.json({
    countryCode: alpha2,
    sourceUrl: `https://opendata.mofa.go.kr/lod/view.do?uri=${encodeURIComponent(
      `http://opendata.mofa.go.kr/core/resource/Country/${alpha2}`
    )}`,
    basic: basic.status === "fulfilled" ? basic.value : null,
    politics: politics.status === "fulfilled" ? politics.value : null,
    economy: economy.status === "fulfilled" ? economy.value : null,
    koreaRelation: koreaRelation.status === "fulfilled" ? koreaRelation.value : null,
    situation: situation.status === "fulfilled" ? situation.value : [],
  });
}
