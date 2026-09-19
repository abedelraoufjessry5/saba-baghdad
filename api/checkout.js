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

    const orderLines = items.map((it) => [
      0,
      0,
      { product_id: it.productId, product_uom_qty: it.qty }
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
