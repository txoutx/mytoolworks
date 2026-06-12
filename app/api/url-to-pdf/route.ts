import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { url } = (await request.json()) as { url?: string };

  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return new NextResponse("URL no valida.", { status: 400 });
  }

  const endpoint = process.env.URL_TO_PDF_ENDPOINT;

  if (!endpoint) {
    return new NextResponse(
      "URL a PDF necesita un servicio externo de renderizado para funcionar en Vercel sin romper el despliegue.",
      { status: 503 }
    );
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!response.ok) {
    return new NextResponse("No se pudo generar el PDF de esa URL.", { status: 502 });
  }

  return new NextResponse(await response.arrayBuffer(), {
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/pdf",
      "content-disposition": 'attachment; filename="url-a-pdf.pdf"'
    }
  });
}
