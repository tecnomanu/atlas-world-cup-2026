import assert from "node:assert/strict";
import test from "node:test";

test("renders atlas shell and core content", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<main class="atlas-shell">/);
  assert.match(html, /Atlas Operativo del Mundial 2026/);
  assert.match(html, /Explorar el mapa/);
  assert.match(html, /Mapa interactivo de la organización del Mundial 2026/);
  assert.match(html, /Métrica visible en los nodos/);
  assert.match(html, /Personas/);
  assert.match(html, /Procesos/);
  assert.match(html, /Tipos de evidencia/);
  assert.equal((html.match(/class="atlas-node node-domain/g) ?? []).length, 18);
  assert.equal((html.match(/class="node-icon"/g) ?? []).length, 18);
  assert.equal((html.match(/class="node-metric-badge"/g) ?? []).length, 19);
  assert.equal((html.match(/class="cluster-island tone-/g) ?? []).length, 6);
  assert.match(html, /Tecnología y señal/);
  assert.match(html, /Dirección y control/);
  assert.match(html, /world-cup-2026-mark\.svg/);
  assert.match(html, /<link[^>]+href="\/assets\/[^\"]+\.css"/);
  assert.match(html, /import\("\/assets\/[^\"]+\.js"\)/);
});
