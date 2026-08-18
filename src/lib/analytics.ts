// Google Analytics 4 tag.
//
// Loaded from JS rather than hardcoded in index.html so the measurement id comes
// from the environment: local dev and preview builds leave VITE_GA_MEASUREMENT_ID
// unset and therefore send nothing, keeping the production property clean.

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const analyticsEnabled = Boolean(MEASUREMENT_ID);

let initialized = false;

export function initAnalytics() {
  if (!MEASUREMENT_ID || initialized || typeof window === "undefined") return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  // Must be a real `arguments`-forwarding function, not a rest-arrow: gtag.js
  // reads the raw arguments object off the queue.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  // This is a SPA, so page_view is sent per route change below instead — leaving
  // the automatic one on would double-count the first page.
  window.gtag("config", MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function trackPageView(path: string) {
  if (!MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** Custom events (appointment submitted, chat opened, ...). */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
}
