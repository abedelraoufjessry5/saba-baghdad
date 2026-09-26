/* What the app keeps on the device: the cart, the signed-in account and the
   orders placed from this phone. Other parts of the app subscribe with
   onChange() to repaint (e.g. the cart badge). */
import { KEYS } from "./config.js";

// If the phone refuses storage (private mode, locked-down views), keep
// things in memory so the cart and "my orders" still work for this visit.
const memory = new Map();
function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* blocked or broken: use memory */ }
  return memory.has(key) ? JSON.parse(memory.get(key)) : fallback;
}
function write(key, value) {
  memory.set(key, JSON.stringify(value));
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage full or blocked */ }
}
function remove(key) {
  memory.delete(key);
  try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
}

const listeners = new Set();
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function emit(what) {
  listeners.forEach((fn) => fn(what));
}

// Old keys from the previous build (the male/female setting and the
// token-less login) are dropped.
KEYS.legacy.forEach(remove);

/* ------------------------------------------------------------------ cart */
const MAX_QTY = 99;

function cleanItem(i) {
  const id = Number(i && i.id);
  const qty = Math.min(MAX_QTY, Math.max(1, Math.floor(Number(i && i.qty) || 1)));
  if (!id) return null;
  return { id, name: String(i.name || ""), price: Number(i.price) || 0, image: String(i.image || ""), qty };
}

let cart = (read(KEYS.cart, []) || []).map(cleanItem).filter(Boolean);

export function getCart() {
  return cart.slice();
}
export function cartCount() {
  return cart.reduce((n, i) => n + i.qty, 0);
}
export function cartTotal() {
  return cart.reduce((n, i) => n + i.qty * i.price, 0);
}
export function addToCart(product, qty = 1) {
  const found = cart.find((i) => i.id === Number(product.id));
  if (found) found.qty = Math.min(MAX_QTY, found.qty + qty);
  else {
    const item = cleanItem({ ...product, qty });
    if (item) cart.push(item);
  }
  saveCart();
}
export function setQty(id, qty) {
  cart = cart
    .map((i) => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, qty) } : i))
    .filter((i) => i.qty > 0);
  saveCart();
}
export function clearCart() {
  cart = [];
  saveCart();
}
function saveCart() {
  write(KEYS.cart, cart);
  emit("cart");
}

/* --------------------------------------------------------------- account */
// { token, exp, name, email, phone } - the token is signed by our server.
let auth = read(KEYS.auth, null);
if (auth && (!auth.token || !auth.exp || auth.exp * 1000 < Date.now())) {
  auth = null;
  remove(KEYS.auth);
}

export function getAuth() {
  return auth;
}
export function setAuth(value) {
  auth = value;
  if (value) write(KEYS.auth, value);
  else remove(KEYS.auth);
  emit("auth");
}

/* ---------------------------------------------------------------- orders */
// Orders placed from this device: { id, ref, token, at, items }.
// The token proves to /api/orders that this device placed the order.
export function getOrders() {
  return read(KEYS.orders, []);
}
export function rememberOrder(order) {
  const list = getOrders().filter((o) => o.id !== order.id);
  list.unshift(order);
  write(KEYS.orders, list.slice(0, 30));
  emit("orders");
}
// Orders saved by the previous build carry no token; they are still listed
// from what this device remembers, just without live status.
(function migrateOldOrders() {
  const old = read(KEYS.legacyOrders, null);
  if (!Array.isArray(old)) return;
  const current = getOrders();
  old.forEach((o) => {
    if (o && o.id && !current.some((c) => c.id === o.id)) current.push({ id: o.id, ref: "#" + o.id, token: null, at: o.at, items: o.items || [] });
  });
  write(KEYS.orders, current.slice(0, 30));
  remove(KEYS.legacyOrders);
})();
