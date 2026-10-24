// GET /api/products?category_id=&q=&set=&on_sale=1&limit=24&offset=0
//  -> { products: [...], total }
//  q    free search, word by word (see _lib/search.js); best matches first.
//       When nothing matches every word, the closest results are sent with
//       related: true.
//  set  a product group from js/data/sets.js (home cards, banners, categories)
import { execute, existingFields, imageUrl } from "./_lib/odoo.js";
import { handler, send } from "./_lib/http.js";
import { searchTerms, orDomain, stripHtml } from "./_lib/text.js";
import { parseQuery, wordsDomain, rankByName } from "./_lib/search.js";
import { activeOffers, pricing } from "./_lib/offers.js";
import { descriptionFields, hasComparePrice, pickDescription, catalogDomain, setFilter } from "./_lib/catalog.js";

const MAX_LIMIT = 100;
const MAX_HITS = 3000;

// Ids of the products matching every word: name matches first (best on
// top), then the ones found only in the description.
async function matchIds(base, groups, q, descFields, codeFields) {
  const [nameRows, anyIds] = await Promise.all([
    execute("product.template", "search_read", [[...base, ...wordsDomain(groups, ["name"], codeFields)]],
      { fields: ["id", "name"], order: "name, id", limit: MAX_HITS }),
    execute("product.template", "search", [[...base, ...wordsDomain(groups, ["name", ...descFields], codeFields)]],
      { order: "name, id", limit: MAX_HITS })
  ]);
  const first = nameRows.length <= 800 ? rankByName(nameRows, q) : nameRows.map((r) => r.id);
  const seen = new Set(first);
  return [...first, ...anyIds.filter((id) => !seen.has(id))];
}

// Nothing matches every word: drop one word at a time (a typo, a word that
// isn't in the name), then try the start of a single long word.
async function closestIds(base, groups, q, descFields, codeFields) {
  if (groups.length > 1) {
    for (let i = groups.length - 1; i >= 0; i--) {
      const ids = await matchIds(base, groups.filter((_, j) => j !== i), q, descFields, codeFields);
      if (ids.length) return ids;
    }
  }
  const longest = [...groups].sort((a, b) => b.word.length - a.word.length)[0];
  if (longest && longest.word.length >= 5 && !/\d/.test(longest.word)) {
    const stem = longest.alts[0].slice(0, Math.max(4, longest.alts[0].length - 2));
    return matchIds(base, [{ word: stem, alts: [stem] }], q, descFields, codeFields);
  }
  return [];
}

export default handler(["GET"], async (req, res) => {
  const { category_id, on_sale } = req.query;
  let { q } = req.query;
  const set = req.query.set ? setFilter(String(req.query.set)) : null;
  if (req.query.set && !set) return send(res, { products: [], total: 0 }, 120);
  if (set) q = set.q;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), MAX_LIMIT);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

  const [descFields, withCompare, shown] = await Promise.all([descriptionFields(), hasComparePrice(), catalogDomain()]);

  const domain = [...shown];
  const cat = parseInt(category_id, 10);
  if (cat > 0) domain.push(["public_categ_ids", "child_of", cat]);

  // a product group: its own words, as one phrase
  if (set) {
    if (q) {
      const conds = [];
      for (const term of searchTerms(q)) {
        conds.push(["name", "ilike", term]);
        for (const f of descFields) conds.push([f, "ilike", term]);
      }
      domain.push(...orDomain(conds));
    }
    domain.push(...set.domain);
  }

  // free search: word by word
  const groups = !set && q ? parseQuery(q) : [];
  const codeFields = groups.length ? await existingFields("product.template", ["default_code", "barcode"]).catch(() => []) : [];
  if (groups.length && on_sale === "1") domain.push(...wordsDomain(groups, ["name", ...descFields], codeFields));

  const fields = ["id", "name", "list_price", "public_categ_ids", ...descFields];
  if (withCompare) fields.push("compare_list_price");

  let rows;
  let total;
  let related = false;
  const offers = activeOffers();
  if (on_sale === "1") {
    // Offers = the app's offers (data/offers.js) first, then Odoo's
    // "compare to" prices. Comparing two fields isn't possible in a domain:
    // find the ids first, then read just the requested page.
    const appIds = offers.size
      ? await execute("product.template", "search", [[...domain, ["id", "in", [...offers.keys()]]]])
      : [];
    let odooIds = [];
    if (withCompare) {
      const candidates = await execute("product.template", "search_read",
        [[...domain, ["compare_list_price", ">", 0]]], { fields: ["id", "list_price", "compare_list_price"], order: "name, id", limit: 2000 });
      odooIds = candidates.filter((p) => p.compare_list_price > p.list_price && !offers.has(p.id)).map((p) => p.id);
    }
    const ids = [...[...offers.keys()].filter((id) => appIds.includes(id)), ...odooIds];
    total = ids.length;
    const page = ids.slice(offset, offset + limit);
    rows = page.length ? await execute("product.template", "read", [page], { fields }) : [];
    rows.sort((a, b) => page.indexOf(a.id) - page.indexOf(b.id));
  } else if (groups.length) {
    let ids = await matchIds(domain, groups, q, descFields, codeFields);
    if (!ids.length) {
      ids = await closestIds(domain, groups, q, descFields, codeFields);
      related = ids.length > 0;
    }
    total = ids.length;
    const page = ids.slice(offset, offset + limit);
    rows = page.length ? await execute("product.template", "read", [page], { fields }) : [];
    rows.sort((a, b) => page.indexOf(a.id) - page.indexOf(b.id));
  } else {
    [rows, total] = await Promise.all([
      execute("product.template", "search_read", [domain], { fields, order: "name, id", limit, offset }),
      execute("product.template", "search_count", [domain])
    ]);
  }

  send(res, {
    products: rows.map((p) => {
      return {
        id: p.id,
        name: p.name,
        ...pricing(p, withCompare, offers),
        excerpt: stripHtml(pickDescription(p, descFields), 110),
        categoryIds: p.public_categ_ids || [],
        image: imageUrl("product.template", p.id, "image_512")
      };
    }),
    total,
    ...(related ? { related: true } : {})
  }, 120);
});
