// GET /api/products?category_id=&q=&on_sale=1&limit=24&offset=0
//  -> { products: [...], total }
import { execute, imageUrl } from "./_lib/odoo.js";
import { handler, send } from "./_lib/http.js";
import { searchTerms, orDomain, stripHtml } from "./_lib/text.js";
import { descriptionFields, hasComparePrice, pickDescription, PUBLISHED } from "./_lib/catalog.js";

const MAX_LIMIT = 100;

export default handler(["GET"], async (req, res) => {
  const { category_id, q, on_sale } = req.query;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), MAX_LIMIT);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

  const [descFields, withCompare] = await Promise.all([descriptionFields(), hasComparePrice()]);

  const domain = [PUBLISHED];
  const cat = parseInt(category_id, 10);
  if (cat > 0) domain.push(["public_categ_ids", "child_of", cat]);

  // name AND description, for the query and its Arabic synonym
  if (q) {
    const conds = [];
    for (const term of searchTerms(q)) {
      conds.push(["name", "ilike", term]);
      for (const f of descFields) conds.push([f, "ilike", term]);
    }
    domain.push(...orDomain(conds));
  }

  const fields = ["id", "name", "list_price", "public_categ_ids", ...descFields];
  if (withCompare) fields.push("compare_list_price");

  let rows;
  let total;
  if (on_sale === "1") {
    // "on sale" compares two fields, which a domain can't do: find the
    // discounted ids first, then read just the requested page.
    if (!withCompare) return send(res, { products: [], total: 0 }, 120);
    const candidates = await execute("product.template", "search_read",
      [[...domain, ["compare_list_price", ">", 0]]], { fields: ["id", "list_price", "compare_list_price"], order: "name, id", limit: 2000 });
    const ids = candidates.filter((p) => p.compare_list_price > p.list_price).map((p) => p.id);
    total = ids.length;
    const page = ids.slice(offset, offset + limit);
    rows = page.length ? await execute("product.template", "read", [page], { fields }) : [];
    rows.sort((a, b) => page.indexOf(a.id) - page.indexOf(b.id));
  } else {
    [rows, total] = await Promise.all([
      execute("product.template", "search_read", [domain], { fields, order: "name, id", limit, offset }),
      execute("product.template", "search_count", [domain])
    ]);
  }

  send(res, {
    products: rows.map((p) => {
      const compare = withCompare ? p.compare_list_price || 0 : 0;
      return {
        id: p.id,
        name: p.name,
        price: p.list_price,
        comparePrice: compare,
        onSale: compare > p.list_price,
        excerpt: stripHtml(pickDescription(p, descFields), 110),
        categoryIds: p.public_categ_ids || [],
        image: imageUrl("product.template", p.id, "image_512")
      };
    }),
    total
  }, 120);
});
