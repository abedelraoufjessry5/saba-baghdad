// Text helpers: Arabic-aware search terms, Odoo domains, HTML clean-up,
// Iraqi phone numbers.

// Arabic -> brand / keyword. Product names in Odoo are mostly English, so a
// customer typing "بيوديرما" would otherwise find nothing.
const SYNONYMS = {
  "بيوديرما": "bioderma", "بيودرما": "bioderma", "بايوديرما": "bioderma",
  "لاروش": "roche", "لا روش": "roche", "لاروش بوزيه": "roche", "لاروش بوساي": "roche",
  "فيشي": "vichy", "فيشى": "vichy",
  "سيسديرما": "sesderma", "سسدرما": "sesderma", "سيسدرما": "sesderma",
  "افين": "avene", "افينه": "avene", "اوسين": "avene",
  "سيرافي": "cerave", "سيراقي": "cerave", "سيرافى": "cerave",
  "نوريفا": "noreva", "نورفا": "noreva",
  "سيباميد": "sebamed", "سبام يد": "sebamed",
  "ايزيس": "isis", "ايزيس فارما": "isis",
  "فيلورجا": "filorga", "فلورجا": "filorga",
  "اس في ار": "svr", "اسفيار": "svr",
  "كوزركس": "cosrx", "كوسركس": "cosrx",
  "انوا": "anua",
  "سكين الف واربعه": "skin1004",
  "جوسون": "joseon", "بيوتي اوف جوسون": "joseon",
  "سكينكود": "skincode", "سكين كود": "skincode",
  "كوتون": "cotton",
  "بيرفكت": "perfect", "بيرفكت ايميج": "perfect",
  "ارينسيا": "arencia",
  "فولتين": "foltene", "فولتينا": "foltene",
  "انكي": "inkey", "ذا انكي ليست": "inkey",
  "ريلاستيل": "rilastil",
  "سوم باي مي": "some by mi",
  "توكوبو": "tocobo",
  "ميديكيوب": "medicube",
  "ايفلين": "eveline",
  "بورجين": "purgene",
  "اي سي ام": "acm",
  "ريتينول": "retinol", "نياسيناميد": "niacinamide",
  "فيتامين سي": "vitamin c", "هيالورونيك": "hyaluronic",
  "واقي شمس": "sun", "واقي الشمس": "sun", "صن بلوك": "sun",
  "سيروم": "serum", "غسول": "cleanser", "كريم": "cream",
  "تونر": "toner", "ماسك": "mask", "شامبو": "shampoo",
  "مرطب": "moistur", "مقشر": "peel"
};

// "أفين" == "افين", no diacritics, one space between words.
export function normalizeAr(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

const NORMALIZED = Object.entries(SYNONYMS).map(([k, v]) => [normalizeAr(k), v]);

// The query itself plus the brand/keyword it stands for.
export function searchTerms(q) {
  const raw = String(q || "").trim().slice(0, 80);
  if (!raw) return [];
  const n = normalizeAr(raw);
  const terms = [raw];
  const exact = NORMALIZED.find(([k]) => k === n);
  const partial = exact || NORMALIZED.find(([k]) => k.length >= 3 && n.length >= 3 && (n.includes(k) || k.includes(n)));
  if (partial) terms.push(partial[1]);
  return [...new Set(terms)];
}

// ["|", "|", a, b, c] - Odoo's prefix notation for a OR b OR c.
export function orDomain(conditions) {
  if (conditions.length <= 1) return conditions.slice();
  return new Array(conditions.length - 1).fill("|").concat(conditions);
}

const ENTITIES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', "#39": "'" };

export function stripHtml(html, max) {
  const text = String(html || "")
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(nbsp|amp|lt|gt|quot|#39);/g, (_, e) => ENTITIES[e])
    .replace(/\s+/g, " ")
    .trim();
  if (!max || text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// Keeps simple formatting tags only (no attributes, scripts, links, images).
// The app cleans it again on the phone; this keeps the API output tidy.
const KEEP = new Set(["p", "br", "ul", "ol", "li", "b", "strong", "i", "em", "u", "h3", "h4", "h5", "h6", "span", "div", "small"]);
export function cleanHtml(html) {
  return String(html || "")
    .replace(/<(script|style|iframe|object|embed|template|noscript)[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\/?([a-z0-9]+)[^>]*>/gi, (tag, name) => {
      const n = name.toLowerCase();
      if (!KEEP.has(n)) return "";
      return tag.startsWith("</") ? `</${n}>` : n === "br" ? "<br>" : `<${n}>`;
    })
    .trim();
}

// Iraqi mobile -> "07XXXXXXXXX" (accepts +964, 00964, spaces, Arabic digits).
export function normalizePhone(raw) {
  let s = String(raw || "")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\s\-().]/g, "");
  if (s.startsWith("+")) s = s.slice(1);
  if (s.startsWith("00")) s = s.slice(2);
  if (s.startsWith("964")) s = "0" + s.slice(3);
  if (/^7\d{9}$/.test(s)) s = "0" + s;
  return /^07\d{9}$/.test(s) ? s : null;
}

// The ways the same number may already be typed on a contact in Odoo.
export function phoneVariants(local) {
  const rest = local.slice(1); // 7XXXXXXXXX
  return [
    local,
    "+964" + rest,
    "964" + rest,
    "00964" + rest,
    `+964 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`,
    `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`
  ];
}

export function cleanText(value, max) {
  return String(value == null ? "" : value).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim().slice(0, max);
}

export function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || ""));
}
