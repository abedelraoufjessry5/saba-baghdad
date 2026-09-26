// GET /api/prices?ids=1,2,3 -> current prices of the hand-picked home products.
import { execute } from "./_lib/odoo.js";
import { handler, send } from "./_lib/http.js";
import { PUBLISHED } from "./_lib/catalog.js";

export default handler(["GET"], async (req, res) => {
  const ids = [...new Set(String(req.query.ids || "").split(",").map((x) => parseInt(x, 10)).filter((x) => x > 0))].slice(0, 80);
  if (!ids.length) return send(res, { prices: [] }, 300);
  const rows = await execute("product.template", "search_read", [[["id", "in", ids], PUBLISHED]], { fields: ["id", "list_price"] });
  send(res, { prices: rows.map((p) => ({ id: p.id, price: p.list_price })) }, 300);
});
