// Best-effort brake against floods of orders / sign-ups / password guesses.
// Counts live in the memory of one server instance, so this is a speed bump,
// not a wall - Odoo's own login cooldown still applies behind it.
import { HttpError } from "./http.js";

const buckets = new Map();

export function limit(key, max, windowSeconds) {
  const now = Date.now();
  const cutoff = now - windowSeconds * 1000;
  const hits = (buckets.get(key) || []).filter((t) => t > cutoff);
  if (hits.length >= max) throw new HttpError(429, "طلبات كثيرة، جرّبوا بعد شوية");
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => t > cutoff)) buckets.delete(k);
  }
}
