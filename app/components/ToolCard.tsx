import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  ArrowLeftRight,
  AudioLines,
  BadgeInfo,
  Binary,
  BookText,
  Box,
  Combine,
  Crop,
  Clock3,
  Coins,
  Droplets,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileType,
  FormInput,
  GitCompare,
  Globe2,
  Hash,
  ImageDown,
  Languages,
  Lock,
  LockKeyhole,
  Map,
  Minimize2,
  PenTool,
  ListVideo,
  Presentation,
  Ruler,
  RotateCw,
  ScanText,
  Scissors,
  Shield,
  Split,
  Stamp,
  Tags,
  Thermometer,
  Video,
  UnlockKeyhole,
  Weight,
  Wrench,
  Youtube,
  Zap as ZapIcon
} from "lucide-react";
import type { Tool, ToolKind } from "../data/tools";
import type { Locale } from "../../lib/i18n";
import { ui } from "../../lib/i18n";

const iconMap: Partial<Record<ToolKind, ComponentType<{ size?: number; className?: string }>>> = {
  pdf: FileText,
  converter: ArrowLeftRight,
  youtube: Youtube
};

const toolIconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  "unir-pdf": Combine,
  "dividir-pdf": Split,
  "comprimir-pdf": Minimize2,
  "word-a-pdf": FileType,
  "powerpoint-a-pdf": Presentation,
  "excel-a-pdf": FileSpreadsheet,
  "editar-pdf": Crop,
  "pdf-a-jpg": FileImage,
  "jpg-a-pdf": FileImage,
  "firmar-pdf": PenTool,
  "marca-de-agua": Stamp,
  "rotar-pdf": RotateCw,
  "html-a-pdf": FileType,
  "proteger-pdf": LockKeyhole,
  "desbloquear-pdf": UnlockKeyhole,
  "ordenar-pdf": Combine,
  "pdf-a-pdfa": FileText,
  "reparar-pdf": Wrench,
  "numeracion-paginas": Hash,
  "escanea-a-pdf": ScanText,
  "ocr-pdf": ScanText,
  "comparar-pdf": GitCompare,
  "censurar-pdf": Shield,
  "recortar-pdf": Scissors,
  "formularios-pdf": FormInput,
  "resumir-pdf": BookText,
  "traducir-pdf": Languages,
  divisa: Coins,
  longitud: Ruler,
  hora: Clock3,
  "hora-mundial": Globe2,
  temperatura: Thermometer,
  peso: Weight,
  "datos-digitales": Binary,
  capacidad: Droplets,
  area: Map,
  volumen: Box,
  energia: ZapIcon,
  "youtube-a-mp3": AudioLines,
  "youtube-a-mp4": Video,
  "youtube-thumbnail-downloader": ImageDown,
  "youtube-metadata-viewer": BadgeInfo,
  "youtube-shorts-downloader": Youtube,
  "youtube-playlist-downloader": ListVideo,
  "youtube-transcript-extractor": ScanText,
  "youtube-tags-extractor": Tags
};

const pdfAccentByGroup: Record<string, string> = {
  Convertir: "coral",
  Organizar: "green",
  Editar: "purple",
  Seguridad: "blue",
  "OCR e IA": "yellow"
};

export function ToolCard({
  tool,
  compact = false,
  variant = "default",
  locale = "es"
}: {
  tool: Tool;
  compact?: boolean;
  variant?: "default" | "showcase";
  locale?: Locale;
}) {
  const Icon = toolIconMap[tool.slug] ?? iconMap[tool.kind] ?? FileText;
  const accent = getAccent(tool);
  const outputLabel = getOutputLabel(tool);
  const className = [
    "tool-card",
    compact ? "compact" : "",
    variant === "showcase" ? "showcase" : "",
    `accent-${accent}`
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link href={tool.route} className={className}>
      <div className="tool-icon" aria-hidden="true">
        <Icon size={22} />
        {outputLabel && <span className="mini-badge">{outputLabel}</span>}
        {tool.group === "Seguridad" && <Shield className="mini-glyph" size={12} />}
        {tool.slug.includes("firmar") && <PenTool className="mini-glyph" size={12} />}
        {tool.slug.includes("proteger") && <Lock className="mini-glyph" size={12} />}
      </div>
      <div>
        <h3>{tool.title}</h3>
        {!compact && <p>{tool.description}</p>}
      </div>
      {variant !== "showcase" && (
        <footer>
          {ui[locale].openTool} <ArrowRight size={15} aria-hidden="true" />
        </footer>
      )}
    </Link>
  );
}

function getAccent(tool: Tool) {
  if (tool.categorySlug === "pdf") return pdfAccentByGroup[tool.group] ?? pdfAccentByGroup[spanishGroup(tool.group)] ?? "coral";
  if (tool.categorySlug === "img") return "blue";
  if (tool.categorySlug === "conversor") return "green";
  if (tool.categorySlug === "youtube") return "coral";
  return "yellow";
}

function spanishGroup(group: string) {
  if (group === "Convert") return "Convertir";
  if (group === "Organize") return "Organizar";
  if (group === "Sign") return "Firmar";
  return group;
}

function getOutputLabel(tool: Tool) {
  if (tool.slug === "pdf-a-jpg") return "IMG";
  if (tool.output === "audio") return "MP3";
  if (tool.output === "video") return "MP4";
  if (tool.output === "jpg") return "JPG";
  return null;
}
