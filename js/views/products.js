/* المنتجات: live list from Odoo with search, category chips and "show more".
   Filters are kept in the address (?cat=&q=) so "back" from a product
   returns to exactly the same list. */
import { h, money, debounce, hideOnError } from "../dom.js";
import { t } from "../i18n.js";
import { api, loadCategories } from "../api.js";
import { addToCart } from "../store.js";
import { navigate, restoreScroll } from "../router.js";
import { screenBar } from "../components/layout.js";

const PAGE = 24;

export function productCard(p) {
  const addBtn = h("button", { class: "btn", type: "button" }, t("shop.add"));
  addBtn.addEventListener("click", () => {
    addToCart(p, 1);
    addBtn.textContent = t("shop.added");
    setTimeout(() => (addBtn.textContent = t("shop.add")), 900);
  });
  const open = () => navigate("/product/" + p.id, { child: true });
  return h("div", { class: "s-card" },
    h("button", { class: "open", type: "button", onClick: open, "aria-label": p.name },
      hideOnError(h("img", { src: p.image, alt: "", loading: "lazy", decoding: "async" }))),
    h("div", { class: "b" },
      h("div", { class: "n clamp-2", role: "link", tabindex: "0", onClick: open, onKeydown: (e) => { if (e.key === "Enter") open(); } }, p.name),
      h("div", { class: "d clamp-2" }, p.excerpt || ""),
      h("div", { class: "p" }, money(p.price), p.onSale ? h("span", { class: "was" }, money(p.comparePrice)) : null),
      addBtn));
}

export function productsView({ query }) {
  const state = {
    cat: query.cat ? Number(query.cat) || null : null,
    q: query.q || "",
    loaded: 0,
    total: 0,
    request: 0
  };
  // coming back: reload as many as were showing (the server sends 100 at most)
  const wanted = Math.min(96, Math.max(PAGE, Number((history.state && history.state.loaded) || 0)));

  const input = h("input", { class: "field-search", type: "search", enterkeyhint: "search", placeholder: t("shop.search"), value: state.q });
  const chips = h("div", { class: "chips" });
  const grid = h("div", { class: "grid-2" });
  const msg = h("div", { class: "msg" }, t("loading"));
  const more = h("div", { class: "pad", hidden: true },
    h("button", { class: "btn ghost", type: "button", onClick: () => load(false) }, t("loadMore")));

  function syncUrl() {
    const s = new URLSearchParams();
    if (state.cat) s.set("cat", state.cat);
    if (state.q) s.set("q", state.q);
    const url = "/products" + (s.toString() ? "?" + s : "");
    history.replaceState({ ...(history.state || {}), loaded: state.loaded }, "", url);
  }

  async function load(reset, limit = PAGE) {
    const my = ++state.request;
    if (reset) {
      state.loaded = 0;
      grid.replaceChildren();
      msg.textContent = t("loading");
      msg.hidden = false;
      more.hidden = true;
    }
    more.querySelector("button").disabled = true;
    try {
      const d = await api.products({ category_id: state.cat, q: state.q, limit, offset: state.loaded });
      if (my !== state.request) return;
      const items = d.products || [];
      state.total = d.total || 0;
      state.loaded += items.length;
      grid.append(...items.map(productCard));
      msg.hidden = state.loaded > 0;
      if (!state.loaded) msg.textContent = t("empty");
      more.hidden = state.loaded >= state.total || items.length === 0;
      syncUrl();
      if (reset) restoreScroll();
    } catch (e) {
      if (my !== state.request) return;
      msg.textContent = e.message;
      msg.hidden = false;
    } finally {
      more.querySelector("button").disabled = false;
    }
  }

  function paintChips(categories) {
    const top = categories.filter((c) => !c.parentId);
    const list = [{ id: null, name: t("all") }, ...top];
    // a brand/sub-category that isn't in the top row still gets its chip
    if (state.cat && !top.some((c) => c.id === state.cat)) {
      const cur = categories.find((c) => c.id === state.cat);
      if (cur) list.splice(1, 0, cur);
    }
    chips.replaceChildren(...list.map((c) =>
      h("button", {
        class: "chip" + ((c.id || null) === state.cat ? " on" : ""), type: "button",
        onClick: () => { state.cat = c.id; paintChips(categories); load(true); }
      }, c.name)));
  }

  const search = debounce(() => load(true), 250);
  input.addEventListener("input", () => {
    const v = input.value.trim();
    if (v.length === 1) return; // from the 2nd letter; empty = everything
    state.q = v;
    search();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); input.blur(); search.cancel(); state.q = input.value.trim(); load(true); }
  });

  loadCategories().then(paintChips).catch(() => chips.replaceChildren());
  load(true, wanted);

  return {
    el: h("div", { class: "screen" },
      screenBar(t("tab.products")),
      h("div", { class: "pad", style: { paddingBottom: "0" } }, input),
      chips, msg, grid, more),
    destroy() { search.cancel(); state.request++; }
  };
}
