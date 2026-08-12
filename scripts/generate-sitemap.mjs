// Build-time sitemap generator.
//
// Replaces the hand-maintained public/sitemap.xml (which was frozen at a fixed
// date and listed no article URLs) with one derived from the same route source
// as navigation and prerendering, plus every live article slug with a real
// lastmod. Runs at the end of `npm run build` and writes dist/sitemap.xml.

import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, NAV_LINKS } from "../src/lib/site.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const API_BASE =
  process.env.VITE_API_BASE_URL || "https://kunphen-backend.vercel.app";

const TODAY = new Date().toISOString().slice(0, 10);

// changefreq/priority are advisory (Google largely ignores them) but valid.
const META = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/about": { changefreq: "monthly", priority: "0.8" },
  "/medicines": { changefreq: "weekly", priority: "0.9" },
  "/articles": { changefreq: "weekly", priority: "0.8" },
  "/gallery": { changefreq: "monthly", priority: "0.6" },
  "/appointments": { changefreq: "monthly", priority: "0.9" },
};

function urlEntry({ loc, lastmod, changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${loc === "/" ? "/" : loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : "",
    priority ? `    <priority>${priority}</priority>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

async function main() {
  const entries = NAV_LINKS.map((l) =>
    urlEntry({ loc: l.to, lastmod: TODAY, ...(META[l.to] || {}) }),
  );

  try {
    const res = await fetch(`${API_BASE}/api/articles`);
    if (res.ok) {
      const articles = await res.json();
      for (const a of articles) {
        entries.push(
          urlEntry({
            loc: `/articles/${a.slug}`,
            lastmod: (a.published_at || TODAY).slice(0, 10),
            changefreq: "monthly",
            priority: "0.7",
          }),
        );
      }
      console.log(`  + ${articles.length} article URLs`);
    } else {
      console.warn(`  ! article fetch ${res.status}; sitemap has static routes only`);
    }
  } catch (err) {
    console.warn(`  ! article fetch failed (${err.message}); static routes only`);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;
  await writeFile(join(DIST, "sitemap.xml"), xml, "utf8");
  console.log(`Wrote dist/sitemap.xml (${entries.length} URLs).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
