import { API } from "@block-builder/shared/api";
import { type Role, toRole } from "@block-builder/shared/auth";
import {
  isAllowed,
  type PermissionKey,
} from "@block-builder/shared/entitlements";
import type { MyEntitlements } from "@block-builder/shared/plans";
import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";
import { gateFor, proGate, proxyRedirect } from "@/lib/auth/routes";

async function fetchApi<T>(
  request: NextRequest,
  path: string,
): Promise<T | null> {
  const response = await fetch(`${env.API_URL}${path}`, {
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });
  return response.ok ? response.json() : null;
}

async function sessionRole(request: NextRequest): Promise<Role | null> {
  if (!getSessionCookie(request)) return null;
  const session = await fetchApi<{ user?: { role?: string } }>(
    request,
    "/api/auth/get-session",
  );
  return session?.user ? toRole(session.user.role) : null;
}

async function planAllows(
  request: NextRequest,
  permission: PermissionKey,
): Promise<boolean> {
  const mine = await fetchApi<MyEntitlements>(request, API.user.entitlements);
  return mine ? isAllowed(mine.entitlements, permission) : true;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await sessionRole(request);
  const target = proxyRedirect(pathname, role);
  if (target) return NextResponse.redirect(new URL(target, request.url));
  const permission = role === "user" ? gateFor(pathname) : undefined;
  const locked = permission ? !(await planAllows(request, permission)) : false;
  const step = proGate(new URL(request.nextUrl.href), locked);
  if (step?.kind === "rewrite") return NextResponse.rewrite(step.url);
  if (step?.kind === "redirect") return NextResponse.redirect(step.url);
  return NextResponse.next();
}

export const config = {
  matcher: ["/back-office/:path*", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
