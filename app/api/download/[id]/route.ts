import { NextResponse } from "next/server";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteProps) {
  const { id } = await params;

  return NextResponse.json({
    id,
    status: "pending",
    message: "Download endpoint preparado para conectar storage temporal."
  });
}
