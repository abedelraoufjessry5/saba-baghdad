/* Bottom bar: الرئيسية · الأقسام · المنتجات · سلتي · الحساب
   (right to left in Arabic/Kurdish, left to right in English). */
import { h } from "../dom.js";
import { icon } from "../icons.js";
import { t } from "../i18n.js";
import { cartCount, onChange } from "../store.js";
import { onRouteChange, current } from "../router.js";

const TABS = [
  { key: "home", href: "/", icon: "home", label: "tab.home" },
  { key: "categories", href: "/categories", icon: "grid", label: "tab.categories" },
  { key: "products", href: "/products", icon: "bag", label: "tab.products" },
  { key: "cart", href: "/cart", icon: "cart", label: "tab.cart" },
  { key: "account", href: "/account", icon: "user", label: "tab.account" }
];

export function mountNav(root) {
  const nav = h("nav", { class: "nav", "aria-label": t("brand.short") });
  root.appendChild(nav);

  function paint() {
    const r = current();
    const active = r ? r.route.tab : "home";
    const n = cartCount();
    nav.replaceChildren(...TABS.map((tab) =>
      h("a", { href: tab.href, class: tab.key === active ? "on" : "", "aria-current": tab.key === active ? "page" : null },
        icon(tab.icon, { size: 21, stroke: tab.key === "cart" || tab.key === "products" || tab.key === "account" ? 2 : 1.7 }),
        h("span", null, t(tab.label)),
        tab.key === "cart" && n ? h("span", { class: "count", "aria-label": String(n) }, n > 99 ? "99+" : String(n)) : null)
    ));
  }

  onRouteChange(paint);
  onChange((what) => { if (what === "cart") paint(); });
  paint();
  return {
    show(visible) {
      nav.hidden = !visible;
      document.body.classList.toggle("no-nav", !visible);
    }
  };
}
