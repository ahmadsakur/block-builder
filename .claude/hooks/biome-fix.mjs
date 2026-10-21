// PostToolUse (Write|Edit): Biome-fix the edited file. Anything Biome can't
// auto-fix goes back to Claude (exit 2) so it gets fixed in the same turn.
import { spawnSync } from "node:child_process";
import path from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const file = JSON.parse(raw || "{}").tool_input?.file_path;
if (!file) process.exit(0);

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const rel = path.relative(root, path.resolve(root, file));
if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0);

const biome = path.join(root, "node_modules/@biomejs/biome/bin/biome");
const result = spawnSync(
  process.execPath,
  [
    biome,
    "check",
    "--write",
    "--no-errors-on-unmatched",
    "--files-ignore-unknown=true",
    "--max-diagnostics=20",
    rel,
  ],
  { cwd: root, encoding: "utf8" },
);

if (result.status !== 0) {
  process.stderr.write(
    `Biome could not auto-fix ${rel}:\n${result.stdout}${result.stderr}`,
  );
  process.exit(2);
}
