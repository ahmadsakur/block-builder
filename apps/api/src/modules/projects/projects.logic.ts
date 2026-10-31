import type { Project } from "@block-builder/shared/projects";

function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\n\r]/.test(safe) ? `"${safe.replaceAll('"', '""')}"` : safe;
}

export function projectsCsv(projects: readonly Project[]): string {
  const lines = projects.map((item) =>
    [item.id, item.name, item.createdAt].map(csvCell).join(","),
  );
  return `${["id,name,createdAt", ...lines].join("\n")}\n`;
}
