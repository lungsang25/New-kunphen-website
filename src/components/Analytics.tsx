import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import { initAnalytics, trackPageView } from "@/lib/analytics";

/**
 * Sends a GA4 page_view on first paint and on every client-side route change.
 * Renders nothing; must live inside the router so it can read the location.
 */
const Analytics = () => {
  const { pathname, search } = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const path = `${pathname}${search}`;
    // React 18 StrictMode double-invokes effects in dev; guard against sending
    // the same view twice.
    if (lastPath.current === path) return;
    lastPath.current = path;

    // Let the route's document.title land before reporting it.
    const id = window.setTimeout(() => trackPageView(path), 0);
    return () => window.clearTimeout(id);
  }, [pathname, search]);

  return null;
};

export default Analytics;
