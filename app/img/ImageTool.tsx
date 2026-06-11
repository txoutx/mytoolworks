"use client";

import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileImage,
  FlipHorizontal2,
  FlipVertical2,
  Move,
  RotateCcw,
  RotateCw,
  UploadCloud,
  X
} from "lucide-react";

type ExportFormat = "jpeg" | "png" | "webp" | "avif";
type DragMode = "move-image" | "scale-image" | "rotate-image" | "move-watermark" | null;

type ImageInfo = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
};

type PointerPoint = {
  x: number;
  y: number;
};

const percentOptions = [25, 50, 75, 100, 150, 200];
const ratioOptions = [
  { label: "Libre", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "4:3", value: "4:3" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" }
];

export function ImageTool() {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const objectUrlRef = useRef("");
  const dragRef = useRef<{
    mode: DragMode;
    start: PointerPoint;
    imageX: number;
    imageY: number;
    imageScale: number;
    imageRotation: number;
    watermarkX: number;
    watermarkY: number;
    startDistance: number;
    startAngle: number;
  } | null>(null);

  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [format, setFormat] = useState<ExportFormat>("webp");
  const [quality, setQuality] = useState(82);
  const [imageX, setImageX] = useState(0);
  const [imageY, setImageY] = useState(0);
  const [imageScale, setImageScale] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkSize, setWatermarkSize] = useState(34);
  const [watermarkOpacity, setWatermarkOpacity] = useState(35);
  const [watermarkX, setWatermarkX] = useState(0);
  const [watermarkY, setWatermarkY] = useState(0);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    renderPreview();
  }, [
    canvasWidth,
    canvasHeight,
    format,
    quality,
    imageX,
    imageY,
    imageScale,
    imageRotation,
    flipX,
    flipY,
    watermarkText,
    watermarkSize,
    watermarkOpacity,
    watermarkX,
    watermarkY
  ]);

  function loadImage(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Sube una imagen valida.");
      return;
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    const image = new Image();
    image.onload = () => {
      imageRef.current = image;
      const info = {
        name: file.name,
        type: file.type || file.name.split(".").pop()?.toUpperCase() || "Imagen",
        size: file.size,
        width: image.naturalWidth,
        height: image.naturalHeight
      };
      setImageInfo(info);
      setCanvasWidth(image.naturalWidth);
      setCanvasHeight(image.naturalHeight);
      setImageX(image.naturalWidth / 2);
      setImageY(image.naturalHeight / 2);
      setImageScale(100);
      setImageRotation(0);
      setFlipX(false);
      setFlipY(false);
      setWatermarkX(image.naturalWidth - 28);
      setWatermarkY(image.naturalHeight - 28);
      setMessage("");
    };
    image.onerror = () => setMessage("El navegador no pudo leer esta imagen.");
    image.src = url;
  }

  function setCanvasSize(nextWidth: number, nextHeight: number) {
    const safeWidth = Math.max(1, Math.round(nextWidth || 1));
    const safeHeight = Math.max(1, Math.round(nextHeight || 1));
    const scaleX = canvasWidth > 0 ? safeWidth / canvasWidth : 1;
    const scaleY = canvasHeight > 0 ? safeHeight / canvasHeight : 1;
    setCanvasWidth(safeWidth);
    setCanvasHeight(safeHeight);
    setImageX((current) => current * scaleX);
    setImageY((current) => current * scaleY);
    setWatermarkX((current) => current * scaleX);
    setWatermarkY((current) => current * scaleY);
  }

  function applyCanvasPercent(percent: number) {
    if (!imageInfo) return;
    setCanvasSize((imageInfo.width * percent) / 100, (imageInfo.height * percent) / 100);
  }

  function applyCanvasRatio(value: string) {
    if (!imageInfo || value === "free") return;
    const [rw, rh] = value.split(":").map(Number);
    const ratio = rw / rh;
    const base = Math.max(canvasWidth || imageInfo.width, 1);
    setCanvasSize(base, Math.round(base / ratio));
  }

  function resetImageLayer() {
    if (!imageInfo) return;
    setImageX(canvasWidth / 2);
    setImageY(canvasHeight / 2);
    setImageScale(Math.min((canvasWidth / imageInfo.width) * 100, (canvasHeight / imageInfo.height) * 100, 100));
    setImageRotation(0);
    setFlipX(false);
    setFlipY(false);
  }

  function renderPreview() {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current || !imageInfo || canvasWidth <= 0 || canvasHeight <= 0) return;
    renderToCanvas(canvas, true);
    estimateSize();
  }

  function renderToCanvas(canvas: HTMLCanvasElement, includeControls: boolean) {
    const image = imageRef.current;
    if (!image || !imageInfo) return;
    canvas.width = Math.round(canvasWidth);
    canvas.height = Math.round(canvasHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.translate(imageX, imageY);
    ctx.rotate((imageRotation * Math.PI) / 180);
    ctx.scale((flipX ? -1 : 1) * (imageScale / 100), (flipY ? -1 : 1) * (imageScale / 100));
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, -imageInfo.width / 2, -imageInfo.height / 2);
    ctx.restore();

    drawWatermark(ctx);
    if (includeControls) drawControls(ctx);
  }

  function drawWatermark(ctx: CanvasRenderingContext2D) {
    const text = watermarkText.trim();
    if (!text) return;
    ctx.save();
    ctx.globalAlpha = watermarkOpacity / 100;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = Math.max(2, Math.round(watermarkSize / 12));
    ctx.font = `700 ${watermarkSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeText(text, watermarkX, watermarkY);
    ctx.fillText(text, watermarkX, watermarkY);
    ctx.restore();
  }

  function drawControls(ctx: CanvasRenderingContext2D) {
    if (!imageInfo) return;
    const box = getImageControlPoints();
    ctx.save();
    ctx.strokeStyle = "#0f766e";
    ctx.lineWidth = Math.max(2, canvasWidth / 360);
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.moveTo(box.corners[0].x, box.corners[0].y);
    box.corners.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);
    drawHandle(ctx, box.scaleHandle.x, box.scaleHandle.y, "#0f766e");
    drawHandle(ctx, box.rotateHandle.x, box.rotateHandle.y, "#f36b4f");
    ctx.beginPath();
    ctx.moveTo(box.topCenter.x, box.topCenter.y);
    ctx.lineTo(box.rotateHandle.x, box.rotateHandle.y);
    ctx.stroke();

    if (watermarkText.trim()) {
      drawHandle(ctx, watermarkX, watermarkY, "#4d7fb2");
    }
    ctx.restore();
  }

  function drawHandle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
    const size = Math.max(10, Math.min(canvasWidth, canvasHeight) / 45);
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - size / 2, y - size / 2, size, size, 4);
    ctx.fill();
    ctx.stroke();
  }

  function getImageControlPoints() {
    const info = imageInfo ?? { width: 1, height: 1 };
    const scale = imageScale / 100;
    const halfW = (info.width * scale) / 2;
    const halfH = (info.height * scale) / 2;
    const angle = (imageRotation * Math.PI) / 180;
    const corners = [
      rotatePoint(-halfW, -halfH, angle),
      rotatePoint(halfW, -halfH, angle),
      rotatePoint(halfW, halfH, angle),
      rotatePoint(-halfW, halfH, angle)
    ].map((point) => ({ x: point.x + imageX, y: point.y + imageY }));
    const topCenterLocal = rotatePoint(0, -halfH, angle);
    const rotateHandleLocal = rotatePoint(0, -halfH - 42, angle);
    return {
      corners,
      topCenter: { x: topCenterLocal.x + imageX, y: topCenterLocal.y + imageY },
      scaleHandle: corners[2],
      rotateHandle: { x: rotateHandleLocal.x + imageX, y: rotateHandleLocal.y + imageY }
    };
  }

  function estimateSize() {
    if (!imageRef.current || !imageInfo || canvasWidth <= 0 || canvasHeight <= 0) return;
    const output = document.createElement("canvas");
    renderToCanvas(output, false);
    output.toBlob((blob) => {
      setResultSize(blob?.size ?? null);
    }, mimeForFormat(format), quality / 100);
  }

  function downloadImage() {
    if (!imageInfo) {
      setMessage("Primero sube una imagen.");
      return;
    }
    const output = document.createElement("canvas");
    renderToCanvas(output, false);
    output.toBlob((blob) => {
      if (!blob) {
        setMessage(`${format.toUpperCase()} no esta soportado por este navegador.`);
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mytoolworks-imagen.${extensionForFormat(format)}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setResultSize(blob.size);
      setMessage("Imagen descargada.");
    }, mimeForFormat(format), quality / 100);
  }

  function pointerFromEvent(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function onCanvasPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!imageInfo) return;
    const point = pointerFromEvent(event);
    const mode = hitTest(point);
    if (!mode) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      mode,
      start: point,
      imageX,
      imageY,
      imageScale,
      imageRotation,
      watermarkX,
      watermarkY,
      startDistance: distance(point, { x: imageX, y: imageY }),
      startAngle: angleBetween({ x: imageX, y: imageY }, point)
    };
  }

  function onCanvasPointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const point = pointerFromEvent(event);
    const dx = point.x - drag.start.x;
    const dy = point.y - drag.start.y;

    if (drag.mode === "move-image") {
      setImageX(drag.imageX + dx);
      setImageY(drag.imageY + dy);
    }
    if (drag.mode === "scale-image") {
      const nextDistance = distance(point, { x: drag.imageX, y: drag.imageY });
      const ratio = drag.startDistance > 0 ? nextDistance / drag.startDistance : 1;
      setImageScale(Math.max(5, Math.min(600, drag.imageScale * ratio)));
    }
    if (drag.mode === "rotate-image") {
      const nextAngle = angleBetween({ x: drag.imageX, y: drag.imageY }, point);
      setImageRotation(normalizeRotation(drag.imageRotation + ((nextAngle - drag.startAngle) * 180) / Math.PI));
    }
    if (drag.mode === "move-watermark") {
      setWatermarkX(clamp(drag.watermarkX + dx, 0, canvasWidth));
      setWatermarkY(clamp(drag.watermarkY + dy, 0, canvasHeight));
    }
  }

  function onCanvasPointerUp(event: React.PointerEvent<HTMLCanvasElement>) {
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function hitTest(point: PointerPoint): DragMode {
    const controls = getImageControlPoints();
    if (distance(point, controls.rotateHandle) < 24) return "rotate-image";
    if (distance(point, controls.scaleHandle) < 24) return "scale-image";
    if (watermarkText.trim() && distance(point, { x: watermarkX, y: watermarkY }) < Math.max(28, watermarkSize)) {
      return "move-watermark";
    }
    return pointInImage(point) ? "move-image" : null;
  }

  function pointInImage(point: PointerPoint) {
    if (!imageInfo) return false;
    const scale = imageScale / 100;
    const angle = (-imageRotation * Math.PI) / 180;
    const local = rotatePoint(point.x - imageX, point.y - imageY, angle);
    return Math.abs(local.x) <= (imageInfo.width * scale) / 2 && Math.abs(local.y) <= (imageInfo.height * scale) / 2;
  }

  return (
    <div className="image-tool-shell">
      <section className="tool-workspace image-upload-panel">
        <h2>Editor de imagen</h2>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/*"
          onChange={(event) => loadImage(event.target.files)}
        />
        <button className="dropzone" type="button" onClick={() => inputRef.current?.click()}>
          <div>
            <UploadCloud size={36} aria-hidden="true" />
            <strong>{imageInfo ? "Cambiar imagen" : "Seleccionar imagen"}</strong>
            <span>JPG, PNG, WebP o AVIF si tu navegador lo soporta.</span>
          </div>
        </button>
        {imageInfo && (
          <div className="file-list">
            <div className="file-row">
              <FileImage size={18} aria-hidden="true" />
              <span>{imageInfo.name}</span>
              <small>{formatFileSize(imageInfo.size)}</small>
              <button type="button" aria-label="Quitar imagen" onClick={() => window.location.reload()}>
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="image-meta-grid">
              <span>{imageInfo.type || "Imagen"}</span>
              <span>{imageInfo.width} x {imageInfo.height}px</span>
              <span>Lienzo: {canvasWidth} x {canvasHeight}px</span>
              {resultSize !== null && <span>Resultado: {formatFileSize(resultSize)}</span>}
            </div>
          </div>
        )}
        {message && <div className={message.includes("descargada") ? "tool-status done" : "tool-status error"}>{message}</div>}
      </section>

      <section className="tool-workspace image-settings-panel">
        <h2>Ajustes</h2>
        <div className="image-settings-grid">
          <div className="tool-options">
            <h3>Lienzo</h3>
            <div className="field-row">
              <NumberField label="Ancho lienzo" value={canvasWidth} onChange={(value) => setCanvasSize(value, canvasHeight)} />
              <NumberField label="Alto lienzo" value={canvasHeight} onChange={(value) => setCanvasSize(canvasWidth, value)} />
            </div>
            <div className="segmented-wrap">
              {percentOptions.map((percent) => (
                <button type="button" className="small-action" onClick={() => applyCanvasPercent(percent)} key={percent}>
                  {percent}%
                </button>
              ))}
            </div>
            <div className="segmented-wrap">
              {ratioOptions.map((option) => (
                <button type="button" className="small-action" onClick={() => applyCanvasRatio(option.value)} key={option.value}>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="tool-options">
            <h3>Imagen</h3>
            <div className="field">
              <label htmlFor="image-scale">Escala {Math.round(imageScale)}%</label>
              <input id="image-scale" type="range" min="5" max="600" value={imageScale} onChange={(event) => setImageScale(Number(event.target.value))} />
            </div>
            <div className="field">
              <label htmlFor="image-rotation">Rotacion {Math.round(imageRotation)} grados</label>
              <input id="image-rotation" type="range" min="0" max="359" value={imageRotation} onChange={(event) => setImageRotation(Number(event.target.value))} />
            </div>
            <div className="segmented-wrap">
              <button type="button" className="small-action" onClick={() => setImageRotation((current) => normalizeRotation(current - 90))}>
                <RotateCcw size={16} /> Izquierda
              </button>
              <button type="button" className="small-action" onClick={() => setImageRotation((current) => normalizeRotation(current + 90))}>
                <RotateCw size={16} /> Derecha
              </button>
              <button type="button" className="small-action" onClick={() => setFlipX((current) => !current)}>
                <FlipHorizontal2 size={16} /> Horizontal
              </button>
              <button type="button" className="small-action" onClick={() => setFlipY((current) => !current)}>
                <FlipVertical2 size={16} /> Vertical
              </button>
              <button type="button" className="small-action" onClick={resetImageLayer}>
                <Move size={16} /> Ajustar
              </button>
            </div>
          </div>

          <div className="tool-options">
            <h3>Convertir y comprimir</h3>
            <div className="field">
              <label htmlFor="image-format">Formato</label>
              <select id="image-format" value={format} onChange={(event) => setFormat(event.target.value as ExportFormat)}>
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="quality">Calidad {quality}%</label>
              <input id="quality" type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </div>
            <p className="option-note">La calidad afecta a JPG, WebP y AVIF cuando el navegador lo soporta.</p>
          </div>

          <div className="tool-options">
            <h3>Marca de agua</h3>
            <div className="field">
              <label htmlFor="watermark">Texto</label>
              <input id="watermark" value={watermarkText} onChange={(event) => setWatermarkText(event.target.value)} />
            </div>
            <div className="field-row">
              <NumberField label="Tamano" value={watermarkSize} onChange={setWatermarkSize} />
              <NumberField label="Opacidad" value={watermarkOpacity} onChange={(value) => setWatermarkOpacity(clamp(value, 0, 100))} />
            </div>
            <p className="option-note">Arrastra la marca de agua en el visor para colocarla.</p>
          </div>
        </div>
      </section>

      <section className="tool-workspace image-preview-panel">
        <div className="preview-top">
          <span className="preview-title">Visor editable</span>
          {resultSize !== null && <span className="status-pill">{formatFileSize(resultSize)}</span>}
        </div>
        <div className="image-preview-canvas-wrap">
          {imageInfo ? (
            <canvas
              ref={canvasRef}
              onPointerDown={onCanvasPointerDown}
              onPointerMove={onCanvasPointerMove}
              onPointerUp={onCanvasPointerUp}
              onPointerCancel={onCanvasPointerUp}
            />
          ) : (
            <div className="preview-loading">Sube una imagen para empezar</div>
          )}
        </div>
        <p className="option-note image-editor-note">Arrastra la imagen para moverla. Usa el tirador verde para escalar y el naranja para rotar.</p>
        <button className="button process-button" type="button" disabled={!imageInfo} onClick={downloadImage}>
          <Download size={18} aria-hidden="true" />
          Descargar imagen
        </button>
      </section>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} type="number" value={Number.isFinite(value) ? Math.round(value) : 0} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function mimeForFormat(format: ExportFormat) {
  if (format === "jpeg") return "image/jpeg";
  if (format === "png") return "image/png";
  if (format === "avif") return "image/avif";
  return "image/webp";
}

function extensionForFormat(format: ExportFormat) {
  return format === "jpeg" ? "jpg" : format;
}

function normalizeRotation(value: number) {
  return ((value % 360) + 360) % 360;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function rotatePoint(x: number, y: number, angle: number) {
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  };
}

function distance(a: PointerPoint, b: PointerPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleBetween(center: PointerPoint, point: PointerPoint) {
  return Math.atan2(point.y - center.y, point.x - center.x);
}
