import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/middleware-supabase";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith("/admin");
  const isLogin = pathname === "/admin/login";

  // If Supabase is not configured yet, let admin area through to login only
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isAdminArea && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    const { response, user } = await updateSession(request);

    if (isAdminArea && !isLogin && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    if (isLogin && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.searchParams.delete("redirect");
      return NextResponse.redirect(url);
    }

    return response;
  } catch {
    // On any unexpected error, redirect admin to login rather than 500
    if (isAdminArea && !isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fotos|logos|patterns|.*\\.(?:png|jpg|jpeg|webp|svg|ico)).*)"],
};
