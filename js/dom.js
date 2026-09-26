/* Small DOM helpers. Everything is built with h(), which creates real
   elements and text nodes - so product names or anything else coming from
   Odoo can never be interpreted as HTML. */
import { t } from "./i18n.js";

// h("a", { class: "x", href: "/", onClick: fn }, child, [children], "text")
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === "dataset") Object.assign(el.dataset, v);
      else if (k in el && typeof v !== "string") el[k] = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

export function clear(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
  return el;
}

// Prices always in western digits (16,000 د.ع).
export function money(n) {
  const v = Number(n);
  if (!isFinite(v)) return "";
  return Math.round(v).toLocaleString("en-US") + " " + t("currency");
}

// Hides a broken image instead of showing the browser's broken-image icon.
export function hideOnError(img, mode = "hidden") {
  img.addEventListener("error", () => {
    if (mode === "none") img.style.display = "none";
    else img.style.visibility = "hidden";
  }, { once: true });
  return img;
}

export function debounce(fn, ms) {
  let timer = null;
  const d = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  d.cancel = () => clearTimeout(timer);
  return d;
}

// Arabic-Indic / Persian digits -> western, so "٠٧٧٠..." works in phone fields.
export function westernDigits(s) {
  return String(s || "")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

// Iraqi mobile number -> "07XXXXXXXXX", or null if it isn't one.
export function normalizePhone(raw) {
  let s = westernDigits(raw).replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  if (s.startsWith("00")) s = s.slice(2);
  if (s.startsWith("964")) s = "0" + s.slice(3);
  if (/^7\d{9}$/.test(s)) s = "0" + s;
  return /^07\d{9}$/.test(s) ? s : null;
}

export function formatDate(value) {
  let d;
  if (value instanceof Date) d = value;
  else if (typeof value === "number") d = new Date(value);
  // Odoo sends "2026-09-24 18:02:11" in UTC
  else d = new Date(String(value).replace(" ", "T") + (/Z|[+-]\d\d:?\d\d$/.test(value) ? "" : "Z"));
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB");
}

// Product descriptions are HTML written in Odoo. Keep simple formatting only:
// no scripts, no styles, no links, no attributes.
const SAFE_TAGS = new Set(["P", "BR", "UL", "OL", "LI", "B", "STRONG", "I", "EM", "U", "H3", "H4", "H5", "H6", "SPAN", "DIV", "SMALL"]);
export function safeHtml(html) {
  const out = document.createDocumentFragment();
  if (!html) return out;
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  (function walk(from, to) {
    for (const node of [...from.childNodes]) {
      if (node.nodeType === 3) to.appendChild(document.createTextNode(node.nodeValue));
      else if (node.nodeType === 1) {
        if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|TEMPLATE|NOSCRIPT)$/.test(node.tagName)) continue;
        if (SAFE_TAGS.has(node.tagName)) {
          const el = document.createElement(node.tagName.toLowerCase());
          walk(node, el);
          to.appendChild(el);
        } else walk(node, to);
      }
    }
  })(doc.body, out);
  return out;
}
