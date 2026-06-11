"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileImage, FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw, UploadCloud, X } from "lucide-react";

type ExportFormat = "jpeg" | "png" | "webp";
type WatermarkPosition = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

type ImageInfo = {
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
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
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<ExportFormat>("webp");
  const [quality, setQuality] = useState(82);
  const [rotation, setRotation] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(0);
  const [cropH, setCropH] = useState(0);
  const [watermarkText, setWatermarkText] = useState("");
  const [watermarkSize, setWatermarkSize] = useState(34);
  const [watermarkOpacity, setWatermarkOpacity] = useState(35);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>("bottom-right");
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    renderPreview();
  }, [width, height, format, quality, rotation, flipX, flipY, cropX, cropY, cropW, cropH, watermarkText, watermarkSize, watermarkOpacity, watermarkPosition]);

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
      const nextInfo = {
        name: file.name,
        type: file.type || file.name.split(".").pop()?.toUpperCase() || "Imagen",
        size: file.size,
        width: image.naturalWidth,
        height: image.naturalHeight
      };
      setImageInfo(nextInfo);
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
      setCropX(0);
      setCropY(0);
      setCropW(image.naturalWidth);
      setCropH(image.naturalHeight);
      setRotation(0);
      setFlipX(false);
      setFlipY(false);
      setMessage("");
    };
    image.onerror = () => setMessage("El navegador no pudo leer esta imagen.");
    image.src = url;
  }

  function updateWidth(nextWidth: number) {
    const safeWidth = Math.max(1, Math.round(nextWidth || 1));
    setWidth(safeWidth);
    if (keepRatio && imageInfo) setHeight(Math.max(1, Math.round((safeWidth * imageInfo.height) / imageInfo.width)));
  }

  function updateHeight(nextHeight: number) {
    const safeHeight = Math.max(1, Math.round(nextHeight || 1));
    setHeight(safeHeight);
    if (keepRatio && imageInfo) setWidth(Math.max(1, Math.round((safeHeight * imageInfo.width) / imageInfo.height)));
  }

  function applyPercent(percent: number) {
    if (!imageInfo) return;
    setWidth(Math.max(1, Math.round((imageInfo.width * percent) / 100)));
    setHeight(Math.max(1, Math.round((imageInfo.height * percent) / 100)));
  }

  function applyRatio(value: string) {
    if (!imageInfo || value === "free") return;
    const [rw, rh] = value.split(":").map(Number);
    const ratio = rw / rh;
    let nextW = cropW || imageInfo.width;
    let nextH = Math.round(nextW / ratio);
    if (nextH > imageInfo.height) {
      nextH = imageInfo.height;
      nextW = Math.round(nextH * ratio);
    }
    setCropW(Math.max(1, nextW));
    setCropH(Math.max(1, nextH));
    setCropX(Math.max(0, Math.round((imageInfo.width - nextW) / 2)));
    setCropY(Math.max(0, Math.round((imageInfo.height - nextH) / 2)));
  }

  function renderPreview() {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !imageInfo || width <= 0 || height <= 0) return;

    const source = normalizeCrop(imageInfo);
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = width;
    sourceCanvas.height = height;
    const sourceCtx = sourceCanvas.getContext("2d");
    if (!sourceCtx) return;
    sourceCtx.imageSmoothingQuality = "high";
    sourceCtx.drawImage(image, source.x, source.y, source.w, source.h, 0, 0, width, height);

    const quarterTurn = Math.abs(rotation % 180) === 90;
    canvas.width = quarterTurn ? height : width;
    canvas.height = quarterTurn ? width : height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.drawImage(sourceCanvas, -width / 2, -height / 2);
    ctx.restore();
    drawWatermark(ctx, canvas.width, canvas.height);
    estimateSize(canvas);
  }

  function normalizeCrop(info: ImageInfo) {
    const x = clamp(Math.round(cropX), 0, info.width - 1);
    const y = clamp(Math.round(cropY), 0, info.height - 1);
    const w = clamp(Math.round(cropW || info.width), 1, info.width - x);
    const h = clamp(Math.round(cropH || info.height), 1, info.height - y);
    return { x, y, w, h };
  }

  function drawWatermark(ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) {
    const text = watermarkText.trim();
    if (!text) return;
    const padding = Math.max(18, Math.round(watermarkSize * 0.6));
    ctx.save();
    ctx.globalAlpha = watermarkOpacity / 100;
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "rgba(0,0,0,0.45)";
    ctx.lineWidth = Math.max(2, Math.round(watermarkSize / 12));
    ctx.font = `700 ${watermarkSize}px Arial, sans-serif`;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const map = {
      center: [canvasWidth / 2 - textWidth / 2, canvasHeight / 2],
      "top-left": [padding, padding + watermarkSize],
      "top-right": [canvasWidth - textWidth - padding, padding + watermarkSize],
      "bottom-left": [padding, canvasHeight - padding],
      "bottom-right": [canvasWidth - textWidth - padding, canvasHeight - padding]
    } satisfies Record<WatermarkPosition, [number, number]>;
    const [x, y] = map[watermarkPosition];
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
    ctx.restore();
  }

  function estimateSize(canvas: HTMLCanvasElement) {
    canvas.toBlob((blob) => {
      setResultSize(blob?.size ?? null);
    }, mimeForFormat(format), quality / 100);
  }

  function downloadImage() {
    const canvas = canvasRef.current;
    if (!canvas || !imageInfo) {
      setMessage("Primero sube una imagen.");
      return;
    }
    canvas.toBlob((blob) => {
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
            <h3>Redimensionar</h3>
            <div className="field-row">
              <NumberField label="Ancho" value={width} onChange={updateWidth} />
              <NumberField label="Alto" value={height} onChange={updateHeight} />
            </div>
            <label>
              <input type="checkbox" checked={keepRatio} onChange={(event) => setKeepRatio(event.target.checked)} />
              Mantener proporcion
            </label>
            <div className="segmented-wrap">
              {percentOptions.map((percent) => (
                <button type="button" className="small-action" onClick={() => applyPercent(percent)} key={percent}>
                  {percent}%
                </button>
              ))}
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
              </select>
            </div>
            <div className="field">
              <label htmlFor="quality">Calidad {quality}%</label>
              <input id="quality" type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </div>
            <p className="option-note">La calidad afecta principalmente a JPG y WebP.</p>
          </div>

          <div className="tool-options">
            <h3>Rotar y voltear</h3>
            <div className="segmented-wrap">
              <button type="button" className="small-action" onClick={() => setRotation((current) => normalizeRotation(current - 90))}>
                <RotateCcw size={16} /> Izquierda
              </button>
              <button type="button" className="small-action" onClick={() => setRotation((current) => normalizeRotation(current + 90))}>
                <RotateCw size={16} /> Derecha
              </button>
              <button type="button" className="small-action" onClick={() => setFlipX((current) => !current)}>
                <FlipHorizontal2 size={16} /> Horizontal
              </button>
              <button type="button" className="small-action" onClick={() => setFlipY((current) => !current)}>
                <FlipVertical2 size={16} /> Vertical
              </button>
            </div>
          </div>

          <div className="tool-options">
            <h3>Recortar</h3>
            <div className="segmented-wrap">
              {ratioOptions.map((option) => (
                <button type="button" className="small-action" onClick={() => applyRatio(option.value)} key={option.value}>
                  {option.label}
                </button>
              ))}
            </div>
            <div className="field-row">
              <NumberField label="X" value={cropX} onChange={setCropX} />
              <NumberField label="Y" value={cropY} onChange={setCropY} />
              <NumberField label="Ancho crop" value={cropW} onChange={setCropW} />
              <NumberField label="Alto crop" value={cropH} onChange={setCropH} />
            </div>
          </div>

          <div className="tool-options">
            <h3>Marca de agua</h3>
            <div className="field">
              <label htmlFor="watermark">Texto</label>
              <input id="watermark" value={watermarkText} onChange={(event) => setWatermarkText(event.target.value)} />
            </div>
            <div className="field-row">
              <NumberField label="Tamano" value={watermarkSize} onChange={setWatermarkSize} />
              <NumberField label="Opacidad" value={watermarkOpacity} onChange={setWatermarkOpacity} />
            </div>
            <div className="field">
              <label htmlFor="watermark-position">Posicion</label>
              <select id="watermark-position" value={watermarkPosition} onChange={(event) => setWatermarkPosition(event.target.value as WatermarkPosition)}>
                <option value="center">Centro</option>
                <option value="top-left">Arriba izquierda</option>
                <option value="top-right">Arriba derecha</option>
                <option value="bottom-left">Abajo izquierda</option>
                <option value="bottom-right">Abajo derecha</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="tool-workspace image-preview-panel">
        <div className="preview-top">
          <span className="preview-title">Previsualizacion</span>
          {resultSize !== null && <span className="status-pill">{formatFileSize(resultSize)}</span>}
        </div>
        <div className="image-preview-canvas-wrap">
          {imageInfo ? <canvas ref={canvasRef} /> : <div className="preview-loading">Sube una imagen para empezar</div>}
        </div>
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
      <input id={id} type="number" value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.target.value))} />
    </div>
  );
}

function mimeForFormat(format: ExportFormat) {
  if (format === "jpeg") return "image/jpeg";
  if (format === "png") return "image/png";
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
