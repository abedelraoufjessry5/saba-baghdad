/* The sections of the home and categories tabs, in the same look as
   the original app. Content comes from data/content.js. */
import { h, money, hideOnError, percentOff } from "../dom.js";
import { icon } from "../icons.js";
import { t, pickLang, isRTL } from "../i18n.js";
import { contentImage } from "../config.js";
import { api, loadCategories } from "../api.js";
import { navigate } from "../router.js";
import { section } from "./layout.js";
import {
  HERO, HERO_INTERVAL_MS, CONCERNS, CATEGORIES, BRANDS
} from "../data/content.js";

// Where a tap on a content item goes.
export function linkFor(item) {
  if (item.product) return "/product/" + item.product;
  if (item.cat) return "/products?cat=" + item.cat;
  if (item.set) return "/products?set=" + encodeURIComponent(item.set);
  if (item.q) return "/products?q=" + encodeURIComponent(item.q);
  return "/products";
}

function photo(image, eager, ...caption) {
  const img = h("img", { src: contentImage(image), alt: "", loading: eager ? "eager" : "lazy", decoding: "async" });
  if (eager) img.setAttribute("fetchpriority", "high");
  hideOnError(img);
  return [img, h("span", { class: "cap" }, ...caption)];
}

/* --------------------------------------------------------------- hero */
export function hero() {
  let index = 0;
  let pausedUntil = 0;
  const track = h("div", { class: "track" },
    HERO.map((s, i) =>
      h("a", { class: "slide", href: linkFor(s) },
        h("span", { class: "photo" },
          photo(s.image, i === 0,
            h("span", { class: "label-en" }, "SABA BAGHDAD"),
            h("span", { class: "t display" }, pickLang(s.title)),
            h("span", { class: "s" }, pickLang(s.sub))))))
  );
  const dots = h("div", { class: "dots" },
    HERO.map((s, i) => h("button", { type: "button", "aria-label": String(i + 1), onClick: () => go(i, true) })));

  function paintDots() {
    [...dots.children].forEach((d, i) => d.classList.toggle("on", i === index));
  }
  function go(i, byHand) {
    index = i;
    if (byHand) pausedUntil = Date.now() + 2500;
    const w = track.clientWidth;
    track.scrollTo({ left: isRTL() ? -i * w : i * w, behavior: "smooth" });
    paintDots();
  }
  track.addEventListener("scroll", () => {
    const w = track.clientWidth || 1;
    const i = Math.round(Math.abs(track.scrollLeft) / w);
    if (i !== index && i < HERO.length) { index = i; paintDots(); }
  }, { passive: true });
  track.addEventListener("pointerdown", () => { pausedUntil = Infinity; });
  const resume = () => { pausedUntil = Date.now() + 2500; };
  track.addEventListener("pointerup", resume);
  track.addEventListener("pointercancel", resume);
  track.addEventListener("touchend", resume, { passive: true });

  const timer = setInterval(() => {
    if (Date.now() < pausedUntil || document.hidden) return;
    go((index + 1) % HERO.length, false);
  }, HERO_INTERVAL_MS);
  paintDots();

  return { el: h("section", { class: "hero" }, track, dots), destroy: () => clearInterval(timer) };
}

/* ----------------------------------------------------- concern cards */
export function concerns() {
  return section({ label: t("concern.label"), title: t("concern.title"), sub: t("concern.sub") },
    h("div", { class: "scroll-x concerns" },
      CONCERNS.map((c) =>
        h("a", { class: "photo concern press", href: linkFor(c) },
          photo(c.image, false, pickLang(c.name))))));
}

/* ------------------------------------------------------ product rails */
// Rails show hand-picked items; their prices are refreshed from Odoo so a
// price change in Odoo shows up here too.
export function productRail({ label, title, sub, items }) {
  const rail = h("div", { class: "scroll-x rail" },
    items.map((p) => {
      const priceEl = h("span", { class: "price" }, p.price ? money(p.price) : t("products.range"));
      if (p.id && p.price) priceEl.dataset.priceId = p.id;
      return h("a", { class: "p-card press", href: p.id ? "/product/" + p.id : linkFor(p) },
        h("span", { class: "pic" },
          p.image
            ? hideOnError(h("img", { src: p.image, alt: p.name, loading: "lazy", decoding: "async" }), "none")
            : h("span", { class: "ph display" }, p.brand || t("brand.short")),
          p.badge ? h("span", { class: "badge" }, p.badge) : null),
        h("span", { class: "body" },
          h("span", { class: "name clamp-2" }, p.name),
          h("span", { class: "row" }, priceEl, icon("arrowUpRight", { size: 13 }))));
    }));
  return section({ label, title, sub }, rail);
}

export function refreshPrices(root) {
  const els = [...root.querySelectorAll("[data-price-id]")];
  const ids = [...new Set(els.map((e) => e.dataset.priceId))];
  if (!ids.length) return;
  api.prices(ids)
    .then((d) => {
      const byId = {};
      (d.prices || []).forEach((p) => (byId[p.id] = p.price));
      els.forEach((e) => {
        const v = byId[e.dataset.priceId];
        if (v) e.textContent = money(v);
      });
    })
    .catch(() => { /* keep the printed prices */ });
}

/* -------------------------------------------------------------- brands */
// A plain grid (a sideways strip made taps land on the wrong logo): the
// first 9 brands, "عرض الكل" shows the rest.
const FIRST_BRANDS = 9;

function normName(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
// Odoo category names are spelled loosely ("BIODRMA", "LA-ROSHE POSAY"), so
// match on the letters, then on the start of the name.
export function matchCategory(categories, name) {
  const n = normName(name);
  if (!n) return null;
  let hit = categories.find((c) => normName(c.name) === n);
  if (!hit) hit = categories.find((c) => { const cn = normName(c.name); return cn && (cn.startsWith(n) || n.startsWith(cn)); });
  if (!hit) hit = categories.find((c) => { const cn = normName(c.name); return cn.length > 4 && n.length > 4 && cn.slice(0, 4) === n.slice(0, 4); });
  return hit ? hit.id : null;
}

// The brand's category in Odoo (only categories with products are listed);
// no category: search the brand's name.
async function openBrand(b) {
  let cat = null;
  try {
    const cats = await loadCategories();
    cat = matchCategory(cats, b.name) || (cats.some((c) => c.id === b.cat) ? b.cat : null);
  } catch (e) {
    cat = b.cat || null; // offline: the saved category
  }
  if (cat) navigate("/products?cat=" + cat);
  else navigate("/products?q=" + encodeURIComponent(b.q || b.name));
}

export function brands() {
  let open = false;
  const tiles = BRANDS.map((b) =>
    h("button", { class: "brand-tile press", type: "button", "aria-label": b.name, onClick: () => openBrand(b) },
      hideOnError(h("img", { src: contentImage(b.image), alt: b.name, loading: "lazy", decoding: "async" }), "none")));
  const grid = h("div", { class: "brands" }, tiles);
  const toggle = h("button", { type: "button" });
  function paint() {
    tiles.forEach((tile, i) => (tile.hidden = !open && i >= FIRST_BRANDS));
    toggle.textContent = open ? t("showLess") : t("showAll");
  }
  toggle.addEventListener("click", () => { open = !open; paint(); });
  paint();
  return section({ label: t("brands.label"), title: t("brands.title"), sub: t("brands.sub") },
    grid, BRANDS.length > FIRST_BRANDS ? h("div", { class: "more-toggle" }, toggle) : null);
}

/* --------------------------------------------------------------- trust */
const TRUST = [
  ["tag", "trust.price", "trust.priceSub"],
  ["badgeCheck", "trust.original", "trust.originalSub"],
  ["shieldCheck", "trust.guarantee", "trust.guaranteeSub"],
  ["truck", "trust.shipping", "trust.shippingSub"]
];
export function trust() {
  return h("section", { class: "trust" },
    h("div", { class: "box" },
      h("p", { class: "label" }, t("trust.title")),
      h("div", { class: "grid" },
        TRUST.map(([ic, title, sub]) =>
          h("div", null,
            h("span", { class: "ic" }, icon(ic, { size: 20, stroke: 1.75 })),
            h("p", { class: "t" }, t(title)),
            h("p", { class: "s" }, t(sub)))))));
}

/* ---------------------------------------------- categories accordion */
export function categoryList() {
  let openId = null;
  const items = CATEGORIES.map((c) => {
    const img = c.image ? contentImage(c.image) : null;
    const iconBox = h("span", { class: "cat-ic" });
    if (img) {
      const el = h("img", { src: img, alt: "", loading: "lazy", decoding: "async" });
      el.addEventListener("error", () => el.replaceWith(document.createTextNode(c.icon)), { once: true });
      iconBox.appendChild(el);
    } else iconBox.textContent = c.icon;

    const chevron = h("span", null);
    const subs = h("div", { class: "cat-subs fade", hidden: true },
      c.subs.map((s) =>
        h("a", { class: "cat-sub press", href: linkFor(s) },
          s.image ? hideOnError(h("img", { src: contentImage(s.image), alt: "", loading: "lazy", decoding: "async" })) : null,
          h("span", null, pickLang(s.name)))));
    const head = h("button", { class: "cat-head press", type: "button", "aria-expanded": "false" },
      iconBox,
      h("span", { class: "cat-txt" },
        h("span", { class: "n truncate" }, pickLang(c.name)),
        h("span", { class: "c" }, c.subs.length + " " + t("cats.count"))),
      chevron);
    return { c, head, subs, chevron, el: h("div", { class: "cat" }, head, subs) };
  });

  function paint() {
    items.forEach((it) => {
      const isOpen = it.c.id === openId;
      it.subs.hidden = !isOpen;
      it.head.setAttribute("aria-expanded", String(isOpen));
      it.chevron.replaceChildren(isOpen
        ? icon("chevronDown", { size: 18 })
        : icon("chevronLeft", { size: 18, className: "flip-ltr" }));
    });
  }
  items.forEach((it) => it.head.addEventListener("click", () => {
    openId = openId === it.c.id ? null : it.c.id;
    paint();
  }));
  paint();
  return section({ label: t("cats.label"), title: t("cats.title") }, h("div", { class: "cats" }, items.map((i) => i.el)));
}

/* ------------------------------------------------------------- offers */
// Live: the app's offers (data/offers.js) and every Odoo product whose
// "compare to" price is above its price. Always on the home page; with no
// offer it shows a "new offers soon" card.
export function offerCard(p) {
  const save = p.comparePrice - p.price;
  return h("a", { class: "o-card press", href: "/product/" + p.id },
    h("span", { class: "pic" },
      hideOnError(h("img", { src: p.image, alt: p.name, loading: "lazy", decoding: "async" }), "none"),
      h("span", { class: "seal" }, percentOff(p.price, p.comparePrice))),
    h("span", { class: "body" },
      h("span", { class: "name clamp-2" }, p.name),
      h("span", { class: "prices" },
        h("span", { class: "now" }, money(p.price)),
        h("s", { class: "was" }, money(p.comparePrice))),
      h("span", { class: "save" }, t("offers.save") + " " + money(save))));
}

export function offers() {
  const rail = h("div", { class: "scroll-x rail offers-rail" },
    [0, 1, 2].map(() => h("span", { class: "o-card o-skel", "aria-hidden": "true" })));
  const el = h("section", { class: "offers" },
    h("div", { class: "offers-box" },
      h("div", { class: "offers-head" },
        h("div", null,
          h("p", { class: "label-en" }, t("offers.label")),
          h("h2", { class: "display" }, t("offers.title")),
          h("p", { class: "sub" }, t("offers.sub"))),
        h("a", { class: "offers-all press", href: "/products?sale=1" },
          t("offers.all"), icon("chevronLeft", { size: 15, className: "ltr-flip" }))),
      rail));
  api.products({ on_sale: 1, limit: 12 })
    .then((d) => {
      const list = (d.products || []).filter((p) => p.comparePrice > p.price);
      rail.replaceChildren(...(list.length ? list.map(offerCard) : [soon()]));
    })
    .catch(() => rail.replaceChildren(soon()));
  function soon() {
    return h("div", { class: "o-soon" }, icon("tag", { size: 22 }), h("span", null, t("offers.empty")));
  }
  return el;
}
