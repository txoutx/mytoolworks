import { NextResponse } from "next/server";
import { chromium } from "playwright-chromium";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const { url } = (await request.json()) as { url?: string };
  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return new NextResponse("URL no valida.", { status: 400 });
  }

  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

  try {
    browser = await chromium.launch({
      headless: true
    });
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1200 },
      deviceScaleFactor: 1
    });

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 45000
    });
    await page.emulateMedia({ media: "screen" });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm"
      }
    });

    const body = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;
    return new NextResponse(body, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="url-a-pdf.pdf"'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo renderizar esa URL.";
    return new NextResponse(`No se pudo generar un PDF visual de esa URL. ${message}`, { status: 500 });
  } finally {
    await browser?.close();
  }
}
