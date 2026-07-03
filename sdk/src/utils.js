const LS_VISITOR = "ga_visitor_id";
const SS_SESSION = "ga_session_id";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function getVisitorId() {
  let id = localStorage.getItem(LS_VISITOR);
  if (!id) {
    id = uuid();
    localStorage.setItem(LS_VISITOR, id);
  }
  return id;
}

export function getSessionId() {
  let id = sessionStorage.getItem(SS_SESSION);
  if (!id) {
    id = uuid();
    sessionStorage.setItem(SS_SESSION, id);
  }
  return id;
}

export function detectSource() {
  const ref = document.referrer;
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname;
    if (/google/.test(host))   return "google";
    if (/facebook/.test(host)) return "facebook";
    if (/twitter|x\.com/.test(host)) return "twitter";
    if (/linkedin/.test(host)) return "linkedin";
    if (/bing/.test(host))     return "bing";
    return host;
  } catch {
    return "referral";
  }
}

export function getCurrentPage() {
  return window.location.pathname + window.location.search;
}
