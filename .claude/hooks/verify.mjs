// Stop: when the working tree changed since the last green run, run lint,
// typecheck and tests related to the changes. On failure, block the stop once
// and hand the output to Claude; a second failure only warns, to avoid loops.
import { execSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

let raw = "";
for await (const chunk of process.stdin) raw += chunk;
const input = JSON.parse(raw || "{}");

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const stateFile = path.join(
  root,
  "node_modules/.cache/claude-verify/last-green",
);

const git = (args) => {
  try {
    return execSync(`git ${args}`, {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return "";
  }
};

// Fingerprint the dirty tree: tracked diff + untracked file stats.
const diff = git("diff HEAD");
const untracked = git("ls-files --others --exclude-standard")
  .split("\n")
  .filter(Boolean);
if (!diff && untracked.length === 0) process.exit(0);

const hash = createHash("sha1").update(diff);
for (const file of untracked) {
  const stat = statSync(path.join(root, file), { throwIfNoEntry: false });
  hash.update(`${file}:${stat?.size}:${stat?.mtimeMs}\n`);
}
const fingerprint = hash.digest("hex");

let lastGreen = "";
try {
  lastGreen = readFileSync(stateFile, "utf8");
} catch {}
if (lastGreen === fingerprint) process.exit(0);

const steps = [
  ["lint", "pnpm -s lint"],
  ["typecheck", "pnpm -s typecheck"],
  [
    "test",
    "pnpm --filter @block-builder/web exec vitest run --changed --passWithNoTests",
  ],
];

const failures = [];
for (const [name, command] of steps) {
  const result = spawnSync(command, {
    cwd: root,
    shell: true,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const output = `${result.stdout}${result.stderr}`.trim().slice(-4000);
    failures.push({ name, report: `## ${name} (\`${command}\`)\n${output}` });
  }
}

if (failures.length === 0) {
  mkdirSync(path.dirname(stateFile), { recursive: true });
  writeFileSync(stateFile, fingerprint);
  process.exit(0);
}

const names = failures.map((f) => f.name).join(", ");
const reports = failures.map((f) => f.report).join("\n\n");
const output = input.stop_hook_active
  ? { systemMessage: `Checks still failing: ${names}. Run pnpm check.` }
  : {
      decision: "block",
      reason: `Checks failed. Fix before finishing:\n\n${reports}`,
    };
process.stdout.write(JSON.stringify(output));
