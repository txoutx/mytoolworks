/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    "/api/pdf-to-word": ["./scripts/pdf_to_docx.py", "./.python_packages/**/*"]
  }
};

export default nextConfig;
