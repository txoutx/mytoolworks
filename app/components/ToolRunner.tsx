"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import type { Tool } from "../data/tools";

type RunnerProps = {
  tool: Tool;
};

type PagePreview = {
  id: string;
  fileIndex: number;
  pageIndex: number;
  pageNumber: number;
  name: string;
  thumbnail: string;
};

const formatEuro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2
});

export function ToolRunner({ tool }: RunnerProps) {
  if (tool.kind === "mortgage") return <MortgageCalculator />;
  if (tool.kind === "salary") return <SalaryCalculator />;
  if (tool.kind === "units") return <UnitConverter />;
  if (tool.kind === "scientific") return <ScientificCalculator />;
  if (tool.kind === "cv") return <CvGenerator />;
  if (tool.kind === "letter") return <LetterGenerator />;
  if (tool.kind === "summary") return <TextSummarizer />;
  if (tool.kind === "grammar") return <GrammarChecker />;
  return <PdfUploader tool={tool} />;
}

function PdfUploader({ tool }: { tool: Tool }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Array<{ name: string; url: string; type: string }>>([]);
  const [pagePreviews, setPagePreviews] = useState<PagePreview[]>([]);
  const [pageOrder, setPageOrder] = useState<string[]>([]);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [draggedFileIndex, setDraggedFileIndex] = useState<number | null>(null);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [pageRotations, setPageRotations] = useState<Record<string, number>>({});
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [watermarkText, setWatermarkText] = useState("MyToolWorks");
  const [isDrawingSignature, setIsDrawingSignature] = useState(false);
  const [signatureHasInk, setSignatureHasInk] = useState(false);
  const [editText, setEditText] = useState("Texto nuevo");
  const [editMode, setEditMode] = useState<"text" | "highlight" | "redact">("text");
  const [editPage, setEditPage] = useState(1);
  const [editX, setEditX] = useState(56);
  const [editY, setEditY] = useState(90);
  const [rotation, setRotation] = useState(90);
  const [rotateScope, setRotateScope] = useState<"all" | "selected">("all");
  const [signatureMode, setSignatureMode] = useState<"draw" | "certificate">("draw");
  const [certificateName, setCertificateName] = useState("");
  const [signaturePlacement, setSignaturePlacement] = useState({ pageId: "", xPct: 0.5, yPct: 0.78 });
  const [signaturePreview, setSignaturePreview] = useState("");
  const [isDraggingSignature, setIsDraggingSignature] = useState(false);
  const [splitMode, setSplitMode] = useState<"all" | "range">("all");
  const [pageRange, setPageRange] = useState("1");
  const [compressionLevel, setCompressionLevel] = useState("recommended");
  const [imageFormat, setImageFormat] = useState<"jpg" | "png" | "webp">("jpg");
  const [urlToPdf, setUrlToPdf] = useState("https://");

  const multiple = tool.input === "multi-file";
  const accept = getAcceptedTypes(tool);

  useEffect(() => {
    const nextPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type
    }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [files]);

  useEffect(() => {
    let cancelled = false;

    async function renderPages() {
      const pdfFiles = files
        .map((file, originalIndex) => ({ file, originalIndex }))
        .filter(({ file }) => file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf"));
      if (pdfFiles.length === 0) {
        setPagePreviews([]);
        setPageOrder([]);
        setSelectedPages([]);
        return;
      }

      const pdfjs = await loadPdfJs();
      const rendered: PagePreview[] = [];

      for (let fileIndex = 0; fileIndex < pdfFiles.length; fileIndex += 1) {
        const { file, originalIndex } = pdfFiles[fileIndex];
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex += 1) {
          const page = await pdf.getPage(pageIndex + 1);
          const viewport = page.getViewport({ scale: 0.34 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          rendered.push({
            id: `${originalIndex}-${pageIndex}`,
            fileIndex: originalIndex,
            pageIndex,
            pageNumber: pageIndex + 1,
            name: file.name,
            thumbnail: canvas.toDataURL("image/jpeg", 0.72)
          });
        }
      }

      if (!cancelled) {
        setPagePreviews(rendered);
        setPageOrder(rendered.map((page) => page.id));
        setSelectedPages([]);
      }
    }

    renderPages().catch(() => {
      setPagePreviews([]);
      setPageOrder([]);
    });

    return () => {
      cancelled = true;
    };
  }, [files]);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    setFiles((current) => (multiple ? [...current, ...incoming] : incoming.slice(0, 1)));
    setStatus("idle");
    setMessage("");
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, currentIndex) => currentIndex !== index));
    setStatus("idle");
    setMessage("");
  }

  function moveFile(index: number, direction: -1 | 1) {
    setFiles((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function dropFile(targetIndex: number) {
    if (draggedFileIndex === null || draggedFileIndex === targetIndex) return;
    setFiles((current) => moveArrayItem(current, draggedFileIndex, targetIndex));
    setDraggedFileIndex(null);
  }

  function dropPage(targetId: string) {
    if (!draggedPageId || draggedPageId === targetId) return;
    setPageOrder((current) => {
      const from = current.indexOf(draggedPageId);
      const to = current.indexOf(targetId);
      if (from < 0 || to < 0) return current;
      return moveArrayItem(current, from, to);
    });
    setDraggedPageId(null);
  }

  function togglePage(id: string) {
    setSelectedPages((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function rotatePage(id: string, direction: -90 | 90 = 90) {
    setPageRotations((current) => ({ ...current, [id]: normalizeDegrees((current[id] ?? 0) + direction) }));
  }

  async function processFiles() {
    if (files.length === 0 && tool.slug !== "html-a-pdf") {
      setStatus("error");
      setMessage("Primero selecciona un archivo.");
      return;
    }
    if (tool.slug === "html-a-pdf" && !/^https?:\/\/.+/i.test(urlToPdf.trim())) {
      setStatus("error");
      setMessage("Introduce una URL valida que empiece por http:// o https://.");
      return;
    }
    if (tool.slug === "firmar-pdf" && signatureMode === "draw" && !signatureHasInk) {
      setStatus("error");
      setMessage("Dibuja tu firma antes de procesar el PDF.");
      return;
    }

    setStatus("processing");
    setMessage("Preparando archivo...");

    try {
      const output = await processPdfTool(tool, files, {
        watermarkText,
        signatureDataUrl: signatureCanvasRef.current?.toDataURL("image/png") ?? "",
        editText,
        editMode,
        editPage,
        editX,
        editY,
        rotation,
        rotateScope,
        signatureMode,
        signaturePlacement,
        pageOrder,
        selectedPages,
        pageRotations,
        splitMode,
        pageRange,
        compressionLevel,
        imageFormat,
        urlToPdf
      });

      setStatus("done");
      setMessage(output);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No se pudo procesar con esta herramienta.");
    }
  }

  function drawSignature(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    if (!canvas || !isDrawingSignature) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#17324d";
    ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    ctx.stroke();
    setSignatureHasInk(true);
  }

  function startSignature(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
    setIsDrawingSignature(true);
  }

  function clearSignature() {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureHasInk(false);
    setSignaturePreview("");
  }

  function finishSignature() {
    setIsDrawingSignature(false);
    const canvas = signatureCanvasRef.current;
    if (canvas && signatureHasInk) setSignaturePreview(canvas.toDataURL("image/png"));
  }

  function placeSignatureOnPreview(event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>, pageId: string) {
    const thumb = event.currentTarget.querySelector(".document-thumb");
    const rect = thumb?.getBoundingClientRect();
    const xPct = rect ? (event.clientX - rect.left) / rect.width : 0.5;
    const yPct = rect ? (event.clientY - rect.top) / rect.height : 0.78;
    setSelectedPages([pageId]);
    setSignaturePlacement({
      pageId,
      xPct: Math.min(Math.max(xPct, 0.08), 0.92),
      yPct: Math.min(Math.max(yPct, 0.08), 0.92)
    });
  }

  const pageCardTools = ["dividir-pdf", "ordenar-pdf", "rotar-pdf", "firmar-pdf", "pdf-a-jpg"];
  const showFirstPageCards = previews.length > 0 && !["unir-pdf", ...pageCardTools].includes(tool.slug);

  return (
    <div className="tool-workspace">
      <h2>{tool.title}</h2>
      {tool.slug === "html-a-pdf" ? (
        <div className="tool-options">
          <TextField label="URL de la pagina" value={urlToPdf} onChange={setUrlToPdf} />
          <p className="option-note">Introduce un enlace publico. La herramienta generara un PDF con el contenido principal de la pagina.</p>
        </div>
      ) : (
        <>
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={(event) => addFiles(event.target.files)}
          />
          <button
            type="button"
            className={dragging ? "dropzone active" : "dropzone"}
            onClick={() => inputRef.current?.click()}
            onDragEnter={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              addFiles(event.dataTransfer.files);
            }}
          >
            <div>
              <UploadCloud size={36} aria-hidden="true" />
              <strong>{files.length > 0 ? "Anadir mas archivos" : "Seleccionar archivos"}</strong>
              <span>Haz clic o arrastra aqui {multiple ? "tus archivos" : "tu archivo"}.</span>
            </div>
          </button>
        </>
      )}

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div className="file-row" key={`${file.name}-${file.size}-${index}`}>
              <FileText size={18} aria-hidden="true" />
              <span>{file.name}</span>
              <small>{formatFileSize(file.size)}</small>
              <button type="button" aria-label={`Quitar ${file.name}`} onClick={() => removeFile(index)}>
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && tool.slug === "unir-pdf" && (
        <div className="document-board">
          {previews.map((preview, index) => (
            <article
              className="document-card"
              key={preview.url}
              draggable
              onDragStart={() => setDraggedFileIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => dropFile(index)}
            >
              <div className="order-badge">{index + 1}</div>
              <div className="document-thumb">
                {preview.type.startsWith("image/") ? (
                  <img src={preview.url} alt="" />
                ) : firstPageForFile(pagePreviews, index) ? (
                  <img src={firstPageForFile(pagePreviews, index)?.thumbnail} alt={`Primera pagina de ${preview.name}`} />
                ) : (
                  <div className="preview-loading" aria-hidden="true">
                    Generando vista previa...
                  </div>
                )}
              </div>
              <div className="document-name" title={preview.name}>
                {preview.name}
              </div>
            </article>
          ))}
        </div>
      )}

      {showFirstPageCards && (
        <div className="document-board">
          {previews.map((preview, index) => (
            <article className="document-card" key={preview.url}>
              <div className="document-thumb">
                {preview.type.startsWith("image/") ? (
                  <img src={preview.url} alt={`Vista previa de ${preview.name}`} />
                ) : firstPageForFile(pagePreviews, index) ? (
                  <img src={firstPageForFile(pagePreviews, index)?.thumbnail} alt={`Primera pagina de ${preview.name}`} />
                ) : (
                  <div className="preview-loading" aria-hidden="true">
                    Generando vista previa...
                  </div>
                )}
              </div>
              <div className="document-name" title={preview.name}>
                {preview.name}
              </div>
            </article>
          ))}
        </div>
      )}

      {pagePreviews.length > 0 && pageCardTools.includes(tool.slug) && (
        <div className="document-board page-board">
          {orderedPagePreviews(pagePreviews, pageOrder).map((page, index) => {
            const selected = selectedPages.includes(page.id);
            return (
              <article
                className={selected ? "document-card page-card selected" : "document-card page-card"}
                key={page.id}
                draggable={tool.slug === "ordenar-pdf"}
                onClick={(event) => {
                  if (tool.slug === "dividir-pdf") {
                    setSplitMode("range");
                    togglePage(page.id);
                  }
                  if (tool.slug === "rotar-pdf") {
                    setRotateScope("selected");
                    togglePage(page.id);
                  }
                  if (tool.slug === "pdf-a-jpg") togglePage(page.id);
                  if (tool.slug === "firmar-pdf") {
                    placeSignatureOnPreview(event, page.id);
                  }
                }}
                onPointerMove={(event) => {
                  if (tool.slug === "firmar-pdf" && isDraggingSignature && signaturePlacement.pageId === page.id) {
                    placeSignatureOnPreview(event, page.id);
                  }
                }}
                onPointerUp={() => setIsDraggingSignature(false)}
                onDragStart={() => setDraggedPageId(page.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => dropPage(page.id)}
              >
                <div className="order-badge">{tool.slug === "ordenar-pdf" ? index + 1 : page.pageNumber}</div>
                <div className="document-thumb">
                  <img
                    src={page.thumbnail}
                    alt={`Pagina ${page.pageNumber}`}
                    style={{ transform: `rotate(${pageRotations[page.id] ?? 0}deg)` }}
                  />
                  {tool.slug === "firmar-pdf" && signaturePlacement.pageId === page.id && signaturePreview && (
                    <span
                      className="signature-marker signature-image-marker"
                      style={{ left: `${signaturePlacement.xPct * 100}%`, top: `${signaturePlacement.yPct * 100}%` }}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                        setIsDraggingSignature(true);
                      }}
                    >
                      <img src={signaturePreview} alt="Firma" />
                    </span>
                  )}
                </div>
                <div className="document-name" title={`${page.name} - pagina ${page.pageNumber}`}>
                  Pagina {page.pageNumber}
                </div>
                {tool.slug === "rotar-pdf" && (
                  <div className="document-actions">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        rotatePage(page.id, -90);
                      }}
                    >
                      -90
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        rotatePage(page.id, 90);
                      }}
                    >
                      +90
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {tool.slug === "dividir-pdf" && (
        <div className="tool-options">
          <label>
            <input
              type="radio"
              name="split-mode"
              checked={splitMode === "all"}
              onChange={() => setSplitMode("all")}
            />
            Extraer todas las paginas
          </label>
          <label>
            <input
              type="radio"
              name="split-mode"
              checked={splitMode === "range"}
              onChange={() => setSplitMode("range")}
            />
            Seleccionar paginas
          </label>
          {splitMode === "range" && (
            <TextField label="Paginas (ej. 1,3,5-7)" value={pageRange} onChange={setPageRange} />
          )}
        </div>
      )}

      {tool.slug === "comprimir-pdf" && (
        <div className="tool-options">
          <label>
            <input
              type="radio"
              name="compression"
              checked={compressionLevel === "extreme"}
              onChange={() => setCompressionLevel("extreme")}
            />
            Compresion extrema
          </label>
          <label>
            <input
              type="radio"
              name="compression"
              checked={compressionLevel === "recommended"}
              onChange={() => setCompressionLevel("recommended")}
            />
            Compresion recomendada
          </label>
          <label>
            <input
              type="radio"
              name="compression"
              checked={compressionLevel === "low"}
              onChange={() => setCompressionLevel("low")}
            />
            Menos compresion
          </label>
          <p className="option-note">
            La compresion extrema rasteriza las paginas para reducir mucho mas el peso, con perdida visible de calidad.
          </p>
        </div>
      )}

      {tool.slug === "pdf-a-jpg" && (
        <div className="tool-options">
          <div className="field">
            <label htmlFor="image-format">Formato de imagen</label>
            <select id="image-format" value={imageFormat} onChange={(event) => setImageFormat(event.target.value as typeof imageFormat)}>
              <option value="jpg">JPG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
          <p className="option-note">
            Haz click en paginas concretas para exportar solo esas. Si no seleccionas ninguna, se exportan todas.
          </p>
        </div>
      )}

      {tool.slug === "marca-de-agua" && (
        <TextField label="Texto de marca de agua" value={watermarkText} onChange={setWatermarkText} />
      )}
      {tool.slug === "editar-pdf" && (
        <div className="tool-options">
          <label>
            <input type="radio" name="edit-mode" checked={editMode === "text"} onChange={() => setEditMode("text")} />
            Añadir texto
          </label>
          <label>
            <input
              type="radio"
              name="edit-mode"
              checked={editMode === "highlight"}
              onChange={() => setEditMode("highlight")}
            />
            Resaltar area
          </label>
          <label>
            <input
              type="radio"
              name="edit-mode"
              checked={editMode === "redact"}
              onChange={() => setEditMode("redact")}
            />
            Tapar area
          </label>
          {editMode === "text" && <TextField label="Texto a insertar" value={editText} onChange={setEditText} />}
          <NumberField label="Pagina" value={editPage} onChange={setEditPage} />
          <NumberField label="Posicion X" value={editX} onChange={setEditX} />
          <NumberField label="Posicion Y desde arriba" value={editY} onChange={setEditY} />
        </div>
      )}
      {tool.slug === "firmar-pdf" && (
        <div className="tool-options">
          <label>
            <input
              type="radio"
              name="signature-mode"
              checked={signatureMode === "draw"}
              onChange={() => setSignatureMode("draw")}
            />
            Firma dibujada
          </label>
          <label>
            <input
              type="radio"
              name="signature-mode"
              checked={signatureMode === "certificate"}
              onChange={() => setSignatureMode("certificate")}
            />
            Certificado digital
          </label>
          {signatureMode === "draw" ? (
            <div className="signature-pad-wrap">
              <label>Dibuja tu firma</label>
              <canvas
                ref={signatureCanvasRef}
                width={520}
                height={180}
                className="signature-pad"
                onPointerDown={startSignature}
                onPointerMove={drawSignature}
                onPointerUp={finishSignature}
                onPointerLeave={finishSignature}
              />
              <button type="button" className="small-action" onClick={clearSignature}>
                Borrar firma
              </button>
            </div>
          ) : (
            <div className="result-box compact-result">
              La firma digital con certificado instalado, sellado de tiempo cualificado y cumplimiento eIDAS/ESIGN/UETA
              requiere una app local o backend de firma. El navegador no puede leer certificados instalados ni custodiar
              claves privadas de forma segura.
            </div>
          )}
          <p className="option-note">Haz click sobre la miniatura de una pagina para elegir exactamente donde colocar la firma.</p>
        </div>
      )}
      {tool.slug === "rotar-pdf" && (
        <div className="tool-options">
          <label>
            <input type="radio" name="rotate-scope" checked={rotateScope === "all"} onChange={() => setRotateScope("all")} />
            Rotar todas
          </label>
          <label>
            <input
              type="radio"
              name="rotate-scope"
              checked={rotateScope === "selected"}
              onChange={() => setRotateScope("selected")}
            />
            Rotar solo paginas seleccionadas
          </label>
          <div className="field">
            <label htmlFor="rotation">Rotacion</label>
            <select id="rotation" value={rotation} onChange={(event) => setRotation(Number(event.target.value))}>
              <option value={90}>90 grados</option>
              <option value={180}>180 grados</option>
              <option value={270}>270 grados</option>
            </select>
          </div>
          <p className="option-note">
            Haz click en las miniaturas para seleccionar paginas. Seleccionadas: {selectedPages.length}.
          </p>
        </div>
      )}

      <button
        className="button process-button"
        type="button"
        disabled={(files.length === 0 && tool.slug !== "html-a-pdf") || status === "processing"}
        onClick={processFiles}
      >
        {status === "processing" ? "Procesando..." : `Procesar ${tool.title}`}
      </button>
      {message && <div className={`tool-status ${status}`}>{message}</div>}
    </div>
  );
}

function MortgageCalculator() {
  const [amount, setAmount] = useState(180000);
  const [years, setYears] = useState(30);
  const [rate, setRate] = useState(3.2);

  const result = useMemo(() => {
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const payment =
      monthlyRate === 0
        ? amount / months
        : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    return {
      payment,
      total: payment * months,
      interest: payment * months - amount
    };
  }, [amount, years, rate]);

  return (
    <div className="tool-workspace">
      <h2>Simula tu hipoteca</h2>
      <div className="form-grid">
        <NumberField label="Importe prestamo" value={amount} onChange={setAmount} />
        <NumberField label="Plazo en anos" value={years} onChange={setYears} />
        <NumberField label="Interes anual (%)" value={rate} onChange={setRate} step={0.1} />
        <div className="result-box">
          <strong>Cuota mensual: {formatEuro.format(result.payment)}</strong>
          <br />
          Coste total: {formatEuro.format(result.total)}
          <br />
          Intereses estimados: {formatEuro.format(result.interest)}
        </div>
      </div>
    </div>
  );
}

function SalaryCalculator() {
  const [gross, setGross] = useState(30000);
  const [tax, setTax] = useState(22);
  const [payments, setPayments] = useState(12);
  const netAnnual = gross * (1 - tax / 100);

  return (
    <div className="tool-workspace">
      <h2>Calcula salario neto</h2>
      <div className="form-grid">
        <NumberField label="Bruto anual" value={gross} onChange={setGross} />
        <NumberField label="Retencion estimada (%)" value={tax} onChange={setTax} step={0.5} />
        <NumberField label="Pagas" value={payments} onChange={setPayments} />
        <div className="result-box">
          <strong>Neto mensual: {formatEuro.format(netAnnual / payments)}</strong>
          <br />
          Neto anual estimado: {formatEuro.format(netAnnual)}
        </div>
      </div>
    </div>
  );
}

function UnitConverter() {
  const [type, setType] = useState("length");
  const [value, setValue] = useState(1);

  const converted = useMemo(() => {
    if (type === "length") return `${(value * 3.28084).toFixed(4)} pies`;
    if (type === "weight") return `${(value * 2.20462).toFixed(4)} libras`;
    if (type === "temperature") return `${((value * 9) / 5 + 32).toFixed(2)} grados Fahrenheit`;
    return `${(value * 0.264172).toFixed(4)} galones US`;
  }, [type, value]);

  return (
    <div className="tool-workspace">
      <h2>Convierte unidades</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="unit-type">Tipo</label>
          <select id="unit-type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="length">Metros a pies</option>
            <option value="weight">Kilogramos a libras</option>
            <option value="temperature">Celsius a Fahrenheit</option>
            <option value="volume">Litros a galones</option>
          </select>
        </div>
        <NumberField label="Valor" value={value} onChange={setValue} step={0.01} />
        <div className="result-box">
          <strong>Resultado: {converted}</strong>
        </div>
      </div>
    </div>
  );
}

function ScientificCalculator() {
  const [expression, setExpression] = useState("");
  const result = useMemo(() => safeCalculate(expression), [expression]);
  const buttons = [
    "C",
    "(",
    ")",
    "Del",
    "sin(",
    "cos(",
    "tan(",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "sqrt(",
    "0",
    ".",
    "="
  ];

  function press(value: string) {
    if (value === "C") {
      setExpression("");
      return;
    }
    if (value === "Del") {
      setExpression((current) => current.slice(0, -1));
      return;
    }
    if (value === "=") {
      setExpression(result === "Operacion no valida" ? expression : result.replace(/\./g, "").replace(",", "."));
      return;
    }
    setExpression((current) => `${current}${value}`);
  }

  return (
    <div className="tool-workspace">
      <h2>Calculadora cientifica</h2>
      <div className="calculator-shell">
        <input
          className="calculator-display"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="0"
          aria-label="Operacion"
        />
        <div className="calculator-result">{expression ? result : "0"}</div>
        <div className="calculator-keys">
          {buttons.map((button) => (
            <button
              className={button === "=" ? "calc-key equals" : "calc-key"}
              type="button"
              key={button}
              onClick={() => press(button)}
            >
              {button}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function CvGenerator() {
  const [name, setName] = useState("Nombre Apellidos");
  const [role, setRole] = useState("Desarrollador web");
  const [skills, setSkills] = useState("Next.js, SEO, automatizacion");

  return (
    <div className="tool-workspace">
      <h2>Genera un CV base</h2>
      <div className="form-grid">
        <TextField label="Nombre" value={name} onChange={setName} />
        <TextField label="Puesto objetivo" value={role} onChange={setRole} />
        <TextField label="Habilidades" value={skills} onChange={setSkills} />
        <div className="result-box">
          <strong>{name}</strong>
          <br />
          Perfil: {role} con experiencia en {skills}. Profesional orientado a resultados,
          aprendizaje continuo y comunicacion clara.
        </div>
      </div>
    </div>
  );
}

function LetterGenerator() {
  const [type, setType] = useState("renuncia");
  const [recipient, setRecipient] = useState("Responsable de RR. HH.");

  return (
    <div className="tool-workspace">
      <h2>Genera una carta</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="letter-type">Tipo</label>
          <select id="letter-type" value={type} onChange={(event) => setType(event.target.value)}>
            <option value="renuncia">Renuncia</option>
            <option value="solicitud">Solicitud</option>
            <option value="reclamacion">Reclamacion</option>
          </select>
        </div>
        <TextField label="Destinatario" value={recipient} onChange={setRecipient} />
        <div className="result-box">
          Estimado/a {recipient}:<br />
          Por medio de la presente deseo comunicar mi {type}. Agradezco la atencion prestada y
          quedo a disposicion para ampliar cualquier informacion necesaria.
        </div>
      </div>
    </div>
  );
}

function TextSummarizer() {
  const [text, setText] = useState("");
  const summary = text
    .split(/[.!?]+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(". ");

  return (
    <div className="tool-workspace">
      <h2>Resume texto</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="summary-text">Texto</label>
          <textarea id="summary-text" value={text} onChange={(event) => setText(event.target.value)} />
        </div>
        <div className="result-box">
          {summary ? `${summary}.` : "Pega un texto largo para ver un resumen inicial."}
        </div>
      </div>
    </div>
  );
}

function GrammarChecker() {
  const [text, setText] = useState("Este texto esta preparado para revisar.");
  const suggestions = [
    [" esta ", " esta/esta: revisa si necesitas tilde segun el contexto."],
    [" ingles", " ingles: en espanol suele escribirse 'ingles' con tilde."],
    [" solo ", " solo: la tilde depende del uso y del criterio editorial."]
  ];
  const found = suggestions.filter(([needle]) => text.toLowerCase().includes(needle.trim()));

  return (
    <div className="tool-workspace">
      <h2>Revisa ortografia</h2>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="grammar-text">Texto</label>
          <textarea id="grammar-text" value={text} onChange={(event) => setText(event.target.value)} />
        </div>
        <div className="result-box">
          {found.length > 0
            ? found.map((item) => item[1]).join(" ")
            : "No se han detectado sugerencias basicas en este texto."}
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        value={value}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

function TextField({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = label.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function safeCalculate(expression: string) {
  if (!expression.trim()) return "0";
  try {
    const normalized = expression
      .replace(/\bsin\(/g, "Math.sin((Math.PI/180)*")
      .replace(/\bcos\(/g, "Math.cos((Math.PI/180)*")
      .replace(/\btan\(/g, "Math.tan((Math.PI/180)*")
      .replace(/\bsqrt\(/g, "Math.sqrt(")
      .replace(/\blog\(/g, "Math.log10(")
      .replace(/\bln\(/g, "Math.log(")
      .replace(/\bpi\b/gi, "Math.PI")
      .replace(/\be\b/g, "Math.E");

    if (!/^[0-9+\-*/().,\sMathPIEcosintalgrq]+$/.test(normalized)) {
      return "Operacion no valida";
    }

    const value = Function(`"use strict"; return (${normalized})`)();
    return Number.isFinite(value) ? Number(value).toLocaleString("es-ES") : "Operacion no valida";
  } catch {
    return "Operacion no valida";
  }
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function moveArrayItem<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function orderedPagePreviews(pages: PagePreview[], order: string[]) {
  const byId = new Map(pages.map((page) => [page.id, page]));
  const ordered = order.map((id) => byId.get(id)).filter((page): page is PagePreview => Boolean(page));
  const missing = pages.filter((page) => !order.includes(page.id));
  return [...ordered, ...missing];
}

function firstPageForFile(pages: PagePreview[], fileIndex: number) {
  return pages.find((page) => page.fileIndex === fileIndex && page.pageIndex === 0);
}

function getAcceptedTypes(tool: Tool) {
  if (tool.slug === "jpg-a-pdf" || tool.slug === "escanea-a-pdf") return "image/*";
  if (tool.slug === "word-a-pdf") return ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (tool.slug === "powerpoint-a-pdf") return ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (tool.slug === "excel-a-pdf") return ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  return ".pdf,application/pdf";
}

async function processPdfTool(
  tool: Tool,
  files: File[],
  options: {
    watermarkText: string;
    signatureDataUrl: string;
    editText: string;
    editMode: "text" | "highlight" | "redact";
    editPage: number;
    editX: number;
    editY: number;
    rotation: number;
    rotateScope: "all" | "selected";
    signatureMode: "draw" | "certificate";
    signaturePlacement: { pageId: string; xPct: number; yPct: number };
    pageOrder: string[];
    selectedPages: string[];
    pageRotations: Record<string, number>;
    splitMode: "all" | "range";
    pageRange: string;
    compressionLevel: string;
    imageFormat: "jpg" | "png" | "webp";
    urlToPdf: string;
  }
) {
  const { PDFDocument, StandardFonts, rgb, degrees } = await import("pdf-lib");

  if (tool.slug === "pdf-a-word") {
    await createVisualWordFromPdf(files[0]);
    return "Documento Word visual creado y descargado.";
  }

  if (tool.slug === "pdf-a-powerpoint") {
    await createPowerPointFromPdf(files[0]);
    return "PowerPoint creado y descargado.";
  }

  if (tool.slug === "pdf-a-excel") {
    const text = await extractPdfText(files[0]);
    await createExcelFromPdfText(text);
    return "Excel creado y descargado.";
  }

  if (tool.slug === "jpg-a-pdf" || tool.slug === "escanea-a-pdf") {
    const output = await PDFDocument.create();
    for (const file of files) {
      const bytes = await imageFileToPngBytes(file);
      const image = await output.embedPng(bytes);
      const page = output.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }
    downloadBytes(await output.save(), "imagenes.pdf", "application/pdf");
    return "PDF creado y descargado.";
  }

  if (tool.slug === "html-a-pdf") {
    await createPdfFromUrl(options.urlToPdf);
    return "PDF de URL creado y descargado.";
  }

  if (tool.input !== "multi-file" && !files[0].type.includes("pdf") && !files[0].name.toLowerCase().endsWith(".pdf")) {
    return "Esta conversion necesita backend especializado para generar el archivo final.";
  }

  if (tool.slug === "pdf-a-jpg") {
    await exportPdfPagesAsImages(files[0], options.selectedPages, options.imageFormat);
    return `Imagenes ${options.imageFormat.toUpperCase()} exportadas.`;
  }

  if (["word-a-pdf", "powerpoint-a-pdf", "excel-a-pdf"].includes(tool.slug)) {
    return "Esta conversion necesita backend especializado para producir un resultado fiable.";
  }

  if (tool.slug === "unir-pdf") {
    const output = await PDFDocument.create();
    for (const file of files) {
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const pages = await output.copyPages(source, source.getPageIndices());
      pages.forEach((page) => output.addPage(page));
    }
    downloadBytes(await output.save(), "pdf-unido.pdf", "application/pdf");
    return "PDF unido y descargado.";
  }

  if (tool.slug === "dividir-pdf") {
    const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
    const clickedPages = options.selectedPages.map((id) => Number(id.split("-")[1])).filter((index) => Number.isFinite(index));
    const selectedIndices =
      clickedPages.length > 0
        ? clickedPages
        : options.splitMode === "range"
          ? parsePageSelection(options.pageRange, source.getPageCount())
          : source.getPageIndices();
    if (selectedIndices.length === 1) {
      const output = await PDFDocument.create();
      const copied = await output.copyPages(source, selectedIndices);
      copied.forEach((page) => output.addPage(page));
      downloadBytes(await output.save(), `pagina-${selectedIndices[0] + 1}.pdf`, "application/pdf");
      return "Pagina seleccionada descargada.";
    }
    await downloadSplitPagesZip(source, selectedIndices);
    return "Paginas seleccionadas descargadas en ZIP.";
  }

  const source = await PDFDocument.load(await files[0].arrayBuffer(), { ignoreEncryption: true });
  const font = await source.embedFont(StandardFonts.HelveticaBold);
  const pages = source.getPages();

  if (tool.slug === "comprimir-pdf") {
    return compressPdfAsRaster(files[0], options.compressionLevel);
  }

  if (tool.slug === "rotar-pdf") {
    const hasIndividualRotations = Object.keys(options.pageRotations).length > 0;
    pages.forEach((page, index) => {
      const id = `0-${index}`;
      const selected = options.selectedPages.includes(id);
      const individualRotation = options.pageRotations[id] ?? 0;
      if (options.rotateScope === "all" && !hasIndividualRotations) page.setRotation(degrees(options.rotation));
      if (options.rotateScope === "selected" && selected) page.setRotation(degrees(options.rotation));
      if (individualRotation) page.setRotation(degrees(individualRotation));
    });
  }

  if (tool.slug === "marca-de-agua") {
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(options.watermarkText, {
        x: width * 0.22,
        y: height * 0.5,
        size: 46,
        font,
        color: rgb(0.85, 0.1, 0.1),
        opacity: 0.22,
        rotate: degrees(-30)
      });
    });
  }

  if (tool.slug === "firmar-pdf") {
    if (options.signatureMode === "certificate") {
      return "Certificado seleccionado visualmente. La firma criptografica real necesita backend seguro para no exponer claves privadas.";
    }
    const signatureBytes = await fetch(options.signatureDataUrl).then((response) => response.arrayBuffer());
    const signatureImage = await source.embedPng(signatureBytes);
    const selectedId = options.selectedPages[0];
    const selectedPageIndex = selectedId ? Number(selectedId.split("-")[1]) : pages.length - 1;
    const page = pages[Math.min(Math.max(selectedPageIndex, 0), pages.length - 1)];
    const { width, height } = page.getSize();
    const signatureWidth = Math.min(220, width - 112);
    const signatureHeight = 76;
    page.drawImage(signatureImage, {
      x: Math.min(Math.max(options.signaturePlacement.xPct * width - signatureWidth / 2, 16), width - signatureWidth - 16),
      y: Math.min(Math.max(height - options.signaturePlacement.yPct * height - signatureHeight / 2, 16), height - signatureHeight - 16),
      width: signatureWidth,
      height: signatureHeight
    });
  }

  if (tool.slug === "numeracion-paginas") {
    pages.forEach((page, index) => {
      const { width } = page.getSize();
      page.drawText(`${index + 1} / ${pages.length}`, {
        x: width / 2 - 18,
        y: 24,
        size: 11,
        font,
        color: rgb(0.2, 0.2, 0.2)
      });
    });
  }

  if (tool.slug === "recortar-pdf") {
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.setCropBox(24, 24, width - 48, height - 48);
    });
  }

  if (tool.slug === "ordenar-pdf") {
    const output = await PDFDocument.create();
    const indices =
      options.pageOrder.length > 0
        ? options.pageOrder.map((id) => Number(id.split("-")[1])).filter((index) => Number.isFinite(index))
        : source.getPageIndices();
    const copiedPages = await output.copyPages(source, indices);
    copiedPages.forEach((page) => output.addPage(page));
    downloadBytes(await output.save(), "pdf-reordenado.pdf", "application/pdf");
    return "PDF reordenado y descargado.";
  }

  if (tool.slug === "editar-pdf") {
    const pageIndex = Math.min(Math.max(options.editPage, 1), pages.length) - 1;
    const page = pages[pageIndex];
    const y = Math.max(24, page.getHeight() - options.editY);
    if (options.editMode === "text") {
      page.drawText(options.editText, {
        x: options.editX,
        y,
        size: 18,
        font,
        color: rgb(0.05, 0.2, 0.38)
      });
    } else {
      page.drawRectangle({
        x: options.editX,
        y: y - 18,
        width: 260,
        height: 38,
        color: options.editMode === "redact" ? rgb(0, 0, 0) : rgb(1, 0.92, 0.25),
        opacity: options.editMode === "redact" ? 1 : 0.55
      });
    }
  }

  if (tool.slug === "censurar-pdf") {
    pages[0].drawRectangle({
      x: 48,
      y: 48,
      width: 220,
      height: 42,
      color: tool.slug === "censurar-pdf" ? rgb(0, 0, 0) : rgb(1, 0.95, 0.7),
      opacity: tool.slug === "censurar-pdf" ? 1 : 0.8
    });
  }

  const filenameByTool: Record<string, string> = {
    "rotar-pdf": "pdf-rotado.pdf",
    "marca-de-agua": "pdf-marca-agua.pdf",
    "firmar-pdf": "pdf-firmado.pdf",
    "numeracion-paginas": "pdf-numerado.pdf",
    "recortar-pdf": "pdf-recortado.pdf",
    "editar-pdf": "pdf-editado.pdf",
    "censurar-pdf": "pdf-censurado.pdf",
    "comprimir-pdf": "pdf-comprimido.pdf",
    "reparar-pdf": "pdf-reparado.pdf",
    "pdf-a-pdfa": "pdf-archivado.pdf"
  };
  downloadBytes(await source.save({ useObjectStreams: true }), filenameByTool[tool.slug] ?? "resultado.pdf", "application/pdf");
  return "Archivo procesado y descargado.";
}

function parsePageSelection(value: string, pageCount: number) {
  const selected = new Set<number>();
  value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      if (part.includes("-")) {
        const [startRaw, endRaw] = part.split("-");
        const start = Math.max(1, Number(startRaw));
        const end = Math.min(pageCount, Number(endRaw));
        for (let page = start; page <= end; page += 1) selected.add(page - 1);
      } else {
        const page = Number(part);
        if (page >= 1 && page <= pageCount) selected.add(page - 1);
      }
    });

  return selected.size > 0 ? Array.from(selected).sort((a, b) => a - b) : [0];
}

function downloadBytes(bytes: Uint8Array, filename: string, type: string) {
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
  const blob = new Blob([buffer], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function exportPdfPagesAsImages(file: File, selectedPages: string[], format: "jpg" | "png" | "webp") {
  const pdfjs = await loadPdfJs();
  const JSZip = (await import("jszip")).default;
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pageIndexes =
    selectedPages.length > 0
      ? selectedPages.map((id) => Number(id.split("-")[1])).filter((index) => Number.isFinite(index))
      : Array.from({ length: pdf.numPages }, (_, index) => index);
  const mime = format === "jpg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
  const zip = new JSZip();

  for (const pageIndex of pageIndexes) {
    const page = await pdf.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await canvasToBlob(canvas, mime, format === "jpg" ? 0.9 : 0.92);
    if (pageIndexes.length === 1) {
      downloadBlob(blob, `pagina-${pageIndex + 1}.${format}`);
      return;
    }
    zip.file(`pagina-${pageIndex + 1}.${format}`, blob);
  }

  downloadBytes(await zip.generateAsync({ type: "uint8array" }), `pdf-imagenes-${format}.zip`, "application/zip");
}

async function downloadSplitPagesZip(source: any, selectedIndices: number[]) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (const pageIndex of selectedIndices) {
    const output = await (await import("pdf-lib")).PDFDocument.create();
    const [copied] = await output.copyPages(source, [pageIndex]);
    output.addPage(copied);
    zip.file(`pagina-${pageIndex + 1}.pdf`, await output.save());
  }

  downloadBytes(await zip.generateAsync({ type: "uint8array" }), "paginas-seleccionadas.zip", "application/zip");
}

async function createVisualWordFromPdf(file: File) {
  const pages = await renderPdfPagesToImages(file, 1.45, "image/png", 0.92);
  const { Document, ImageRun, Packer, Paragraph } = await import("docx");
  const preparedPages = await Promise.all(
    pages.map(async (page) => ({
      data: new Uint8Array(await page.blob.arrayBuffer()),
      size: fitImage(page.width, page.height, 620, 860)
    }))
  );
  const doc = new Document({
    sections: [
      {
        children: preparedPages.flatMap((page, index) => [
          new Paragraph({
            children: [
              new ImageRun({
                type: "png",
                data: page.data,
                transformation: page.size
              })
            ]
          }),
          ...(index < preparedPages.length - 1 ? [new Paragraph({ text: "" })] : [])
        ])
      }
    ]
  });
  downloadBlob(await Packer.toBlob(doc), "pdf-a-word.docx");
}

function fitImage(width: number, height: number, maxWidth: number, maxHeight: number) {
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
}

async function imageFileToPngBytes(file: File) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("No se pudo leer esta imagen.");
  context.drawImage(bitmap, 0, 0);
  const blob = await canvasToBlob(canvas, "image/png", 0.92);
  return blob.arrayBuffer();
}

async function createPdfFromUrl(url: string) {
  const response = await fetch("/api/url-to-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
  if (!response.ok) throw new Error(await response.text());
  downloadBlob(await response.blob(), "url-a-pdf.pdf");
}

async function createPowerPointFromPdf(file: File) {
  const pages = await renderPdfPagesToImages(file, 1.35, "image/jpeg", 0.86);
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const slideWidth = 9144000;
  const slideHeight = 6858000;

  zip.file("[Content_Types].xml", pptContentTypes(pages.length));
  zip.file("_rels/.rels", relsXml([{ id: "rId1", type: officeRel("officeDocument"), target: "ppt/presentation.xml" }]));
  zip.file("ppt/presentation.xml", presentationXml(pages.length, slideWidth, slideHeight));
  zip.file("ppt/_rels/presentation.xml.rels", presentationRelsXml(pages.length));

  pages.forEach((page, index) => {
    zip.file(`ppt/slides/slide${index + 1}.xml`, slideXml(index + 1, slideWidth, slideHeight));
    zip.file(
      `ppt/slides/_rels/slide${index + 1}.xml.rels`,
      relsXml([{ id: "rId1", type: officeRel("image"), target: `../media/image${index + 1}.jpg` }])
    );
    zip.file(`ppt/media/image${index + 1}.jpg`, page.blob);
  });

  downloadBytes(await zip.generateAsync({ type: "uint8array" }), "pdf-a-powerpoint.pptx", "application/vnd.openxmlformats-officedocument.presentationml.presentation");
}

async function createExcelFromPdfText(text: string) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  const rows = textToRows(text);

  zip.file("[Content_Types].xml", xlsxContentTypes());
  zip.file("_rels/.rels", relsXml([{ id: "rId1", type: officeRel("officeDocument"), target: "xl/workbook.xml" }]));
  zip.file("xl/workbook.xml", workbookXml());
  zip.file("xl/_rels/workbook.xml.rels", relsXml([{ id: "rId1", type: officeRel("worksheet"), target: "worksheets/sheet1.xml" }]));
  zip.file("xl/worksheets/sheet1.xml", worksheetXml(rows));

  downloadBytes(await zip.generateAsync({ type: "uint8array" }), "pdf-a-excel.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
}

async function renderPdfPagesToImages(file: File, scale: number, mime: string, quality: number) {
  const pdfjs = await loadPdfJs();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: Array<{ blob: Blob; width: number; height: number }> = [];

  for (let pageIndex = 0; pageIndex < pdf.numPages; pageIndex += 1) {
    const page = await pdf.getPage(pageIndex + 1);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    pages.push({ blob: await canvasToBlob(canvas, mime, quality), width: canvas.width, height: canvas.height });
  }

  return pages;
}

function textToRows(text: string) {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const source = lines.length > 0 ? lines : ["No se ha encontrado texto seleccionable en este PDF."];
  return source.map((line) => line.split(/\s{2,}|\t/).map((cell) => cell.trim()).filter(Boolean));
}

function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function officeRel(type: string) {
  return `http://schemas.openxmlformats.org/officeDocument/2006/relationships/${type}`;
}

function relsXml(items: Array<{ id: string; type: string; target: string }>) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${items
    .map((item) => `<Relationship Id="${item.id}" Type="${item.type}" Target="${xmlEscape(item.target)}"/>`)
    .join("")}</Relationships>`;
}

function xlsxContentTypes() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;
}

function workbookXml() {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="PDF" sheetId="1" r:id="rId1"/></sheets></workbook>`;
}

function worksheetXml(rows: string[][]) {
  const body = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, columnIndex) => `<c r="${columnName(columnIndex)}${rowIndex + 1}" t="inlineStr"><is><t>${xmlEscape(cell)}</t></is></c>`)
        .join("");
      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${body}</sheetData></worksheet>`;
}

function columnName(index: number) {
  let name = "";
  let value = index + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    value = Math.floor((value - 1) / 26);
  }
  return name;
}

function pptContentTypes(slideCount: number) {
  const slides = Array.from(
    { length: slideCount },
    (_, index) => `<Override PartName="/ppt/slides/slide${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
  ).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>${slides}</Types>`;
}

function presentationXml(slideCount: number, width: number, height: number) {
  const slideIds = Array.from({ length: slideCount }, (_, index) => `<p:sldId id="${256 + index}" r:id="rId${index + 1}"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldIdLst>${slideIds}</p:sldIdLst><p:sldSz cx="${width}" cy="${height}" type="screen4x3"/><p:notesSz cx="${width}" cy="${height}"/></p:presentation>`;
}

function presentationRelsXml(slideCount: number) {
  return relsXml(
    Array.from({ length: slideCount }, (_, index) => ({
      id: `rId${index + 1}`,
      type: officeRel("slide"),
      target: `slides/slide${index + 1}.xml`
    }))
  );
}

function slideXml(pageNumber: number, width: number, height: number) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/><a:chOff x="0" y="0"/><a:chExt cx="${width}" cy="${height}"/></a:xfrm></p:grpSpPr><p:pic><p:nvPicPr><p:cNvPr id="2" name="Pagina ${pageNumber}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${width}" cy="${height}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

async function compressPdfAsRaster(file: File, level: string) {
  const pdfjs = await loadPdfJs();
  const { PDFDocument } = await import("pdf-lib");
  const sourceBytes = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(sourceBytes.slice(0)) }).promise;
  const originalSize = file.size;
  const lossless = await PDFDocument.load(sourceBytes.slice(0), { ignoreEncryption: true }).then((doc) => doc.save({ useObjectStreams: true }));
  const candidates: Array<{ label: string; bytes: Uint8Array }> = [{ label: "optimizacion interna", bytes: lossless }];
  const settingsByLevel: Record<string, Array<{ label: string; scale: number; quality: number }>> = {
    extreme: [
      { label: "extrema", scale: 0.8, quality: 0.34 },
      { label: "muy alta", scale: 0.62, quality: 0.26 },
      { label: "maxima", scale: 0.48, quality: 0.2 },
      { label: "minima", scale: 0.34, quality: 0.16 }
    ],
    recommended: [
      { label: "recomendada", scale: 1, quality: 0.5 },
      { label: "alta", scale: 0.82, quality: 0.38 },
      { label: "muy alta", scale: 0.62, quality: 0.28 }
    ],
    low: [
      { label: "suave", scale: 1.25, quality: 0.68 },
      { label: "media", scale: 1, quality: 0.52 },
      { label: "alta", scale: 0.78, quality: 0.38 }
    ]
  };

  for (const settings of settingsByLevel[level] ?? settingsByLevel.recommended) {
    candidates.push({
      label: settings.label,
      bytes: await createRasterizedPdf(pdf, settings.scale, settings.quality)
    });
  }

  const smallerCandidates = candidates
    .filter((candidate) => candidate.bytes.byteLength < originalSize)
    .sort((a, b) => a.bytes.byteLength - b.bytes.byteLength);

  if (smallerCandidates.length === 0) {
    return "No se descargo nada: este PDF ya esta muy optimizado y las pruebas generaban archivos mas pesados.";
  }

  const best = smallerCandidates[0];
  const savedPercent = Math.max(1, Math.round((1 - best.bytes.byteLength / originalSize) * 100));
  downloadBytes(best.bytes, "pdf-comprimido.pdf", "application/pdf");
  return `PDF comprimido y descargado. Pesa ${savedPercent}% menos con compresion ${best.label}.`;
}

async function createRasterizedPdf(pdf: { numPages: number; getPage: (pageNumber: number) => Promise<any> }, scale: number, quality: number) {
  const { PDFDocument } = await import("pdf-lib");
  const output = await PDFDocument.create();

  for (let index = 0; index < pdf.numPages; index += 1) {
    const page = await pdf.getPage(index + 1);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) continue;
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await canvasToBlob(canvas, "image/jpeg", quality);
    const jpg = await output.embedJpg(await blob.arrayBuffer());
    const pdfPage = output.addPage([jpg.width, jpg.height]);
    pdfPage.drawImage(jpg, { x: 0, y: 0, width: jpg.width, height: jpg.height });
  }

  return output.save({ useObjectStreams: true });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas export failed"));
    }, type, quality);
  });
}

async function extractPdfText(file: File) {
  const pdfjs = await loadPdfJs();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data: bytes }).promise;
  const lines: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .filter(Boolean)
      .join(" ");
    lines.push(pageText);
  }

  return lines.join("\n\n");
}

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();
  return pdfjs;
}
