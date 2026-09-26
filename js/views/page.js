/* "من نحن" / "الخدمات والآراء" inside the app. */
import { h } from "../dom.js";
import { t } from "../i18n.js";
import { screenBar } from "../components/layout.js";
import { PAGES } from "../data/pages.js";

function block([kind, a, b]) {
  if (kind === "h") return h("h3", null, a);
  if (kind === "p") return h("p", null, a);
  if (kind === "ul") return h("ul", null, a.map((x) => h("li", null, x)));
  if (kind === "quote") return h("blockquote", null, a, h("cite", null, b));
  if (kind === "link") return h("a", { class: "btn ghost", href: b }, a);
  return null;
}

export function pageView(key) {
  return () => h("div", { class: "screen" },
    screenBar(t("page." + key)),
    h("div", { class: "pad article" }, PAGES[key].map(block)));
}
