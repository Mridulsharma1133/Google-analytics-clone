# @ga-project/sdk

Lightweight JavaScript analytics SDK. Tracks page views, clicks, sessions and custom events — sends everything to your GA server.

---

## Install

```bash
# inside sdk/
npm install
npm run build   # outputs dist/ga-sdk.umd.js  +  dist/ga-sdk.esm.js
```

---

## Usage

### Via Script Tag (UMD)
```html
<script src="path/to/ga-sdk.umd.js"></script>
<script>
  GATracker.default.init({ endpoint: "http://localhost:3001/api/v1", debug: true });
</script>
```

### Via ES Module
```js
import tracker from "@ga-project/sdk";

tracker.init({
  endpoint:  "http://localhost:3001/api/v1",
  autotrack: true,   // default: true
  debug:     false,
});
```

---

## API

### `tracker.init(config)`
| Option | Type | Default | Description |
|---|---|---|---|
| `endpoint` | string | `http://localhost:3001/api/v1` | Your server base URL |
| `autotrack` | boolean | `true` | Auto page views + click tracking |
| `debug` | boolean | `false` | Console debug logs |

---

### `tracker.track(eventName, props?)`
Send any custom event.

```js
tracker.track("purchase", {
  eventValue: 49.99,
  type:       "sum",      // "count" | "sum" | "unique"
  source:     "email",    // optional override
  page:       "/checkout" // optional override
});
```

---

### `tracker.identify(userId)`
Link future events to a known user after login.

```js
tracker.identify("user@example.com");
```

---

## Auto-tracking

When `autotrack: true` the SDK automatically fires:

| Event | Trigger |
|---|---|
| `page_view` | Page load + every History API navigation (SPA) |
| `session_end` | Browser tab close (`sendBeacon`) with session duration in seconds |

---

## Click Tracking via Data Attributes

No JS required — just add attributes to any HTML element:

```html
<button
  data-ga-event="signup_click"
  data-ga-value="1"
  data-ga-type="count"
>
  Sign Up
</button>

<button
  data-ga-event="purchase"
  data-ga-value="49.99"
  data-ga-type="sum"
>
  Buy Now
</button>
```

| Attribute | Required | Description |
|---|---|---|
| `data-ga-event` | ✅ | Event name |
| `data-ga-value` | ❌ | Numeric value |
| `data-ga-type` | ❌ | `count` / `sum` / `unique` (default: `count`) |

---

## Session & Visitor IDs

| ID | Storage | Lifecycle |
|---|---|---|
| `visitorId` | `localStorage` | Permanent until cleared |
| `sessionId` | `sessionStorage` | Per browser tab/session |

---

## Retry / Queue

If a network request fails, the event is queued in `localStorage` and retried up to 3 times with exponential backoff. Queued events are also replayed on next page load.

---

## Demo

Open `demo/index.html` in a browser (with server running):

```bash
# Serve the demo — from sdk/
npx serve .
# or just open sdk/demo/index.html directly in browser
```

---

## Event Schema (sent to server)

```json
{
  "eventName":  "purchase",
  "visitorId":  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
  "sessionId":  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx",
  "source":     "google",
  "page":       "/checkout",
  "eventValue": 49.99,
  "type":       "sum"
}
```
