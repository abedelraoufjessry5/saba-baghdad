import { execute, imageUrl } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";
import { searchTerms, orDomain, stripHtml } from "./_lib/search.js";
import { descriptionFields, pickDescription } from "./_lib/fields.js";

export default async function handler(req, res) {
  await guarded(res, async () => {
    const { category_id, q, on_sale, limit = "24", offset = "0" } = req.query;

    const descFields = await descriptionFields();

    const domain = [["website_published", "=", true]];
    if (category_id) {
      domain.push(["public_categ_ids", "child_of", Number(category_id)]);
    }

    // Search the name AND the description, for the query and its Arabic
    // synonym (so "بيوديرما" finds products named "BIODERMA ...").
    if (q) {
      const terms = searchTerms(q);
      const conds = [];
      for (const t of terms) {
        conds.push(["name", "ilike", t]);
        for (const f of descFields) conds.push([f, "ilike", t]);
      }
      domain.push(...orDomain(conds));
    }

    const fields = [
      "id",
      "name",
      "list_price",
      "compare_list_price",
      "public_categ_ids",
      ...descFields
    ];

    let rows;
    try {
      rows = await execute("product.template", "search_read", [domain], {
        fields,
        order: "name"
      });
    } catch {
      // a field the database doesn't have - fall back to the safe minimum
      rows = await execute(
        "product.template",
        "search_read",
        [
          q
            ? [["website_published", "=", true], ["name", "ilike", q]]
            : domain.filter((d) => d !== "|")
        ],
        { fields: ["id", "name", "list_price", "public_categ_ids"], order: "name" }
      );
    }

    let mapped = rows.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.list_price,
      comparePrice: p.compare_list_price || 0,
      onSale: !!p.compare_list_price && p.compare_list_price > p.list_price,
      // Saba doesn't track stock in Odoo, so nothing is ever "unavailable".
      inStock: true,
      excerpt: stripHtml(pickDescription(p, descFields), 110),
      categoryIds: p.public_categ_ids || [],
      image: imageUrl("product.template", p.id, "image_512")
    }));

    if (on_sale === "1") mapped = mapped.filter((p) => p.onSale);

    const off = Number(offset);
    const lim = Number(limit);
    ok(res, { products: mapped.slice(off, off + lim), total: mapped.length });
  });
}
