import { NextResponse } from "next/server";
import type { UploadResponse } from "../../../lib/api/contracts";

export async function POST(): Promise<NextResponse<UploadResponse>> {
  return NextResponse.json({
    uploadId: crypto.randomUUID(),
    expiresInSeconds: 3600
  });
}
