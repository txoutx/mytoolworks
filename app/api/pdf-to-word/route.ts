import { NextResponse } from "next/server";
import conversionCloud from "groupdocs-conversion-cloud";

export const runtime = "nodejs";
export const maxDuration = 60;

const clientId = process.env.GROUPDOCS_CLIENT_ID;
const clientSecret = process.env.GROUPDOCS_CLIENT_SECRET;

export async function POST(request: Request) {
  if (!clientId || !clientSecret) {
    return new NextResponse(
      "PDF a Word real necesita configurar GROUPDOCS_CLIENT_ID y GROUPDOCS_CLIENT_SECRET en Vercel.",
      { status: 501 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new NextResponse("Sube un archivo PDF valido.", { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
    return new NextResponse("El archivo debe ser PDF.", { status: 400 });
  }

  try {
    const config = new conversionCloud.Configuration(clientId, clientSecret);
    config.apiBaseUrl = "https://api.groupdocs.cloud";
    const convertApi = conversionCloud.ConvertApi.fromConfig(config);
    const input = Buffer.from(await file.arrayBuffer());
    const result = await convertApi.convertDocumentDirect(
      new conversionCloud.ConvertDocumentDirectRequest("docx", input)
    );
    const body = result.buffer.slice(result.byteOffset, result.byteOffset + result.byteLength) as ArrayBuffer;

    return new NextResponse(body, {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "content-disposition": `attachment; filename="${safeFilename(file.name)}.docx"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return new NextResponse(`No se pudo convertir el PDF a Word real. ${message}`, { status: 502 });
  }
}

function safeFilename(name: string) {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "pdf-a-word";
}
