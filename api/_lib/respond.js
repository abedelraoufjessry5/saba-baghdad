// Vercel's edge caches the response, so repeat visitors don't wait for Odoo
// at all. `seconds` is how long the edge serves it before asking again.
export function ok(res, data, seconds) {
  var s = seconds || 60;
  res.setHeader("Cache-Control", "s-maxage=" + s + ", stale-while-revalidate=" + s * 10);
  res.status(200).json(data);
}

export async function guarded(res, fn) {
  try {
    await fn();
  } catch (err) {
    // Log full detail server-side, but never leak internals (or the API key
    // path) to the client - just a clean message.
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
}
