/* العروض: Saba offers, the offer tiles and the trending rail. */
import { h } from "../dom.js";
import { t } from "../i18n.js";
import { appHeader } from "../components/layout.js";
import { sabaOffers, offerTiles, productRail, refreshPrices } from "../components/blocks.js";
import { TRENDING } from "../data/content.js";

export function offersView() {
  const main = h("main", { class: "page fade" },
    sabaOffers(),
    offerTiles(),
    productRail({ label: t("trend.label"), title: t("trend.title"), items: TRENDING }));
  refreshPrices(main);
  return h("div", null, appHeader(), main);
}
