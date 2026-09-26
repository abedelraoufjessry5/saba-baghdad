// Server-side only: talks to Odoo's JSON-RPC endpoint with the API key kept
// in Vercel's environment variables. Nothing in this folder reaches the
// browser - only the JSON each endpoint decides to return.
import { HttpError } from "./http.js";

const TIMEOUT_MS = 15000;
const UID_TTL_MS = 10 * 60 * 1000; // re-authenticate every 10 minutes

function config() {
  const { ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY } = process.env;
  if (!ODOO_URL || !ODOO_DB || !ODOO_LOGIN || !ODOO_API_KEY) {
    throw new HttpError(500, "Missing Odoo env vars. Set ODOO_URL, ODOO_DB, ODOO_LOGIN, ODOO_API_KEY in Vercel project settings.", { expose: true });
  }
  return { url: ODOO_URL.replace(/\/+$/, ""), db: ODOO_DB, login: ODOO_LOGIN, key: ODOO_API_KEY };
}

export class OdooError extends Error {}

async function rpc(service, method, args) {
  const { url } = config();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url + "/jsonrpc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", method: "call", params: { service, method, args }, id: Date.now() }),
      signal: ctrl.signal
    });
  } catch (err) {
    throw new OdooError(`Odoo unreachable (${service}.${method}): ${err.message}`);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new OdooError(`Odoo HTTP ${res.status} on ${service}.${method}`);
  const json = await res.json();
  if (json.error) {
    const e = new OdooError(json.error.data?.message || json.error.message || "Unknown Odoo RPC error");
    e.odoo = json.error;
    throw e;
  }
  return json.result;
}

let cachedUid = null;
let cachedAt = 0;

async function serviceUid() {
  if (cachedUid && Date.now() - cachedAt < UID_TTL_MS) return cachedUid;
  const { db, login, key } = config();
  const uid = await rpc("common", "authenticate", [db, login, key, {}]);
  if (!uid) {
    throw new HttpError(500, "Odoo authentication failed (check ODOO_DB, ODOO_LOGIN and ODOO_API_KEY).", { expose: true });
  }
  cachedUid = uid;
  cachedAt = Date.now();
  return uid;
}

// Any model call as the service account:
// execute("product.template", "search_read", [domain], { fields, limit })
export async function execute(model, method, args = [], kwargs = {}) {
  const { db, key } = config();
  const uid = await serviceUid();
  return rpc("object", "execute_kw", [db, uid, key, model, method, args, kwargs]);
}

// Checks a CUSTOMER's own email + password. Returns their user id or null.
export async function authenticateUser(login, password) {
  const { db } = config();
  try {
    return (await rpc("common", "authenticate", [db, login, password, {}])) || null;
  } catch {
    return null;
  }
}

// Which of these fields exist on the model (field names differ between Odoo
// versions and installed modules). Cached per server instance.
const fieldCache = new Map();
export async function existingFields(model, names) {
  const key = model + ":" + names.join(",");
  if (!fieldCache.has(key)) {
    const p = execute(model, "fields_get", [names], { attributes: ["type"] })
      .then((found) => names.filter((n) => found && found[n]))
      .catch((e) => { fieldCache.delete(key); throw e; });
    fieldCache.set(key, p);
  }
  return fieldCache.get(key);
}

// Public image of a published product - loaded by the phone straight from
// Odoo, never passed through here as base64.
export function imageUrl(model, id, field = "image_1024") {
  return `${config().url}/web/image/${model}/${id}/${field}`;
}
