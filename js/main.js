/* App start: routes, bottom bar, first-launch language screen, live chat. */
import { applyDocumentLang, langChosen, t } from "./i18n.js";
import { route, start, onRouteChange, refresh } from "./router.js";
import { LIVECHAT_CHANNEL, ODOO_SITE } from "./config.js";
import { loadCategories } from "./api.js";
import { mountNav } from "./components/nav.js";
import { homeView } from "./views/home.js";
import { categoriesView } from "./views/categories.js";
import { accountView } from "./views/account.js";
import { productsView } from "./views/products.js";
import { productView } from "./views/product.js";
import { cartView } from "./views/cart.js";
import { ordersView } from "./views/orders.js";
import { pageView } from "./views/page.js";
import { welcomeView } from "./views/welcome.js";

applyDocumentLang();

// The language screen shows once, the first time the app opens on the home tab.
const needsWelcome = () => !langChosen() && location.pathname === "/";

route("/", () => (needsWelcome() ? welcomeView(refresh) : homeView()), { tab: "home", main: true });
route("/categories", categoriesView, { tab: "categories", main: true });
route("/account", accountView, { tab: "account", main: true });
route("/products", productsView, { tab: "products" });
route("/product/:id", productView, { tab: "products" });
route("/cart", cartView, { tab: "cart" });
route("/orders", ordersView, { tab: "account" });
route("/about", pageView("about"), { tab: "account" });
route("/services", pageView("services"), { tab: "account" });

const nav = mountNav(document.body);
onRouteChange(() => {
  nav.show(!needsWelcome());
  document.title = t("brand.name") + " | Saba Baghdad Pharmacy";
});

start(document.getElementById("app"));

// brand logos resolve to their Odoo category on the first tap
setTimeout(() => loadCategories().catch(() => {}), 2500);

/* Odoo live chat ("استشارة"), loaded after the page settles. The loader
   defines the chat settings and assets_embed.js builds the bubble from them,
   so the second script must wait for the first. */
function startLiveChat() {
  if (!LIVECHAT_CHANNEL) return;
  const loader = document.createElement("script");
  loader.src = ODOO_SITE + "/im_livechat/loader/" + LIVECHAT_CHANNEL;
  loader.onload = () => {
    const widget = document.createElement("script");
    widget.src = ODOO_SITE + "/im_livechat/assets_embed.js";
    document.head.appendChild(widget);
  };
  document.head.appendChild(loader);
}
setTimeout(startLiveChat, 1200);
