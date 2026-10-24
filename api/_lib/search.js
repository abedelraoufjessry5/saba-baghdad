// Free search, the way people actually type it.
//
// The words are looked up one by one, in any order: "dr althea", "Dr.Althea",
// "Althea Dr" and "دكتور ألثيا" all find "DR. ALTHEA 345 RELIEF CREAM".
//  - punctuation is ignored ("Dr.Althea" = "dr althea", "B-3" = "b 3")
//  - Arabic: أ/إ/آ/ا are the same letter, so are ي/ى and ة/ه at the end of
//    a word; diacritics, tatweel and Arabic/Persian digits are fine;
//    Kurdish letters (ی ک ە) are read as their Arabic twins
//  - Latin: "avene" also finds "Avène"
//  - "ال" at the start of a word and plural endings (-s, -ات) are optional
//  - filler words (دكتور، منتجات، ماركة، the…) are skipped
//  - Arabic brand and product words also search their English name
//
// Every word must be found in the name, the description or the code.
// Odoo's "ilike" understands "_" (any one letter): that is how the Arabic
// letter variants and accents are matched, without changing Odoo.
import { normalizeAr } from "./text.js";

// Arabic (and common misspellings) -> the word used in the English names.
// Several words: an array. Keys are written normally; they are normalised.
export const SYNONYMS = {
  // brands
  "بيوديرما": "bioderma", "بيودرما": "bioderma", "بايوديرما": "bioderma", "بايودرما": "bioderma",
  "لاروش": "roche", "لا روش": "roche", "لاروش بوزيه": "roche", "لاروش بوساي": "roche", "لا روش بوزيه": "roche", "روش": "roche",
  "فيشي": "vichy", "فيشى": "vichy",
  "سيسديرما": "sesderma", "سسدرما": "sesderma", "سيسدرما": "sesderma",
  "افين": "av_ne", "افينه": "av_ne", "اوسين": "av_ne", "افيني": "av_ne",
  "سيرافي": "cerave", "سيراقي": "cerave", "سيرافى": "cerave", "سيراف": "cerave",
  "نوريفا": "noreva", "نورفا": "noreva",
  "سيباميد": "sebamed", "سبام يد": "sebamed", "سيبامد": "sebamed",
  "ايزيس": "isis", "ايزيس فارما": "isis", "ايزس": "isis",
  "فيلورجا": "filorga", "فلورجا": "filorga", "فيلورغا": "filorga", "فلورغا": "filorga",
  "اس في ار": "svr", "اسفيار": "svr",
  "كوزركس": "cosrx", "كوسركس": "cosrx", "كوزاركس": "cosrx",
  "انوا": "anua",
  "سكين الف واربعه": "skin1004", "سكين 1004": "skin1004", "سكين1004": "skin1004",
  "جوسون": "joseon", "بيوتي اوف جوسون": "joseon",
  "سكينكود": "skincode", "سكين كود": "skincode",
  "كوتون": "cotton",
  "بيرفكت": "perfect", "بيرفكت ايميج": "perfect image", "بيرفيكت": "perfect",
  "ارينسيا": "arencia", "ارنسيا": "arencia",
  "فولتين": "folt_ne", "فولتينا": "folt_ne",
  "انكي": "inkey", "ذا انكي ليست": "inkey",
  "ريلاستيل": "rilastil",
  "سوم باي مي": "some by mi", "سم باي مي": "some by mi",
  "توكوبو": "tocobo",
  "ميديكيوب": "medicube", "ميدي كيوب": "medicube",
  "ايفلين": "eveline",
  "بورجين": "purgene",
  "اي سي ام": "acm",
  "الثيا": "althea", "التيا": "althea", "الثييا": "althea", "دكتور الثيا": "althea", "دكتور التيا": "althea", "دكتورالثيا": "althea",
  "اردين": "ardene", "اردن": "ardene",
  "ريفويل": "revuele", "ريفيول": "revuele", "ريفيويل": "revuele", "ريفيولي": "revuele",
  "نيفيا": "nivea", "نيڤيا": "nivea",
  "كيفن مورفي": "kevin murphy", "كيفن": "kevin",
  "هيدروديرم": "hydroderm", "هيدرو ديرم": "hydroderm",
  "يورياج": "uriage", "يوراج": "uriage", "يورياش": "uriage",
  "بيورست": "purest", "ذا بيورست": "purest",
  "ناو": "now ", "ناو فودز": "now ",
  "دوكراي": "ducray", "دوكري": "ducray",
  "موستيلا": "mustela", "مستيلا": "mustela",
  "فوليكا": "fulica",
  "سيتافيل": "cetaphil", "سيتافل": "cetaphil",
  "ميبيلين": "maybelline", "مابيلين": "maybelline", "ميبلين": "maybelline",
  "اولابلكس": "olaplex", "اولابليكس": "olaplex", "اولا بلكس": "olaplex",
  "سيمبل": "simple",
  "ايكوال بيري": "eqqualberry", "اكوال بيري": "eqqualberry", "ايكوالبيري": "eqqualberry",
  "يوسيرين": "eucerin", "يوسرين": "eucerin",
  "ديرما سيف": "dermasafe", "ديرماسيف": "dermasafe",
  "بيبانثين": "bepanthen", "بيبانتين": "bepanthen", "بيبانثن": "bepanthen",
  "نيكس": "nyx",
  "بيوكلين": "bioclin",
  "هيمالايا": "himalaya",
  "فازلين": "vaseline",
  "ايكرينال": "ecrinal",
  "دوبلهيرز": "doppelherz", "دوبل هيرز": "doppelherz",
  "ايسدين": "isdin",
  "سنتروم": "centrum",
  "غارنييه": "garnier", "جارنير": "garnier", "غارنير": "garnier",
  "ستربسلز": "strepsils", "ستريبسلز": "strepsils",
  "البسين": "alpecin",
  "نيتروجينا": "neutrogena", "نيوتروجينا": "neutrogena",
  "شيسيدو": "shiseido",
  "سوانسون": "swanson",
  "بانوكسيل": "panoxyl", "بانوكسل": "panoxyl",
  "بريجناكير": "pregnacare", "بريغناكير": "pregnacare",
  "فيتابيوتكس": "vitabiotics", "فيتابايوتكس": "vitabiotics",
  "لانيج": "laneige",
  "اورديناري": "ordinary", "ذا اورديناري": "ordinary",
  "امبريوليس": "embryolisse",
  "فارماسيرس": "pharmaceris",
  "شيكو": "chicco",
  "جونسون": "johnson",
  "مافالا": "mavala",
  "سنتيليان": "centellian",
  "بايو اويل": "bio-oil", "بيو اويل": "bio-oil",
  "سوسكين": "soskin",
  "فاتيكا": "vatika",
  "بارادونتكس": "parodontax", "بارودونتكس": "parodontax",
  "ميلي": "mielle",
  "ايسنتري": "isntree",
  "اكسس واي": "axis-y",
  "كي 18": "k18",
  // product words
  "ريتينول": "retinol", "نياسيناميد": "niacinamide", "نياسينامايد": "niacinamide",
  "فيتامين سي": "vitamin c", "فيتامين c": "vitamin c", "فيتامين د": "vitamin d", "فيتامين دي": "vitamin d",
  "فيتامين ب": "vitamin b", "فيتامين بي": "vitamin b", "فيتامين اي": "vitamin e", "فيتامين ا": "vitamin a",
  "اوميغا 3": "omega 3", "اوميجا 3": "omega 3", "فيتامين": "vitamin", "هيالورونيك": "hyaluronic", "هيالورون": "hyaluron",
  "كولاجين": "collagen", "بيوتين": "biotin", "زنك": "zinc", "اوميغا": "omega", "اوميجا": "omega",
  "مغنيسيوم": "magnesium", "كالسيوم": "calcium", "حديد": "iron",
  "واقي شمس": "sun", "واقي الشمس": "sun", "واقي": "sun", "صن بلوك": "sun", "صن سكرين": "sun",
  "سيروم": "serum", "غسول": ["cleanser", "wash"], "كريم": "cream",
  "تونر": "toner", "ماسك": "mask", "شامبو": "shampoo", "بلسم": "conditioner",
  "مرطب": "moistur", "مقشر": ["peel", "exfoliat", "scrub"], "لوشن": "lotion",
  "زيت": "oil", "صابون": "soap", "جل": "gel", "بخاخ": "spray", "رذاذ": "mist",
  "معجون اسنان": "toothpaste", "فرشاة اسنان": "toothbrush", "غسول فم": "mouthwash",
  "مزيل عرق": "deodorant", "مضاد للتعرق": "perspirant", "مزيل مكياج": "remover",
  "ماء ميسيلار": "micellar", "ميسيلار": "micellar",
  "احمر شفاه": "lipstick", "روج": "lipstick", "كريم اساس": "foundation", "ماسكرا": "mascara",
  "شفاه": "lip", "عين": "eye", "عيون": "eye", "جسم": "body", "وجه": "face", "شعر": "hair",
  "قدم": "foot", "قدمين": "foot", "يدين": "hand",
  "اطفال": "baby", "طفل": "baby", "رضع": "baby",
  "قشره": "dandruff", "تساقط": "hair loss", "حب الشباب": "acne", "تصبغات": "pigment", "كلف": "pigment",
  "تجاعيد": "wrinkle", "هالات": "dark circle", "تفتيح": "bright"
};

// Words that never narrow the search.
const FILLER = new Set([
  "dr", "د", "دكتور", "دكتوره", "الدكتور", "doctor", "the", "of", "and", "for", "with", "by", "a", "an",
  "من", "في", "على", "عن", "مع", "و", "ل", "او", "منتج", "منتجات", "product", "products",
  "ماركه", "براند", "brand", "شركه", "نوع", "اريد", "ابي", "بدي", "اكو", "يوجد", "عندكم"
].map(normalizeAr));

const AR = /[؀-ۿ]/;

// The query as plain words.
export function cleanQuery(q) {
  return String(q || "")
    .slice(0, 100)
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[یێ]/g, "ي").replace(/ک/g, "ك").replace(/ە/g, "ه").replace(/ۆ/g, "و").replace(/ڵ/g, "ل").replace(/ڕ/g, "ر")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC") // é -> e (ئ and ؤ stay)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "") // Arabic diacritics, tatweel
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ") // punctuation, % and _ too
    .trim();
}

// "spf50" -> "spf 50", "345relief" -> "345 relief" (but "b3", "q10" stay)
function splitMixed(word) {
  const parts = word.split(/(?<=\p{L})(?=\p{N})|(?<=\p{N})(?=\p{L})/u);
  return parts.length > 1 && parts.every((p) => p.length >= 2) ? parts : [word];
}

// One word -> the pattern Odoo is given ("_" = any one letter).
export function pattern(word) {
  if (AR.test(word)) {
    // (an alef at the very end stays: "التيا" must not find "التي ...")
    // hamza seats (ئ ؤ ء) and the Persian/Kurdish گ چ ڤ may be written
    // several ways, so they match any letter; پ is written ب
    const p = normalizeAr(word.replace(/پ/g, "ب"))
      .replace(/ا(?!$| )/g, "_")
      .replace(/[ئؤءگچڤ]/g, "_")
      .replace(/[يه](?=$| )/g, "_");
    const letters = p.replace(/[_ ]/g, "").length;
    return letters >= 2 && letters * 2 >= p.replace(/ /g, "").length ? p : normalizeAr(word);
  }
  // accents: "avene" finds "Avène", "creme" finds "crème"
  return word.length >= 4 ? word.replace(/e/g, "_") : word;
}

// The word without "ال"/"لل"/"بال"... in front and plural endings, so
// "للشعر" also finds "شعر" and "كريمات" finds "كريم".
function stems(word) {
  const out = [word];
  if (AR.test(word)) {
    const n = normalizeAr(word);
    // a 3-letter rest only when it is a known word ("الشعر" -> "شعر", but
    // not "التيا" -> "تيا", which would also find "اختيار")
    const pre = ["وال", "بال", "كال", "فال", "لل", "ال"].find((p) => n.startsWith(p) &&
      (n.length - p.length >= 4 || (n.length - p.length === 3 && SYN.has(n.slice(p.length)))));
    const base = pre ? n.slice(pre.length) : n;
    if (pre) out.push(base);
    if (base.endsWith("ات") && base.length >= 5) out.push(base.slice(0, -2));
  } else if (/[a-z]{4,}s$/.test(word) && !/ss$/.test(word)) {
    out.push(word.slice(0, -1));
  }
  return out;
}

const SYN = new Map(Object.entries(SYNONYMS).map(([k, v]) => [normalizeAr(cleanQuery(k)), [].concat(v)]));
const synOf = (w) => SYN.get(normalizeAr(w)) || [];

// The words of a query, each with the patterns that may stand for it.
// [{ word, alts: ["patt1", "patt2"] }]
const MAX_WORDS = 6;

export function parseQuery(q) {
  const words = [];
  for (const w of cleanQuery(q).split(" ").filter(Boolean).flatMap(splitMixed)) {
    // a single letter belongs to the word before: "vitamin d", "فيتامين د"
    if (w.length === 1 && !/\d/.test(w) && words.length) words[words.length - 1] += " " + w;
    else words.push(w);
  }
  const groups = [];
  for (let i = 0; i < words.length; i++) {
    // two/three-word names first: "لا روش", "سوم باي مي", "فيتامين سي"
    let hit = null;
    for (const len of [3, 2]) {
      if (i + len > words.length) continue;
      const phrase = words.slice(i, i + len).join(" ");
      const syn = SYN.get(normalizeAr(phrase));
      if (syn) { hit = { word: phrase, alts: [pattern(phrase), ...syn] }; i += len - 1; break; }
    }
    if (!hit) {
      const w = words[i];
      const forms = stems(w);
      hit = { word: w, alts: [...forms.map(pattern), ...forms.flatMap(synOf)] };
    }
    hit.alts = [...new Set(hit.alts)];
    groups.push(hit);
  }
  const useful = groups.filter((g) => !FILLER.has(normalizeAr(g.word)) && (g.word.length > 1 || /\d/.test(g.word)));
  return (useful.length ? useful : groups.filter((g) => g.word.length > 1).slice(0, 1)).slice(0, MAX_WORDS);
}

const or = (conds) => (conds.length <= 1 ? conds : new Array(conds.length - 1).fill("|").concat(conds));

// Domain: every word found in one of `fields`. Words with a digit also look
// at the codes (internal reference, barcode).
export function wordsDomain(groups, fields, codeFields = []) {
  const domain = [];
  for (const g of groups) {
    const fs = /\d/.test(g.word) ? [...fields, ...codeFields] : fields;
    domain.push(...or(g.alts.flatMap((a) => fs.map((f) => [f, "ilike", a]))));
  }
  return domain;
}

// Best first: the name starts with the first word, then names where every
// word starts a word of the name ("nivea" before "Genevia"), then the rest;
// alphabetical inside each.
const toRe = (alt, atStart) => new RegExp((atStart ? "^" : "(?:^| )") +
  normalizeAr(alt).split("").map((c) => (c === "_" ? "." : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))).join(""));

export function rankByName(rows, groups) {
  const first = (groups[0] ? groups[0].alts : []).map((a) => toRe(a, true));
  const each = groups.map((g) => g.alts.map((a) => toRe(a, false)));
  const score = (r) => {
    const n = normalizeAr(cleanQuery(r.name));
    if (first.some((re) => re.test(n))) return 0;
    if (each.every((alts) => alts.some((re) => re.test(n)))) return 1;
    return 2;
  };
  return rows
    .map((r) => ({ r, s: score(r) }))
    .sort((a, b) => a.s - b.s || String(a.r.name).localeCompare(String(b.r.name)) || a.r.id - b.r.id)
    .map((x) => x.r.id);
}
