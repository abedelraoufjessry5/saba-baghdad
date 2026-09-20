import { execute, imageUrl } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";
import { descriptionFields, pickDescription } from "./_lib/fields.js";
import { stripHtml } from "./_lib/search.js";

export default async function handler(req, res) {
  await guarded(res, async () => {
    const id = Number(req.query.id);
    if (!id) {
      res.status(400).json({ error: "Missing ?id=" });
      return;
    }

    const descFields = await descriptionFields();

    const rows = await execute(
      "product.template",
      "search_read",
      [[["id", "=", id], ["website_published", "=", true]]],
      {
        fields: ["id", "name", "list_price", "public_categ_ids", ...descFields],
        limit: 1
      }
    );

    const p = rows[0];
    if (!p) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const html = pickDescription(p, descFields);

    ok(res, {
      id: p.id,
      name: p.name,
      price: p.list_price,
      description: html,
      excerpt: stripHtml(html, 160),
      inStock: true, // stock isn't tracked in Odoo - never block a sale
      categoryIds: p.public_categ_ids || [],
      image: imageUrl("product.template", p.id, "image_1024")
    }, 300);
  });
}
