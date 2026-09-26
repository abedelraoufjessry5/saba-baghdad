// Product fields that differ between Odoo versions / modules.
import { existingFields } from "./odoo.js";

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
export const APP_ORIGIN = "Saba Baghdad App";
