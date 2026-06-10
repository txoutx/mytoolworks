import Link from "next/link";
import type { ComponentType } from "react";
import {
  ArrowRight,
  BookText,
  Combine,
  Crop,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileType,
  FormInput,
  GitCompare,
  Hash,
  Languages,
  Lock,
  LockKeyhole,
  Minimize2,
  PenTool,
  Presentation,
  RotateCw,
  ScanText,
  Scissors,
  Shield,
  Split,
  Stamp,
  UnlockKeyhole,
  Wrench
} from "lucide-react";
import type { Tool, ToolKind } from "../data/tools";

const iconMap: Partial<Record<ToolKind, ComponentType<{ size?: number; className?: string }>>> = {
  pdf: FileText
};

const toolIconMap: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  "unir-pdf": Combine,
  "dividir-pdf": Split,
  "comprimir-pdf": Minimize2,
  "pdf-a-word": FileType,
  "pdf-a-powerpoint": Presentation,
  "pdf-a-excel": FileSpreadsheet,
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
  "traducir-pdf": Languages
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
  variant = "default"
}: {
  tool: Tool;
  compact?: boolean;
  variant?: "default" | "showcase";
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
          Abrir herramienta <ArrowRight size={15} aria-hidden="true" />
        </footer>
      )}
    </Link>
  );
}

function getAccent(tool: Tool) {
  if (tool.categorySlug === "pdf") return pdfAccentByGroup[tool.group] ?? "coral";
  if (tool.categorySlug === "calculadora") return "blue";
  if (tool.categorySlug === "conversor") return "green";
  if (tool.categorySlug === "cv") return "purple";
  if (tool.categorySlug === "cartas") return "coral";
  return "yellow";
}

function getOutputLabel(tool: Tool) {
  if (tool.slug === "pdf-a-jpg") return "IMG";
  if (tool.output === "docx") return "W";
  if (tool.output === "pptx") return "P";
  if (tool.output === "xlsx") return "X";
  if (tool.output === "jpg") return "JPG";
  return null;
}
