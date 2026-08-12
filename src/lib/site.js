// Single source of truth for the site's canonical origin and primary navigation.
//
// Imported by the React app (Navbar, SEO) AND by the Node build scripts
// (scripts/prerender.mjs, scripts/generate-sitemap.mjs). Keeping the domain and
// route list here means they can never drift between the app and the scripts —
// which is exactly the bug that shipped the wrong `kunphen.com` canonical.
//
// Plain ESM `.js` (not `.ts`) on purpose: Node runs the build scripts directly
// and cannot import a `.ts` module, while Vite/esbuild import this from `.tsx`
// without complaint (allowJs + bundler resolution).

export const SITE_URL = "https://www.kunphenherbalclinic.com";

// Human-facing brand name. Must match the Google Business Profile name and the
// JSON-LD `name` in index.html byte-for-byte, so Google binds them to one entity.
export const SITE_NAME = "Kunphen Tibetan Medical Centre";

// Primary navigation. `to` is the route path; `label` is the visible link text.
// Also drives which routes get prerendered and listed in the sitemap.
export const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/medicines", label: "Medicines" },
  { to: "/articles", label: "Articles" },
  { to: "/gallery", label: "Gallery" },
  { to: "/appointments", label: "Appointments" },
];
