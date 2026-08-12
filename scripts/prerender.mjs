// Post-build prerenderer.
//
// `vite build` emits a single-page app whose routes all resolve to one
// index.html — so crawlers (and non-JS link unfurlers) see identical markup for
// every URL, which is why the site earns no sitelinks. This script boots the
// built app in headless Chrome once per route, waits for React + React Query to
// finish, and writes the fully-rendered DOM to dist/<route>/index.html. Vercel
// serves those files directly (filesystem beats the SPA rewrite), so each URL
// now returns unique, crawlable HTML.
//
// It also injects per-page JSON-LD (WebSite, SiteNavigationElement, breadcrumbs,
// and page-type schema) into each snapshot — the structured-data signals that
// make Google confident enough to grant sitelinks.
//
// Run automatically as the second half of `npm run build`.

import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, statSync } from "node:fs";
import puppeteer from "puppeteer";
import { SITE_URL, SITE_NAME, NAV_LINKS } from "../src/lib/site.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const PORT = 4319;

// The built app calls this at runtime for its data; we fetch article slugs from
// the same origin so the snapshot list matches what visitors see. On Vercel this
// env var is set; locally it falls back to the deployed backend.
const API_BASE =
  process.env.VITE_API_BASE_URL || "https://kunphen-backend.vercel.app";

const MIME = {
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

// ---- JSON-LD builders -------------------------------------------------------

function ld(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function siteNavigation() {
  return ld({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE_NAME} navigation`,
    itemListElement: NAV_LINKS.map((l, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: l.label,
      url: `${SITE_URL}${l.to === "/" ? "" : l.to}`,
    })),
  });
}

function website() {
  return ld({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["Kunphen Hospital", "Kunphen Herbal Clinic", "Kunphen"],
    url: SITE_URL,
  });
}

function breadcrumb(trail) {
  // trail: [{ name, path }] where path is a route ("" for home).
  return ld({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  });
}

function articleSchema(a, url) {
  return ld({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    image: a.image_url ? [a.image_url] : undefined,
    datePublished: a.published_at,
    articleSection: a.category,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  });
}

// Per-route JSON-LD. Home already carries the Hospital schema statically in
// index.html, so it only gets the sitewide WebSite + navigation blocks.
function schemaForRoute(route, url) {
  const blocks = [website(), siteNavigation()];
  if (route.path !== "/") {
    blocks.push(breadcrumb(route.breadcrumb));
  }
  if (route.type === "medicines") {
    blocks.push(
      ld({
        "@context": "https://schema.org",
        "@type": "MedicalWebPage",
        name: "Tibetan Herbal Medicines",
        about: { "@type": "MedicalBusiness", name: SITE_NAME },
        url,
      }),
    );
  } else if (route.type === "gallery") {
    blocks.push(
      ld({
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        name: `${SITE_NAME} Gallery`,
        url,
      }),
    );
  } else if (route.type === "article") {
    blocks.push(articleSchema(route.article, url));
  }
  return blocks.join("");
}

// ---- route list -------------------------------------------------------------

const STATIC_TYPE = {
  "/medicines": "medicines",
  "/gallery": "gallery",
};

async function buildRoutes() {
  const routes = NAV_LINKS.map((l) => ({
    path: l.to,
    type: STATIC_TYPE[l.to] || "static",
    breadcrumb:
      l.to === "/"
        ? [{ name: "Home", path: "/" }]
        : [
            { name: "Home", path: "/" },
            { name: l.label, path: l.to },
          ],
  }));

  // Append every published article's detail page.
  try {
    const res = await fetch(`${API_BASE}/api/articles`);
    if (res.ok) {
      const articles = await res.json();
      for (const a of articles) {
        routes.push({
          path: `/articles/${a.slug}`,
          type: "article",
          article: a,
          breadcrumb: [
            { name: "Home", path: "/" },
            { name: "Articles", path: "/articles" },
            { name: a.title, path: `/articles/${a.slug}` },
          ],
        });
      }
      console.log(`  + ${articles.length} article routes from ${API_BASE}`);
    } else {
      console.warn(`  ! article fetch ${res.status}; skipping article routes`);
    }
  } catch (err) {
    console.warn(`  ! article fetch failed (${err.message}); skipping`);
  }
  return routes;
}

// ---- static file server (SPA fallback) --------------------------------------

function startServer(indexHtml) {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(req.url.split("?")[0]);
    const filePath = join(DIST, urlPath);
    // Serve real asset files; everything else falls back to index.html so the
    // SPA router can render the requested route.
    if (urlPath !== "/" && existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = urlPath.slice(urlPath.lastIndexOf("."));
      try {
        const body = await readFile(filePath);
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        res.end(body);
        return;
      } catch {
        /* fall through */
      }
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(indexHtml);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

// ---- main -------------------------------------------------------------------

async function prerender() {
  console.log("Prerendering routes:");
  const indexHtml = await readFile(join(DIST, "index.html"), "utf8");
  const routes = await buildRoutes();
  const server = await startServer(indexHtml);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let ok = 0;
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", async (r) => {
      const type = r.resourceType();
      // Abort heavy sub-resources: the <img>/font tags stay in the DOM (which is
      // all crawlers need) but the network goes idle fast and reliably.
      if (["image", "media", "font"].includes(type)) {
        r.abort();
        return;
      }
      // The backend's CORS only allows the production origin, so a fetch from
      // this headless page (localhost origin) would be blocked and the data
      // pages would render empty. Fulfil API calls ourselves — server-to-server
      // fetch has no CORS — and hand the browser a permissive response so React
      // Query gets real data. Same behaviour whether this runs locally or on CI.
      if (r.url().startsWith(API_BASE)) {
        try {
          const upstream = await fetch(r.url(), { headers: { accept: "application/json" } });
          const body = Buffer.from(await upstream.arrayBuffer());
          r.respond({
            status: upstream.status,
            headers: {
              "content-type": upstream.headers.get("content-type") || "application/json",
              "access-control-allow-origin": "*",
            },
            body,
          });
        } catch (err) {
          r.abort();
        }
        return;
      }
      r.continue();
    });

    const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
    try {
      await page.goto(`http://localhost:${PORT}${route.path}`, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });
      // Data-loaded signal: a non-empty <h1> exists.
      await page.waitForFunction(
        () => {
          const h = document.querySelector("h1");
          return h && h.textContent.trim().length > 0;
        },
        { timeout: 15000 },
      );

      let html = await page.content();
      html = html.replace("</head>", `${schemaForRoute(route, url)}</head>`);

      const outDir =
        route.path === "/" ? DIST : join(DIST, route.path);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, "index.html"), html, "utf8");
      console.log(`  ✓ ${route.path}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${route.path} — ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log(`Prerendered ${ok}/${routes.length} routes.`);
  if (ok < routes.length) process.exitCode = 1;
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
