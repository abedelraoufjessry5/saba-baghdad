import { execute } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

// Cash-on-delivery only (v1). Creates a draft sale order in Odoo so pharmacy
// staff can review/confirm it exactly like any other quotation - it does NOT
// auto-confirm, so nothing ships without a human looking at it first.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  await guarded(res, async () => {
    const { name, phone, address, items, notes } = req.body || {};
    if (!name || !phone || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "name, phone and items[] are required" });
      return;
    }

    // Find an existing customer by phone, else create one.
    const existing = await execute("res.partner", "search_read", [
      [["phone", "=", phone]]
    ], { fields: ["id"], limit: 1 });

    let partnerId;
    if (existing.length) {
      partnerId = existing[0].id;
    } else {
      partnerId = await execute("res.partner", "create", [
        { name, phone, street: address || "" }
      ]);
    }

    // The app browses product.template ids, but sale.order.line.product_id
    // needs a product.product (variant) id - they are NOT the same number.
    // Resolve each template to its first variant before building the lines.
    const tmplIds = items.map((i) => Number(i.productId));
    const variants = await execute(
      "product.product",
      "search_read",
      [[["product_tmpl_id", "in", tmplIds]]],
      { fields: ["id", "product_tmpl_id"] }
    );

    const variantByTmpl = {};
    variants.forEach((v) => {
      const tid = Array.isArray(v.product_tmpl_id) ? v.product_tmpl_id[0] : v.product_tmpl_id;
      if (!variantByTmpl[tid]) variantByTmpl[tid] = v.id;
    });

    const missing = tmplIds.filter((id) => !variantByTmpl[id]);
    if (missing.length) {
      res.status(400).json({ error: "منتج غير موجود بأودو: " + missing.join(", ") });
      return;
    }

    const orderLines = items.map((it) => [
      0,
      0,
      { product_id: variantByTmpl[Number(it.productId)], product_uom_qty: it.qty }
    ]);

    const orderId = await execute("sale.order", "create", [
      {
        partner_id: partnerId,
        order_line: orderLines,
        note: `دفع عند التوصيل - عنوان: ${address || "-"}\n${notes || ""}`.trim(),
        origin: "Saba Baghdad App"
      }
    ]);

    ok(res, { orderId, partnerId, status: "draft" });
  });
}
