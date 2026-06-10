import { NextResponse } from "next/server";
import type { JobRequest, JobResponse } from "../../../lib/api/contracts";

export async function POST(request: Request): Promise<NextResponse<JobResponse>> {
  const body = (await request.json()) as JobRequest;

  if (!body.toolRoute || !body.processing) {
    return NextResponse.json({ jobId: "", status: "failed" }, { status: 400 });
  }

  return NextResponse.json({
    jobId: crypto.randomUUID(),
    status: body.processing === "client" ? "done" : "queued"
  });
}
