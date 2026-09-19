import { execute, imageUrl } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

export default async function handler(req, res) {
  await guarded(res, async () => {
    const { category_id, q, on_sale, limit = "24", offset = "0" } = req.query;

    const domain = [["website_published", "=", true]];
    if (category_id) {
      domain.push(["public_categ_ids", "child_of", Number(category_id)]);
    }
    if (q) {
      domain.push(["name", "ilike", q]);
    }

    // compare_list_price may not exist on older Odoo versions - fall back
    // gracefully if the read fails on that field.
    let fields = ["id", "name", "list_price", "compare_list_price", "public_categ_ids", "qty_available"];
    let rows;
    try {
      rows = await execute("product.template", "search_read", [domain], {
        fields,
        order: "name"
      });
    } catch {
      fields = ["id", "name", "list_price", "public_categ_ids", "qty_available"];
      rows = await execute("product.template", "search_read", [domain], {
        fields,
        order: "name"
      });
    }

    let mapped = rows.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.list_price,
      comparePrice: p.compare_list_price || 0,
      onSale: !!p.compare_list_price && p.compare_list_price > p.list_price,
      // Saba doesn't track stock in Odoo (quantities are left open), so a
      // qty_available of 0 does NOT mean "unavailable" - everything sells.
      inStock: true,
      categoryIds: p.public_categ_ids || [],
      image: imageUrl("product.template", p.id, "image_512")
    }));

    if (on_sale === "1") {
      mapped = mapped.filter((p) => p.onSale);
    }

    const off = Number(offset);
    const lim = Number(limit);
    ok(res, { products: mapped.slice(off, off + lim), total: mapped.length });
  });
}
