// Arabic -> brand/keyword synonyms. Product names in Odoo are mostly English,
// so a customer typing "بيوديرما" would otherwise get zero results.
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
  "سكين": "skin1004", "سكين الف واربعه": "skin1004",
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
  // common ingredient / category words
  "ريتينول": "retinol", "نياسيناميد": "niacinamide",
  "فيتامين سي": "vitamin c", "هيالورونيك": "hyaluronic",
  "واقي شمس": "sun", "واقي الشمس": "sun", "صن بلوك": "sun",
  "سيروم": "serum", "غسول": "cleanser", "كريم": "cream",
  "تونر": "toner", "ماسك": "mask", "شامبو": "shampoo",
  "مرطب": "moistur", "مقشر": "peel"
};

// unify alef/ya/ta-marbuta and drop diacritics so "أفين" == "افين"
function normalizeAr(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

// Returns the distinct terms worth searching for a query: the query itself
// plus any synonym it maps to.
export function searchTerms(q) {
  const raw = String(q || "").trim();
  if (!raw) return [];
  const n = normalizeAr(raw);
  const terms = [raw];

  if (SYNONYMS[n]) {
    terms.push(SYNONYMS[n]);
  } else {
    for (const key of Object.keys(SYNONYMS)) {
      const k = normalizeAr(key);
      if (k.length >= 3 && (n.includes(k) || k.includes(n))) {
        terms.push(SYNONYMS[key]);
        break;
      }
    }
  }
  return [...new Set(terms)];
}

// Builds an Odoo OR-domain out of a list of leaf conditions.
export function orDomain(conditions) {
  if (conditions.length <= 1) return conditions.slice();
  const prefix = new Array(conditions.length - 1).fill("|");
  return prefix.concat(conditions);
}

export function stripHtml(html, max) {
  const text = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  if (!max || text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}
