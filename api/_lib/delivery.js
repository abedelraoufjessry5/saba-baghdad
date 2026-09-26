// Delivery fees - the one place they are set (Baghdad 4,000 / provinces 5,000). The app reads them from
// /api/delivery, and checkout adds the fee to the order as its own line.
// Change them here, or in Vercel with DELIVERY_FEE_BAGHDAD / DELIVERY_FEE_PROVINCES.
import { execute, existingFields } from "./odoo.js";

function amount(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export const ZONES = {
  baghdad: { fee: amount(process.env.DELIVERY_FEE_BAGHDAD, 4000), line: "أجور التوصيل — بغداد" },
  provinces: { fee: amount(process.env.DELIVERY_FEE_PROVINCES, 5000), line: "أجور التوصيل — المحافظات" }
};

// The Odoo product used for the fee line: a service called "أجور التوصيل"
// with internal reference SABA-DELIVERY. Created the first time it's needed;
// set DELIVERY_PRODUCT_ID in Vercel to use one of your own instead.
const CODE = "SABA-DELIVERY";
let cachedId = null;

export async function deliveryProductId({ create = false } = {}) {
  if (process.env.DELIVERY_PRODUCT_ID) return Number(process.env.DELIVERY_PRODUCT_ID);
  if (cachedId) return cachedId;
  const [found] = await execute("product.product", "search_read", [[["default_code", "=", CODE]]], { fields: ["id"], limit: 1 });
  if (found) return (cachedId = found.id);
  if (!create) return null;

  // Odoo 17 names the product kind "detailed_type", Odoo 18+ uses "type"
  const kind = (await existingFields("product.template", ["detailed_type"])).length ? "detailed_type" : "type";
  const tmplId = await execute("product.template", "create", [{
    name: "أجور التوصيل",
    default_code: CODE,
    [kind]: "service",
    list_price: 0,
    sale_ok: true,
    purchase_ok: false,
    website_published: false
  }]);
  const [variant] = await execute("product.product", "search_read", [[["product_tmpl_id", "=", tmplId]]], { fields: ["id"], limit: 1 });
  return (cachedId = variant.id);
}
