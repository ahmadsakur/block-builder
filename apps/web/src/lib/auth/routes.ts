import type { Role } from "@block-builder/shared/auth";
import type { PermissionKey } from "@block-builder/shared/entitlements";

const HOME_BY_ROLE: Record<Role, string> = {
  root: "/back-office",
  user: "/dashboard",
};

const AUTH_PAGES = ["/sign-in", "/sign-up"];

export function homeFor(role: Role): string {
  return HOME_BY_ROLE[role];
}

function areaRole(pathname: string): Role | undefined {
  return (Object.keys(HOME_BY_ROLE) as Role[]).find((role) => {
    const home = HOME_BY_ROLE[role];
    return pathname === home || pathname.startsWith(`${home}/`);
  });
}

export function proxyRedirect(
  pathname: string,
  role: Role | null,
): string | null {
  const area = areaRole(pathname);
  if (!area) {
    return role && AUTH_PAGES.includes(pathname) ? homeFor(role) : null;
  }
  if (!role) return "/sign-in";
  return role === area ? null : homeFor(role);
}

export const UPGRADE_PATH = "/dashboard/upgrade";

const GATED_PAGES: Record<string, PermissionKey> = {
  "/dashboard/analytics": "analytics.view",
};

export function gateFor(pathname: string): PermissionKey | undefined {
  const page = Object.keys(GATED_PAGES).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  return page ? GATED_PAGES[page] : undefined;
}

export function upgradeHref(permission: PermissionKey): string {
  return `${UPGRADE_PATH}?${new URLSearchParams({ permission })}`;
}
