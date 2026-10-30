import { type Role, toRole } from "@block-builder/shared/auth";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { proxyRedirect } from "@/feature/auth/_shared/logic/auth.logic";

async function sessionRole(request: NextRequest): Promise<Role | null> {
  if (!getSessionCookie(request)) return null;
  const response = await fetch(`${env.API_URL}/api/auth/get-session`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  if (!response.ok) return null;
  const session: { user?: { role?: string } } | null = await response.json();
  return session?.user ? toRole(session.user.role) : null;
}

export async function proxy(request: NextRequest) {
  const target = proxyRedirect(
    request.nextUrl.pathname,
    await sessionRole(request),
  );
  if (!target) return NextResponse.next();
  return NextResponse.redirect(new URL(target, request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/app/:path*", "/sign-in", "/sign-up"],
};
