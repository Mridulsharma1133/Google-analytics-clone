import { getVisitorId, getSessionId, detectSource, getCurrentPage } from "./utils.js";
import { attachAutoTrackers } from "./autotrack.js";

const DEFAULT_ENDPOINT = "http://localhost:3001/api/v1";
const QUEUE_KEY        = "ga_event_queue";
const MAX_RETRY        = 3;

class GATracker {
  constructor() {
    this._initialized = false;
    this._queue       = [];
  }

  /**
   * Initialize the SDK.
   * @param {object} config
   * @param {string} config.endpoint       - API base URL (default: http://localhost:3001/api/v1)
   * @param {boolean} [config.autotrack]   - Auto-track page views & clicks (default: true)
   * @param {boolean} [config.debug]       - Log events to console
   */
  init(config = {}) {
    if (this._initialized) return;

    this.endpoint  = (config.endpoint || DEFAULT_ENDPOINT).replace(/\/$/, "");
    this.debug     = config.debug     || false;
    this.autotrack = config.autotrack !== false;

    this.visitorId = getVisitorId();
    this.sessionId = getSessionId();
    this.source    = detectSource();

    // Flush any queued events from previous failed attempts
    this._loadQueue();
    this._flushQueue();

    if (this.autotrack) {
      attachAutoTrackers(this);
    }

    this._initialized = true;
    this._log("GA SDK initialized", { visitorId: this.visitorId, sessionId: this.sessionId, source: this.source });
  }

  /**
   * Track a custom event.
   * @param {string} eventName
   * @param {object} [props]
   * @param {*}      [props.eventValue]
   * @param {string} [props.type]        - "count" | "sum" | "unique"
   * @param {string} [props.source]      - override source
   * @param {string} [props.page]        - override page
   */
  track(eventName, props = {}) {
    if (!eventName) return;

    const event = {
      eventName,
      visitorId:  this.visitorId,
      sessionId:  this.sessionId,
      source:     props.source     || this.source    || "direct",
      page:       props.page       || getCurrentPage(),
      eventValue: props.eventValue !== undefined ? props.eventValue : null,
      type:       props.type       || "count",
    };

    this._log("track", event);
    this._send(event);
  }

  /**
   * Override visitorId (e.g. after user logs in).
   * @param {string} userId
   */
  identify(userId) {
    this.visitorId = userId;
    this._log("identify", userId);
  }

  // ─── Internal ───────────────────────────────────────────────────────────────

  async _send(event, attempt = 0) {
    try {
      const res = await fetch(`${this.endpoint}/events`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(event),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Remove from retry queue on success
      this._removeFromQueue(event);
    } catch (err) {
      this._log("send failed", err.message, `attempt ${attempt + 1}/${MAX_RETRY}`);

      if (attempt < MAX_RETRY - 1) {
        this._addToQueue(event);
        setTimeout(() => this._send(event, attempt + 1), 2000 * (attempt + 1));
      }
    }
  }

  _loadQueue() {
    try {
      this._queue = JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
    } catch {
      this._queue = [];
    }
  }

  _saveQueue() {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(this._queue));
  }

  _addToQueue(event) {
    const exists = this._queue.some(
      (e) => e.eventName === event.eventName && e.sessionId === event.sessionId
    );
    if (!exists) {
      this._queue.push(event);
      this._saveQueue();
    }
  }

  _removeFromQueue(event) {
    this._queue = this._queue.filter(
      (e) => !(e.eventName === event.eventName && e.sessionId === event.sessionId)
    );
    this._saveQueue();
  }

  _flushQueue() {
    if (!this._queue.length) return;
    this._log("flushing queued events", this._queue.length);
    this._queue.forEach((event) => this._send(event));
  }

  _log(...args) {
    if (this.debug) console.log("[GA SDK]", ...args);
  }
}

// Export singleton
const tracker = new GATracker();
export default tracker;
export { GATracker };
