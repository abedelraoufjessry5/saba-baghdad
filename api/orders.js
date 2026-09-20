import { execute } from "./_lib/odoo.js";
import { ok, guarded } from "./_lib/respond.js";

// Returns the live status of orders the app itself placed. The app passes the
// ids it stored on this device, and we only ever return orders created by the
// app (origin check) - so nobody can read another customer's orders by
// guessing numbers.
export default async function handler(req, res) {
  await guarded(res, async () => {
    const ids = String(req.query.ids || "")
      .split(",")
      .map(Number)
      .filter(Boolean)
      .slice(0, 40);

    if (!ids.length) {
      ok(res, { orders: [] });
      return;
    }

    const domain = [["id", "in", ids], ["origin", "=", "Saba Baghdad App"]];
    const base = ["id", "name", "state", "date_order", "amount_total", "order_line"];

    let orders;
    try {
      orders = await execute("sale.order", "search_read", [domain], {
        fields: [...base, "delivery_status"],
        order: "id desc"
      });
    } catch {
      // older Odoo without delivery_status
      orders = await execute("sale.order", "search_read", [domain], {
        fields: base,
        order: "id desc"
      });
    }

    const lineIds = orders.reduce((acc, o) => acc.concat(o.order_line || []), []);
    const linesByOrder = {};
    if (lineIds.length) {
      const lines = await execute("sale.order.line", "read", [lineIds], {
        fields: ["id", "name", "product_uom_qty", "price_total", "order_id"]
      });
      for (const l of lines) {
        const oid = Array.isArray(l.order_id) ? l.order_id[0] : l.order_id;
        (linesByOrder[oid] = linesByOrder[oid] || []).push({
          name: l.name,
          qty: l.product_uom_qty,
          total: l.price_total
        });
      }
    }

    ok(res, {
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
}
