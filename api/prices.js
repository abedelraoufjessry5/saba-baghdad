import { execute } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

// The home page ships with prices baked into the old build. This lets the app
// refresh them from Odoo so a price change in Odoo shows up everywhere.
export default async function handler(req, res) {
  await guarded(res, async () => {
    const ids = String(req.query.ids || "")
      .split(",")
      .map(Number)
      .filter(Boolean)
      .slice(0, 80);

    if (!ids.length) {
      ok(res, { prices: [] }, 300);
      return;
    }

    const rows = await execute(
      "product.template",
      "search_read",
      [[["id", "in", ids], ["website_published", "=", true]]],
      { fields: ["id", "list_price"] }
    );

    ok(res, { prices: rows.map((p) => ({ id: p.id, price: p.list_price })) }, 300);
  });
}
