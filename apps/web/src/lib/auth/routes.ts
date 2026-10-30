import type { Role } from "@block-builder/shared/auth";

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
