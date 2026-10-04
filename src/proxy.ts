import { NextResponse, type NextRequest } from "next/server";

// Optimistic gate only: bounces visitors without a session cookie away from /admin.
// The real check (session lookup) happens in requireAdmin() on every admin page and action.
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return;
  if (!request.cookies.has("umb_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = { matcher: ["/admin/:path*"] };
