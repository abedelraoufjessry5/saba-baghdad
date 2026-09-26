/* طلباتي: orders placed from this phone, plus - when signed in - every order
   of the account. Status is read live from Odoo. */
import { h, money, formatDate } from "../dom.js";
import { t } from "../i18n.js";
import { whatsappUrl } from "../config.js";
import { api } from "../api.js";
import { getOrders, getAuth, addToCart } from "../store.js";
import { navigate } from "../router.js";
import { screenBar } from "../components/layout.js";

function statusLabel(o) {
  if (o.state === "cancel") return t("st.cancel");
  if (o.state === "done" || o.delivery === "full") return t("st.done");
  if (o.delivery === "started" || o.delivery === "partial") return t("st.way");
  if (o.state === "sale") return t("st.prep");
  return t("st.new");
}

function orderCard(o) {
  const total = money(o.total);
  return h("div", { class: "order" },
    h("div", { class: "order-head" }, h("b", null, o.ref), h("span", null, formatDate(o.date))),
    h("div", { class: "state-chip" }, o.live ? statusLabel(o) : t("st.new")),
    h("ul", { class: "lines" },
      o.lines.map((l) => h("li", null, h("span", null, l.name), h("span", null, "×" + l.qty)))),
    h("div", { class: "order-total" }, h("span", null, t("orders.total")), h("b", null, total)),
    o.reorder.length
      ? h("button", {
          class: "btn ghost", type: "button",
          onClick: () => { o.reorder.forEach((i) => addToCart(i, i.qty)); navigate("/cart", { child: true }); }
        }, t("orders.reorder"))
      : null,
    h("a", { class: "btn", href: whatsappUrl(t("orders.issueMsg") + " " + o.ref + " (" + total + ")") }, t("orders.issue")));
}

export function ordersView() {
  const body = h("div", { class: "pad" }, h("div", { class: "msg" }, t("loading")));
  let alive = true;

  const local = getOrders();
  const byId = new Map();
  // what this phone remembers - shown as-is if Odoo can't be reached
  local.forEach((o) => byId.set(o.id, {
    id: o.id, ref: o.ref || "#" + o.id, date: o.at, live: false,
    total: (o.items || []).reduce((n, i) => n + i.qty * i.price, 0) + (o.fee || 0),
    lines: [
      ...(o.items || []).map((i) => ({ name: i.name, qty: i.qty })),
      ...(o.fee ? [{ name: t("cart.delivery") + " — " + t("zone." + (o.zone || "baghdad")), qty: 1 }] : [])
    ],
    reorder: o.items || []
  }));

  function paint() {
    const list = [...byId.values()].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id);
    const hint = getAuth() ? null : h("p", { class: "note info" }, t("orders.signinHint"));
    if (!list.length) body.replaceChildren(hint || "", h("div", { class: "msg" }, t("orders.empty")));
    else body.replaceChildren(...[hint, ...list.map(orderCard)].filter(Boolean));
  }

  const refs = local.filter((o) => o.token).map((o) => o.id + "." + o.token);
  if (refs.length || getAuth()) {
    api.orders(refs)
      .then((d) => {
        if (!alive) return;
        (d.orders || []).forEach((o) => {
          const saved = byId.get(o.id);
          byId.set(o.id, {
            id: o.id, ref: o.ref, date: o.date, live: true, state: o.state, delivery: o.delivery, total: o.total,
            lines: o.lines.map((l) => ({ name: l.name, qty: l.qty })),
            reorder: saved && saved.reorder.length ? saved.reorder
              : o.lines.filter((l) => l.productId).map((l) => ({ id: l.productId, name: l.name, price: l.price, image: l.image, qty: l.qty }))
          });
        });
        paint();
      })
      .catch(() => { if (alive) paint(); });
  } else paint();

  return {
    el: h("div", { class: "screen" }, screenBar(t("orders.title")), body),
    destroy() { alive = false; }
  };
}
