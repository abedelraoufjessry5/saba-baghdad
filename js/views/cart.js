/* سلتي: items, quantities and the cash-on-delivery order form. */
import { h, money, normalizePhone, hideOnError } from "../dom.js";
import { t } from "../i18n.js";
import { DELIVERY_FEES, KEYS } from "../config.js";
import { api } from "../api.js";
import { getCart, setQty, clearCart, getAuth, rememberOrder, onChange, refreshCart, removeFromCart } from "../store.js";
import { navigate } from "../router.js";
import { screenBar } from "../components/layout.js";

function field(name, label, { type = "text", value = "", required = false, hint = "", multiline = false, autocomplete } = {}) {
  const attrs = { name, id: "f-" + name, required, autocomplete };
  const control = multiline
    ? h("textarea", { ...attrs, rows: 2 }, value)
    : h("input", { ...attrs, type, value, dir: type === "tel" || type === "email" || type === "password" ? "ltr" : null });
  return h("div", { class: "f" },
    h("label", { for: "f-" + name }, label),
    control,
    hint ? h("span", { class: "hint" }, hint) : null);
}
export { field };

// Delivery fees come from the server (one place to change them); the
// numbers in config.js show until it answers.
let fees = { ...DELIVERY_FEES };
let feesLoaded = null;
function loadFees() {
  if (!feesLoaded) feesLoaded = api.delivery().then((d) => { if (d.zones) fees = d.zones; }).catch(() => { feesLoaded = null; });
  return feesLoaded;
}

// What was typed in the form survives a repaint, a language switch and a
// reload, until the order goes through.
function loadDraft() {
  try { return JSON.parse(sessionStorage.getItem(KEYS.draft) || "{}") || {}; } catch (e) { return {}; }
}
function saveDraft(d) {
  try { sessionStorage.setItem(KEYS.draft, JSON.stringify(d)); } catch (e) { /* ignore */ }
}

// One key per basket: if the answer to "place order" is lost and the
// customer reloads and taps again, the server sees the same key and returns
// the first order instead of making a second one.
function orderKeyFor(items, zone) {
  const sig = zone + ":" + items.map((i) => i.id + "x" + i.qty).sort().join(",");
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEYS.pending) || "null"); } catch (e) { /* ignore */ }
  // (kept for an hour: the same basket ordered again another day is a new order)
  if (saved && saved.sig === sig && saved.key && Date.now() - (saved.at || 0) < 3600e3) return saved.key;
  const key = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  try { localStorage.setItem(KEYS.pending, JSON.stringify({ sig, key, at: Date.now() })); } catch (e) { /* ignore */ }
  return key;
}
function orderSent() {
  try { localStorage.removeItem(KEYS.pending); sessionStorage.removeItem(KEYS.draft); } catch (e) { /* ignore */ }
}

function savedZone() {
  try { const z = localStorage.getItem(KEYS.zone); return z === "provinces" ? "provinces" : "baghdad"; } catch (e) { return "baghdad"; }
}

export function cartView() {
  const body = h("div", { class: "pad" });
  let zone = savedZone(); // most orders are inside Baghdad
  let form = null; // kept across repaints so typed details aren't lost
  let done = false; // order placed: keep the confirmation on screen
  const gone = new Set(); // in the cart but no longer sold
  const available = () => getCart().filter((i) => !gone.has(i.id));
  const subtotal = () => available().reduce((n, i) => n + i.qty * i.price, 0);

  function paint() {
    const items = getCart();
    if (!items.length) {
      body.replaceChildren(h("div", { class: "msg" }, t("cart.empty")));
      return;
    }
    const rows = items.map((i) =>
      h("div", { class: "cart-row" + (gone.has(i.id) ? " gone" : "") },
        h("a", { href: "/product/" + i.id, "data-child": "1" }, hideOnError(h("img", { src: i.image, alt: "" }))),
        h("div", { class: "i" },
          h("a", { class: "n", href: "/product/" + i.id, "data-child": "1" }, i.name),
          gone.has(i.id) ? h("div", { class: "p gone-tag" }, t("cart.gone")) : h("div", { class: "p" }, money(i.price))),
        gone.has(i.id)
          ? h("button", { class: "btn ghost gone-rm", type: "button", onClick: () => { gone.delete(i.id); removeFromCart([i.id]); } }, t("cart.remove"))
          : h("div", { class: "stepper" },
            h("button", { type: "button", "aria-label": i.qty > 1 ? "-" : t("cart.remove"), onClick: () => setQty(i.id, i.qty - 1) }, "−"),
            h("span", null, String(i.qty)),
            h("button", { type: "button", "aria-label": "+", onClick: () => setQty(i.id, i.qty + 1) }, "+"))));
    if (!form) form = orderForm();
    const fee = fees[zone] || 0;
    const pickZone = (z) => {
      zone = z;
      try { localStorage.setItem(KEYS.zone, z); } catch (e) { /* ignore */ }
      paint();
    };
    body.replaceChildren(
      ...rows,
      h("div", { class: "zone" },
        h("p", { class: "zone-label" }, t("cart.zone")),
        h("div", { class: "zone-opts", role: "radiogroup", "aria-label": t("cart.zone") },
          ["baghdad", "provinces"].map((z) =>
            h("button", {
              type: "button", role: "radio", class: "zone-opt press" + (zone === z ? " on" : ""),
              "aria-checked": String(zone === z), onClick: () => pickZone(z)
            },
            h("span", { class: "zn" }, t("zone." + z)),
            h("span", { class: "zf" }, money(fees[z] || 0)))))),
      h("div", { class: "totals" },
        h("div", null, h("span", null, t("cart.subtotal")), h("span", null, money(subtotal()))),
        h("div", null, h("span", null, t("cart.delivery") + " (" + t("zone." + zone) + ")"), h("span", null, money(fee))),
        h("div", { class: "grand" }, h("span", null, t("cart.total")), h("span", null, money(subtotal() + fee)))),
      gone.size ? h("div", { class: "note err" }, t("cart.goneNote")) : null,
      form);
  }

  function orderForm() {
    const auth = getAuth();
    const draft = loadDraft();
    const err = h("div");
    const submit = h("button", { class: "btn", type: "submit" }, t("cart.checkout"));
    const f = h("form", { novalidate: true },
      field("name", t("cart.name"), { value: draft.name || (auth ? auth.name : ""), required: true, autocomplete: "name" }),
      field("phone", t("cart.phone"), { type: "tel", value: draft.phone || (auth && auth.phone ? auth.phone : ""), required: true, hint: t("cart.phoneHint"), autocomplete: "tel" }),
      field("address", t("cart.address"), { value: draft.address || "", multiline: true, required: true, autocomplete: "street-address" }),
      field("notes", t("cart.notes"), { value: draft.notes || "" }),
      // left empty by people, filled by spam bots
      h("div", { class: "trap", "aria-hidden": "true" }, h("input", { name: "website", tabindex: "-1", autocomplete: "off" })),
      err,
      submit);

    // handled on the button (a tap, or Enter in a field): works even where
    // the page may not submit forms itself
    f.addEventListener("submit", (e) => e.preventDefault());
    f.addEventListener("input", () => {
      const v = (n) => f.elements.namedItem(n).value;
      saveDraft({ name: v("name"), phone: v("phone"), address: v("address"), notes: v("notes") });
    });
    submit.addEventListener("click", async (e) => {
      e.preventDefault();
      err.replaceChildren();
      const el = (n) => f.elements.namedItem(n);
      const name = el("name").value.trim();
      const phone = normalizePhone(el("phone").value);
      const address = el("address").value.trim();
      const fail = (m, el) => { err.replaceChildren(h("div", { class: "note err" }, m)); if (el) el.focus(); };
      if (!name) return fail(t("cart.name"), el("name"));
      if (!phone) return fail(t("cart.badPhone"), el("phone"));
      if (!address) return fail(t("cart.address"), el("address"));

      if (gone.size) return fail(t("cart.goneNote"));
      const items = available();
      if (!items.length) return fail(t("cart.empty"));
      const orderKey = orderKeyFor(items, zone);
      submit.disabled = true;
      submit.textContent = t("cart.sending");
      try {
        const d = await api.checkout({
          name, phone, address, zone,
          notes: el("notes").value.trim(),
          website: el("website").value,
          key: orderKey,
          items: items.map((i) => ({ productId: i.id, qty: i.qty }))
        });
        rememberOrder({ id: d.orderId, ref: d.ref, token: d.token, at: Date.now(), items, fee: fees[zone] || 0, zone });
        done = true;
        form = null;
        orderSent();
        clearCart();
        body.replaceChildren(
          h("div", { class: "note ok" },
            t("cart.done") + " " + d.ref + " — " + t("cart.doneSub"),
            d.total ? h("b", { style: { display: "block", marginTop: ".35rem" } }, t("cart.doneTotal") + ": " + money(d.total)) : null),
          h("button", { class: "btn", type: "button", onClick: () => navigate("/products") }, t("cart.continue")));
      } catch (ex) {
        submit.disabled = false;
        submit.textContent = t("cart.checkout");
        // the shop says which products are no longer sold: mark them
        const missing = ex.data && Array.isArray(ex.data.missing) ? ex.data.missing : [];
        if (missing.length) {
          missing.forEach((id) => gone.add(Number(id)));
          paint();
          err.replaceChildren(h("div", { class: "note err" }, ex.message));
          return;
        }
        fail(ex.message);
      }
    });
    return f;
  }

  const off = onChange((what) => {
    if (what !== "cart" || done) return;
    paint();
  });
  paint();
  loadFees().then(() => { if (!done) paint(); });
  // today's prices (and what is no longer sold) from the shop
  const ids = getCart().map((i) => i.id);
  if (ids.length) {
    api.prices(ids)
      .then((d) => {
        if (done) return;
        refreshCart(d.prices || []).forEach((id) => gone.add(id));
        paint();
      })
      .catch(() => { /* offline: keep the saved prices; checkout uses the shop's anyway */ });
  }

  return {
    el: h("div", { class: "screen" }, screenBar(t("tab.cart")), body),
    destroy() { off(); }
  };
}
