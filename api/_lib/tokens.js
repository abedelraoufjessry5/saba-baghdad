// Signed tokens, so the server can trust what the phone sends back without
// keeping any database of its own:
//  - session tokens: "this phone is signed in as user X" (30 days)
//  - order tokens:   "this phone placed order N" (lets it read that order)
import crypto from "crypto";
import { HttpError } from "./http.js";

const SESSION_DAYS = 30;

function secret() {
  // Set SESSION_SECRET in Vercel (any long random text). Without it, a key is
  // derived from the Odoo API key, which works but changes if you rotate it.
  const s = process.env.SESSION_SECRET || (process.env.ODOO_API_KEY ? "derived:" + process.env.ODOO_API_KEY : "");
  if (!s) throw new HttpError(500, "Missing SESSION_SECRET", { expose: true });
  return crypto.createHash("sha256").update("saba-app|" + s).digest();
}

function sign(text) {
  return crypto.createHmac("sha256", secret()).update(text).digest("base64url");
}

function same(a, b) {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function createSession(user) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DAYS * 86400;
  const payload = Buffer.from(JSON.stringify({ uid: user.uid, pid: user.pid, exp })).toString("base64url");
  return { token: payload + "." + sign("session." + payload), exp };
}

// Returns { uid, pid } from "Authorization: Bearer ...", or null if absent.
// A present-but-bad token is a 401 so the app signs the person out.
export function readSession(req, { required = false } = {}) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) {
    if (required) throw new HttpError(401, "سجّلوا الدخول أولاً");
    return null;
  }
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !same(sig, sign("session." + payload))) throw new HttpError(401, "انتهت الجلسة، سجّلوا الدخول مرة ثانية");
  let data;
  try { data = JSON.parse(Buffer.from(payload, "base64url").toString()); } catch { data = null; }
  if (!data || !data.uid || !data.pid || data.exp * 1000 < Date.now()) throw new HttpError(401, "انتهت الجلسة، سجّلوا الدخول مرة ثانية");
  return { uid: data.uid, pid: data.pid };
}

export function orderToken(orderId) {
  return sign("order." + orderId).slice(0, 32);
}

export function checkOrderToken(orderId, token) {
  return !!token && same(token, orderToken(orderId));
}

// Session + "is this account still active?" (a deleted account's token stops
// working at once, not after 30 days).
export async function activeSession(req, execute, { required = false } = {}) {
  const s = readSession(req, { required });
  if (!s) return null;
  const n = await execute("res.users", "search_count", [[["id", "=", s.uid]]]);
  if (!n) throw new HttpError(401, "انتهت الجلسة، سجّلوا الدخول مرة ثانية");
  return s;
}
