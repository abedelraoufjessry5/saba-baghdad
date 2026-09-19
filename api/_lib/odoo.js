// Server-side only. Talks to Odoo's JSON-RPC endpoint using the API key
// stored in Vercel environment variables. This file runs inside /api
// functions (Node serverless runtime) and its output is never sent to the
// browser as source - only the JSON each endpoint chooses to return.

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_LOGIN = process.env.ODOO_LOGIN;
const ODOO_API_KEY = process.env.ODOO_API_KEY;

let cachedUid = null;
let cachedAt = 0;
const UID_TTL_MS = 10 * 60 * 1000; // re-authenticate every 10 min

async function rpc(service, method, args) {
  if (!ODOO_URL || !ODOO_DB || !ODOO_LOGIN || !ODOO_API_KEY) {
    throw new Error(
      "Missing Odoo env vars. Set ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY in Vercel project settings."
    );
  }
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now()
    })
  });
  if (!res.ok) {
    throw new Error(`Odoo HTTP ${res.status} on ${service}.${method}`);
  }
  const json = await res.json();
  if (json.error) {
    const msg =
      json.error.data?.message || json.error.message || "Unknown Odoo RPC error";
    const err = new Error(msg);
    err.odoo = json.error;
    throw err;
  }
  return json.result;
}

async function getUid() {
  const fresh = Date.now() - cachedAt < UID_TTL_MS;
  if (cachedUid && fresh) return cachedUid;
  const uid = await rpc("common", "authenticate", [ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, {}]);
  if (!uid) {
    throw new Error(
      "Odoo authentication failed (bad db name, login, or API key). Check ODOO_DB - it may not match the URL subdomain."
    );
  }
  cachedUid = uid;
  cachedAt = Date.now();
  return uid;
}

// Generic model call, e.g. execute("product.template", "search_read", [domain], {fields, limit})
export async function execute(model, method, args = [], kwargs = {}) {
  const uid = await getUid();
  return rpc("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    model,
    method,
    args,
    kwargs
  ]);
}

// Verifies a CUSTOMER's own email + password (not the admin service account
// used by execute()). Returns their uid, or null if the credentials are wrong.
export async function authenticateUser(login, password) {
  try {
    const uid = await rpc("common", "authenticate", [ODOO_DB, login, password, {}]);
    return uid || null;
  } catch {
    return null;
  }
}

// Public image URL for a record - no auth needed for website_published records,
// so we never fetch base64 image data through RPC (slow + huge payloads).
export function imageUrl(model, id, field = "image_1024") {
  return `${ODOO_URL}/web/image/${model}/${id}/${field}`;
}

export function odooUrl() {
  return ODOO_URL;
}
