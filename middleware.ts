import { NextResponse, type NextRequest } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_HEADER,
  type Locale,
} from "@/lib/i18n/config";

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // favicon, images, manifests, etc.
  );
}

function applyLocale(
  response: NextResponse,
  locale: Locale,
): NextResponse {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  response.headers.set(LOCALE_HEADER, locale);
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  let locale: Locale = DEFAULT_LOCALE;
  let barePath = pathname;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    locale = "en";
    barePath = pathname === "/en" ? "/" : pathname.slice(3) || "/";
  } else if (pathname === "/es" || pathname.startsWith("/es/")) {
    locale = "es";
    barePath = pathname === "/es" ? "/" : pathname.slice(3) || "/";
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  if (locale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = barePath;
    const response = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    return applyLocale(response, locale);
  }

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  return applyLocale(response, locale);
}

export const config = {
  matcher: [
    /*
     * Match all paths except static files handled above.
     * Excludes Next internals explicitly.
     */
    "/((?!_next/static|_next/image|.*\\..*).*)",
  ],
};
