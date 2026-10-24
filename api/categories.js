// GET /api/categories -> { categories: [{ id, name, parentId, count }] }
// Only categories that have products in the app (in them or under them), so
// no chip or brand opens an empty list.
import { execute } from "./_lib/odoo.js";
import { handler, send } from "./_lib/http.js";
import { catalogDomain } from "./_lib/catalog.js";

export default handler(["GET"], async (req, res) => {
  const [rows, products] = await Promise.all([
    execute("product.public.category", "search_read", [[]], { fields: ["id", "name", "parent_id"], order: "sequence, name" }),
    execute("product.template", "search_read", [await catalogDomain()], { fields: ["public_categ_ids"], limit: 20000 })
  ]);
  const parent = new Map(rows.map((c) => [c.id, c.parent_id ? c.parent_id[0] : null]));
  // each product counts once for its categories and every category above them
  const count = new Map();
  for (const p of products) {
    const seen = new Set();
    for (let id of p.public_categ_ids || []) {
      while (id && !seen.has(id)) { seen.add(id); id = parent.get(id); }
    }
    for (const id of seen) count.set(id, (count.get(id) || 0) + 1);
  }
  send(res, {
    categories: rows
      .filter((c) => count.get(c.id))
      .map((c) => ({ id: c.id, name: c.name, parentId: c.parent_id ? c.parent_id[0] : null, count: count.get(c.id) }))
  }, 900);
});
