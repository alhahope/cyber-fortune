import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
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
}

test("server-renders the finished Tianji experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>天机接口｜今日赛博求签<\/title>/);
  assert.match(html, /向未知/);
  assert.match(html, /借一束光/);
  assert.match(html, /抽取今日签文/);
  assert.match(html, /近日签录/);
  assert.match(html, /仅供娱乐/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships daily fortunes, local history, sharing, and GitHub Pages", async () => {
  const [page, css, layout, config, workflow, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /const fortunes: Fortune\[\]/);
  assert.match(page, /window\.localStorage\.setItem\("tianji-history"/);
  assert.match(page, /canvas\.toDataURL\("image\/png"\)/);
  assert.match(page, /navigator\.share/);
  assert.match(page, /prefers-reduced-motion|aria-live/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(layout, /天机接口｜今日赛博求签/);
  assert.match(config, /output: "export"/);
  assert.match(config, /GITHUB_REPOSITORY/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(packageJson, /"build:pages": "next build"/);
  await access(new URL("../public/.nojekyll", import.meta.url));
});
