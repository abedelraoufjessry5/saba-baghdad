// Request/response helpers shared by every endpoint.

export class HttpError extends Error {
  // expose: the message is safe to show to the customer
  // data: extra fields sent with the error (e.g. which products)
  constructor(status, message, { expose = true, data = null } = {}) {
    super(message);
    this.status = status;
    this.expose = expose;
    this.data = data;
  }
}

export function send(res, data, cacheSeconds = 0) {
  if (cacheSeconds > 0) {
    // Vercel's edge keeps the answer, so repeat visitors don't wait for Odoo.
    // A short stale window: a changed price or an ended offer shows within
    // a couple of minutes, not an hour later.
    res.setHeader("Cache-Control", `s-maxage=${cacheSeconds}, stale-while-revalidate=${Math.min(cacheSeconds, 120)}`);
  } else {
    res.setHeader("Cache-Control", "no-store");
  }
  res.status(200).json(data);
}

export function body(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string" && req.body) {
    try { return JSON.parse(req.body); } catch { throw new HttpError(400, "Invalid JSON"); }
  }
  return {};
}

export function clientIp(req) {
  const fwd = String(req.headers["x-forwarded-for"] || "");
  return fwd.split(",")[0].trim() || req.socket?.remoteAddress || "unknown";
}

// POSTs must come from our own pages (the app), not from other websites.
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // native apps / curl send none
  try {
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Wraps an endpoint: method check, same-origin check for writes, and errors
// turned into clean JSON (internals are logged, never sent to the phone).
export function handler(methods, fn) {
  return async (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader("Allow", methods.join(", "));
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
    if (req.method !== "GET" && !sameOrigin(req)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    try {
      await fn(req, res);
    } catch (err) {
      if (err instanceof HttpError) {
        if (err.status >= 500) console.error(err);
        res.status(err.status).json({ error: err.expose ? err.message : "Server error", ...(err.expose && err.data ? err.data : {}) });
      } else {
        console.error(err);
        res.status(502).json({ error: "تعذّر الاتصال بالمتجر، يرجى المحاولة بعد قليل" });
      }
    }
  };
}
