import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const MEASUREMENT_ID = "G-TEST12345";

async function loadWith(id: string | undefined) {
  vi.resetModules();
  vi.stubEnv("VITE_GA_MEASUREMENT_ID", id ?? "");
  return import("@/lib/analytics");
}

function gtagCalls() {
  return (window.dataLayer ?? []).map((a) => Array.from(a as IArguments));
}

describe("analytics", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    // @ts-expect-error resetting between cases
    delete window.dataLayer;
    // @ts-expect-error resetting between cases
    delete window.gtag;
  });
  afterEach(() => vi.unstubAllEnvs());

  it("stays inert with no measurement id", async () => {
    const a = await loadWith(undefined);
    expect(a.analyticsEnabled).toBe(false);
    a.initAnalytics();
    a.trackPageView("/about");
    a.trackEvent("thing");
    expect(document.querySelector("script")).toBeNull();
    expect(window.dataLayer).toBeUndefined();
  });

  it("loads gtag.js and disables the automatic page_view", async () => {
    const a = await loadWith(MEASUREMENT_ID);
    a.initAnalytics();

    const script = document.querySelector<HTMLScriptElement>("script[src*=googletagmanager]");
    expect(script?.src).toContain(`id=${MEASUREMENT_ID}`);
    expect(script?.async).toBe(true);

    const config = gtagCalls().find((c) => c[0] === "config");
    expect(config?.[1]).toBe(MEASUREMENT_ID);
    expect(config?.[2]).toEqual({ send_page_view: false });
  });

  it("only injects the script once", async () => {
    const a = await loadWith(MEASUREMENT_ID);
    a.initAnalytics();
    a.initAnalytics();
    expect(document.querySelectorAll("script[src*=googletagmanager]")).toHaveLength(1);
  });

  it("sends a page_view carrying the path", async () => {
    const a = await loadWith(MEASUREMENT_ID);
    a.initAnalytics();
    a.trackPageView("/medicines?q=1");

    const view = gtagCalls().find((c) => c[0] === "event" && c[1] === "page_view");
    expect(view).toBeTruthy();
    expect((view?.[2] as Record<string, unknown>).page_path).toBe("/medicines?q=1");
    expect((view?.[2] as Record<string, unknown>).page_location).toBe(window.location.href);
  });

  it("forwards custom events", async () => {
    const a = await loadWith(MEASUREMENT_ID);
    a.initAnalytics();
    a.trackEvent("appointment_submitted", { source: "form" });
    const evt = gtagCalls().find((c) => c[1] === "appointment_submitted");
    expect(evt?.[2]).toEqual({ source: "form" });
  });
});
