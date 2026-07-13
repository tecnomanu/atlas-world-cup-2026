import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** Spanish markers that must ship in the static client assets for Pages. */
export const CLIENT_MARKERS = [
  "Registro completo de investigación",
  "URLs únicas",
  "Proveedores involucrados",
  "Procesos conectados",
  "Fuegos artificiales y pirotecnia",
];

/**
 * Scan every client JS chunk (not only page-*.js). i18n strings live in locale-*.js.
 * @param {string | URL} assetsDir
 */
export function assertClientMarkers(assetsDir) {
  const dir = typeof assetsDir === "string" ? assetsDir : fileURLToPath(assetsDir);
  const files = readdirSync(dir).filter((name) => name.endsWith(".js"));
  if (files.length === 0) {
    throw new Error(`No client JS assets found in ${dir}`);
  }

  const clientBundle = files
    .map((name) => readFileSync(join(dir, name), "utf8"))
    .join("\n");

  for (const marker of CLIENT_MARKERS) {
    if (!clientBundle.includes(marker)) {
      throw new Error(`Static client bundle is missing: ${marker}`);
    }
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  const target = process.argv[2]
    ? join(process.cwd(), process.argv[2])
    : fileURLToPath(new URL("../dist-pages/assets/", import.meta.url));
  assertClientMarkers(target);
  console.log(`Client markers OK (${CLIENT_MARKERS.length}) in ${target}`);
}
