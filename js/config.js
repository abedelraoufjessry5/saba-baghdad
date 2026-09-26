/* App-wide settings. Change values here, not inside the screens. */

// Where the banner / category / brand photos live. download-assets.mjs copies
// them into /img/content and switches this line to "/img/content" for you.
export const IMG_BASE = "https://019beba1-942b-7e71-8d2c-d730501e122b.mochausercontent.com";

// Pharmacy WhatsApp number, international format without "+".
export const WHATSAPP = "9647804406692";

// The Odoo website - used for its live-chat widget only. Products, cart,
// orders and accounts all go through our own /api, never to this site.
export const ODOO_SITE = "https://saba-baghdad.odoo.com";
export const LIVECHAT_CHANNEL = 2; // set to 0 to turn the chat bubble off

export const LINKS = {
  facebook: "https://www.facebook.com/share/16QZoebDZM/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/saba_baghdad_pharmacy?igsh=MW5r",
  tiktok: "https://www.tiktok.com/@saba_baghdad_pharmacy",
  maps: "https://maps.app.goo.gl/cm1amRPGhojmVsat5"
};

export const API_BASE = "/api";

// Shown until /api/delivery answers; the real fees are set in api/_lib/delivery.js.
export const DELIVERY_FEES = { baghdad: 4000, provinces: 5000 };

// localStorage keys
export const KEYS = {
  lang: "saba.lang",
  cart: "saba.cart.v1",
  auth: "saba.auth.v2",
  zone: "saba.zone",
  orders: "saba.orders.v2",
  legacyOrders: "saba.orders.v1",
  legacy: ["saba.addr", "saba.auth.v1"] // removed on start-up
};

export function whatsappUrl(text) {
  return "https://api.whatsapp.com/send/?phone=%2B" + WHATSAPP + (text ? "&text=" + encodeURIComponent(text) : "");
}

// Photo name from content.js -> full URL.
export function contentImage(name) {
  if (!name) return "";
  if (/^(https?:|data:|\/)/.test(name)) return name;
  if (name.startsWith("local:")) return "/img/brand/" + name.slice(6);
  return IMG_BASE + "/" + encodeURIComponent(name);
}
