import { execute } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

// Diagnostics: open /api/health in a browser to see exactly what Odoo says.
// Handy when something fails and the app only shows a short error.
export default async function handler(req, res) {
  await guarded(res, async () => {
    const out = { ok: true, checks: {} };

    try {
      const v = await execute("ir.module.module", "search_read", [
        [["name", "=", "base"], ["state", "=", "installed"]]
      ], { fields: ["latest_version"], limit: 1 });
      out.checks.odooVersion = v.length ? v[0].latest_version : "unknown";
    } catch (e) {
      out.checks.odooVersion = "error: " + e.message;
    }

    try {
      const n = await execute("product.template", "search_count", [
        [["website_published", "=", true]]
      ]);
      out.checks.publishedProducts = n;
    } catch (e) {
      out.checks.publishedProducts = "error: " + e.message;
    }

    try {
      const f = await execute("res.users", "fields_get", [["group_ids", "groups_id"]], {
        attributes: ["type"]
      });
      out.checks.userGroupField = f && f.group_ids ? "group_ids" : "groups_id";
    } catch (e) {
      out.checks.userGroupField = "error: " + e.message;
    }

    try {
      const orders = await execute("sale.order", "search_read", [
        [["origin", "=", "Saba Baghdad App"]]
      ], { fields: ["id", "name", "state", "partner_id", "amount_total", "create_date"], limit: 5, order: "id desc" });
      out.checks.lastAppOrders = orders;
    } catch (e) {
      out.checks.lastAppOrders = "error: " + e.message;
    }

    ok(res, out);
  });
}
