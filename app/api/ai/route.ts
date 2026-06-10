import { NextResponse } from "next/server";
import type { AiRequest } from "../../../lib/api/contracts";

export async function POST(request: Request) {
  const body = (await request.json()) as AiRequest;

  if (!body.toolRoute || !body.input) {
    return NextResponse.json({ error: "Missing AI input" }, { status: 400 });
  }

  return NextResponse.json({
    status: "queued",
    jobId: crypto.randomUUID()
  });
}
