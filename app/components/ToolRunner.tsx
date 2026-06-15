"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { rawTimeZones } from "@vvo/tzdb";
import { FileText, UploadCloud, X } from "lucide-react";
import type { Tool } from "../data/tools";
import type { Locale } from "../../lib/i18n";

type RunnerProps = {
  tool: Tool;
  locale?: Locale;
};

type PagePreview = {
  id: string;
  fileIndex: number;
  pageIndex: number;
  pageNumber: number;
  name: string;
  thumbnail: string;
};

type PlacedSignature = {
  id: string;
  dataUrl: string;
  pageId: string;
  xPct: number;
  yPct: number;
  scale: number;
};

type AudioClip = {
  id: string;
  fileIndex: number;
  start: number;
  end: number;
  label: string;
};

const formatEuro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2
});

const runnerText = {
  es: {
    selectFirst: "Primero selecciona un archivo.",
    validUrl: "Introduce una URL valida que empiece por http:// o https://.",
    signFirst: "Dibuja y anade al menos una firma al PDF.",
    preparing: "Preparando archivo...",
    genericError: "No se pudo procesar con esta herramienta.",
    urlLabel: "URL de la pagina",
    urlNote: "Introduce un enlace publico. La herramienta generara un PDF con el contenido principal de la pagina.",
    addMore: "Anadir mas archivos",
    selectFiles: "Seleccionar archivos",
    drop: "Haz clic o arrastra aqui",
    yourFiles: "tus archivos",
    yourFile: "tu archivo",
    generating: "Generando vista previa...",
    process: "Procesar",
    processing: "Procesando..."
  },
  en: {
    selectFirst: "Select a file first.",
    validUrl: "Enter a valid URL starting with http:// or https://.",
    signFirst: "Draw and add at least one signature to the PDF.",
    preparing: "Preparing file...",
    genericError: "This tool could not process the file.",
    urlLabel: "Page URL",
    urlNote: "Enter a public link. The tool will generate a PDF with the main page content.",
    addMore: "Add more files",
    selectFiles: "Select files",
    drop: "Click or drag here",
    yourFiles: "your files",
    yourFile: "your file",
    generating: "Generating preview...",
    process: "Process",
    processing: "Processing..."
  }
} as const;

export function ToolRunner({ tool, locale = "es" }: RunnerProps) {
  if (tool.kind === "mortgage") return <MortgageCalculator />;
  if (tool.kind === "salary") return <SalaryCalculator />;
  if (tool.slug === "hora-mundial") return <WorldClockConverter tool={tool} locale={locale} />;
  if (tool.kind === "converter") return <UnitConverter tool={tool} locale={locale} />;
  if (tool.kind === "audio") return <AudioTool tool={tool} locale={locale} />;
  if (tool.kind === "scientific") return <ScientificCalculator />;
  if (tool.kind === "cv") return <CvGenerator />;
  if (tool.kind === "letter") return <LetterGenerator />;
  if (tool.kind === "summary") return <TextSummarizer />;
  if (tool.kind === "grammar") return <GrammarChecker />;
  return <PdfUploader tool={tool} locale={locale} />;
}

const audioText = {
  es: {
    addFiles: "Anadir audios",
    selectFiles: "Seleccionar audios",
    supported: "MP3, WAV, OGG, AAC, FLAC y otros formatos que pueda decodificar tu navegador.",
    noFile: "Selecciona al menos un archivo de audio.",
    decodeError: "No se pudo leer uno de los audios. Prueba con MP3, WAV u OGG.",
    editorMode: "Modo de edicion",
    trim: "Cortar audio",
    merge: "Unir audios",
    waveform: "Forma de onda",
    timeline: "Timeline de cortes",
    addCut: "Anadir corte al timeline",
    clearCuts: "Limpiar cortes",
    moveLeft: "Mover antes",
    moveRight: "Mover despues",
    removeCut: "Quitar corte",
    noCuts: "Crea cortes visuales para reordenarlos o usa el audio seleccionado completo.",
    renderedPreview: "Preescucha del resultado",
    activeFile: "Audio activo",
    start: "Inicio",
    end: "Final",
    fadeIn: "Fade in",
    fadeOut: "Fade out",
    speed: "Velocidad",
    pitch: "Tono",
    removeSilence: "Eliminar silencios",
    silenceThreshold: "Umbral de silencio",
    convertFormat: "Formato de salida",
    browserWav: "WAV compatible con navegador",
    sampleRate: "Sample rate",
    normalize: "Normalizar volumen",
    compressor: "Compresor de dinamica",
    noiseGate: "Reducir ruido de fondo",
    mono: "Estereo a mono",
    splitChannels: "Separar canales L/R",
    process: "Generar audio",
    preview: "Reproducir seleccion",
    processing: "Procesando audio...",
    done: "Audio generado.",
    download: "Descargar resultado",
    note: "Todo se procesa en tu navegador. Para exportar MP3/AAC/FLAC reales haria falta conectar un backend con codificador dedicado."
  },
  en: {
    addFiles: "Add audio files",
    selectFiles: "Select audio files",
    supported: "MP3, WAV, OGG, AAC, FLAC and other formats your browser can decode.",
    noFile: "Select at least one audio file.",
    decodeError: "One audio file could not be read. Try MP3, WAV or OGG.",
    editorMode: "Editing mode",
    trim: "Cut audio",
    merge: "Merge audio",
    waveform: "Waveform",
    timeline: "Cut timeline",
    addCut: "Add cut to timeline",
    clearCuts: "Clear cuts",
    moveLeft: "Move earlier",
    moveRight: "Move later",
    removeCut: "Remove cut",
    noCuts: "Create visual cuts to reorder them or use the selected audio directly.",
    renderedPreview: "Rendered preview",
    activeFile: "Active audio",
    start: "Start",
    end: "End",
    fadeIn: "Fade in",
    fadeOut: "Fade out",
    speed: "Speed",
    pitch: "Pitch",
    removeSilence: "Remove silence",
    silenceThreshold: "Silence threshold",
    convertFormat: "Output format",
    browserWav: "Browser-compatible WAV",
    sampleRate: "Sample rate",
    normalize: "Normalize volume",
    compressor: "Dynamic compressor",
    noiseGate: "Reduce background noise",
    mono: "Stereo to mono",
    splitChannels: "Split L/R channels",
    process: "Generate audio",
    preview: "Play selection",
    processing: "Processing audio...",
    done: "Audio generated.",
    download: "Download result",
    note: "Everything runs in your browser. Real MP3/AAC/FLAC export requires a backend with dedicated encoders."
  }
} as const;

function AudioTool({ tool, locale }: { tool: Tool; locale: Locale }) {
  const t = audioText[locale];
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLCanvasElement>(null);
  const stopTimerRef = useRef<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [buffers, setBuffers] = useState<AudioBuffer[]>([]);
  const [clips, setClips] = useState<AudioClip[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mode, setMode] = useState<"trim" | "merge">("trim");
  const [startPct, setStartPct] = useState(0);
  const [endPct, setEndPct] = useState(100);
  const [fadeIn, setFadeIn] = useState(0.25);
  const [fadeOut, setFadeOut] = useState(0.25);
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [removeSilence, setRemoveSilence] = useState(false);
  const [silenceThreshold, setSilenceThreshold] = useState(0.018);
  const [sampleRate, setSampleRate] = useState(44100);
  const [normalize, setNormalize] = useState(true);
  const [compressor, setCompressor] = useState(false);
  const [noiseGate, setNoiseGate] = useState(false);
  const [mono, setMono] = useState(false);
  const [splitChannels, setSplitChannels] = useState(false);
  const [resultUrl, setResultUrl] = useState("");
  const [resultName, setResultName] = useState("audio.wav");
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const activeBuffer = buffers[activeIndex];
  const startSeconds = activeBuffer ? (startPct / 100) * activeBuffer.duration : 0;
  const endSeconds = activeBuffer ? Math.max(startSeconds + 0.05, (endPct / 100) * activeBuffer.duration) : 0;
  const isEnhancer = tool.slug === "mejorar-convertir-audio";

  useEffect(() => {
    drawWaveform(waveformRef.current, activeBuffer, startSeconds, endSeconds);
  }, [activeBuffer, startSeconds, endSeconds]);

  useEffect(() => {
    if (!files[activeIndex]) {
      setPreviewUrl("");
      return;
    }

    const nextUrl = URL.createObjectURL(files[activeIndex]);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [files, activeIndex]);

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) window.clearInterval(stopTimerRef.current);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  async function addFiles(fileList: FileList | null) {
    const incoming = Array.from(fileList ?? []).filter((file) => file.type.startsWith("audio/") || /\.(mp3|wav|ogg|aac|m4a|flac)$/i.test(file.name));
    if (!incoming.length) return;

    try {
      setStatus("processing");
      setMessage(t.processing);
      const decoded = await Promise.all(incoming.map(decodeAudioFile));
      setFiles(incoming);
      setBuffers(decoded);
      setClips([]);
      setActiveIndex(0);
      setStartPct(0);
      setEndPct(100);
      setStatus("idle");
      setMessage("");
    } catch {
      setStatus("error");
      setMessage(t.decodeError);
    }
  }

  function playSelection() {
    const element = audioRef.current;
    if (!element || !activeBuffer) return;
    if (stopTimerRef.current) window.clearInterval(stopTimerRef.current);
    element.pause();
    element.currentTime = startSeconds;
    void element.play();
    stopTimerRef.current = window.setInterval(() => {
      if (element.currentTime >= endSeconds) {
        element.pause();
        if (stopTimerRef.current) window.clearInterval(stopTimerRef.current);
      }
    }, 80);
  }

  function addCutToTimeline() {
    if (!activeBuffer || !files[activeIndex]) return;
    setClips((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        fileIndex: activeIndex,
        start: startSeconds,
        end: endSeconds,
        label: files[activeIndex].name
      }
    ]);
  }

  function removeClip(id: string) {
    setClips((current) => current.filter((clip) => clip.id !== id));
  }

  function moveClip(id: string, direction: -1 | 1) {
    setClips((current) => {
      const index = current.findIndex((clip) => clip.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      return moveArrayItem(current, index, target);
    });
  }

  function selectClip(clip: AudioClip) {
    setActiveIndex(clip.fileIndex);
    const buffer = buffers[clip.fileIndex];
    if (!buffer) return;
    setStartPct(Math.max(0, Math.min(99, (clip.start / buffer.duration) * 100)));
    setEndPct(Math.max(1, Math.min(100, (clip.end / buffer.duration) * 100)));
  }

  async function processAudio() {
    if (!buffers.length) {
      setStatus("error");
      setMessage(t.noFile);
      return;
    }

    setStatus("processing");
    setMessage(t.processing);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    try {
      const source =
        clips.length && !isEnhancer
          ? renderAudioClips(clips, buffers)
          : mode === "merge" && !isEnhancer
            ? mergeAudioBuffers(buffers)
            : cropAudioBuffer(activeBuffer, startSeconds, endSeconds);
      let processed = source;
      processed = applyFades(processed, fadeIn, fadeOut);
      if (removeSilence) processed = removeSilentSections(processed, silenceThreshold);
      const pitchRate = Math.pow(2, pitch / 12);
      if (speed !== 1 || pitch !== 0) processed = resampleDuration(processed, speed * pitchRate);
      if (noiseGate) processed = applyNoiseGate(processed, silenceThreshold);
      if (compressor) processed = applySoftCompression(processed);
      if (normalize) processed = normalizeAudio(processed);
      if (mono) processed = convertToMono(processed);
      if (sampleRate !== processed.sampleRate) processed = convertSampleRate(processed, sampleRate);

      if (splitChannels && processed.numberOfChannels > 1) {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();
        for (let channel = 0; channel < processed.numberOfChannels; channel += 1) {
          const oneChannel = makeAudioBuffer([processed.getChannelData(channel)], processed.sampleRate);
          zip.file(`canal-${channel === 0 ? "L" : "R"}.wav`, audioBufferToWav(oneChannel));
        }
        const blob = await zip.generateAsync({ type: "blob" });
        setResultName("canales-audio.zip");
        setResultUrl(URL.createObjectURL(blob));
      } else {
        const blob = audioBufferToWav(processed);
        setResultName(`${safeAudioName(files[activeIndex]?.name ?? "audio")}.wav`);
        setResultUrl(URL.createObjectURL(blob));
      }

      setStatus("done");
      setMessage(t.done);
    } catch {
      setStatus("error");
      setMessage(t.decodeError);
    }
  }

  return (
    <div className="tool-workspace audio-workspace">
      <input ref={inputRef} className="sr-only" type="file" accept="audio/*,.mp3,.wav,.ogg,.aac,.m4a,.flac" multiple onChange={(event) => addFiles(event.target.files)} />
      <button type="button" className="dropzone audio-dropzone" onClick={() => inputRef.current?.click()}>
        <UploadCloud size={32} aria-hidden="true" />
        <strong>{files.length ? t.addFiles : t.selectFiles}</strong>
        <span>{t.supported}</span>
      </button>

      {!!files.length && (
        <div className="audio-grid">
          <section className="audio-panel">
            <h2>{t.activeFile}</h2>
            <div className="audio-file-list">
              {files.map((file, index) => (
                <button type="button" className={index === activeIndex ? "active" : ""} onClick={() => setActiveIndex(index)} key={`${file.name}-${index}`}>
                  <span>{file.name}</span>
                  <small>{formatFileSize(file.size)}</small>
                </button>
              ))}
            </div>
            {previewUrl && <audio ref={audioRef} src={previewUrl} controls preload="metadata" />}
            <button type="button" className="small-action" onClick={playSelection}>{t.preview}</button>
          </section>

          <section className="audio-panel">
            <h2>{isEnhancer ? t.convertFormat : t.editorMode}</h2>
            {!isEnhancer && (
              <div className="segmented-wrap">
                <button type="button" className={`small-action ${mode === "trim" ? "active" : ""}`} onClick={() => setMode("trim")}>{t.trim}</button>
                <button type="button" className={`small-action ${mode === "merge" ? "active" : ""}`} onClick={() => setMode("merge")}>{t.merge}</button>
              </div>
            )}
            <div className="field-row">
              <label className="audio-range-label">
                <span>{t.start}: {formatDuration(startSeconds)}</span>
                <input type="range" min="0" max="99" value={startPct} disabled={mode === "merge" && !isEnhancer} onChange={(event) => setStartPct(Math.min(Number(event.target.value), endPct - 1))} />
              </label>
              <label className="audio-range-label">
                <span>{t.end}: {formatDuration(endSeconds)}</span>
                <input type="range" min="1" max="100" value={endPct} disabled={mode === "merge" && !isEnhancer} onChange={(event) => setEndPct(Math.max(Number(event.target.value), startPct + 1))} />
              </label>
            </div>
            <div className="audio-waveform-wrap">
              <div className="audio-waveform-head">
                <strong>{t.waveform}</strong>
                <span>{formatDuration(startSeconds)} - {formatDuration(endSeconds)}</span>
              </div>
              <div className="audio-waveform-stage">
                <canvas ref={waveformRef} width={960} height={180} aria-label={t.waveform} />
              </div>
              {!isEnhancer && (
                <button type="button" className="small-action" onClick={addCutToTimeline}>
                  {t.addCut}
                </button>
              )}
            </div>
            <div className="field-row">
              <label className="field">
                <span>{t.fadeIn}</span>
                <input type="number" min="0" step="0.1" value={fadeIn} onChange={(event) => setFadeIn(Number(event.target.value))} />
              </label>
              <label className="field">
                <span>{t.fadeOut}</span>
                <input type="number" min="0" step="0.1" value={fadeOut} onChange={(event) => setFadeOut(Number(event.target.value))} />
              </label>
            </div>
          </section>

          {!isEnhancer && (
            <section className="audio-panel audio-panel-wide">
              <div className="audio-timeline-header">
                <h2>{t.timeline}</h2>
                {!!clips.length && <button type="button" className="small-action" onClick={() => setClips([])}>{t.clearCuts}</button>}
              </div>
              {clips.length ? (
                <div className="audio-timeline">
                  {clips.map((clip, index) => (
                    <article className="audio-clip" key={clip.id} onClick={() => selectClip(clip)}>
                      <div>
                        <strong>{index + 1}. {clip.label}</strong>
                        <span>{formatDuration(clip.start)} - {formatDuration(clip.end)} ({formatDuration(clip.end - clip.start)})</span>
                      </div>
                      <div className="audio-clip-actions">
                        <button type="button" aria-label={t.moveLeft} onClick={(event) => { event.stopPropagation(); moveClip(clip.id, -1); }}>‹</button>
                        <button type="button" aria-label={t.moveRight} onClick={(event) => { event.stopPropagation(); moveClip(clip.id, 1); }}>›</button>
                        <button type="button" aria-label={t.removeCut} onClick={(event) => { event.stopPropagation(); removeClip(clip.id); }}>×</button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="option-note">{t.noCuts}</p>
              )}
            </section>
          )}

          <section className="audio-panel">
            <h2>{isEnhancer ? (locale === "en" ? "Enhance" : "Mejorar audio") : (locale === "en" ? "Adjust" : "Ajustes")}</h2>
            <label className="audio-range-label">
              <span>{t.speed}: {speed.toFixed(2)}x</span>
              <input type="range" min="0.5" max="2" step="0.05" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
            </label>
            <label className="audio-range-label">
              <span>{t.pitch}: {pitch > 0 ? "+" : ""}{pitch} st</span>
              <input type="range" min="-12" max="12" step="1" value={pitch} onChange={(event) => setPitch(Number(event.target.value))} />
            </label>
            <label className="audio-range-label">
              <span>{t.silenceThreshold}: {silenceThreshold.toFixed(3)}</span>
              <input type="range" min="0.001" max="0.08" step="0.001" value={silenceThreshold} onChange={(event) => setSilenceThreshold(Number(event.target.value))} />
            </label>
            <div className="audio-toggle-grid">
              <label><input type="checkbox" checked={removeSilence} onChange={(event) => setRemoveSilence(event.target.checked)} /> {t.removeSilence}</label>
              <label><input type="checkbox" checked={normalize} onChange={(event) => setNormalize(event.target.checked)} /> {t.normalize}</label>
              <label><input type="checkbox" checked={compressor} onChange={(event) => setCompressor(event.target.checked)} /> {t.compressor}</label>
              <label><input type="checkbox" checked={noiseGate} onChange={(event) => setNoiseGate(event.target.checked)} /> {t.noiseGate}</label>
              <label><input type="checkbox" checked={mono} onChange={(event) => setMono(event.target.checked)} /> {t.mono}</label>
              <label><input type="checkbox" checked={splitChannels} onChange={(event) => setSplitChannels(event.target.checked)} /> {t.splitChannels}</label>
            </div>
          </section>

          <section className="audio-panel">
            <h2>{t.convertFormat}</h2>
            <label className="field">
              <span>{t.convertFormat}</span>
              <select value="wav" disabled>
                <option value="wav">{t.browserWav}</option>
              </select>
            </label>
            <label className="field">
              <span>{t.sampleRate}</span>
              <select value={sampleRate} onChange={(event) => setSampleRate(Number(event.target.value))}>
                <option value={44100}>44.1 kHz</option>
                <option value={48000}>48 kHz</option>
              </select>
            </label>
            <p className="option-note">{t.note}</p>
            <button type="button" className="button process-button" onClick={processAudio}>{t.process}</button>
            {message && <div className={`tool-status ${status}`}>{message}</div>}
            {resultUrl && (
              <>
                {!splitChannels && (
                  <div className="audio-result-preview">
                    <strong>{t.renderedPreview}</strong>
                    <audio controls src={resultUrl} />
                  </div>
                )}
                <a className="button secondary process-button" href={resultUrl} download={resultName}>
                  {t.download}
                </a>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

async function decodeAudioFile(file: File) {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const context = new AudioContextClass();
  try {
    return await context.decodeAudioData(await file.arrayBuffer());
  } finally {
    await context.close();
  }
}

function cropAudioBuffer(buffer: AudioBuffer, startSeconds: number, endSeconds: number) {
  const start = Math.max(0, Math.floor(startSeconds * buffer.sampleRate));
  const end = Math.min(buffer.length, Math.max(start + 1, Math.floor(endSeconds * buffer.sampleRate)));
  const channels = Array.from({ length: buffer.numberOfChannels }, (_, channel) => buffer.getChannelData(channel).slice(start, end));
  return makeAudioBuffer(channels, buffer.sampleRate);
}

function renderAudioClips(clips: AudioClip[], buffers: AudioBuffer[]) {
  const pieces = clips
    .map((clip) => {
      const buffer = buffers[clip.fileIndex];
      return buffer ? cropAudioBuffer(buffer, clip.start, clip.end) : null;
    })
    .filter((buffer): buffer is AudioBuffer => Boolean(buffer));

  return pieces.length ? mergeAudioBuffers(pieces) : buffers[0];
}

function drawWaveform(canvas: HTMLCanvasElement | null, buffer: AudioBuffer | undefined, startSeconds: number, endSeconds: number) {
  if (!canvas) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#f7faf9";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#d8e3e8";
  context.beginPath();
  context.moveTo(0, height / 2);
  context.lineTo(width, height / 2);
  context.stroke();

  if (!buffer) return;

  const data = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(data.length / width));
  context.strokeStyle = "#0f766e";
  context.lineWidth = 1.5;
  context.beginPath();

  for (let x = 0; x < width; x += 1) {
    let min = 1;
    let max = -1;
    const offset = x * step;
    for (let index = 0; index < step && offset + index < data.length; index += 1) {
      const value = data[offset + index];
      min = Math.min(min, value);
      max = Math.max(max, value);
    }
    context.moveTo(x, ((1 + min) * height) / 2);
    context.lineTo(x, ((1 + max) * height) / 2);
  }
  context.stroke();

  const startX = Math.max(0, Math.min(width, (startSeconds / buffer.duration) * width));
  const endX = Math.max(startX, Math.min(width, (endSeconds / buffer.duration) * width));
  context.fillStyle = "rgba(15, 118, 110, 0.16)";
  context.fillRect(startX, 0, endX - startX, height);
  context.strokeStyle = "#c2410c";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(startX, 0);
  context.lineTo(startX, height);
  context.moveTo(endX, 0);
  context.lineTo(endX, height);
  context.stroke();
}

function mergeAudioBuffers(buffers: AudioBuffer[]) {
  const sampleRate = buffers[0].sampleRate;
  const channelsCount = Math.max(...buffers.map((buffer) => buffer.numberOfChannels));
  const totalLength = buffers.reduce((sum, buffer) => sum + Math.round(buffer.duration * sampleRate), 0);
  const channels = Array.from({ length: channelsCount }, () => new Float32Array(totalLength));
  let offset = 0;

  buffers.forEach((buffer) => {
    const converted = buffer.sampleRate === sampleRate ? buffer : convertSampleRate(buffer, sampleRate);
    for (let channel = 0; channel < channelsCount; channel += 1) {
      const source = converted.getChannelData(Math.min(channel, converted.numberOfChannels - 1));
      channels[channel].set(source, offset);
    }
    offset += converted.length;
  });

  return makeAudioBuffer(channels, sampleRate);
}

function applyFades(buffer: AudioBuffer, fadeInSeconds: number, fadeOutSeconds: number) {
  const channels = copyChannels(buffer);
  const fadeInSamples = Math.min(buffer.length, Math.max(0, Math.floor(fadeInSeconds * buffer.sampleRate)));
  const fadeOutSamples = Math.min(buffer.length, Math.max(0, Math.floor(fadeOutSeconds * buffer.sampleRate)));

  channels.forEach((data) => {
    for (let index = 0; index < fadeInSamples; index += 1) data[index] *= index / Math.max(1, fadeInSamples);
    for (let index = 0; index < fadeOutSamples; index += 1) {
      const target = data.length - 1 - index;
      data[target] *= index / Math.max(1, fadeOutSamples);
    }
  });

  return makeAudioBuffer(channels, buffer.sampleRate);
}

function removeSilentSections(buffer: AudioBuffer, threshold: number) {
  const keep: number[] = [];
  const windowSize = Math.max(1, Math.floor(buffer.sampleRate * 0.018));
  for (let index = 0; index < buffer.length; index += windowSize) {
    let peak = 0;
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let cursor = index; cursor < Math.min(index + windowSize, data.length); cursor += 1) {
        peak = Math.max(peak, Math.abs(data[cursor]));
      }
    }
    if (peak >= threshold) keep.push(index);
  }

  if (!keep.length) return buffer;
  const channels = Array.from({ length: buffer.numberOfChannels }, () => new Float32Array(keep.length * windowSize));
  keep.forEach((sourceIndex, chunkIndex) => {
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      channels[channel].set(buffer.getChannelData(channel).slice(sourceIndex, sourceIndex + windowSize), chunkIndex * windowSize);
    }
  });
  return makeAudioBuffer(channels, buffer.sampleRate);
}

function resampleDuration(buffer: AudioBuffer, factor: number) {
  const safeFactor = Math.max(0.25, Math.min(4, factor));
  const nextLength = Math.max(1, Math.floor(buffer.length / safeFactor));
  const channels = copyChannels(buffer).map((data) => resampleArray(data, nextLength));
  return makeAudioBuffer(channels, buffer.sampleRate);
}

function convertSampleRate(buffer: AudioBuffer, nextSampleRate: number) {
  const nextLength = Math.max(1, Math.floor((buffer.length * nextSampleRate) / buffer.sampleRate));
  const channels = copyChannels(buffer).map((data) => resampleArray(data, nextLength));
  return makeAudioBuffer(channels, nextSampleRate);
}

function normalizeAudio(buffer: AudioBuffer) {
  const channels = copyChannels(buffer);
  let peak = 0;
  channels.forEach((data) => {
    for (let index = 0; index < data.length; index += 1) peak = Math.max(peak, Math.abs(data[index]));
  });
  if (peak <= 0) return buffer;
  const gain = Math.min(4, 0.94 / peak);
  channels.forEach((data) => {
    for (let index = 0; index < data.length; index += 1) data[index] *= gain;
  });
  return makeAudioBuffer(channels, buffer.sampleRate);
}

function applyNoiseGate(buffer: AudioBuffer, threshold: number) {
  const channels = copyChannels(buffer);
  channels.forEach((data) => {
    for (let index = 0; index < data.length; index += 1) {
      if (Math.abs(data[index]) < threshold) data[index] *= 0.18;
    }
  });
  return makeAudioBuffer(channels, buffer.sampleRate);
}

function applySoftCompression(buffer: AudioBuffer) {
  const channels = copyChannels(buffer);
  channels.forEach((data) => {
    for (let index = 0; index < data.length; index += 1) {
      const sample = data[index];
      data[index] = Math.tanh(sample * 1.8) / 1.8;
    }
  });
  return makeAudioBuffer(channels, buffer.sampleRate);
}

function convertToMono(buffer: AudioBuffer) {
  if (buffer.numberOfChannels === 1) return buffer;
  const mono = new Float32Array(buffer.length);
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < data.length; index += 1) mono[index] += data[index] / buffer.numberOfChannels;
  }
  return makeAudioBuffer([mono], buffer.sampleRate);
}

function copyChannels(buffer: AudioBuffer) {
  return Array.from({ length: buffer.numberOfChannels }, (_, channel) => new Float32Array(buffer.getChannelData(channel)));
}

function resampleArray(data: Float32Array, nextLength: number) {
  const result = new Float32Array(nextLength);
  const scale = (data.length - 1) / Math.max(1, nextLength - 1);
  for (let index = 0; index < nextLength; index += 1) {
    const position = index * scale;
    const before = Math.floor(position);
    const after = Math.min(data.length - 1, before + 1);
    const ratio = position - before;
    result[index] = data[before] * (1 - ratio) + data[after] * ratio;
  }
  return result;
}

function makeAudioBuffer(channels: Float32Array[], sampleRate: number) {
  const length = Math.max(1, ...channels.map((channel) => channel.length));
  const context = new OfflineAudioContext(channels.length, length, sampleRate);
  const buffer = context.createBuffer(channels.length, length, sampleRate);
  channels.forEach((channel, index) => buffer.copyToChannel(channel.slice(0, length), index));
  return buffer;
}

function audioBufferToWav(buffer: AudioBuffer) {
  const bytesPerSample = 2;
  const blockAlign = buffer.numberOfChannels * bytesPerSample;
  const dataSize = buffer.length * blockAlign;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);
  let offset = 0;

  writeString(view, offset, "RIFF"); offset += 4;
  view.setUint32(offset, 36 + dataSize, true); offset += 4;
  writeString(view, offset, "WAVE"); offset += 4;
  writeString(view, offset, "fmt "); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, buffer.numberOfChannels, true); offset += 2;
  view.setUint32(offset, buffer.sampleRate, true); offset += 4;
  view.setUint32(offset, buffer.sampleRate * blockAlign, true); offset += 4;
  view.setUint16(offset, blockAlign, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(view, offset, "data"); offset += 4;
  view.setUint32(offset, dataSize, true); offset += 4;

  for (let index = 0; index < buffer.length; index += 1) {
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[index]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += bytesPerSample;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
}

function formatDuration(value: number) {
  const total = Math.max(0, Math.round(value));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function safeAudioName(name: string) {
  return name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-").replace(/^-|-$/g, "") || "audio";
}

function PdfUploader({ tool, locale }: { tool: Tool; locale: Locale }) {
  const t = runnerText[locale];
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
  const [signaturePreview, setSignaturePreview] = useState("");
  const [placedSignatures, setPlacedSignatures] = useState<PlacedSignature[]>([]);
  const [draggingSignatureId, setDraggingSignatureId] = useState<string | null>(null);
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
          const viewport = page.getViewport({ scale: tool.slug === "firmar-pdf" ? 1 : 0.34 });
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
      setMessage(t.selectFirst);
      return;
    }
    if (tool.slug === "html-a-pdf" && !/^https?:\/\/.+/i.test(urlToPdf.trim())) {
      setStatus("error");
      setMessage(t.validUrl);
      return;
    }
    if (tool.slug === "firmar-pdf" && placedSignatures.length === 0) {
      setStatus("error");
      setMessage(t.signFirst);
      return;
    }

    setStatus("processing");
    setMessage(t.preparing);

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
        placedSignatures,
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
      setMessage(error instanceof Error ? error.message : t.genericError);
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

  function getPointerPlacement(event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>) {
    const thumb = event.currentTarget.querySelector(".document-thumb");
    const rect = thumb?.getBoundingClientRect();
    const xPct = rect ? (event.clientX - rect.left) / rect.width : 0.5;
    const yPct = rect ? (event.clientY - rect.top) / rect.height : 0.78;
    return {
      xPct: Math.min(Math.max(xPct, 0.08), 0.92),
      yPct: Math.min(Math.max(yPct, 0.08), 0.92)
    };
  }

  function addSignatureToPdf() {
    const targetPage = selectedPages[0] ?? pagePreviews[0]?.id;
    if (!signaturePreview || !targetPage) return;
    setPlacedSignatures((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        dataUrl: signaturePreview,
        pageId: targetPage,
        xPct: 0.5,
        yPct: 0.78,
        scale: 1
      }
    ]);
  }

  function moveSignature(event: React.PointerEvent<HTMLElement> | React.MouseEvent<HTMLElement>, pageId: string, signatureId: string) {
    const placement = getPointerPlacement(event);
    setPlacedSignatures((current) =>
      current.map((signature) => (signature.id === signatureId ? { ...signature, pageId, ...placement } : signature))
    );
  }

  function resizeSignature(id: string, delta: number) {
    setPlacedSignatures((current) =>
      current.map((signature) =>
        signature.id === id ? { ...signature, scale: Math.min(2.2, Math.max(0.45, signature.scale + delta)) } : signature
      )
    );
  }

  function removeSignature(id: string) {
    setPlacedSignatures((current) => current.filter((signature) => signature.id !== id));
  }

  const pageCardTools = ["dividir-pdf", "ordenar-pdf", "rotar-pdf", "pdf-a-jpg"];
  const showFirstPageCards = previews.length > 0 && !["unir-pdf", ...pageCardTools].includes(tool.slug);

  return (
    <div className="tool-workspace">
      <h2>{tool.title}</h2>
      {tool.slug === "html-a-pdf" ? (
        <div className="tool-options">
          <TextField label={t.urlLabel} value={urlToPdf} onChange={setUrlToPdf} />
          <p className="option-note">{t.urlNote}</p>
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
              <strong>{files.length > 0 ? t.addMore : t.selectFiles}</strong>
              <span>{t.drop} {multiple ? t.yourFiles : t.yourFile}.</span>
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
                    {t.generating}
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
                    {t.generating}
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

      {tool.slug === "firmar-pdf" && pagePreviews.length > 0 && (
        <div className="signature-editor">
          <aside className="signature-thumbs" aria-label="Paginas del PDF">
            {pagePreviews.map((page) => (
              <button
                type="button"
                className={selectedPages[0] === page.id ? "signature-thumb active" : "signature-thumb"}
                onClick={() => setSelectedPages([page.id])}
                key={page.id}
              >
                <img src={page.thumbnail} alt={`Pagina ${page.pageNumber}`} />
                <span>{page.pageNumber}</span>
              </button>
            ))}
          </aside>

          <div className="signature-pages" aria-label="Editor de PDF">
            {pagePreviews.map((page) => (
              <section
                className="signature-page"
                onClick={() => setSelectedPages([page.id])}
                onPointerMove={(event) => {
                  if (draggingSignatureId) moveSignature(event, page.id, draggingSignatureId);
                }}
                onPointerUp={() => setDraggingSignatureId(null)}
                key={page.id}
              >
                <div className="signature-page-number">Pagina {page.pageNumber}</div>
                <div className="document-thumb signature-page-paper">
                  <img src={page.thumbnail} alt={`Pagina ${page.pageNumber}`} />
                  {placedSignatures
                    .filter((signature) => signature.pageId === page.id)
                    .map((signature) => (
                      <span
                        className="signature-marker signature-image-marker"
                        style={{
                          left: `${signature.xPct * 100}%`,
                          top: `${signature.yPct * 100}%`,
                          width: `${120 * signature.scale}px`,
                          height: `${44 * signature.scale}px`
                        }}
                        onPointerDown={(event) => {
                          event.stopPropagation();
                          setDraggingSignatureId(signature.id);
                        }}
                        key={signature.id}
                        >
                          <img src={signature.dataUrl} alt="Firma" />
                          <div className="signature-inline-controls" onPointerDown={(event) => event.stopPropagation()}>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                resizeSignature(signature.id, -0.15);
                              }}
                              aria-label="Reducir firma"
                            >
                              -
                            </button>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                resizeSignature(signature.id, 0.15);
                              }}
                              aria-label="Ampliar firma"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="signature-remove"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSignature(signature.id);
                          }}
                          aria-label="Quitar firma"
                        >
                          x
                        </button>
                      </span>
                    ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="signature-sidebar">
            <h3>Opciones de firma</h3>
            <div className="signature-type-card active">
              <span className="signature-type-icon">Firma</span>
              <strong>Firma simple</strong>
            </div>
            <div className="signature-pad-wrap">
              <label>Dibuja una firma</label>
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
              <div className="signature-actions">
                <button type="button" className="small-action primary-small" onClick={addSignatureToPdf} disabled={!signaturePreview}>
                  Anadir firma
                </button>
                <button type="button" className="small-action" onClick={clearSignature}>
                  Borrar dibujo
                </button>
              </div>
            </div>
            <div className="signature-list">
              <h4>Firmas colocadas</h4>
              {placedSignatures.length === 0 ? (
                <p>Cuando anadas una firma aparecera aqui.</p>
              ) : (
                placedSignatures.map((signature, index) => (
                  <div className="signature-list-item" key={signature.id}>
                    <img src={signature.dataUrl} alt={`Firma ${index + 1}`} />
                    <span>Firma {index + 1}</span>
                    <button type="button" onClick={() => resizeSignature(signature.id, -0.15)} aria-label="Reducir firma">
                      -
                    </button>
                    <button type="button" onClick={() => resizeSignature(signature.id, 0.15)} aria-label="Ampliar firma">
                      +
                    </button>
                    <button type="button" onClick={() => removeSignature(signature.id)} aria-label="Quitar firma">
                      Quitar
                    </button>
                  </div>
                ))
              )}
            </div>
          </aside>
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
                  if (tool.slug === "firmar-pdf") setSelectedPages([page.id]);
                }}
                onPointerMove={(event) => {
                  if (tool.slug === "firmar-pdf" && draggingSignatureId) {
                    moveSignature(event, page.id, draggingSignatureId);
                  }
                }}
                onPointerUp={() => setDraggingSignatureId(null)}
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
                  {tool.slug === "firmar-pdf" &&
                    placedSignatures
                      .filter((signature) => signature.pageId === page.id)
                      .map((signature) => (
                        <span
                          className="signature-marker signature-image-marker"
                          style={{ left: `${signature.xPct * 100}%`, top: `${signature.yPct * 100}%` }}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            setDraggingSignatureId(signature.id);
                          }}
                          key={signature.id}
                        >
                          <img src={signature.dataUrl} alt="Firma" />
                        </span>
                      ))}
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
        {status === "processing" ? t.processing : `${t.process} ${tool.title}`}
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

function WorldClockConverter({ tool, locale }: { tool: Tool; locale: Locale }) {
  const [now, setNow] = useState<Date | null>(null);
  const [selectedZone, setSelectedZone] = useState("America/New_York");
  const [query, setQuery] = useState("");
  const labels = locale === "en" ? worldClockLabels.en : worldClockLabels.es;
  const zones = useMemo(() => getWorldClockZones(locale), [locale]);
  const localZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Madrid", []);
  const localParts = useMemo(() => getZoneParts(now ?? new Date(), localZone, locale), [localZone, locale, now]);
  const selectedParts = useMemo(() => getZoneParts(now ?? new Date(), selectedZone, locale), [locale, now, selectedZone]);
  const filteredZones = useMemo(() => {
    const normalized = normalizeSearch(query);
    if (!normalized) return zones.slice(0, 18);
    return zones
      .filter((zone) =>
        normalizeSearch(
          `${zone.label} ${zone.enLabel} ${zone.countryName} ${zone.enCountryName} ${zone.countryCode} ${zone.cities.join(" ")} ${zone.timeZone}`
        ).includes(normalized)
      )
      .slice(0, 60);
  }, [query, zones]);
  const popularZones = useMemo(
    () => zones.filter((zone) => popularWorldClockZones.includes(zone.timeZone) && zone.timeZone !== selectedZone).slice(0, 8),
    [selectedZone, zones]
  );

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="tool-workspace world-clock-workspace">
      <h2>{tool.title}</h2>

      <div className="world-clock-grid">
        <ClockCard title={labels.local} zone={localZone} parts={localParts} locale={locale} featured />
        <ClockCard title={labels.selected} zone={selectedZone} parts={selectedParts} locale={locale} />
      </div>

      <div className="world-clock-search">
        <div className="field">
          <label htmlFor="world-clock-search">{labels.search}</label>
          <input
            id="world-clock-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={labels.placeholder}
          />
        </div>
        <div className="world-clock-zone-list" aria-label={labels.results}>
          {filteredZones.map((zone) => {
            const parts = getZoneParts(now ?? new Date(), zone.timeZone, locale);
            return (
              <button
                type="button"
                className={zone.timeZone === selectedZone ? "world-clock-zone active" : "world-clock-zone"}
                key={zone.timeZone}
                onClick={() => setSelectedZone(zone.timeZone)}
              >
                <span>{locale === "en" ? zone.enLabel : zone.label}</span>
                <strong>{parts.time}</strong>
                <small>{zone.timeZone}</small>
              </button>
            );
          })}
        </div>
      </div>

      <h3 className="world-clock-subtitle">{labels.popular}</h3>
      <div className="world-clock-list">
        {popularZones.map((zone) => {
          const parts = getZoneParts(now ?? new Date(), zone.timeZone, locale);
          return (
            <div className="world-clock-row" key={zone.timeZone}>
              <span>{locale === "en" ? zone.enLabel : zone.label}</span>
              <strong>{parts.time}</strong>
              <small>{parts.date}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClockCard({
  title,
  zone,
  parts,
  locale,
  featured = false
}: {
  title: string;
  zone: string;
  parts: ZoneParts;
  locale: Locale;
  featured?: boolean;
}) {
  const zoneLabel = getWorldClockZones(locale).find((item) => item.timeZone === zone);
  const hourAngle = ((parts.hour % 12) + parts.minute / 60) * 30;
  const minuteAngle = parts.minute * 6;
  return (
    <article className={featured ? "clock-card featured" : "clock-card"}>
      <div>
        <span>{title}</span>
        <h3>{zoneLabel ? (locale === "en" ? zoneLabel.enLabel : zoneLabel.label) : zone}</h3>
      </div>
      <div className="analog-clock" aria-hidden="true">
        <i className="clock-mark top" />
        <i className="clock-mark right" />
        <i className="clock-mark bottom" />
        <i className="clock-mark left" />
        <b className="clock-hand hour" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
        <b className="clock-hand minute" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
        <em />
      </div>
      <strong>{parts.time}</strong>
      <small>{parts.date}</small>
    </article>
  );
}

type ZoneParts = {
  time: string;
  date: string;
  hour: number;
  minute: number;
};

const worldClockLabels = {
  es: {
    local: "Hora local",
    selected: "Hora seleccionada",
    search: "Buscar pais, ciudad o zona horaria",
    placeholder: "Ej: España, Japón, Nueva York, México, Argentina...",
    results: "Zonas horarias",
    popular: "Horas populares"
  },
  en: {
    local: "Local time",
    selected: "Selected time",
    search: "Search country, city or time zone",
    placeholder: "Example: Spain, Japan, New York, Mexico, Argentina...",
    results: "Time zones",
    popular: "Popular times"
  }
} as const;

type WorldClockZone = {
  timeZone: string;
  label: string;
  enLabel: string;
  countryName: string;
  enCountryName: string;
  countryCode: string;
  cities: string[];
};

const worldClockAliases: Record<string, { label: string; enLabel: string }> = {
  "Europe/Madrid": { label: "España - Madrid", enLabel: "Spain - Madrid" },
  "Europe/London": { label: "Reino Unido - Londres", enLabel: "United Kingdom - London" },
  "Europe/Paris": { label: "Francia - París", enLabel: "France - Paris" },
  "Europe/Berlin": { label: "Alemania - Berlin", enLabel: "Germany - Berlin" },
  "America/New_York": { label: "Estados Unidos - Nueva York", enLabel: "United States - New York" },
  "America/Los_Angeles": { label: "Estados Unidos - Los Angeles", enLabel: "United States - Los Angeles" },
  "America/Mexico_City": { label: "Mexico - Ciudad de Mexico", enLabel: "Mexico - Mexico City" },
  "America/Bogota": { label: "Colombia - Bogota", enLabel: "Colombia - Bogota" },
  "America/Argentina/Buenos_Aires": { label: "Argentina - Buenos Aires", enLabel: "Argentina - Buenos Aires" },
  "America/Sao_Paulo": { label: "Brasil - Sao Paulo", enLabel: "Brazil - Sao Paulo" },
  "Asia/Dubai": { label: "Emiratos - Dubai", enLabel: "UAE - Dubai" },
  "Asia/Tokyo": { label: "Japón - Tokio", enLabel: "Japan - Tokyo" },
  "Asia/Shanghai": { label: "China - Shanghai", enLabel: "China - Shanghai" },
  "Asia/Kolkata": { label: "India - Nueva Delhi", enLabel: "India - New Delhi" },
  "Australia/Sydney": { label: "Australia - Sidney", enLabel: "Australia - Sydney" }
};

const popularWorldClockZones = [
  "Europe/Madrid",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/Bogota",
  "America/Argentina/Buenos_Aires",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney"
];

function getWorldClockZones(locale: Locale): WorldClockZone[] {
  const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames([locale === "en" ? "en" : "es"], { type: "region" }) : null;
  const seen = new Set<string>();

  return rawTimeZones
    .filter((zone) => {
      if (!zone.countryCode || seen.has(zone.name)) return false;
      seen.add(zone.name);
      return true;
    })
    .map((zone) => {
      const alias = worldClockAliases[zone.name];
      const localizedCountry = regionNames?.of(zone.countryCode) ?? zone.countryName;
      const cityLabel = zone.mainCities.length > 0 ? zone.mainCities.slice(0, 2).join(", ") : timeZoneToLabel(zone.name);
      return {
        timeZone: zone.name,
        label: alias?.label ?? `${localizedCountry} - ${cityLabel}`,
        enLabel: alias?.enLabel ?? `${zone.countryName} - ${cityLabel}`,
        countryName: localizedCountry,
        enCountryName: zone.countryName,
        countryCode: zone.countryCode,
        cities: zone.mainCities
      };
    })
    .sort((a, b) => (locale === "en" ? a.enLabel.localeCompare(b.enLabel) : a.label.localeCompare(b.label)));
}

function getZoneParts(date: Date, timeZone: string, locale: Locale): ZoneParts {
  const parts = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-ES", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  const hour = Number(get("hour")) % 24;
  const minute = Number(get("minute"));
  return {
    time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    date: `${get("day")} ${get("month")} ${get("year")}`,
    hour,
    minute
  };
}

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function timeZoneToLabel(timeZone: string) {
  const [region, ...rest] = timeZone.split("/");
  const place = rest.join(" / ").replace(/_/g, " ");
  return place ? `${region} - ${place}` : timeZone.replace(/_/g, " ");
}

function UnitConverter({ tool, locale }: { tool: Tool; locale: Locale }) {
  const config = converterConfigs[tool.slug] ?? converterConfigs.longitud;
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState(config.defaultFrom);
  const [to, setTo] = useState(config.defaultTo);
  const [currencyRates, setCurrencyRates] = useState<Record<string, number>>({});
  const [currencyDate, setCurrencyDate] = useState("");
  const [currencyStatus, setCurrencyStatus] = useState<"idle" | "loading" | "live" | "fallback">("idle");

  useEffect(() => {
    setValue(1);
    setFrom(config.defaultFrom);
    setTo(config.defaultTo);
  }, [config.defaultFrom, config.defaultTo]);

  const fromUnit = config.units.find((unit) => unit.id === from) ?? config.units[0];
  const toUnit = config.units.find((unit) => unit.id === to) ?? config.units[1] ?? config.units[0];
  const isCurrency = tool.slug === "divisa";
  const result = useMemo(() => {
    if (isCurrency) return convertCurrencyValue(value, fromUnit, toUnit, currencyRates, config);
    return config.convert(value, fromUnit, toUnit);
  }, [config, currencyRates, fromUnit, isCurrency, toUnit, value]);
  const quickResults = useMemo(
    () =>
      config.units
        .filter((unit) => unit.id !== from)
        .slice(0, 7)
        .map((unit) => ({
          unit,
          value: isCurrency ? convertCurrencyValue(value, fromUnit, unit, currencyRates, config) : config.convert(value, fromUnit, unit)
        })),
    [config, currencyRates, from, fromUnit, isCurrency, value]
  );
  const labels = locale === "en" ? converterLabels.en : converterLabels.es;

  useEffect(() => {
    if (!isCurrency) return;
    let cancelled = false;
    const controller = new AbortController();

    async function loadRates() {
      setCurrencyStatus("loading");
      try {
        const base = fromUnit.symbol.toUpperCase();
        const quotes = config.units
          .map((unit) => unit.symbol.toUpperCase())
          .filter((symbol) => symbol !== base)
          .join(",");
        const response = await fetch(`/api/currency?base=${base}&quotes=${quotes}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Currency API error");
        const data = (await response.json()) as { date?: string; rates?: Record<string, number> };
        if (cancelled) return;
        setCurrencyRates(
          Object.fromEntries(
            Object.entries(data.rates ?? {}).map(([code, rate]) => [code.toLowerCase(), rate])
          )
        );
        setCurrencyDate(data.date ?? "");
        setCurrencyStatus("live");
      } catch {
        if (!cancelled) setCurrencyStatus("fallback");
      }
    }

    loadRates();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [config.units, fromUnit.symbol, isCurrency]);

  return (
    <div className="tool-workspace converter-workspace">
      <h2>{tool.title}</h2>
      <div className="converter-panel">
        <div className="converter-main">
          <NumberField label={labels.amount} value={value} onChange={setValue} step={config.step ?? 0.01} />
          <div className="field">
            <label htmlFor="converter-from">{labels.from}</label>
            <select id="converter-from" value={from} onChange={(event) => setFrom(event.target.value)}>
              {config.units.map((unit) => (
                <option value={unit.id} key={unit.id}>
                  {locale === "en" && unit.enLabel ? unit.enLabel : unit.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="swap-button"
            type="button"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            {labels.swap}
          </button>
          <div className="field">
            <label htmlFor="converter-to">{labels.to}</label>
            <select id="converter-to" value={to} onChange={(event) => setTo(event.target.value)}>
              {config.units.map((unit) => (
                <option value={unit.id} key={unit.id}>
                  {locale === "en" && unit.enLabel ? unit.enLabel : unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="converter-result">
          <span>{labels.result}</span>
          <strong>{formatConverterNumber(result)} {toUnit.symbol}</strong>
          <small>
            {formatConverterNumber(value)} {fromUnit.symbol} = {formatConverterNumber(result)} {toUnit.symbol}
          </small>
        </div>
      </div>
      <div className="converter-table" aria-label={labels.quick}>
        {quickResults.map(({ unit, value: converted }) => (
          <div className="converter-row" key={unit.id}>
            <span>{locale === "en" && unit.enLabel ? unit.enLabel : unit.label}</span>
            <strong>
              {formatConverterNumber(converted)} {unit.symbol}
            </strong>
          </div>
        ))}
      </div>
      {isCurrency && (
        <p className={`converter-note currency-note ${currencyStatus}`}>
          {currencyStatus === "live"
            ? locale === "en"
              ? `Live exchange rates loaded from Frankfurter${currencyDate ? `, date ${currencyDate}` : ""}.`
              : `Tipos de cambio actualizados desde Frankfurter${currencyDate ? `, fecha ${currencyDate}` : ""}.`
            : currencyStatus === "loading"
              ? locale === "en"
                ? "Updating exchange rates..."
                : "Actualizando tipos de cambio..."
              : locale === "en"
                ? "Could not update rates. Showing fallback reference values."
                : "No se pudieron actualizar los cambios. Mostrando valores orientativos de respaldo."}
        </p>
      )}
      {config.note && !isCurrency && <p className="converter-note">{locale === "en" && config.enNote ? config.enNote : config.note}</p>}
    </div>
  );
}

type ConverterUnit = {
  id: string;
  label: string;
  enLabel?: string;
  symbol: string;
  factor?: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
};

type ConverterConfig = {
  defaultFrom: string;
  defaultTo: string;
  step?: number;
  units: ConverterUnit[];
  note?: string;
  enNote?: string;
  convert: (value: number, from: ConverterUnit, to: ConverterUnit) => number;
};

const converterLabels = {
  es: {
    amount: "Cantidad",
    from: "De",
    to: "A",
    swap: "Intercambiar",
    result: "Resultado",
    quick: "Conversiones rapidas"
  },
  en: {
    amount: "Amount",
    from: "From",
    to: "To",
    swap: "Swap",
    result: "Result",
    quick: "Quick conversions"
  }
} as const;

function factorConverter(units: ConverterUnit[]): ConverterConfig["convert"] {
  return (value, from, to) => (value * (from.factor ?? 1)) / (to.factor ?? 1);
}

function customConverter(value: number, from: ConverterUnit, to: ConverterUnit) {
  const base = from.toBase ? from.toBase(value) : value * (from.factor ?? 1);
  return to.fromBase ? to.fromBase(base) : base / (to.factor ?? 1);
}

function convertCurrencyValue(
  value: number,
  from: ConverterUnit,
  to: ConverterUnit,
  liveRates: Record<string, number>,
  config: ConverterConfig
) {
  if (from.id === to.id) return value;
  const liveRate = liveRates[to.id];
  if (Number.isFinite(liveRate)) return value * liveRate;
  return config.convert(value, from, to);
}

const converterConfigs: Record<string, ConverterConfig> = {
  divisa: (() => {
    const units: ConverterUnit[] = [
      { id: "eur", label: "Euro", enLabel: "Euro", symbol: "EUR", factor: 1 },
      { id: "usd", label: "Dolar estadounidense", enLabel: "US dollar", symbol: "USD", factor: 0.92 },
      { id: "gbp", label: "Libra esterlina", enLabel: "British pound", symbol: "GBP", factor: 1.17 },
      { id: "chf", label: "Franco suizo", enLabel: "Swiss franc", symbol: "CHF", factor: 1.06 },
      { id: "jpy", label: "Yen japones", enLabel: "Japanese yen", symbol: "JPY", factor: 0.0059 },
      { id: "cad", label: "Dolar canadiense", enLabel: "Canadian dollar", symbol: "CAD", factor: 0.67 },
      { id: "aud", label: "Dolar australiano", enLabel: "Australian dollar", symbol: "AUD", factor: 0.61 },
      { id: "mxn", label: "Peso mexicano", enLabel: "Mexican peso", symbol: "MXN", factor: 0.050 }
    ];
    return {
      defaultFrom: "eur",
      defaultTo: "usd",
      step: 0.01,
      units,
      note: "Los tipos de cambio son orientativos y no se actualizan en tiempo real.",
      enNote: "Exchange rates are indicative and are not updated in real time.",
      convert: factorConverter(units)
    };
  })(),
  longitud: (() => {
    const units: ConverterUnit[] = [
      { id: "m", label: "Metro", enLabel: "Meter", symbol: "m", factor: 1 },
      { id: "km", label: "Kilometro", enLabel: "Kilometer", symbol: "km", factor: 1000 },
      { id: "cm", label: "Centimetro", enLabel: "Centimeter", symbol: "cm", factor: 0.01 },
      { id: "mm", label: "Milimetro", enLabel: "Millimeter", symbol: "mm", factor: 0.001 },
      { id: "mi", label: "Milla", enLabel: "Mile", symbol: "mi", factor: 1609.344 },
      { id: "yd", label: "Yarda", enLabel: "Yard", symbol: "yd", factor: 0.9144 },
      { id: "ft", label: "Pie", enLabel: "Foot", symbol: "ft", factor: 0.3048 },
      { id: "in", label: "Pulgada", enLabel: "Inch", symbol: "in", factor: 0.0254 }
    ];
    return { defaultFrom: "m", defaultTo: "ft", units, convert: factorConverter(units) };
  })(),
  hora: (() => {
    const units: ConverterUnit[] = [
      { id: "s", label: "Segundo", enLabel: "Second", symbol: "s", factor: 1 },
      { id: "min", label: "Minuto", enLabel: "Minute", symbol: "min", factor: 60 },
      { id: "h", label: "Hora", enLabel: "Hour", symbol: "h", factor: 3600 },
      { id: "d", label: "Dia", enLabel: "Day", symbol: "d", factor: 86400 },
      { id: "wk", label: "Semana", enLabel: "Week", symbol: "sem", factor: 604800 },
      { id: "mo", label: "Mes medio", enLabel: "Average month", symbol: "mes", factor: 2629800 },
      { id: "yr", label: "Ano medio", enLabel: "Average year", symbol: "ano", factor: 31557600 }
    ];
    return { defaultFrom: "h", defaultTo: "min", units, convert: factorConverter(units) };
  })(),
  temperatura: (() => {
    const units: ConverterUnit[] = [
      { id: "c", label: "Celsius", symbol: "°C", toBase: (value) => value + 273.15, fromBase: (value) => value - 273.15 },
      { id: "f", label: "Fahrenheit", symbol: "°F", toBase: (value) => ((value - 32) * 5) / 9 + 273.15, fromBase: (value) => ((value - 273.15) * 9) / 5 + 32 },
      { id: "k", label: "Kelvin", symbol: "K", toBase: (value) => value, fromBase: (value) => value }
    ];
    return { defaultFrom: "c", defaultTo: "f", step: 0.1, units, convert: customConverter };
  })(),
  peso: (() => {
    const units: ConverterUnit[] = [
      { id: "kg", label: "Kilogramo", enLabel: "Kilogram", symbol: "kg", factor: 1 },
      { id: "g", label: "Gramo", enLabel: "Gram", symbol: "g", factor: 0.001 },
      { id: "t", label: "Tonelada", enLabel: "Tonne", symbol: "t", factor: 1000 },
      { id: "lb", label: "Libra", enLabel: "Pound", symbol: "lb", factor: 0.45359237 },
      { id: "oz", label: "Onza", enLabel: "Ounce", symbol: "oz", factor: 0.028349523125 },
      { id: "st", label: "Stone", symbol: "st", factor: 6.35029318 }
    ];
    return { defaultFrom: "kg", defaultTo: "lb", units, convert: factorConverter(units) };
  })(),
  "datos-digitales": (() => {
    const units: ConverterUnit[] = [
      { id: "b", label: "Byte", symbol: "B", factor: 1 },
      { id: "kb", label: "Kilobyte", symbol: "KB", factor: 1000 },
      { id: "mb", label: "Megabyte", symbol: "MB", factor: 1000 ** 2 },
      { id: "gb", label: "Gigabyte", symbol: "GB", factor: 1000 ** 3 },
      { id: "tb", label: "Terabyte", symbol: "TB", factor: 1000 ** 4 },
      { id: "kib", label: "Kibibyte", symbol: "KiB", factor: 1024 },
      { id: "mib", label: "Mebibyte", symbol: "MiB", factor: 1024 ** 2 },
      { id: "gib", label: "Gibibyte", symbol: "GiB", factor: 1024 ** 3 }
    ];
    return { defaultFrom: "mb", defaultTo: "gb", units, convert: factorConverter(units) };
  })(),
  capacidad: (() => {
    const units: ConverterUnit[] = [
      { id: "l", label: "Litro", enLabel: "Liter", symbol: "l", factor: 1 },
      { id: "ml", label: "Mililitro", enLabel: "Milliliter", symbol: "ml", factor: 0.001 },
      { id: "m3", label: "Metro cubico", enLabel: "Cubic meter", symbol: "m³", factor: 1000 },
      { id: "gal-us", label: "Galon US", enLabel: "US gallon", symbol: "gal US", factor: 3.785411784 },
      { id: "gal-uk", label: "Galon imperial", enLabel: "Imperial gallon", symbol: "gal UK", factor: 4.54609 },
      { id: "pt", label: "Pinta US", enLabel: "US pint", symbol: "pt", factor: 0.473176473 },
      { id: "cup", label: "Taza US", enLabel: "US cup", symbol: "cup", factor: 0.2365882365 },
      { id: "floz", label: "Onza liquida US", enLabel: "US fluid ounce", symbol: "fl oz", factor: 0.0295735295625 }
    ];
    return { defaultFrom: "l", defaultTo: "ml", units, convert: factorConverter(units) };
  })(),
  area: (() => {
    const units: ConverterUnit[] = [
      { id: "m2", label: "Metro cuadrado", enLabel: "Square meter", symbol: "m²", factor: 1 },
      { id: "km2", label: "Kilometro cuadrado", enLabel: "Square kilometer", symbol: "km²", factor: 1000000 },
      { id: "cm2", label: "Centimetro cuadrado", enLabel: "Square centimeter", symbol: "cm²", factor: 0.0001 },
      { id: "ha", label: "Hectarea", enLabel: "Hectare", symbol: "ha", factor: 10000 },
      { id: "ft2", label: "Pie cuadrado", enLabel: "Square foot", symbol: "ft²", factor: 0.09290304 },
      { id: "yd2", label: "Yarda cuadrada", enLabel: "Square yard", symbol: "yd²", factor: 0.83612736 },
      { id: "acre", label: "Acre", symbol: "ac", factor: 4046.8564224 }
    ];
    return { defaultFrom: "m2", defaultTo: "ft2", units, convert: factorConverter(units) };
  })(),
  volumen: (() => {
    const units: ConverterUnit[] = [
      { id: "m3", label: "Metro cubico", enLabel: "Cubic meter", symbol: "m³", factor: 1 },
      { id: "cm3", label: "Centimetro cubico", enLabel: "Cubic centimeter", symbol: "cm³", factor: 0.000001 },
      { id: "l", label: "Litro", enLabel: "Liter", symbol: "l", factor: 0.001 },
      { id: "ml", label: "Mililitro", enLabel: "Milliliter", symbol: "ml", factor: 0.000001 },
      { id: "ft3", label: "Pie cubico", enLabel: "Cubic foot", symbol: "ft³", factor: 0.028316846592 },
      { id: "in3", label: "Pulgada cubica", enLabel: "Cubic inch", symbol: "in³", factor: 0.000016387064 },
      { id: "yd3", label: "Yarda cubica", enLabel: "Cubic yard", symbol: "yd³", factor: 0.764554857984 }
    ];
    return { defaultFrom: "m3", defaultTo: "l", units, convert: factorConverter(units) };
  })(),
  energia: (() => {
    const units: ConverterUnit[] = [
      { id: "j", label: "Julio", enLabel: "Joule", symbol: "J", factor: 1 },
      { id: "kj", label: "Kilojulio", enLabel: "Kilojoule", symbol: "kJ", factor: 1000 },
      { id: "cal", label: "Caloria", enLabel: "Calorie", symbol: "cal", factor: 4.184 },
      { id: "kcal", label: "Kilocaloria", enLabel: "Kilocalorie", symbol: "kcal", factor: 4184 },
      { id: "wh", label: "Vatio hora", enLabel: "Watt-hour", symbol: "Wh", factor: 3600 },
      { id: "kwh", label: "Kilovatio hora", enLabel: "Kilowatt-hour", symbol: "kWh", factor: 3600000 },
      { id: "btu", label: "BTU", symbol: "BTU", factor: 1055.05585262 }
    ];
    return { defaultFrom: "kwh", defaultTo: "j", units, convert: factorConverter(units) };
  })()
};

function formatConverterNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("es-ES", {
    maximumFractionDigits: Math.abs(value) >= 1000 ? 2 : 6
  }).format(value);
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
    placedSignatures: PlacedSignature[];
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
    for (const signature of options.placedSignatures) {
      const signatureBytes = await fetch(signature.dataUrl).then((response) => response.arrayBuffer());
      const signatureImage = await source.embedPng(signatureBytes);
      const selectedPageIndex = Number(signature.pageId.split("-")[1]);
      const page = pages[Math.min(Math.max(selectedPageIndex, 0), pages.length - 1)];
      const { width, height } = page.getSize();
      const signatureWidth = Math.min(220 * signature.scale, width - 112);
      const signatureHeight = 76 * signature.scale;
      page.drawImage(signatureImage, {
        x: Math.min(Math.max(signature.xPct * width - signatureWidth / 2, 16), width - signatureWidth - 16),
        y: Math.min(Math.max(height - signature.yPct * height - signatureHeight / 2, 16), height - signatureHeight - 16),
        width: signatureWidth,
        height: signatureHeight
      });
    }
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

async function loadPdfJs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.mjs", import.meta.url).toString();
  return pdfjs;
}
