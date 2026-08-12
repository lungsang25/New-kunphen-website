// Post-build prerenderer — static HTML head generation, no browser required.
//
// `vite build` emits a single-page app whose routes all resolve to one
// index.html, so crawlers and link unfurlers saw identical <head> markup for
// every URL — same title, same description, and (before the domain fix) the
// same wrong canonical. That is why the site earned no sitelinks.
//
// This script writes a dist/<route>/index.html per route with that route's own
// title, description, canonical, OG/Twitter tags and JSON-LD baked in. Vercel
// serves those files directly (filesystem wins over the SPA rewrite), so every
// URL now returns unique, crawlable HTML. React still hydrates on top and
// renders the body exactly as before.
//
// Deliberately browserless: driving headless Chrome during a Vercel build is
// fragile (no system Chrome, and serverless Chromium builds are pinned to a
// specific Amazon Linux/glibc generation — the "Failed to launch the browser
// process: Code 127" class of failure). Everything crawlers need from the head
// is computable from PAGE_META plus the articles API, so we compute it directly
// and the build cannot fail that way.
//
// Runs as the second step of `npm run build`.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, SITE_NAME, NAV_LINKS, PAGE_META } from "../src/lib/site.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");

const API_BASE =
  process.env.VITE_API_BASE_URL || "https://kunphen-backend.vercel.app";

const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// ---- escaping ---------------------------------------------------------------

const escapeHtml = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// JSON-LD sits inside <script>; the only sequence that can break out is "</".
const escapeJsonLd = (json) => json.replace(/</g, "\\u003c");

const ld = (obj) =>
  `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(obj))}</script>`;

// ---- JSON-LD builders -------------------------------------------------------

const siteNavigation = () =>
  ld({
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

const website = () =>
  ld({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: ["Kunphen Hospital", "Kunphen Herbal Clinic", "Kunphen"],
    url: SITE_URL,
  });

const breadcrumb = (trail) =>
  ld({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}${t.path}`,
    })),
  });

const articleSchema = (a, url) =>
  ld({
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

// Home already carries the Hospital schema statically in index.html, so it only
// adds the sitewide WebSite + navigation blocks.
function schemaForRoute(route, url) {
  const blocks = [website(), siteNavigation()];
  if (route.path !== "/") blocks.push(breadcrumb(route.breadcrumb));
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

// ---- head rewriting ---------------------------------------------------------

// Replace the value of an existing tag when present, otherwise append to <head>.
function upsert(html, matcher, replacement) {
  return matcher.test(html)
    ? html.replace(matcher, replacement)
    : html.replace("</head>", `    ${replacement}\n  </head>`);
}

function renderHead(html, route) {
  const url = `${SITE_URL}${route.path === "/" ? "/" : route.path}`;
  const title = escapeHtml(route.meta.title);
  const description = escapeHtml(route.meta.description);
  const keywords = route.meta.keywords ? escapeHtml(route.meta.keywords) : null;
  const image = escapeHtml(route.meta.image || OG_IMAGE);

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  out = upsert(
    out,
    /<meta name="title" content="[^"]*"\s*\/?>/,
    `<meta name="title" content="${title}" />`,
  );
  out = upsert(
    out,
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );
  if (keywords) {
    out = upsert(
      out,
      /<meta name="keywords" content="[^"]*"\s*\/?>/,
      `<meta name="keywords" content="${keywords}" />`,
    );
  }
  out = upsert(
    out,
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${url}" />`,
  );

  // Open Graph + Twitter
  const og = [
    ["og:url", url],
    ["og:title", title],
    ["og:description", description],
    ["og:image", image],
  ];
  for (const [prop, val] of og) {
    out = upsert(
      out,
      new RegExp(`<meta property="${prop}" content="[^"]*"\\s*/?>`),
      `<meta property="${prop}" content="${val}" />`,
    );
  }
  const tw = [
    ["twitter:url", url],
    ["twitter:title", title],
    ["twitter:description", description],
    ["twitter:image", image],
  ];
  for (const [name, val] of tw) {
    out = upsert(
      out,
      new RegExp(`<meta name="${name}" content="[^"]*"\\s*/?>`),
      `<meta name="${name}" content="${val}" />`,
    );
  }

  // Article pages describe an article, not the site itself.
  if (route.type === "article") {
    out = out.replace(
      /<meta property="og:type" content="[^"]*"\s*\/?>/,
      `<meta property="og:type" content="article" />`,
    );
  }

  return out.replace("</head>", `${schemaForRoute(route, url)}</head>`);
}

// ---- route list -------------------------------------------------------------

const STATIC_TYPE = { "/medicines": "medicines", "/gallery": "gallery" };

async function buildRoutes() {
  const routes = NAV_LINKS.map((l) => ({
    path: l.to,
    type: STATIC_TYPE[l.to] || "static",
    meta: PAGE_META[l.to],
    breadcrumb:
      l.to === "/"
        ? [{ name: "Home", path: "/" }]
        : [
            { name: "Home", path: "/" },
            { name: l.label, path: l.to },
          ],
  }));

  const missing = routes.filter((r) => !r.meta).map((r) => r.path);
  if (missing.length) {
    throw new Error(`PAGE_META missing entries for: ${missing.join(", ")}`);
  }

  try {
    const res = await fetch(`${API_BASE}/api/articles`);
    if (res.ok) {
      const articles = await res.json();
      for (const a of articles) {
        routes.push({
          path: `/articles/${a.slug}`,
          type: "article",
          article: a,
          meta: {
            title: `${a.title} - Kunphen Hospital`,
            description: a.excerpt || "Tibetan medicine article from Kunphen Hospital.",
            image: a.image_url || OG_IMAGE,
          },
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

// ---- main -------------------------------------------------------------------

async function prerender() {
  console.log("Prerendering routes:");
  const indexHtml = await readFile(join(DIST, "index.html"), "utf8");
  const routes = await buildRoutes();

  for (const route of routes) {
    const html = renderHead(indexHtml, route);
    const outDir = route.path === "/" ? DIST : join(DIST, route.path);
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, "index.html"), html, "utf8");
    console.log(`  ✓ ${route.path}`);
  }

  console.log(`Prerendered ${routes.length} routes.`);
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
