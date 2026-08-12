const { join } = require("path");
const os = require("os");

/**
 * Puppeteer install/runtime config.
 *
 * On Vercel, set PUPPETEER_CACHE_DIR to a path the build cache persists (e.g.
 * `$PWD/.cache/puppeteer`) so Chromium is downloaded once and reused across
 * deploys instead of every build. Locally it defaults to the shared ~/.cache
 * so repeated installs don't re-download the browser.
 *
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  cacheDirectory:
    process.env.PUPPETEER_CACHE_DIR || join(os.homedir(), ".cache", "puppeteer"),
};
