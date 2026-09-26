// GET /api/health?key=YOUR_HEALTH_KEY - checks the Odoo connection.
// Only answers when HEALTH_KEY is set in Vercel and the same key is given;
// shows no customer names or details.
import crypto from "crypto";
import { execute, existingFields } from "./_lib/odoo.js";
import { handler, send, HttpError } from "./_lib/http.js";
import { APP_ORIGIN, PUBLISHED } from "./_lib/catalog.js";

function keyMatches(given) {
  const expected = process.env.HEALTH_KEY || "";
  const a = Buffer.from(String(given || ""));
  const b = Buffer.from(expected);
  return expected.length >= 8 && a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default handler(["GET"], async (req, res) => {
  if (!keyMatches(req.query.key)) throw new HttpError(404, "Not found");
  const out = { ok: true, checks: {} };
  const check = async (name, fn) => {
    try { out.checks[name] = await fn(); } catch (e) { out.ok = false; out.checks[name] = "error: " + e.message; }
  };
  await check("odooVersion", async () => {
    const v = await execute("ir.module.module", "search_read", [[["name", "=", "base"], ["state", "=", "installed"]]], { fields: ["latest_version"], limit: 1 });
    return v.length ? v[0].latest_version : "unknown";
  });
  await check("publishedProducts", () => execute("product.template", "search_count", [[PUBLISHED]]));
  await check("userGroupField", async () => (await existingFields("res.users", ["group_ids", "groups_id"]))[0] || "none");
  await check("comparePrice", async () => (await existingFields("product.template", ["compare_list_price"])).length === 1);
  await check("sessionSecret", async () => (process.env.SESSION_SECRET ? "set" : "derived from ODOO_API_KEY (set SESSION_SECRET)"));
  await check("lastAppOrders", async () => {
    const rows = await execute("sale.order", "search_read", [[["origin", "=", APP_ORIGIN]]], { fields: ["name", "state", "amount_total", "create_date"], limit: 5, order: "id desc" });
    return rows.map((o) => ({ ref: o.name, state: o.state, total: o.amount_total, at: o.create_date }));
  });
  send(res, out);
});
