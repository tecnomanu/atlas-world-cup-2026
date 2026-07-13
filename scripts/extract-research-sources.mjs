import { readFileSync, writeFileSync } from "node:fs";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Usage: node extract-research-sources.mjs INPUT OUTPUT");

const markdown = readFileSync(input, "utf8");
const sources = [];
const seen = new Set();
const pattern = /^(\d+)\. \[([^\]]+)\]\((https?:\/\/[^)]+)\)/gm;

for (const match of markdown.matchAll(pattern)) {
  const [, number, label, url] = match;
  if (seen.has(url)) continue;
  seen.add(url);
  sources.push({ number: Number(number), label, url });
}

sources.sort((a, b) => a.number - b.number);
writeFileSync(output, `// Generated from docs/mundial-2026-mapa-organizacion-investigacion.md\nexport const researchSources = ${JSON.stringify(sources, null, 2)} as const;\n`);
console.log(`Generated ${sources.length} unique sources.`);
