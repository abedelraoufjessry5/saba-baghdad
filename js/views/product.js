/* One product: picture, price, description, quantity, add to cart. */
import { h, money, safeHtml, hideOnError } from "../dom.js";
import { t } from "../i18n.js";
import { api } from "../api.js";
import { addToCart } from "../store.js";
import { navigate } from "../router.js";
import { screenBar } from "../components/layout.js";

export function productView({ params }) {
  const body = h("div", null, h("div", { class: "msg" }, t("loading")));
  let alive = true;

  api.product(params.id)
    .then((p) => {
      if (!alive) return;
      let qty = 1;
      const qtyEl = h("span", null, "1");
      const desc = h("div", { class: "pd-desc" });
      desc.appendChild(safeHtml(p.description));
      body.replaceChildren(
        hideOnError(h("img", { class: "hero-img", src: p.image, alt: p.name })),
        h("div", { class: "pad" },
          h("h2", { class: "pd-name" }, p.name),
          h("div", { class: "pd-price" }, money(p.price)),
          p.description ? desc : null,
          h("div", { class: "stepper", style: { margin: "1rem 0" }, "aria-label": t("shop.qty") },
            h("button", { type: "button", "aria-label": "-", onClick: () => { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; } }, "−"),
            qtyEl,
            h("button", { type: "button", "aria-label": "+", onClick: () => { qty = Math.min(99, qty + 1); qtyEl.textContent = qty; } }, "+")),
          h("button", {
            class: "btn", type: "button",
            onClick: () => { addToCart(p, qty); navigate("/cart", { child: true }); }
          }, t("shop.add"))));
    })
    .catch((e) => { if (alive) body.replaceChildren(h("div", { class: "msg" }, e.message)); });

  return {
    el: h("div", { class: "screen" }, screenBar(t("tab.products")), body),
    destroy() { alive = false; }
  };
}
