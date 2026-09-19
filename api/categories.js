import { execute } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

export default async function handler(req, res) {
  await guarded(res, async () => {
    const categories = await execute(
      "product.public.category",
      "search_read",
      [[]],
      { fields: ["id", "name", "parent_id"], order: "sequence, name" }
    );
    ok(res, {
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        parentId: c.parent_id ? c.parent_id[0] : null
      }))
    });
  });
}
