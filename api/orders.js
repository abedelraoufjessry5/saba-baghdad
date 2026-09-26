// GET /api/orders?refs=12.TOKEN,15.TOKEN  (+ optional sign-in)
// Live status of orders placed from the app. A phone only sees:
//  - orders it placed itself (each carries the signed token it got at checkout)
//  - every app order of the signed-in account
// Guessing order numbers returns nothing.
import { execute, existingFields } from "./_lib/odoo.js";
import { handler, send } from "./_lib/http.js";
import { activeSession, checkOrderToken } from "./_lib/tokens.js";
import { APP_ORIGIN } from "./_lib/catalog.js";
import { deliveryProductId } from "./_lib/delivery.js";

export default handler(["GET"], async (req, res) => {
  const session = await activeSession(req, execute);
  const ids = String(req.query.refs || "")
    .split(",")
    .slice(0, 40)
    .map((ref) => {
      const [id, token] = ref.split(".");
      const n = parseInt(id, 10);
      return n > 0 && checkOrderToken(n, token) ? n : null;
    })
    .filter(Boolean);

  if (!ids.length && !session) return send(res, { orders: [] });

  const who = [];
  if (ids.length) who.push(["id", "in", ids]);
  if (session) who.push(["partner_id", "child_of", session.pid]);
  const domain = [["origin", "=", APP_ORIGIN], ...(who.length === 2 ? ["|", ...who] : who)];

  const base = ["id", "name", "state", "date_order", "amount_total", "order_line"];
  const extra = await existingFields("sale.order", ["delivery_status"]).catch(() => []);
  const orders = await execute("sale.order", "search_read", [domain], { fields: [...base, ...extra], order: "id desc", limit: 50 });

  // order lines + the product each line is for (so "order again" works)
  const lineIds = orders.flatMap((o) => o.order_line || []);
  const linesByOrder = {};
  if (lineIds.length) {
    const optional = await existingFields("sale.order.line", ["is_delivery"]).catch(() => []);
    const feeProduct = await deliveryProductId().catch(() => null);
    const lines = await execute("sale.order.line", "read", [lineIds], {
      fields: ["id", "name", "product_uom_qty", "price_unit", "price_total", "order_id", "product_id", "display_type", ...optional]
    });
    const variantIds = [...new Set(lines.map((l) => (Array.isArray(l.product_id) ? l.product_id[0] : null)).filter(Boolean))];
    const tmplOf = {};
    if (variantIds.length) {
      const variants = await execute("product.product", "read", [variantIds], { fields: ["id", "product_tmpl_id"] });
      variants.forEach((v) => (tmplOf[v.id] = Array.isArray(v.product_tmpl_id) ? v.product_tmpl_id[0] : v.product_tmpl_id));
    }
    for (const l of lines) {
      if (l.display_type) continue; // section / note lines
      const oid = Array.isArray(l.order_id) ? l.order_id[0] : l.order_id;
      const vid = Array.isArray(l.product_id) ? l.product_id[0] : null;
      (linesByOrder[oid] = linesByOrder[oid] || []).push({
        name: l.name,
        qty: l.product_uom_qty,
        price: l.price_unit,
        total: l.price_total,
        // delivery fees are listed but never put back in the cart
        productId: vid && !l.is_delivery && vid !== feeProduct ? tmplOf[vid] || null : null
      });
    }
  }

  send(res, {
    orders: orders.map((o) => ({
      id: o.id,
      ref: o.name,
      state: o.state,
      delivery: o.delivery_status || null,
      date: o.date_order,
      total: o.amount_total,
      lines: linesByOrder[o.id] || []
    }))
  });
});
