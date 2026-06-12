import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", pathname.startsWith("/en") ? "en" : "es");

  if (
    pathname.startsWith("/en") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/ads.txt" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const acceptLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";
  const prefersEnglish = acceptLanguage.split(",").some((part) => part.trim().startsWith("en"));
  const prefersSpanish = acceptLanguage.split(",").some((part) => part.trim().startsWith("es"));

  if (prefersEnglish && !prefersSpanish) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
