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
import type { Locale } from "../../lib/i18n";

type ExportFormat = "jpeg" | "png" | "webp" | "avif";
type DragMode = "move-image" | "scale-image" | "rotate-image" | "move-watermark" | null;

type ImageInfo = {
  id: string;
  name: string;
  type: string;
  size: number;
  width: number;
  height: number;
};

type ImageLayer = {
  id: string;
  info: ImageInfo;
  image: HTMLImageElement;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
};

type PointerPoint = {
  x: number;
  y: number;
};

const percentOptions = [25, 50, 75, 100, 150, 200];
const editorPadding = 72;
const ratioOptions = [
  { label: "Libre", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "4:3", value: "4:3" },
  { label: "16:9", value: "16:9" },
  { label: "9:16", value: "9:16" }
];

const imageToolText = {
  es: {
    editor: "Editor de imagen",
    addImages: "Anadir imagenes",
    selectImages: "Seleccionar imagenes",
    uploadHint: "Sube una o varias imagenes para crear un collage.",
    canvas: "Lienzo",
    canvasWidth: "Ancho lienzo",
    canvasHeight: "Alto lienzo",
    image: "Imagen",
    scale: "Escala",
    rotation: "Rotacion",
    left: "Izquierda",
    right: "Derecha",
    horizontal: "Horizontal",
    vertical: "Vertical",
    fit: "Ajustar",
    convert: "Convertir y comprimir",
    format: "Formato",
    quality: "Calidad",
    watermark: "Marca de agua",
    text: "Texto",
    size: "Tamano",
    opacity: "Opacidad",
    viewer: "Visor editable",
    empty: "Sube imagenes para empezar",
    note: "Selecciona una capa, arrastrala para moverla y usa los tiradores para escalar o rotar.",
    download: "Descargar imagen",
    front: "Delante",
    back: "Atras",
    background: "Fondo",
    layer: "Capa",
    active: "Activa",
    images: "imagenes",
    oneImage: "imagen",
    result: "Resultado",
    downloaded: "Imagen descargada."
  },
  en: {
    editor: "Image editor",
    addImages: "Add images",
    selectImages: "Select images",
    uploadHint: "Upload one or more images to create a collage.",
    canvas: "Canvas",
    canvasWidth: "Canvas width",
    canvasHeight: "Canvas height",
    image: "Image",
    scale: "Scale",
    rotation: "Rotation",
    left: "Left",
    right: "Right",
    horizontal: "Horizontal",
    vertical: "Vertical",
    fit: "Fit",
    convert: "Convert and compress",
    format: "Format",
    quality: "Quality",
    watermark: "Watermark",
    text: "Text",
    size: "Size",
    opacity: "Opacity",
    viewer: "Editable viewer",
    empty: "Upload images to start",
    note: "Select a layer, drag it to move it and use the handles to scale or rotate.",
    download: "Download image",
    front: "Front",
    back: "Back",
    background: "Background",
    layer: "Layer",
    active: "Active",
    images: "images",
    oneImage: "image",
    result: "Result",
    downloaded: "Image downloaded."
  }
} as const;

export function ImageTool({ locale = "es" }: { locale?: Locale }) {
  const t = imageToolText[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
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

  const [layers, setLayers] = useState<ImageLayer[]>([]);
  const [activeLayerId, setActiveLayerId] = useState("");
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
  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? null;
  const activeInfo = activeLayer?.info ?? null;

  useEffect(() => {
    renderPreview();
  }, [
    layers,
    activeLayerId,
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

  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function loadImage(fileList: FileList | null) {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) {
      setMessage(locale === "en" ? "Upload one or more valid images." : "Sube una o varias imagenes validas.");
      return;
    }

    Promise.all(files.map(readImageFile))
      .then((nextLayers) => {
        if (!nextLayers.length) return;
        const first = nextLayers[0];
        const isFirstBatch = layers.length === 0;
        setLayers((current) => [...saveActiveLayer(current), ...nextLayers]);
        setActiveLayerId(first.id);
        loadLayerIntoControls(first);
        if (isFirstBatch) {
          setCanvasWidth(first.info.width);
          setCanvasHeight(first.info.height);
          setWatermarkX(first.info.width - 28);
          setWatermarkY(first.info.height - 28);
        }
        setMessage("");
      })
      .catch(() => setMessage(locale === "en" ? "The browser could not read one of the images." : "El navegador no pudo leer alguna imagen."));
  }

  function readImageFile(file: File) {
    return new Promise<ImageLayer>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      const image = new Image();
      image.onload = () => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const info = {
          id,
          name: file.name,
          type: file.type || file.name.split(".").pop()?.toUpperCase() || "Imagen",
          size: file.size,
          width: image.naturalWidth,
          height: image.naturalHeight
        };
        resolve({
          id,
          info,
          image,
          x: canvasWidth > 0 ? canvasWidth / 2 : image.naturalWidth / 2,
          y: canvasHeight > 0 ? canvasHeight / 2 : image.naturalHeight / 2,
          scale: layers.length > 0 && canvasWidth > 0 ? Math.min((canvasWidth / image.naturalWidth) * 70, (canvasHeight / image.naturalHeight) * 70, 100) : 100,
          rotation: 0,
          flipX: false,
          flipY: false
        });
      };
      image.onerror = reject;
      image.src = url;
    });
  }

  function saveActiveLayer(currentLayers = layers) {
    if (!activeLayerId) return currentLayers;
    return currentLayers.map((layer) =>
      layer.id === activeLayerId
        ? {
            ...layer,
            x: imageX,
            y: imageY,
            scale: imageScale,
            rotation: imageRotation,
            flipX,
            flipY
          }
        : layer
    );
  }

  function loadLayerIntoControls(layer: ImageLayer) {
    setImageX(layer.x);
    setImageY(layer.y);
    setImageScale(layer.scale);
    setImageRotation(layer.rotation);
    setFlipX(layer.flipX);
    setFlipY(layer.flipY);
  }

  function selectLayer(layer: ImageLayer) {
    setLayers((current) => saveActiveLayer(current));
    setActiveLayerId(layer.id);
    loadLayerIntoControls(layer);
  }

  function removeLayer(layerId: string) {
    setLayers((current) => {
      const saved = saveActiveLayer(current).filter((layer) => layer.id !== layerId);
      if (!saved.length) {
        setActiveLayerId("");
        setResultSize(null);
        setMessage("");
        return [];
      }
      if (layerId === activeLayerId) {
        const next = saved[saved.length - 1];
        setActiveLayerId(next.id);
        loadLayerIntoControls(next);
      }
      return saved;
    });
  }

  function moveLayer(layerId: string, direction: "front" | "back") {
    setLayers((current) => {
      const saved = saveActiveLayer(current);
      const index = saved.findIndex((layer) => layer.id === layerId);
      if (index < 0) return saved;
      const targetIndex = direction === "front" ? Math.min(saved.length - 1, index + 1) : Math.max(0, index - 1);
      if (targetIndex === index) return saved;
      const reordered = [...saved];
      const [layer] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, layer);
      return reordered;
    });
    setActiveLayerId(layerId);
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
    if (!activeInfo) return;
    setCanvasSize((activeInfo.width * percent) / 100, (activeInfo.height * percent) / 100);
  }

  function applyCanvasRatio(value: string) {
    if (!activeInfo || value === "free") return;
    const [rw, rh] = value.split(":").map(Number);
    const ratio = rw / rh;
    const base = Math.max(canvasWidth || activeInfo.width, 1);
    setCanvasSize(base, Math.round(base / ratio));
  }

  function resetImageLayer() {
    if (!activeInfo) return;
    setImageX(canvasWidth / 2);
    setImageY(canvasHeight / 2);
    setImageScale(Math.min((canvasWidth / activeInfo.width) * 100, (canvasHeight / activeInfo.height) * 100, 100));
    setImageRotation(0);
    setFlipX(false);
    setFlipY(false);
  }

  function renderPreview() {
    const canvas = canvasRef.current;
    if (!canvas || !layers.length || canvasWidth <= 0 || canvasHeight <= 0) return;
    renderToCanvas(canvas, true);
    estimateSize();
  }

  function renderToCanvas(canvas: HTMLCanvasElement, includeControls: boolean) {
    if (!layers.length) return;
    const offset = includeControls ? editorPadding : 0;
    canvas.width = Math.round(canvasWidth + offset * 2);
    canvas.height = Math.round(canvasHeight + offset * 2);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(offset, offset);

    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.clip();
    layers.forEach((layer) => {
      const editableLayer = getRenderableLayer(layer);
      drawLayer(ctx, editableLayer);
    });
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvasWidth, canvasHeight);
    ctx.clip();
    drawWatermark(ctx);
    ctx.restore();

    if (includeControls && activeLayer) {
      drawCanvasBoundary(ctx);
      drawControls(ctx);
    }
    ctx.restore();
  }

  function drawCanvasBoundary(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = "rgba(15, 118, 110, 0.35)";
    ctx.lineWidth = Math.max(1, canvasWidth / 520);
    ctx.setLineDash([6, 5]);
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
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

  function getRenderableLayer(layer: ImageLayer) {
    if (layer.id !== activeLayerId) return layer;
    return {
      ...layer,
      x: imageX,
      y: imageY,
      scale: imageScale,
      rotation: imageRotation,
      flipX,
      flipY
    };
  }

  function drawLayer(ctx: CanvasRenderingContext2D, layer: ImageLayer) {
    ctx.save();
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale((layer.flipX ? -1 : 1) * (layer.scale / 100), (layer.flipY ? -1 : 1) * (layer.scale / 100));
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(layer.image, -layer.info.width / 2, -layer.info.height / 2);
    ctx.restore();
  }

  function drawControls(ctx: CanvasRenderingContext2D) {
    if (!activeInfo) return;
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
    const info = activeInfo ?? { width: 1, height: 1 };
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
    if (!layers.length || canvasWidth <= 0 || canvasHeight <= 0) return;
    const output = document.createElement("canvas");
    renderToCanvas(output, false);
    output.toBlob((blob) => {
      setResultSize(blob?.size ?? null);
    }, mimeForFormat(format), quality / 100);
  }

  function downloadImage() {
    if (!layers.length) {
      setMessage(locale === "en" ? "Upload an image first." : "Primero sube una imagen.");
      return;
    }
    const output = document.createElement("canvas");
    renderToCanvas(output, false);
    output.toBlob((blob) => {
      if (!blob) {
        setMessage(locale === "en" ? `${format.toUpperCase()} is not supported by this browser.` : `${format.toUpperCase()} no esta soportado por este navegador.`);
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
      setMessage(t.downloaded);
    }, mimeForFormat(format), quality / 100);
  }

  function pointerFromEvent(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const offset = editorPadding;
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width - offset,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height - offset
    };
  }

  function onCanvasPointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!activeLayer) return;
    const point = pointerFromEvent(event);
    const mode = hitTest(point);
    if (!mode) {
      const clickedLayer = findLayerAtPoint(point);
      if (clickedLayer) selectLayer(clickedLayer);
      return;
    }
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
    if (!activeInfo) return false;
    const scale = imageScale / 100;
    const angle = (-imageRotation * Math.PI) / 180;
    const local = rotatePoint(point.x - imageX, point.y - imageY, angle);
    return Math.abs(local.x) <= (activeInfo.width * scale) / 2 && Math.abs(local.y) <= (activeInfo.height * scale) / 2;
  }

  function findLayerAtPoint(point: PointerPoint) {
    const savedLayers = saveActiveLayer();
    for (let index = savedLayers.length - 1; index >= 0; index -= 1) {
      const layer = savedLayers[index];
      if (layer.id !== activeLayerId && pointInLayer(point, layer)) return layer;
    }
    return null;
  }

  function pointInLayer(point: PointerPoint, layer: ImageLayer) {
    const scale = layer.scale / 100;
    const angle = (-layer.rotation * Math.PI) / 180;
    const local = rotatePoint(point.x - layer.x, point.y - layer.y, angle);
    return Math.abs(local.x) <= (layer.info.width * scale) / 2 && Math.abs(local.y) <= (layer.info.height * scale) / 2;
  }

  return (
    <div className="image-tool-shell">
      <section className="tool-workspace image-upload-panel">
        <h2>{t.editor}</h2>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/*"
          onChange={(event) => loadImage(event.target.files)}
        />
        <button className="dropzone" type="button" onClick={() => inputRef.current?.click()}>
          <div>
            <UploadCloud size={36} aria-hidden="true" />
            <strong>{layers.length ? t.addImages : t.selectImages}</strong>
            <span>{t.uploadHint}</span>
          </div>
        </button>
        {layers.length > 0 && (
          <div className="file-list">
            {layers.map((layer, index) => (
              <div
                className={`file-row image-layer-row${layer.id === activeLayerId ? " active" : ""}`}
                onClick={() => selectLayer(layer)}
                key={layer.id}
              >
                <FileImage size={18} aria-hidden="true" />
                <button type="button" className="image-layer-name" onClick={() => selectLayer(layer)}>
                  <span>{layer.info.name}</span>
                  <small>{index === layers.length - 1 ? t.front : index === 0 ? t.background : `${t.layer} ${index + 1}`}</small>
                </button>
                <small>{formatFileSize(layer.info.size)}</small>
                <div className="image-layer-actions">
                  <button
                    type="button"
                    aria-label={t.back}
                    title={t.back}
                    disabled={index === 0}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveLayer(layer.id, "back");
                    }}
                  >
                    {t.back}
                  </button>
                  <button
                    type="button"
                    aria-label={t.front}
                    title={t.front}
                    disabled={index === layers.length - 1}
                    onClick={(event) => {
                      event.stopPropagation();
                      moveLayer(layer.id, "front");
                    }}
                  >
                    {t.front}
                  </button>
                  <button
                    type="button"
                  aria-label="Quitar imagen"
                  className="image-layer-remove"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeLayer(layer.id);
                  }}
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
            <div className="image-meta-grid">
              <span>{layers.length} {layers.length === 1 ? t.oneImage : t.images}</span>
              {activeInfo && <span>{t.active}: {activeInfo.width} x {activeInfo.height}px</span>}
              <span>Lienzo: {canvasWidth} x {canvasHeight}px</span>
              {resultSize !== null && <span>{t.result}: {formatFileSize(resultSize)}</span>}
            </div>
          </div>
        )}
        {message && <div className={message.includes("descargada") ? "tool-status done" : "tool-status error"}>{message}</div>}
      </section>

      <section className="tool-workspace image-settings-panel">
        <h2>{locale === "en" ? "Settings" : "Ajustes"}</h2>
        <div className="image-settings-grid">
          <div className="tool-options">
            <h3>{t.canvas}</h3>
            <div className="field-row">
              <NumberField label={t.canvasWidth} value={canvasWidth} onChange={(value) => setCanvasSize(value, canvasHeight)} />
              <NumberField label={t.canvasHeight} value={canvasHeight} onChange={(value) => setCanvasSize(canvasWidth, value)} />
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
            <h3>{t.image}</h3>
            <div className="field">
              <label htmlFor="image-scale">{t.scale} {Math.round(imageScale)}%</label>
              <input id="image-scale" type="range" min="5" max="600" value={imageScale} onChange={(event) => setImageScale(Number(event.target.value))} />
            </div>
            <div className="field">
              <label htmlFor="image-rotation">{t.rotation} {Math.round(imageRotation)} {locale === "en" ? "degrees" : "grados"}</label>
              <input id="image-rotation" type="range" min="0" max="359" value={imageRotation} onChange={(event) => setImageRotation(Number(event.target.value))} />
            </div>
            <div className="segmented-wrap">
              <button type="button" className="small-action" onClick={() => setImageRotation((current) => normalizeRotation(current - 90))}>
                <RotateCcw size={16} /> {t.left}
              </button>
              <button type="button" className="small-action" onClick={() => setImageRotation((current) => normalizeRotation(current + 90))}>
                <RotateCw size={16} /> {t.right}
              </button>
              <button type="button" className="small-action" onClick={() => setFlipX((current) => !current)}>
                <FlipHorizontal2 size={16} /> {t.horizontal}
              </button>
              <button type="button" className="small-action" onClick={() => setFlipY((current) => !current)}>
                <FlipVertical2 size={16} /> {t.vertical}
              </button>
              <button type="button" className="small-action" onClick={resetImageLayer}>
                <Move size={16} /> {t.fit}
              </button>
            </div>
          </div>

          <div className="tool-options">
            <h3>{t.convert}</h3>
            <div className="field">
              <label htmlFor="image-format">{t.format}</label>
              <select id="image-format" value={format} onChange={(event) => setFormat(event.target.value as ExportFormat)}>
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
                <option value="avif">AVIF</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="quality">{t.quality} {quality}%</label>
              <input id="quality" type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </div>
            <p className="option-note">{locale === "en" ? "Quality affects JPG, WebP and AVIF when supported by your browser." : "La calidad afecta a JPG, WebP y AVIF cuando el navegador lo soporta."}</p>
          </div>

          <div className="tool-options">
            <h3>{t.watermark}</h3>
            <div className="field">
              <label htmlFor="watermark">{t.text}</label>
              <input id="watermark" value={watermarkText} onChange={(event) => setWatermarkText(event.target.value)} />
            </div>
            <div className="field-row">
              <NumberField label={t.size} value={watermarkSize} onChange={setWatermarkSize} />
              <NumberField label={t.opacity} value={watermarkOpacity} onChange={(value) => setWatermarkOpacity(clamp(value, 0, 100))} />
            </div>
            <p className="option-note">{locale === "en" ? "Drag the watermark in the viewer to place it." : "Arrastra la marca de agua en el visor para colocarla."}</p>
          </div>
        </div>
      </section>

      <section className="tool-workspace image-preview-panel">
        <div className="preview-top">
          <span className="preview-title">{t.viewer}</span>
          {resultSize !== null && <span className="status-pill">{formatFileSize(resultSize)}</span>}
        </div>
        <div className="image-preview-canvas-wrap">
          {layers.length ? (
            <canvas
              ref={canvasRef}
              onPointerDown={onCanvasPointerDown}
              onPointerMove={onCanvasPointerMove}
              onPointerUp={onCanvasPointerUp}
              onPointerCancel={onCanvasPointerUp}
            />
          ) : (
            <div className="preview-loading">{t.empty}</div>
          )}
        </div>
        <p className="option-note image-editor-note">{t.note}</p>
        <button className="button process-button" type="button" disabled={!layers.length} onClick={downloadImage}>
          <Download size={18} aria-hidden="true" />
          {t.download}
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
