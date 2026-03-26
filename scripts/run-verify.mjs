import { spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lines = [];

function run(label, cmd, args) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, NODE_OPTIONS: process.env.NODE_OPTIONS ?? "" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  const out = `${r.stdout || ""}${r.stderr || ""}`.trim();
  if (r.status === 0) {
    lines.push(`${label}: PASS`);
    if (out) lines.push(out);
  } else {
    lines.push(`${label}: FAIL (exit ${r.status})`);
    if (out) lines.push(out);
    if (r.error) lines.push(String(r.error));
  }
}

run("tsc", process.execPath, [
  "node_modules/typescript/bin/tsc",
  "--noEmit",
]);
run("vitest", process.execPath, [
  "node_modules/vitest/vitest.mjs",
  "run",
]);

const outPath = join(root, "verify-results.txt");
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log("Wrote", outPath);
