import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    if (!pathname.startsWith("/admin")) {
      return NextResponse.next();
    }

    const isLogin = pathname === "/admin/login";
    let authenticated = false;
    try {
      const cookies = request.cookies.getAll();
      authenticated = cookies.some(
        (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token")
      );
    } catch {
      authenticated = false;
    }

    if (!isLogin && !authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (isLogin && authenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
