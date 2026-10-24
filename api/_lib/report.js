// The products report: /api/health?key=HEALTH_KEY&report=hidden
// Lists every active product that is NOT published on the website, and
// why it may not be ready (no photo, no price, not for sale); plus the
// products the app shows that have no website category (they don't come up
// under any category or brand, only in search) and names listed twice.
// &format=csv downloads the same list for Excel.
import { execute, existingFields } from "./odoo.js";
import { PUBLISHED, templatesWithPhoto, catalogDomain } from "./catalog.js";

const STATUS = {
  ready: "جاهز للنشر",
  noPhoto: "بلا صورة",
  noPrice: "بلا سعر",
  notForSale: "مو للبيع / خدمة",
  noCategory: "ظاهر بس بلا قسم",
  duplicate: "اسم مكرر"
};

const sameName = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();

function statusOf(p, withPhoto) {
  if (!p.sale_ok || p.type === "service") return "notForSale";
  if (!(p.list_price > 0)) return "noPrice";
  if (!withPhoto.has(p.id)) return "noPhoto";
  return "ready";
}

export async function hiddenProducts() {
  const optional = await existingFields("product.template", ["default_code", "barcode", "qty_available", "categ_id"]);
  const fields = ["id", "name", "list_price", "sale_ok", "type", "public_categ_ids", ...optional];
  const shown = await catalogDomain();
  const [rows, inApp, publishedCount, photoIds, cats] = await Promise.all([
    execute("product.template", "search_read", [[["website_published", "=", false]]], { fields, order: "name, id" }),
    execute("product.template", "search_read", [shown], { fields, order: "name, id" }),
    execute("product.template", "search_count", [[PUBLISHED]]),
    templatesWithPhoto(),
    execute("product.public.category", "search_read", [[]], { fields: ["id", "name"] })
  ]);
  const withPhoto = new Set(photoIds);
  const catName = Object.fromEntries(cats.map((c) => [c.id, c.name]));
  const row = (p, status) => ({
    id: p.id,
    name: p.name,
    code: p.default_code || p.barcode || "",
    price: p.list_price || 0,
    stock: typeof p.qty_available === "number" ? p.qty_available : null,
    category: Array.isArray(p.categ_id) ? p.categ_id[1] : "",
    webCategories: (p.public_categ_ids || []).map((id) => catName[id]).filter(Boolean).join("، "),
    photo: withPhoto.has(p.id),
    status
  });
  const inAppIds = new Set(inApp.map((p) => p.id));
  const hidden = rows.filter((p) => !inAppIds.has(p.id));
  const products = hidden.map((p) => row(p, statusOf(p, withPhoto)));
  // shown in the app, but no website category
  for (const p of inApp) if (!(p.public_categ_ids || []).length) products.push(row(p, "noCategory"));
  // the same name twice in the app
  const byName = new Map();
  for (const p of inApp) {
    const k = sameName(p.name);
    if (!byName.has(k)) byName.set(k, []);
    byName.get(k).push(p);
  }
  for (const list of byName.values()) if (list.length > 1) for (const p of list) products.push(row(p, "duplicate"));

  const counts = { published: publishedCount, inApp: inApp.length, hidden: hidden.length };
  for (const k of Object.keys(STATUS)) counts[k] = products.filter((p) => p.status === k).length;
  return { counts, products, hasStock: optional.includes("qty_available") };
}

const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function reportCsv({ products, hasStock }) {
  const head = ["ID", "المنتج", "الرمز", "السعر", ...(hasStock ? ["المخزون"] : []), "فئة أودو", "أقسام الموقع", "صورة", "الحالة"];
  const cell = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  const lines = [head.map(cell).join(",")];
  for (const p of products) {
    lines.push([p.id, p.name, p.code, p.price, ...(hasStock ? [p.stock] : []), p.category, p.webCategories, p.photo ? "نعم" : "لا", STATUS[p.status]].map(cell).join(","));
  }
  return "﻿" + lines.join("\r\n"); // BOM so Excel reads Arabic
}

export function reportHtml({ counts, products, hasStock }, { odooUrl, csvHref }) {
  const money = (n) => Number(n || 0).toLocaleString("en-US");
  const card = (key, label, n) =>
    `<button class="card" data-f="${key}"><b>${money(n)}</b><span>${label}</span></button>`;
  const rows = products.map((p) => `<tr data-s="${p.status}">
<td class="n">${p.id}</td>
<td><a href="${esc(odooUrl)}/web#model=product.template&amp;id=${p.id}&amp;view_type=form" target="_blank" rel="noopener">${esc(p.name)}</a>${p.code ? `<small>${esc(p.code)}</small>` : ""}</td>
<td class="n">${money(p.price)}</td>
${hasStock ? `<td class="n">${p.stock ?? ""}</td>` : ""}
<td>${esc(p.category)}${p.webCategories ? `<small>${esc(p.webCategories)}</small>` : ""}</td>
<td><span class="tag ${p.status}">${STATUS[p.status]}</span></td>
</tr>`).join("");

  return `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>تقرير المنتجات</title>
<style>
:root{--plum:#5c0a16;--rose:#8e2d46;--gold:#d2a469;--ink:#3a1520;--mute:#8a7a80;--line:#f2dde6;--shell:#fcf4f9;--ok:#1c6b3a;--ok-bg:#e9f7ee;--warn:#8a5a00;--warn-bg:#fff4dc;--err:#a0233d;--err-bg:#fdeaee}
*{box-sizing:border-box}body{margin:0;background:var(--shell);color:var(--ink);font:15px/1.5 system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif}
header{background:var(--plum);color:#fff;padding:18px 16px}h1{margin:0;font-size:20px}header p{margin:4px 0 0;opacity:.85;font-size:13px}
main{max-width:1100px;margin:0 auto;padding:16px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:14px}
.card{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px;text-align:right;cursor:pointer;font:inherit;color:inherit}
.card b{display:block;font-size:22px;color:var(--plum)}.card span{font-size:13px;color:var(--mute)}
.card.on{border-color:var(--rose);box-shadow:0 0 0 2px var(--rose) inset}
.card.static{cursor:default}
.bar{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.bar input{flex:1;min-width:200px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font:inherit}
.bar a{background:var(--rose);color:#fff;text-decoration:none;padding:10px 14px;border-radius:10px}
.note{background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin-bottom:14px;font-size:14px}
.note b{color:var(--plum)}
.wrap{overflow-x:auto;background:#fff;border:1px solid var(--line);border-radius:12px}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{padding:8px 10px;border-bottom:1px solid var(--line);text-align:right;vertical-align:top}
th{background:#fff;position:sticky;top:0;color:var(--mute);font-weight:600}
td a{color:var(--ink)}td small{display:block;color:var(--mute);font-size:12px}
td.n{white-space:nowrap;font-variant-numeric:tabular-nums}
.tag{display:inline-block;padding:2px 8px;border-radius:99px;font-size:12px;white-space:nowrap}
.tag.ready{background:var(--ok-bg);color:var(--ok)}.tag.noPhoto,.tag.noPrice,.tag.noCategory,.tag.duplicate{background:var(--warn-bg);color:var(--warn)}.tag.notForSale{background:var(--err-bg);color:var(--err)}
#count{color:var(--mute);font-size:13px;margin:8px 2px}
</style></head><body>
<header><h1>تقرير المنتجات</h1><p>المنتجات المخفية عن التطبيق، والظاهرة بلا قسم، والمكررة. اكبسوا على اسم المنتج ليفتح بأودو.</p></header>
<main>
<div class="cards">
<div class="card static"><b>${money(counts.inApp)}</b><span>ظاهر بالتطبيق</span></div>
<div class="card static"><b>${money(counts.published)}</b><span>منشور على الموقع</span></div>
${card("hidden", "مخفي (الكل)", counts.hidden)}
${card("ready", "مخفي وجاهز للنشر (صورة + سعر)", counts.ready)}
${card("noPhoto", "مخفي وبلا صورة", counts.noPhoto)}
${card("noPrice", "مخفي وبلا سعر", counts.noPrice)}
${card("notForSale", "مو للبيع أو خدمة", counts.notForSale)}
${card("noCategory", "ظاهر بس بلا قسم (بيطلع بالبحث بس)", counts.noCategory)}
${card("duplicate", "اسم مكرر بالتطبيق", counts.duplicate)}
</div>
<div class="note"><b>جاهز للنشر</b> يعني المنتج للبيع، وإله سعر وصورة. هدول بيطلعوا بالتطبيق إذا انحطّ <code>CATALOG_MODE=ready</code> بـ Vercel، أو إذا نشرتوهم من أودو.<br>
<b>ظاهر بس بلا قسم</b>: المنتج بالتطبيق وبيطلع بالبحث، بس ما إله «فئة الموقع» (eCommerce Category) بأودو، فما بيطلع تحت أي قسم أو ماركة. حطوله فئة من أودو وبيطلع لحاله.<br>
<b>اسم مكرر</b>: نفس الاسم لأكتر من منتج. إذا مكرر بالغلط، ألغوا نشر وحدة منهن بأودو أو حطوا رقمها بـ <code>js/data/hidden.js</code>.</div>
<div class="bar"><input id="q" type="search" placeholder="دوّروا باسم المنتج أو الرمز أو الفئة…"><a href="${esc(csvHref)}">تنزيل Excel (CSV)</a></div>
<div id="count"></div>
<div class="wrap"><table><thead><tr><th>ID</th><th>المنتج</th><th>السعر</th>${hasStock ? "<th>المخزون</th>" : ""}<th>الفئة</th><th>الحالة</th></tr></thead>
<tbody id="rows">${rows}</tbody></table></div>
</main>
<script>
(function(){
  var f="hidden",HID={ready:1,noPhoto:1,noPrice:1,notForSale:1},q=document.getElementById("q"),rows=[].slice.call(document.querySelectorAll("#rows tr")),cards=[].slice.call(document.querySelectorAll(".card[data-f]")),out=document.getElementById("count");
  function paint(){
    var t=q.value.trim().toLowerCase(),n=0;
    rows.forEach(function(r){var ok=(f==="hidden"?HID[r.dataset.s]:r.dataset.s===f)&&(!t||r.textContent.toLowerCase().indexOf(t)>-1);r.hidden=!ok;if(ok)n++;});
    cards.forEach(function(c){c.classList.toggle("on",c.dataset.f===f);});
    out.textContent="المعروض: "+n.toLocaleString("en-US")+" منتج";
  }
  cards.forEach(function(c){c.addEventListener("click",function(){f=c.dataset.f;paint();});});
  q.addEventListener("input",paint);paint();
})();
</script>
</body></html>`;
}
