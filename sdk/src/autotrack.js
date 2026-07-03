/**
 * Attaches auto-tracking listeners to the SDK instance.
 * - Page views: fires on load + popstate/pushState (SPA support)
 * - Clicks: fires for any element with [data-ga-event] attribute
 */
export function attachAutoTrackers(tracker) {
  // ── Page view on initial load ──────────────────────────────────────────────
  tracker.track("page_view", { page: window.location.pathname });

  // ── SPA route change (History API) ────────────────────────────────────────
  const _push    = history.pushState.bind(history);
  const _replace = history.replaceState.bind(history);

  history.pushState = function (...args) {
    _push(...args);
    tracker.track("page_view", { page: window.location.pathname });
  };
  history.replaceState = function (...args) {
    _replace(...args);
    tracker.track("page_view", { page: window.location.pathname });
  };

  window.addEventListener("popstate", () => {
    tracker.track("page_view", { page: window.location.pathname });
  });

  // ── Click tracking via data attribute ─────────────────────────────────────
  // Usage: <button data-ga-event="signup_click" data-ga-value="5">Sign Up</button>
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-ga-event]");
    if (!el) return;

    const eventName = el.getAttribute("data-ga-event");
    const value     = el.getAttribute("data-ga-value");
    const type      = el.getAttribute("data-ga-type") || "count";

    tracker.track(eventName, {
      eventValue: value !== null ? Number(value) || value : null,
      type,
      element: el.tagName.toLowerCase(),
    });
  });

  // ── Session duration on unload ─────────────────────────────────────────────
  const startTime = Date.now();
  window.addEventListener("beforeunload", () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    // Use sendBeacon so the request survives page close
    const payload = JSON.stringify({
      eventName:  "session_end",
      visitorId:  tracker.visitorId,
      sessionId:  tracker.sessionId,
      source:     tracker.source,
      page:       window.location.pathname,
      eventValue: duration,
      type:       "sum",
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${tracker.endpoint}/events`, payload);
    }
  });
}
