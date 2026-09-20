import { execute } from "./odoo.js";

// Odoo names the shop description differently across versions/modules.
// Saba fills the eCommerce one, so it comes first.
const DESC_CANDIDATES = [
  "description_ecommerce",
  "website_description",
  "description_sale"
];

let cache = null;

// Returns only the description fields that actually exist on this database.
export async function descriptionFields() {
  if (cache) return cache;
  try {
    const found = await execute("product.template", "fields_get", [DESC_CANDIDATES], {
      attributes: ["type"]
    });
    cache = DESC_CANDIDATES.filter((f) => found && found[f]);
    if (!cache.length) cache = ["description_sale"];
  } catch {
    cache = ["description_sale"];
  }
  return cache;
}

// First non-empty description on the record, in priority order.
export function pickDescription(record, fields) {
  for (const f of fields) {
    const v = record[f];
    if (v && String(v).trim() && String(v).trim() !== "false") return String(v);
  }
  return "";
}
