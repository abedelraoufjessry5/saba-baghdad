// GET /api/categories -> { categories: [{ id, name, parentId }] }
import { execute } from "./_lib/odoo.js";
import { handler, send } from "./_lib/http.js";

export default handler(["GET"], async (req, res) => {
  const rows = await execute("product.public.category", "search_read", [[]], {
    fields: ["id", "name", "parent_id"],
    order: "sequence, name"
  });
  send(res, {
    categories: rows.map((c) => ({ id: c.id, name: c.name, parentId: c.parent_id ? c.parent_id[0] : null }))
  }, 900);
});
