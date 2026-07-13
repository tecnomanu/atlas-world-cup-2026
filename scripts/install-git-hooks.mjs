#!/usr/bin/env node
/**
 * Installs a local git pre-commit hook that runs the Pages smoke build.
 * Idempotent. Safe to re-run.
 */
import { chmodSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const hookPath = join(root, ".git", "hooks", "pre-commit");
const marker = "# atlas-world-cup-2026 smoke";

const hook = `#!/bin/sh
${marker}
# Fail commit if static Pages export / client markers break.
set -e
cd "$(git rev-parse --show-toplevel)"
npm run smoke
`;

if (!existsSync(join(root, ".git"))) {
  console.log("No .git directory; skip hook install.");
  process.exit(0);
}

mkdirSync(join(root, ".git", "hooks"), { recursive: true });

if (existsSync(hookPath)) {
  const current = readFileSync(hookPath, "utf8");
  if (current.includes(marker)) {
    console.log("pre-commit smoke hook already installed.");
    process.exit(0);
  }
  writeFileSync(`${hookPath}.atlas-backup`, current);
  console.log("Backed up existing pre-commit to pre-commit.atlas-backup");
}

writeFileSync(hookPath, hook, { mode: 0o755 });
chmodSync(hookPath, 0o755);
console.log("Installed git pre-commit → npm run smoke");
