/* الرئيسية: search, banners, concerns, product rails, brands, why-us and
   the contact footer. */
import { h } from "../dom.js";
import { t } from "../i18n.js";
import { appHeader, footer } from "../components/layout.js";
import { searchBox } from "../components/search.js";
import { hero, concerns, productRail, brands, trust, refreshPrices } from "../components/blocks.js";
import { TRENDING, FEATURED } from "../data/content.js";

export function homeView() {
  const search = searchBox();
  const slides = hero();
  const main = h("main", { class: "page fade" },
    search.el,
    slides.el,
    concerns(),
    productRail({ label: t("trend.label"), title: t("trend.title"), sub: t("trend.sub"), items: TRENDING }),
    productRail({ label: t("products.label"), title: t("products.title"), items: FEATURED }),
    brands(),
    trust(),
    footer({ full: true })
  );
  refreshPrices(main);
  return {
    el: h("div", null, appHeader(), main),
    destroy() { search.destroy(); slides.destroy(); }
  };
}
