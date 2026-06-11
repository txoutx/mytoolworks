import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function POST(request: Request) {
  const { url } = (await request.json()) as { url?: string };
  if (!url || !/^https?:\/\/.+/i.test(url)) {
    return new NextResponse("URL no valida.", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 MyToolWorks URL to PDF"
      }
    });
    if (!response.ok) {
      return new NextResponse(`No se pudo leer la URL (${response.status}).`, { status: 502 });
    }

    const html = await response.text();
    const title = extractTitle(html) || url;
    const text = htmlToText(html);
    const pdfBytes = await textToPdf(title, text || url);

    const body = pdfBytes.buffer.slice(pdfBytes.byteOffset, pdfBytes.byteOffset + pdfBytes.byteLength) as ArrayBuffer;
    return new NextResponse(body, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": 'attachment; filename="url-a-pdf.pdf"'
      }
    });
  } catch {
    return new NextResponse("No se pudo generar el PDF desde esa URL.", { status: 500 });
  }
}

function extractTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim();
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<\/(p|div|section|article|header|footer|main|h[1-6]|li|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function textToPdf(title: string, text: string) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const margin = 48;
  const lineHeight = 14;
  let page = pdf.addPage([595.28, 841.89]);
  let y = page.getHeight() - margin;

  page.drawText(title.slice(0, 90), {
    x: margin,
    y,
    size: 16,
    font: bold,
    color: rgb(0.08, 0.14, 0.18)
  });
  y -= 28;

  for (const paragraph of text.split(/\n+/)) {
    for (const line of wrapText(paragraph, 92)) {
      if (y < margin) {
        page = pdf.addPage([595.28, 841.89]);
        y = page.getHeight() - margin;
      }
      page.drawText(line, {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.12, 0.16, 0.2)
      });
      y -= lineHeight;
    }
    y -= 6;
  }

  return pdf.save();
}

function wrapText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}
