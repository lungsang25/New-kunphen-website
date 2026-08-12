# Kunphen SEO — status & action list

This file supersedes the earlier `SEO-*.md` / `QUICK-START-SEO.md` / `KEYWORDS-STRATEGY.md`
notes, which declared the work "✅ COMPLETE / Ready for Production" while three
things had actually shipped broken. This one reflects what is really true.

## Why this work happened

The site already ranks #1 for brand searches, so indexing was never the problem.
The gap versus competitors that show **sitelinks** and a rich **knowledge panel**
came from three things:

1. Every route served the same SPA `index.html`, so Google saw all pages as
   identical and could not build a sitelinks set.
2. Every page declared its canonical URL on the wrong domain (`kunphen.com`,
   left over from the domain migration), telling Google each page lived
   elsewhere.
3. The Google Business Profile pointed at a **parked** domain, so the real site
   was never attached to the business entity.

## Done in code (shipped in this change)

- **Canonical domain fixed.** `src/lib/site.js` is now the single source of truth
  for `SITE_URL`; `src/components/SEO.tsx` and both build scripts import it, so it
  can't drift again. The old `kunphen.com` string is gone from the bundle.
- **Build-time prerendering.** `npm run build` now runs `vite build`, then
  `scripts/prerender.mjs` (headless Chrome snapshot of every route → real HTML per
  URL), then `scripts/generate-sitemap.mjs`. Each of the 8 routes now returns
  unique, crawlable markup with real content.
- **Structured data per page:** sitewide `Hospital` + `WebSite` +
  `SiteNavigationElement`; a proper `BreadcrumbList` per page; `Article` on article
  pages, `MedicalWebPage` on medicines, `ImageGallery` on gallery.
- **Assets:** real `og-image.jpg` (clinic photo + legible name) and `logo.png`
  created; `favicon.ico` shrunk from 964 KB → ~5 KB; favicon/apple-touch links
  added.
- **Schema name aligned** to `Kunphen Tibetan Medical Centre`, with keyword
  variants moved to `alternateName`; `geo` and real `sameAs` (LinkedIn, Facebook,
  Instagram) added.
- **Sitemap** regenerated from live article slugs with real `lastmod`.
- **Soft-404s** now emit `noindex` via `<SEO noIndex />` on `NotFound`.

## Manual — off-page (highest impact, not doable in code)

Ranked by impact:

1. **Claim / fix the Google Business Profile** ("Kunphen Tibetan Medical Center",
   *Own this business?* in the panel).
   - **Change the website field to `https://www.kunphenherbalclinic.com`** — it
     currently points at the parked `kunphenmedical.com`. Single highest-value
     action here.
   - Set the business name to match the schema exactly:
     **`Kunphen Tibetan Medical Centre`** (the site's schema also lists the
     American "Center" spelling as an alternate, so either resolves — but pick one
     and use it everywhere).
   - Verify address (`Kunphen Marg, Chhetrapati, Kathmandu 44600`), phone
     (`+977 1-5351920`), hours (Mon–Sun 9–5, closed Saturday).
   - Upload 10+ photos; set primary category (Alternative Medicine Practitioner)
     + secondaries.
2. **Reviews.** Move from 5 toward 25+. Review count/recency drives local ranking
   more than almost anything on-site. Ask patients with a short GBP review link.
3. **Google Search Console.** Verify by DNS TXT, submit
   `https://www.kunphenherbalclinic.com/sitemap.xml`, then watch **Page indexing**
   for "Alternate page with proper canonical" / "Duplicate, Google chose different
   canonical" — that's where the old canonical bug will clear. Add Bing Webmaster
   Tools too.
4. **`kunphenmedical.com`.** It's parked (bounces to a registrar lander) — likely
   lapsed. If recoverable, 301-redirect it to `kunphenherbalclinic.com` to reclaim
   its existing Google associations instead of leaving a dead domain in the
   knowledge panel.
5. **NAP consistency.** Keep name/address/phone byte-identical across the site,
   GBP, LinkedIn, Facebook, Instagram, Mindtrip, and Nepal health directories.
6. **Curate `sameAs`** in `index.html`: there appear to be separate Chhetrapati
   and Boudha branch profiles on Facebook/Instagram — confirm the listed handles
   are the Chhetrapati location before relying on them.

## Target keywords (reference)

- Primary: Kunphen Hospital · Kunphen Tibetan Medicine · Tibetan Medicine
  Kathmandu · Tibetan Hospital Nepal
- Secondary: Sowa Rigpa Kathmandu · Traditional Tibetan Medicine Nepal · Pulse
  Diagnosis Kathmandu · Alternative Medicine Kathmandu

## What to expect

Canonical + image fixes are picked up within days of recrawl. Sitelinks are
granted at Google's discretion, typically after several weeks of stable, distinctly
indexed pages — they can't be requested. The knowledge panel corrects within days
of updating the GBP website field.

## Notes for maintainers

- Publishing a new article in the CMS won't be prerendered until the next build.
  Add a Vercel Deploy Hook and call it from kunphen-studio on publish. Until then a
  new article still resolves and renders client-side (via the SPA rewrite) — it
  just lacks a prerendered snapshot.
- On Vercel, set `PUPPETEER_CACHE_DIR` to a build-cache-persistent path (see
  `.puppeteerrc.cjs`) so Chromium is downloaded once, not every build.
