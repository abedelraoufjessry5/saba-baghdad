// Offer prices from js/data/offers.js, applied on top of Odoo's prices.
import { OFFERS } from "../../js/data/offers.js";

function today() {
  // Baghdad date (UTC+3), as YYYY-MM-DD
  return new Date(Date.now() + 3 * 3600 * 1000).toISOString().slice(0, 10);
}

export function activeOffers() {
  const day = today();
  const map = new Map();
  for (const o of OFFERS) {
    const id = parseInt(o.id, 10), price = Number(o.price), was = Number(o.was);
    if (!(id > 0 && price > 0 && was > price)) continue;
    if (o.until && String(o.until) < day) continue;
    map.set(id, { price, was });
  }
  return map;
}

// Price shown and charged for one product.template row from Odoo.
export function pricing(row, withCompare, offers = activeOffers()) {
  const o = offers.get(row.id);
  if (o) return { price: o.price, comparePrice: o.was, onSale: true };
  const compare = withCompare ? row.compare_list_price || 0 : 0;
  return { price: row.list_price, comparePrice: compare, onSale: compare > row.list_price };
}
