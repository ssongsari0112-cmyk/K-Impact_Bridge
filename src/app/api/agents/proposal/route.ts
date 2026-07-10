import { NextResponse } from "next/server";
import { runAgent } from "@/lib/ai/client";

export async function POST(request: Request) {
  const input = await request.json().catch(() => ({}));
  const result = await runAgent("proposal", input);
  return NextResponse.json(result);
}
