# MyToolWorks

Web de herramientas online preparada para Vercel y el dominio `mytoolworks.com`.

## Que incluye

- Next.js con App Router.
- Paginas SEO estaticas para cada herramienta, por ejemplo `/pdf/unir-pdf` y `/calculadora/hipotecas`.
- `sitemap.xml`, `robots.txt`, metadatos, canonical URLs y JSON-LD por herramienta.
- Home responsive con categorias, herramientas destacadas y espacios reservados para anuncios.
- Herramientas funcionales de calculadoras, conversores, generador de CV/cartas y texto.
- Herramientas PDF preparadas para conectar un backend de procesamiento seguro.
- Registry modular en `lib/tools/registry.ts`.
- Endpoints base para `upload`, `jobs`, `ai` y `download`.

## Arquitectura

```text
app/
├── [categorySlug]/[toolSlug]/page.tsx  # template SEO de cualquier tool
├── api/                                # upload, jobs, ai, download
├── pdf/ calculadora/ conversor/        # hubs SEO por categoria
├── cv/ cartas/ texto/
└── components/

lib/
├── tools/registry.ts                   # fuente central de categorias y tools
├── ads.ts                              # perfiles de monetizacion
├── analytics.ts                        # eventos de herramientas
└── api/contracts.ts                    # contratos frontend/backend
```

## Como anadir una herramienta

1. Anade la herramienta en `lib/tools/registry.ts`.
2. Define `route`, `categorySlug`, `processing`, `input`, `output` y `adProfile`.
3. Si necesita UI propia, extiende `ToolRunner`.
4. El sitemap, hub de categoria, relacionados, metadata y rutas se generan desde el registry.

Ejemplo de ruta:

```text
/pdf/unir-pdf
/calculadora/hipotecas
/cv/generador
/texto/resumidor
```

## Comandos

```bash
npm install
npm run dev
npm run build
```

## Despliegue en Vercel

1. Sube este proyecto a GitHub.
2. Importa el repositorio desde Vercel.
3. En Vercel, asigna el dominio `mytoolworks.com`.
4. Revisa que Vercel haya configurado correctamente los DNS del dominio.

## Siguientes pasos recomendados

- Crear backend para PDF con colas de trabajo y limpieza automatica de archivos.
- Anadir politicas de privacidad, terminos y contacto antes de activar anuncios.
- Medir Core Web Vitals y Search Console tras publicar.
- Convertir los componentes principales en una base reutilizable para futura app movil.
