import { NextResponse, type NextRequest } from "next/server";

function hasSupabaseSession(request: NextRequest): boolean {
  for (const name of request.cookies.getAll().map((c) => c.name)) {
    if (name.startsWith("sb-") && name.includes("-auth-token")) {
      return true;
    }
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminArea = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  const authenticated = hasSupabaseSession(request);

  if (isAdminArea && !isLogin && !authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isLogin && authenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.searchParams.delete("redirect");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fotos|logos|patterns|.*\\.(?:png|jpg|jpeg|webp|svg|ico)).*)"],
};
