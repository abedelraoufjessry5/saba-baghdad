export function ok(res, data) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
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
