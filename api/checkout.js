// POST /api/checkout  - cash-on-delivery order.
// body: { name, phone, address, zone, notes, items: [{ productId, qty }], key, website }
// zone: "baghdad" | "provinces" - the delivery fee is added as its own line.
// key: a random id the phone makes per order attempt - sending the same
// order twice (slow network, double tap, retry after a timeout) returns the
// first order instead of creating a second one.
// Signed-in customers send their session too and the order goes on their
// account. Prices always come from Odoo, never from the phone.
//  -> { orderId, ref, token, total, status }
import { execute } from "./_lib/odoo.js";
import { handler, send, body, clientIp, HttpError } from "./_lib/http.js";
import { activeSession, orderToken } from "./_lib/tokens.js";
import { limit } from "./_lib/limit.js";
import { normalizePhone, phoneVariants, cleanText } from "./_lib/text.js";
import { APP_ORIGIN, PUBLISHED } from "./_lib/catalog.js";
import { ZONES, deliveryProductId } from "./_lib/delivery.js";

// Orders are confirmed straight away so they land in Sales Orders (as the
// shop did). Set ORDER_AUTO_CONFIRM=false in Vercel to leave them as
// quotations for the team to confirm by hand.
const AUTO_CONFIRM = process.env.ORDER_AUTO_CONFIRM !== "false";
const MAX_LINES = 40;
const MAX_QTY = 99;

function readOrder(req) {
  const b = body(req);
  if (b.website) throw new HttpError(400, "Bad request"); // spam-bot trap field
  const name = cleanText(b.name, 80);
  const phone = normalizePhone(b.phone);
  const address = cleanText(b.address, 300);
  const notes = cleanText(b.notes, 500);
  if (name.length < 2) throw new HttpError(400, "الاسم مطلوب");
  if (!phone) throw new HttpError(400, "رقم الهاتف لازم يكون رقم موبايل عراقي، مثل 07701234567");
  if (address.length < 3) throw new HttpError(400, "العنوان مطلوب");
  const zone = String(b.zone || "");
  if (!ZONES[zone]) throw new HttpError(400, "اختاروا منطقة التوصيل");

  // merge duplicates, clamp quantities
  const qtyById = new Map();
  for (const it of Array.isArray(b.items) ? b.items : []) {
    const id = parseInt(it && it.productId, 10);
    const qty = parseInt(it && it.qty, 10);
    if (!(id > 0) || !(qty > 0)) continue;
    qtyById.set(id, Math.min(MAX_QTY, (qtyById.get(id) || 0) + qty));
  }
  if (!qtyById.size) throw new HttpError(400, "السلة فارغة");
  if (qtyById.size > MAX_LINES) throw new HttpError(400, "عدد المنتجات كبير، قسّموا الطلب");
  const key = /^[A-Za-z0-9-]{16,64}$/.test(String(b.key || "")) ? "APP-" + b.key : null;
  return { name, phone, address, zone, notes, qtyById, key };
}

async function findOrCreateCustomer({ name, phone, address }, session) {
  // Signed in: the order goes on the account. Guest: an existing contact with
  // this phone is reused only if it isn't someone's account, so a mistyped
  // number can never put an order into a stranger's "My orders".
  if (session) {
    const [partner] = await execute("res.partner", "search_read", [[["id", "=", session.pid]]], { fields: ["id", "phone"], limit: 1 });
    if (!partner) throw new HttpError(401, "انتهت الجلسة، سجّلوا الدخول مرة ثانية");
    if (!partner.phone) await execute("res.partner", "write", [[partner.id], { phone }]);
    return { id: partner.id, isNew: false };
  }
  const [existing] = await execute("res.partner", "search_read",
    [[["phone", "in", phoneVariants(phone)], ["parent_id", "=", false], ["user_ids", "=", false], ["is_company", "=", false]]],
    { fields: ["id"], limit: 1, order: "id desc" });
  if (existing) return { id: existing.id, isNew: false };
  const id = await execute("res.partner", "create", [{ name, phone, street: address }]);
  return { id, isNew: true };
}

// The address typed for THIS order becomes a delivery address under the
// customer, so an old address on file is never used by mistake and the
// customer's main card is never overwritten by an anonymous form.
async function deliveryAddress(customer, { name, phone, address }) {
  if (customer.isNew) return customer.id;
  const [same] = await execute("res.partner", "search_read",
    [[["parent_id", "=", customer.id], ["type", "=", "delivery"], ["street", "=", address]]], { fields: ["id"], limit: 1 });
  if (same) return same.id;
  return execute("res.partner", "create", [{ parent_id: customer.id, type: "delivery", name, phone, street: address }]);
}

async function reply(res, orderId) {
  const [saved] = await execute("sale.order", "read", [[orderId]], { fields: ["name", "amount_total", "state"] });
  send(res, {
    orderId,
    ref: saved ? saved.name : "#" + orderId,
    token: orderToken(orderId),
    total: saved ? saved.amount_total : null,
    status: saved ? saved.state : "draft"
  });
}

export default handler(["POST"], async (req, res) => {
  const order = readOrder(req);
  // many customers can share one mobile-network IP, so the IP limit is loose
  limit("checkout:ip:" + clientIp(req), 40, 600);
  limit("checkout:phone:" + order.phone, 6, 600);
  const session = await activeSession(req, execute);

  if (order.key) {
    const [dup] = await execute("sale.order", "search_read",
      [[["client_order_ref", "=", order.key], ["origin", "=", APP_ORIGIN]]], { fields: ["id"], limit: 1 });
    if (dup) return reply(res, dup.id);
  }

  // The app shows product.template ids; order lines need product.product
  // (variant) ids. Only published products can be ordered.
  const tmplIds = [...order.qtyById.keys()];
  const published = await execute("product.template", "search_read",
    [[["id", "in", tmplIds], PUBLISHED, ["sale_ok", "=", true]]], { fields: ["id"] });
  const publishedIds = new Set(published.map((p) => p.id));
  const variants = await execute("product.product", "search_read",
    [[["product_tmpl_id", "in", [...publishedIds]]]], { fields: ["id", "product_tmpl_id"], order: "id" });
  const variantOf = {};
  for (const v of variants) {
    const tid = Array.isArray(v.product_tmpl_id) ? v.product_tmpl_id[0] : v.product_tmpl_id;
    if (!variantOf[tid]) variantOf[tid] = v.id;
  }
  const missing = tmplIds.filter((id) => !variantOf[id]);
  if (missing.length) throw new HttpError(400, "بعض المنتجات ما عادت متوفرة بالمتجر، احذفوها من السلة وجرّبوا مرة ثانية");

  const customer = await findOrCreateCustomer(order, session);
  const shippingId = await deliveryAddress(customer, order);

  // tie the order to the website so it shows under Website > Orders too
  let websiteId = null;
  try {
    const [site] = await execute("website", "search_read", [[]], { fields: ["id"], limit: 1 });
    if (site) websiteId = site.id;
  } catch (e) {
    console.error("website lookup failed", e);
  }

  // Phone + address live on the delivery address above. The order's "note"
  // field is the printed Terms & Conditions, so it is left alone.
  const vals = {
    partner_id: customer.id,
    partner_shipping_id: shippingId,
    order_line: tmplIds.map((id) => [0, 0, { product_id: variantOf[id], product_uom_qty: order.qtyById.get(id) }]),
    origin: APP_ORIGIN
  };
  const delivery = ZONES[order.zone];
  if (delivery.fee > 0) {
    const productId = await deliveryProductId({ create: true });
    vals.order_line.push([0, 0, { product_id: productId, name: delivery.line, product_uom_qty: 1, price_unit: delivery.fee }]);
  }
  if (order.key) vals.client_order_ref = order.key;
  if (websiteId) vals.website_id = websiteId;

  const orderId = await execute("sale.order", "create", [vals]);

  // internal note in the order's chatter for the team
  try {
    const text = ["طلب من التطبيق — دفع عند الاستلام", "الهاتف: " + order.phone, "العنوان: " + order.address, delivery.line + ": " + delivery.fee, order.notes ? "ملاحظات الزبون: " + order.notes : ""]
      .filter(Boolean).join(" — ");
    await execute("sale.order", "message_post", [[orderId]], { body: text, message_type: "comment", subtype_xmlid: "mail.mt_note" });
  } catch (e) {
    console.error("could not add the note to order " + orderId, e);
  }

  // If confirming fails the order still exists as a quotation - nothing is lost.
  let status = "draft";
  if (AUTO_CONFIRM) {
    try {
      await execute("sale.order", "action_confirm", [[orderId]]);
      status = "sale";
    } catch (e) {
      console.error("action_confirm failed for order " + orderId, e);
    }
  }

  if (status === "draft") console.log("order " + orderId + " left as quotation");
  await reply(res, orderId);
});
