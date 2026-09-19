import { execute, imageUrl } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

export default async function handler(req, res) {
  await guarded(res, async () => {
    const id = Number(req.query.id);
    if (!id) {
      res.status(400).json({ error: "Missing ?id=" });
      return;
    }
    const rows = await execute(
      "product.template",
      "search_read",
      [[["id", "=", id], ["website_published", "=", true]]],
      {
        fields: [
          "id",
          "name",
          "list_price",
          "description_sale",
          "qty_available",
          "public_categ_ids"
        ],
        limit: 1
      }
    );
    const p = rows[0];
    if (!p) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    ok(res, {
      id: p.id,
      name: p.name,
      price: p.list_price,
      description: p.description_sale || "",
      inStock: true, // stock isn't tracked in Odoo - never block a sale
      categoryIds: p.public_categ_ids || [],
      image: imageUrl("product.template", p.id, "image_1024")
    });
  });
}
