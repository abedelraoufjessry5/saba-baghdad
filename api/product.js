// GET /api/product?id=123 -> one published product with its description.
import { execute, imageUrl } from "./_lib/odoo.js";
import { handler, send, HttpError } from "./_lib/http.js";
import { cleanHtml, stripHtml } from "./_lib/text.js";
import { descriptionFields, hasComparePrice, pickDescription, PUBLISHED } from "./_lib/catalog.js";

export default handler(["GET"], async (req, res) => {
  const id = parseInt(req.query.id, 10);
  if (!(id > 0)) throw new HttpError(400, "Missing ?id=");

  const [descFields, withCompare] = await Promise.all([descriptionFields(), hasComparePrice()]);
  const fields = ["id", "name", "list_price", "public_categ_ids", ...descFields];
  if (withCompare) fields.push("compare_list_price");

  const rows = await execute("product.template", "search_read", [[["id", "=", id], PUBLISHED]], { fields, limit: 1 });
  const p = rows[0];
  if (!p) throw new HttpError(404, "المنتج غير موجود");

  const html = cleanHtml(pickDescription(p, descFields));
  const compare = withCompare ? p.compare_list_price || 0 : 0;
  send(res, {
    id: p.id,
    name: p.name,
    price: p.list_price,
    comparePrice: compare,
    onSale: compare > p.list_price,
    description: html,
    excerpt: stripHtml(html, 160),
    categoryIds: p.public_categ_ids || [],
    image: imageUrl("product.template", p.id, "image_1024")
  }, 300);
});
