// Product fields that differ between Odoo versions / modules, and which
// products the app shows.
import { execute, existingFields } from "./odoo.js";
import { orDomain } from "./text.js";
import { SETS, NOT_SUPPLEMENT } from "../../js/data/sets.js";

// The shop description has different names; Saba fills the eCommerce one.
const DESC_CANDIDATES = ["description_ecommerce", "website_description", "description_sale"];

export async function descriptionFields() {
  try {
    const found = await existingFields("product.template", DESC_CANDIDATES);
    return found.length ? found : ["description_sale"];
  } catch {
    return ["description_sale"];
  }
}

// The "was" price used for offers - only exists with eCommerce comparison prices on.
export async function hasComparePrice() {
  try {
    return (await existingFields("product.template", ["compare_list_price"])).length === 1;
  } catch {
    return false;
  }
}

export function pickDescription(record, fields) {
  for (const f of fields) {
    const v = record[f];
    if (v && String(v).trim() && String(v).trim() !== "false") return String(v);
  }
  return "";
}

export const PUBLISHED = ["website_published", "=", true];

// Sellable goods: can be sold, have a price, and aren't a service
// (the delivery fee product is a service).
export const SELLABLE = [["sale_ok", "=", true], ["list_price", ">", 0], ["type", "!=", "service"]];

// Products that have a main photo. Odoo keeps photos as attachments, so
// this works on every version. Kept for 10 minutes per server instance.
let photoCache = { at: 0, ids: null };
export async function templatesWithPhoto() {
  if (photoCache.ids && Date.now() - photoCache.at < 10 * 60 * 1000) return photoCache.ids;
  const rows = await execute("ir.attachment", "search_read",
    [[["res_model", "=", "product.template"], ["res_field", "=", "image_1920"]]], { fields: ["res_id"] });
  const ids = [...new Set(rows.map((r) => r.res_id).filter(Boolean))];
  photoCache = { at: Date.now(), ids };
  return ids;
}

// Which products the app shows (domain terms to add to a search):
//  default                 only products published on the website
//  CATALOG_MODE=ready      also unpublished ones that are ready to sell:
//                          sellable, with a price and a photo
export async function catalogDomain() {
  if (process.env.CATALOG_MODE !== "ready") return [PUBLISHED];
  const withPhoto = await templatesWithPhoto();
  return ["|", PUBLISHED, "&", "&", "&", ["id", "in", withPhoto], ...SELLABLE];
}
export const APP_ORIGIN = "Saba Baghdad App";

// A product group from js/data/sets.js as Odoo domain terms (+ its free
// search, if it has one). null = no such group.
export function setFilter(id) {
  const set = Object.prototype.hasOwnProperty.call(SETS, id) ? SETS[id] : null;
  if (!set) return null;
  const domain = [];
  if (set.terms && set.terms.length) domain.push(...orDomain(set.terms.map((t) => ["name", "ilike", t])));
  const without = [...(set.without || []), ...(set.vitamins ? NOT_SUPPLEMENT : [])];
  for (const w of without) domain.push(["name", "not ilike", w]);
  if (set.exclude && set.exclude.length) domain.push(["id", "not in", set.exclude]);
  return { domain, q: set.q || "" };
}
