// Fails when source code uses raw colors instead of design tokens from globals.css.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const SRC = path.resolve(import.meta.dirname, "..", "src");
const PALETTE =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone";
const RULES = [
  new RegExp(
    `\\b(?:text|bg|border|fill|stroke|ring|outline|decoration|from|via|to|shadow|caret|accent|divide|placeholder)-(?:${PALETTE})-\\d{2,3}\\b`,
    "g",
  ),
  new RegExp(`--color-(?:${PALETTE})-\\d{2,3}\\b`, "g"),
  /\[#[0-9a-fA-F]{3,8}\]|["'`]#[0-9a-fA-F]{3,8}["'`]/g,
];

function* sourceFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(full);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield full;
  }
}

const hits = [];
for (const file of sourceFiles(SRC)) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      for (const rule of RULES) {
        for (const match of line.matchAll(rule)) {
          hits.push(
            `${path.relative(process.cwd(), file)}:${index + 1}  ${match[0]}`,
          );
        }
      }
    });
}

if (hits.length > 0) {
  console.error(
    `Raw colors found. Use tokens (text-success, bg-destructive/10, var(--color-chart-2), ...):\n${hits.join("\n")}`,
  );
  process.exit(1);
}
