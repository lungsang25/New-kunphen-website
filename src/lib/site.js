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

// Per-route <title>/description/keywords.
//
// Single source of truth, consumed twice: the page components pass these to
// <SEO> at runtime, and scripts/prerender.mjs bakes the same values into each
// route's static HTML at build time. Defining them once is what keeps the
// prerendered <head> and the client-rendered <head> from disagreeing.
export const PAGE_META = {
  "/": {
    title: "Kunphen Hospital Kathmandu Nepal - Tibetan Medicine & Herbal Clinic",
    description:
      "Kunphen Hospital in Kathmandu, Nepal - Leading Tibetan Medicine Hospital and Herbal Clinic. Kunphen Medical Center offers authentic Sowa Rigpa treatments, herbal medicines, pulse diagnosis in Kathmandu. Book appointments with experienced Tibetan medicine practitioners in Nepal.",
    keywords:
      "Kunphen Hospital Kathmandu, Kunphen Hospital Nepal, Kunphen Medical Center Kathmandu, Kunphen Herbal Clinic Nepal, Tibetan Medicine Kathmandu, Tibetan Medicine Nepal, Kunphen Kathmandu, Kunphen Nepal, Sowa Rigpa Kathmandu, Traditional Tibetan Medicine Nepal, Herbal Medicine Kathmandu, Pulse Diagnosis Nepal, Holistic Healing Kathmandu, Alternative Medicine Nepal, Tibetan Doctors Kathmandu",
  },
  "/about": {
    title: "About Kunphen Hospital Kathmandu Nepal - Expert Tibetan Medicine Practitioners",
    description:
      "Meet our experienced Tibetan medicine doctors at Kunphen Hospital in Kathmandu, Nepal. Learn about our founder Dr. Kunsang Phenthok and our team of expert healers at Kunphen Medical Center specializing in Sowa Rigpa and traditional Tibetan medicine in Nepal.",
    keywords:
      "Kunphen doctors Kathmandu, Tibetan medicine practitioners Nepal, Dr. Kunsang Phenthok, Sowa Rigpa healers Kathmandu, traditional medicine experts Nepal, Tibetan physicians Kathmandu, holistic healers Nepal, Kunphen Medical Center doctors",
  },
  "/medicines": {
    title: "Tibetan Herbal Medicines Kathmandu Nepal - Kunphen Herbal Clinic",
    description:
      "Explore authentic Tibetan herbal medicines at Kunphen Herbal Clinic in Kathmandu, Nepal. Discover traditional remedies like Agar-35, Rinchen Ratna Sampel at Kunphen Medical Center. Natural formulations for holistic healing in Nepal.",
    keywords:
      "Tibetan herbal medicine Kathmandu, Tibetan herbal medicine Nepal, Agar-35 Kathmandu, Kunphen Herbal Clinic Nepal, traditional remedies Kathmandu, Himalayan herbs Nepal, natural medicine Kathmandu, Tibetan pills Nepal, herbal formulations Kathmandu, Kunphen medicines Nepal",
  },
  "/articles": {
    title: "Tibetan Medicine Articles & Blog - Kunphen Hospital Wellness Resources",
    description:
      "Read informative articles about Tibetan medicine, Sowa Rigpa philosophy, herbal remedies, and holistic wellness from Kunphen Hospital's expert practitioners.",
    keywords:
      "Tibetan medicine articles, Sowa Rigpa blog, herbal medicine information, holistic wellness articles, traditional medicine resources, Kunphen blog",
  },
  "/gallery": {
    title: "Gallery - Kunphen Hospital Facilities & Traditional Medicine Photos",
    description:
      "View photos of Kunphen Tibetan Medicine Hospital, our practitioners, herbal medicine preparations, facilities, and traditional healing practices.",
    keywords:
      "Kunphen gallery, Tibetan medicine photos, hospital facilities, traditional medicine images, herbal preparation, Kunphen hospital photos",
  },
  "/appointments": {
    title: "Book Appointment Kathmandu Nepal - Kunphen Hospital Tibetan Medicine",
    description:
      "Schedule your consultation at Kunphen Hospital in Kathmandu, Nepal. Book appointments with expert Tibetan medicine practitioners at Kunphen Medical Center for pulse diagnosis, herbal medicine treatment, and holistic wellness care in Kathmandu.",
    keywords:
      "book appointment Kunphen Kathmandu, book appointment Kunphen Nepal, Tibetan medicine consultation Kathmandu, schedule appointment Nepal, pulse diagnosis booking Kathmandu, herbal medicine appointment Nepal, holistic health consultation Kathmandu, Kunphen Medical Center appointment",
  },
};
