import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { spawn } from "child_process";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new NextResponse("Sube un archivo PDF valido.", { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
    return new NextResponse("El archivo debe ser PDF.", { status: 400 });
  }

  const jobDir = path.join(tmpdir(), `mytoolworks-pdf-word-${randomUUID()}`);
  const inputPath = path.join(jobDir, "input.pdf");
  const outputPath = path.join(jobDir, "output.docx");

  try {
    await mkdir(jobDir, { recursive: true });
    await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));
    await runPythonConverter(inputPath, outputPath);
    const output = await readFile(outputPath);
    const body = output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength) as ArrayBuffer;
    return new NextResponse(body, {
      headers: {
        "content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "content-disposition": `attachment; filename="${safeFilename(file.name)}.docx"`
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return new NextResponse(`No se pudo convertir el PDF a Word. ${message}`, { status: 500 });
  } finally {
    await rm(jobDir, { recursive: true, force: true });
  }
}

function runPythonConverter(inputPath: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), "scripts", "pdf_to_docx.py");
    const pythonPackagesPath = path.join(process.cwd(), ".python_packages");
    const pythonCommand = process.env.PYTHON_BIN ?? (process.platform === "win32" ? "python" : "python3");
    const child = spawn(pythonCommand, [scriptPath, inputPath, outputPath], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PYTHONPATH: [pythonPackagesPath, process.env.PYTHONPATH].filter(Boolean).join(path.delimiter)
      },
      windowsHide: true
    });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      reject(new Error(`No se pudo arrancar Python. ${error.message}`));
    });
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          stderr.trim() ||
            "El servidor no tiene instalado pdf2docx. Instala las dependencias de requirements.txt en el entorno de despliegue."
        )
      );
    });
  });
}

function safeFilename(name: string) {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/[^a-z0-9._-]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "pdf-a-word";
}
