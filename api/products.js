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

    const lim = Math.min(Number(limit) || 24, 100);
    const off = Math.max(Number(offset) || 0, 0);

    // Offers compare two fields, which an Odoo domain can't do - narrow to the
    // discounted ones first, then finish the comparison here.
    const saleMode = on_sale === "1";
    if (saleMode) domain.push(["compare_list_price", ">", 0]);

    let rows, total;
    try {
      // Ask Odoo for ONE page, not the whole catalogue. Count runs alongside.
      const [page, count] = await Promise.all([
        execute("product.template", "search_read", [domain], {
          fields,
          order: "name",
          limit: saleMode ? 300 : lim,
          offset: saleMode ? 0 : off
        }),
        execute("product.template", "search_count", [domain])
      ]);
      rows = page;
      total = count;
    } catch {
      // a field this database doesn't have - fall back to the safe minimum
      const safeDomain = q
        ? [["website_published", "=", true], ["name", "ilike", q]]
        : [["website_published", "=", true]];
      rows = await execute("product.template", "search_read", [safeDomain], {
        fields: ["id", "name", "list_price", "public_categ_ids"],
        order: "name",
        limit: lim,
        offset: off
      });
      total = await execute("product.template", "search_count", [safeDomain]);
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

    if (saleMode) {
      mapped = mapped.filter((p) => p.onSale);
      total = mapped.length;
      mapped = mapped.slice(off, off + lim);
    }

    ok(res, { products: mapped, total }, 120);
  });
}
