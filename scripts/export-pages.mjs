import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertClientMarkers } from "./assert-client-markers.mjs";

const root = new URL("../", import.meta.url);
const clientDir = new URL("../dist/client/", import.meta.url);
const outputDir = new URL("../dist-pages/", import.meta.url);
const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", Date.now().toString());

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
cpSync(clientDir, outputDir, { recursive: true });

const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request("https://atlas.local/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static render failed: ${response.status}`);
let html = await response.text();
html = html
  .replaceAll('href="/assets/', 'href="./assets/')
  .replaceAll('\\"href\\":\\"/assets/', '\\"href\\":\\"./assets/')
  .replaceAll('\\"src\\":\\"/assets/', '\\"src\\":\\"./assets/')
  .replaceAll('href="/favicon.svg', 'href="./favicon.svg')
  .replaceAll('\\"href\\":\\"/favicon.svg', '\\"href\\":\\"./favicon.svg')
  .replaceAll('href="/world-cup-2026-mark.svg', 'href="./world-cup-2026-mark.svg')
  .replaceAll('src="/world-cup-2026-mark.svg', 'src="./world-cup-2026-mark.svg')
  .replaceAll('\\"src\\":\\"/world-cup-2026-mark.svg', '\\"src\\":\\"./world-cup-2026-mark.svg')
  .replaceAll('import("/assets/', 'import("./assets/')
  .replaceAll('\\"/assets/', '\\"./assets/')
  .replaceAll('url(/assets/', 'url(./assets/');

writeFileSync(new URL("index.html", outputDir), html);
writeFileSync(new URL("404.html", outputDir), html);
writeFileSync(new URL(".nojekyll", outputDir), "");

function rewriteCss(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) rewriteCss(path);
    else if (extname(path) === ".css") {
      const css = readFileSync(path, "utf8").replaceAll("url(/assets/", "url(./");
      writeFileSync(path, css);
    }
  }
}

rewriteCss(fileURLToPath(new URL("assets/", outputDir)));

const exportedHtml = readFileSync(new URL("index.html", outputDir), "utf8");
if (/(?:href|src)=\"\/(?:assets|favicon\.svg|world-cup-2026-mark\.svg)/.test(exportedHtml)) {
  throw new Error("Static export still contains root-relative public paths");
}

assertClientMarkers(new URL("assets/", outputDir));

console.log(`Static GitHub Pages export ready at ${outputDir.pathname.replace(root.pathname, "")}`);
