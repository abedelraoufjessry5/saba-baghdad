/* ==========================================================================
   صبا بغداد — طبقة المتجر الداخلي (v2.2)
   تنضاف فوق التصميم الأصلي بدون ما تغيّر منه شي.
   ========================================================================== */
(function () {
  "use strict";

  var API = "/api";
  var ODOO_HOST = "saba-baghdad.odoo.com";
  var WA = "9647804406692";

  /* ---------------------------------------------------------------- i18n */
  var T = {
    ar: {
      cart: "سلتي", account: "الحساب", products: "المنتجات", back: "رجوع",
      search: "دوّر على منتج أو ماركة...", all: "الكل", loading: "ثانية...",
      empty: "ماكو نتائج", cartEmpty: { m: "ماكو شي بسلتك", f: "ماكو شي بسلتچ" },
      add: "ضيّفه للسلة",
      total: "الكلي", checkout: "أكمّل الطلب — الدفع عند الاستلام",
      name: "الاسم", phone: "رقم الهاتف", address: "العنوان", notes: "ملاحظات (اختياري)",
      sending: "نرسل الطلب...", orderOk: "وصلنا طلبك رقم #",
      orderOkSub: { m: "رح نتصل بيك نأكّد التوصيل. تدفع لما يوصلك.", f: "رح نتصل بيچ نأكّد التوصيل. تدفعين لما يوصلچ." },
      continue: "كمّل تسوّق", login: "تسجيل الدخول", register: "حساب جديد",
      email: "الإيميل", password: "كلمة المرور", enter: "دخول", create: "سوّي حساب",
      noAccount: { m: "ماعندك حساب؟ سوّي واحد", f: "ماعندچ حساب؟ سوّي واحد" },
      haveAccount: { m: "عندك حساب؟ ادخل", f: "عندچ حساب؟ ادخلي" },
      hello: { m: "هلا بيك", f: "هلا بيچ" },
      logout: "خروج", del: "حذف حسابي",
      delWarn: { m: "هذا الإجراء يوقف حسابك نهائياً ويمسح بياناتك. اكتب كلمة المرور للتأكيد.", f: "هذا الإجراء يوقف حسابچ نهائياً ويمسح بياناتچ. اكتبي كلمة المرور للتأكيد." },
      delConfirm: "أكّد حذف الحساب", cancel: "تراجع", currency: "د.ع",
      err: "صار خلل، جرّب مرة ثانية", myAccount: "حسابي",
      myOrders: "طلباتي", noOrders: "لسه ماكو طلبات", reorder: "اطلبه مرة ثانية",
      orderIssue: "عندك مشكلة بالطلب؟", orderItems: "المنتجات",
      st_new: "وصلنا طلبك", st_prep: "قيد التجهيز", st_way: { m: "بالطريق إلك", f: "بالطريق إلچ" },
      st_done: { m: "تسلّمته", f: "تسلّمتيه" }, st_cancel: "ملغي",
      showAll: "عرض الكل", showLess: "عرض أقل", seeAllResults: "شوف كل النتائج",
      consult: "استشارة",
      addrTitle: "شلون نحچيك؟", addrM: "أهلاً بيك", addrF: "أهلاً بيچ",
      addrHint: "حتى نخاطبك بالشكل يريحك — تگدر تغيّرها بعدين من حسابك",
      changeAddr: "غيّر صيغة المخاطبة"
    },
    en: {
      cart: "Cart", account: "Account", products: "Products", back: "Back",
      search: "Search products, brands...", all: "All", loading: "Loading...",
      empty: "No results", cartEmpty: "Your cart is empty", add: "Add to cart",
      total: "Total", checkout: "Place order (cash on delivery)",
      name: "Name", phone: "Phone", address: "Address", notes: "Notes (optional)",
      sending: "Sending...", orderOk: "Order received #",
      orderOkSub: "We'll contact you to confirm delivery. Pay on arrival.",
      continue: "Continue shopping", login: "Sign in", register: "New account",
      email: "Email", password: "Password", enter: "Sign in", create: "Create account",
      noAccount: "No account? Create one", haveAccount: "Have an account? Sign in",
      hello: "Hello", logout: "Sign out", del: "Delete my account",
      delWarn: "This permanently closes your account and removes your personal data. Enter your password to confirm.",
      delConfirm: "Confirm deletion", cancel: "Cancel", currency: "IQD",
      err: "Something went wrong, try again", myAccount: "My account",
      myOrders: "My orders", noOrders: "No orders yet", reorder: "Order again",
      orderIssue: "Problem with this order?", orderItems: "Items",
      st_new: "Order received", st_prep: "Being prepared", st_way: "On its way",
      st_done: "Delivered", st_cancel: "Cancelled",
      showAll: "Show all", showLess: "Show less", seeAllResults: "See all results",
      consult: "Ask us",
      addrTitle: "How should we address you?", addrM: "Welcome (m)", addrF: "Welcome (f)",
      addrHint: "You can change this later from your account",
      changeAddr: "Change how we address you"
    }
  };
  T.ku = T.ar;

  function lang() {
    try {
      var v = localStorage.getItem("saba.lang");
      if (v) return v;
      var m = document.cookie.match("(?:^|; )saba\\.lang=([^;]*)");
      if (m) return decodeURIComponent(m[1]);
    } catch (e) {}
    return "ar";
  }
  // "أهلاً بيك" vs "أهلاً بيچ" - chosen once on first launch, changeable later
  var ADDR_KEY = "saba.addr";
  function addr() {
    try { return localStorage.getItem(ADDR_KEY) === "m" ? "m" : "f"; } catch (e) { return "f"; }
  }
  function hasAddr() {
    try { return localStorage.getItem(ADDR_KEY) === "m" || localStorage.getItem(ADDR_KEY) === "f"; }
    catch (e) { return false; }
  }
  // lang() falls back to "ar", so check whether a language was really picked -
  // otherwise the sheet would cover the language screen itself.
  function langChosen() {
    try {
      if (localStorage.getItem("saba.lang")) return true;
      if (document.cookie.match("(?:^|; )saba\\.lang=")) return true;
    } catch (e) {}
    return false;
  }

  function t(k) {
    var v = (T[lang()] || T.ar)[k];
    if (v === undefined) v = T.ar[k];
    if (v && typeof v === "object") return v[addr()] || v.f || v.m;
    return v === undefined ? k : v;
  }
  function isRTL() { var l = lang(); return l === "ar" || l === "ku"; }
  // Prices always in western digits (16,000) - Abed's call
  function money(n) {
    try { return Number(n).toLocaleString("en-US") + " " + t("currency"); }
    catch (e) { return n + " " + t("currency"); }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------------------------------------------------------- store */
  var CART_KEY = "saba.cart.v1", AUTH_KEY = "saba.auth.v1", ORDERS_KEY = "saba.orders.v1";
  function readJSON(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (e) { return d; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var cart = readJSON(CART_KEY, []);
  var auth = readJSON(AUTH_KEY, null);

  function saveCart() { writeJSON(CART_KEY, cart); paintBadge(); }

  /* Orders placed from THIS device. No login needed, and no way to see
     someone else's orders. Each entry keeps the basket so "اطلبه مرة ثانية"
     works without extra lookups. */
  function myOrders() { return readJSON(ORDERS_KEY, []); }
  function rememberOrder(id, items) {
    var list = myOrders().filter(function (o) { return o.id !== id; });
    list.unshift({ id: id, at: Date.now(), items: items });
    writeJSON(ORDERS_KEY, list.slice(0, 30));
  }
  function cartCount() { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (n, i) { return n + i.qty * i.price; }, 0); }
  function addToCart(p, qty) {
    var f = cart.filter(function (i) { return i.id === p.id; })[0];
    if (f) f.qty += qty || 1;
    else cart.push({ id: p.id, name: p.name, price: p.price, image: p.image, qty: qty || 1 });
    saveCart();
  }

  /* ---------------------------------------------------------------- styles */
  var css = [
    /* overlay stops above the bottom bar so tabs stay tappable */
    "#sbx{position:fixed;top:0;inset-inline:0;bottom:calc(var(--sb-nav-h,3.6rem) + env(safe-area-inset-bottom));",
    "z-index:9998;background:#FCF4F9;display:none;flex-direction:column;font-family:inherit;color:#2b1620}",
    "#sbx.on{display:flex}",
    "#sb-nav{z-index:9999}",
    "#sbx .sbx-head{position:sticky;top:0;background:#FCF4F9;border-bottom:1px solid #F2DDE6;",
    "padding:calc(env(safe-area-inset-top) + .7rem) 1rem .7rem;display:flex;align-items:center;gap:.5rem}",
    "#sbx .sbx-head h2{margin:0;font-size:1.02rem;font-weight:700;flex:1;text-align:center}",
    "#sbx .sbx-head button{background:none;border:none;color:#8E2D46;font-weight:700;font-family:inherit;",
    "padding:.3rem .35rem;font-size:.88rem;white-space:nowrap}",
    "#sbx .sbx-back[hidden]{display:none}",
    "#sbx .sbx-body{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-bottom:1.5rem}",
    ".sbx-scope .sbx-search{width:100%;padding:.72rem .9rem;border-radius:.9rem;border:1px solid #F2DDE6;",
    "background:#fff;font-size:.95rem;font-family:inherit;margin:.8rem 0 0;color:#2b1620}",
    "#sbx .sbx-chips{display:flex;gap:.5rem;overflow-x:auto;padding:.75rem 1rem;scrollbar-width:none}",
    "#sbx .sbx-chips::-webkit-scrollbar{display:none}",
    "#sbx .sbx-chip{flex:0 0 auto;padding:.42rem .9rem;border-radius:999px;border:1px solid #F2DDE6;",
    "background:#fff;font-size:.82rem;white-space:nowrap;font-family:inherit;color:#2b1620}",
    "#sbx .sbx-chip.on{background:#8E2D46;color:#fff;border-color:#8E2D46}",
    /* uniform product cards: same height, name clamped to 3 lines, button pinned bottom */
    "#sbx .sbx-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem;padding:0 1rem 1rem;align-items:stretch}",
    "#sbx .sbx-card{background:#fff;border:1px solid #F2DDE6;border-radius:1rem;overflow:hidden;",
    "display:flex;flex-direction:column;height:100%}",
    "#sbx .sbx-card img{width:100%;aspect-ratio:1;object-fit:cover;background:#f6eff3;display:block}",
    "#sbx .sbx-card .b{padding:.6rem .7rem;display:flex;flex-direction:column;gap:.35rem;flex:1}",
    "#sbx .sbx-card .n{font-size:.76rem;font-weight:600;line-height:1.35;height:2.7em;overflow:hidden;",
    "display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-align:start}",
    "#sbx .sbx-card .d{font-size:.68rem;line-height:1.4;color:#8a6b76;height:2.8em;overflow:hidden;",
    "display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;text-align:start}",
    "#sbx .sbx-card .p{color:#8E2D46;font-weight:700;font-size:.86rem;text-align:start}",
    "#sbx .sbx-card .sbx-btn{margin-top:auto}",
    ".sbx-scope .sbx-btn{background:#8E2D46;color:#fff;border:none;border-radius:.7rem;padding:.6rem;",
    "font-size:.84rem;font-weight:700;font-family:inherit;width:100%}",
    ".sbx-scope .sbx-btn:disabled{opacity:.45}",
    ".sbx-scope .sbx-btn.ghost{background:#fff;color:#2b1620;border:1px solid #F2DDE6}",
    ".sbx-scope .sbx-btn.danger{background:#fff;color:#c0394f;border:1px solid #e3b6c0}",
    "#sbx .sbx-msg{text-align:center;color:#8a6b76;padding:2.5rem 1rem;font-size:.92rem}",
    ".sbx-scope .sbx-pad{padding:1rem}",
    "#sbx .sbx-row{display:flex;align-items:center;gap:.7rem;background:#fff;border:1px solid #F2DDE6;",
    "border-radius:1rem;padding:.6rem;margin-bottom:.6rem}",
    "#sbx .sbx-row img{width:3.4rem;height:3.4rem;border-radius:.7rem;object-fit:cover;background:#f6eff3}",
    "#sbx .sbx-row .i{flex:1;min-width:0}",
    "#sbx .sbx-row .i div:first-child{font-size:.85rem;font-weight:600;line-height:1.35}",
    "#sbx .sbx-step{display:flex;align-items:center;gap:.55rem}",
    "#sbx .sbx-step button{width:1.9rem;height:1.9rem;border-radius:50%;border:1px solid #F2DDE6;",
    "background:#fff;font-size:1.05rem;line-height:1;color:#8E2D46;font-family:inherit}",
    ".sbx-scope .sbx-f{display:flex;flex-direction:column;gap:.3rem;margin-bottom:.75rem}",
    ".sbx-scope .sbx-f label{font-size:.78rem;color:#8a6b76}",
    ".sbx-scope .sbx-f input,.sbx-scope .sbx-f textarea{padding:.68rem .85rem;border-radius:.8rem;",
    "border:1px solid #F2DDE6;font-size:.95rem;font-family:inherit;background:#fff;color:#2b1620}",
    ".sbx-scope .sbx-note{padding:.8rem 1rem;border-radius:.9rem;font-size:.85rem;margin-bottom:.8rem}",
    ".sbx-scope .sbx-note.ok{background:#e9f7ee;color:#1c6b3a}",
    ".sbx-scope .sbx-note.err{background:#fdeaee;color:#a0233d}",
    "#sbx .sbx-hero{width:100%;aspect-ratio:1;object-fit:contain;background:#fff;display:block}",
    "#sbx .sbx-sum{display:flex;justify-content:space-between;font-weight:700;margin:.4rem 0 1rem;font-size:1rem}",
    "#sb-nav .sb-badge{position:absolute;top:.25rem;inset-inline-end:26%;background:#8E2D46;color:#fff;",
    "font-size:.58rem;min-width:1.05rem;height:1.05rem;border-radius:999px;display:flex;align-items:center;",
    "justify-content:center;padding:0 .18rem;font-weight:700}",
    /* account panel injected into the contact page */
    "#sbx-account,#sbx-orders{margin:1rem 1rem 0;background:#fff;border:1px solid #F2DDE6;",
    "border-radius:1.1rem;padding:1rem}",
    "#sbx-pref{margin:.7rem 1rem 0}",
    "#sbx-account h3,#sbx-orders h3{margin:0 0 .8rem;font-size:1.02rem;font-weight:700;color:#8E2D46}",
    /* my orders */
    ".sbx-order{border:1px solid #F2DDE6;border-radius:.9rem;padding:.75rem;margin-bottom:.7rem;background:#FCF8FA}",
    ".sbx-order-head{display:flex;justify-content:space-between;align-items:center;font-size:.9rem}",
    ".sbx-order-head span{color:#8a6b76;font-size:.78rem}",
    ".sbx-chipstate{display:inline-block;margin:.45rem 0;padding:.22rem .65rem;border-radius:999px;",
    "background:#F2DDE6;color:#8E2D46;font-size:.74rem;font-weight:700}",
    ".sbx-lines{list-style:none;margin:.3rem 0 .5rem;padding:0}",
    ".sbx-lines li{display:flex;justify-content:space-between;gap:.5rem;font-size:.78rem;",
    "color:#5b3f4a;padding:.16rem 0;line-height:1.4}",
    ".sbx-lines li span:first-child{flex:1;min-width:0}",
    ".sbx-order-total{display:flex;justify-content:space-between;font-size:.85rem;margin:.4rem 0 .6rem;",
    "padding-top:.45rem;border-top:1px dashed #F2DDE6}",
    /* how-we-address-you sheet */
    "#sbx-addr{position:fixed;inset:0;z-index:10050;background:rgba(43,22,32,.45);display:flex;",
    "align-items:flex-end;justify-content:center}",
    "#sbx-addr .sbx-addr-card{background:#FCF4F9;width:100%;max-width:520px;border-radius:1.4rem 1.4rem 0 0;",
    "padding:1.4rem 1.2rem calc(1.4rem + env(safe-area-inset-bottom));text-align:center}",
    "#sbx-addr h3{margin:0 0 1rem;font-size:1.1rem;color:#2b1620;font-weight:700}",
    "#sbx-addr .sbx-addr-row{display:flex;gap:.7rem}",
    "#sbx-addr p{margin:.9rem 0 0;font-size:.76rem;color:#8a6b76;line-height:1.6}",
    /* one-line entry to the orders screen */
    "#sbx-orders-entry{margin:.7rem 1rem 0}",
    "#sbx-orders-entry .sbx-row-btn{width:100%;display:flex;align-items:center;justify-content:space-between;",
    "background:#fff;border:1px solid #F2DDE6;border-radius:1.1rem;padding:.95rem 1rem;font-family:inherit;",
    "font-size:.95rem;font-weight:700;color:#8E2D46}",
    "#sbx-orders-entry .sbx-row-arrow{color:#c49aab;font-size:1.1rem}",
    /* brand strip toggle */
    "[data-sbx-brands]::-webkit-scrollbar{display:none}",
    "#sbx-brands-toggle{text-align:center;margin:.55rem 1rem 0}",
    "#sbx-brands-toggle button{background:none;border:none;color:#8E2D46;font-weight:700;",
    "font-size:.82rem;font-family:inherit;padding:.35rem .8rem}",
    /* live suggestions under the home search box */
    "#sbx-suggest{position:fixed;z-index:10040;background:#fff;border:1px solid #F2DDE6;border-radius:1rem;",
    "box-shadow:0 12px 30px rgba(43,22,32,.14);overflow:hidden;max-height:60vh;overflow-y:auto}",
    "#sbx-suggest .sbx-sg-item{display:flex;align-items:center;gap:.6rem;width:100%;background:#fff;",
    "border:none;border-bottom:1px solid #F7EAF0;padding:.55rem .7rem;font-family:inherit;text-align:start}",
    "#sbx-suggest .sbx-sg-item img{width:2.5rem;height:2.5rem;border-radius:.5rem;object-fit:cover;background:#f6eff3;flex:0 0 auto}",
    "#sbx-suggest .sbx-sg-n{flex:1;min-width:0;font-size:.76rem;line-height:1.35;color:#2b1620;",
    "display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}",
    "#sbx-suggest .sbx-sg-p{font-size:.74rem;font-weight:700;color:#8E2D46;white-space:nowrap}",
    "#sbx-suggest .sbx-sg-all{width:100%;background:#FCF4F9;border:none;padding:.65rem;color:#8E2D46;",
    "font-weight:700;font-size:.8rem;font-family:inherit}",
    "#sbx-suggest .sbx-sg-msg{padding:.9rem;text-align:center;color:#8a6b76;font-size:.82rem}",
    /* in-app article pages */
    "#sbx .sbx-article{line-height:1.85;font-size:.9rem;color:#3b2630}",
    "#sbx .sbx-article h3{margin:1.4rem 0 .5rem;font-size:1rem;color:#8E2D46;font-weight:700}",
    "#sbx .sbx-article h3:first-child{margin-top:.2rem}",
    "#sbx .sbx-article p{margin:0 0 .7rem}",
    "#sbx .sbx-article ul{margin:0 0 .9rem;padding-inline-start:1.1rem}",
    "#sbx .sbx-article li{margin-bottom:.35rem}",
    "#sbx .sbx-article blockquote{margin:0 0 1rem;padding:.85rem 1rem;background:#fff;border:1px solid #F2DDE6;",
    "border-radius:1rem;font-size:.86rem;color:#5b3f4a}",
    "#sbx .sbx-article cite{display:block;margin-top:.5rem;font-style:normal;font-weight:700;color:#8E2D46;font-size:.8rem}"
  ].join("");

  var styleEl = document.createElement("style");
  styleEl.id = "sbx-style";
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------------------------------------------------------------- shell */
  var root = document.createElement("div");
  root.id = "sbx";
  root.className = "sbx-scope";
  root.innerHTML =
    '<div class="sbx-head">' +
    '<button class="sbx-back" type="button" hidden></button>' +
    "<h2></h2>" +
    '<button class="sbx-x" type="button">✕</button>' +
    "</div><div class=\"sbx-body\"></div>";
  document.body.appendChild(root);

  var elHead = root.querySelector("h2");
  var elBody = root.querySelector(".sbx-body");
  var elBack = root.querySelector(".sbx-back");
  var elClose = root.querySelector(".sbx-x");
  var open = false;

  /* screen stack — so "رجوع" inside a product returns to the list it came
     from (with its category/search intact) instead of closing everything. */
  var stack = [];
  var current = null;

  function openOverlay() {
    root.dir = isRTL() ? "rtl" : "ltr";
    if (!open) {
      root.classList.add("on");
      document.documentElement.style.overflow = "hidden";
      history.pushState({ sbx: true }, "", location.href);
      open = true;
    }
  }
  function hide(fromPop) {
    if (!open) return;
    root.classList.remove("on");
    document.documentElement.style.overflow = "";
    open = false;
    stack = [];
    current = null;
    setNavActive(null);
    if (!fromPop) history.back();
  }
  function paintBack() {
    elBack.hidden = stack.length === 0;
    elBack.textContent = (isRTL() ? "‹ " : "‹ ") + t("back");
  }
  function goTo(entry, push) {
    if (push && current) stack.push(current);
    else if (!push) stack = [];
    current = entry;
    openOverlay();
    setNavActive(entry.tab || "products");
    elHead.textContent = entry.title;
    paintBack();
    elBody.scrollTop = 0;
    entry.render();
  }

  /* The page underneath doesn't change when a screen opens, so the bottom bar
     would keep lighting up "الأقسام" while the customer is in المنتجات.
     Move the highlight while a screen is open, restore it when it closes. */
  var navSaved = null;
  function setNavActive(kind) {
    var nav = document.getElementById("sb-nav");
    if (!nav) return;
    var tabs = Array.prototype.slice.call(nav.querySelectorAll(".sb-tab"));
    if (navSaved === null) {
      navSaved = tabs.filter(function (a) { return a.classList.contains("sb-on"); });
    }
    tabs.forEach(function (a) { a.classList.remove("sb-on"); });
    if (kind) {
      var target = nav.querySelector('[data-sbx-tab="' + kind + '"]');
      if (target) target.classList.add("sb-on");
    } else {
      navSaved.forEach(function (a) { a.classList.add("sb-on"); });
      navSaved = null;
    }
  }
  function goBack() {
    if (!stack.length) { hide(false); return; }
    current = stack.pop();
    elHead.textContent = current.title;
    paintBack();
    elBody.scrollTop = 0;
    current.render();
  }
  elBack.addEventListener("click", goBack);
  elClose.addEventListener("click", function () { hide(false); });
  window.addEventListener("popstate", function () { if (open) hide(true); });

  function html(s) { elBody.innerHTML = s; }

  /* ---------------------------------------------------------------- api */
  function api(path, opts) {
    return fetch(API + path, opts).then(function (r) {
      return r.json().then(function (d) {
        if (!r.ok) throw new Error(d && d.error ? d.error : t("err"));
        return d;
      });
    });
  }

  /* ------------------------------------------------------------ products */
  var catsCache = null;

  function prefetchCategories() {
    if (catsCache) return;
    api("/categories").then(function (d) { catsCache = d.categories || []; }).catch(function () {});
  }

  function normName(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }

  // Matches a brand name to an Odoo category, tolerating the spelling
  // differences in the database (e.g. "BIODRMA", "LA-ROSHE POSAY").
  function matchCategory(name) {
    if (!catsCache || !name) return null;
    var n = normName(name);
    if (!n) return null;
    var hit = catsCache.filter(function (c) { return normName(c.name) === n; })[0];
    if (hit) return hit.id;
    hit = catsCache.filter(function (c) {
      var cn = normName(c.name);
      return cn && (cn.indexOf(n) === 0 || n.indexOf(cn) === 0);
    })[0];
    if (hit) return hit.id;
    hit = catsCache.filter(function (c) {
      var cn = normName(c.name);
      return cn.length > 4 && n.length > 4 && cn.slice(0, 4) === n.slice(0, 4);
    })[0];
    return hit ? hit.id : null;
  }

  function screenProducts(categoryId, query, push) {
    var state = { cat: categoryId || null, q: query || "" };
    goTo({ title: t("products"), tab: "products", render: function () { renderProducts(state); } }, push);
  }

  function renderProducts(state) {
    html(
      '<div class="sbx-pad" style="padding-bottom:0"><input class="sbx-search" placeholder="' +
      esc(t("search")) + '" value="' + esc(state.q) + '"></div>' +
      '<div class="sbx-chips"></div><div class="sbx-list"><div class="sbx-msg">' + esc(t("loading")) + "</div></div>"
    );

    var input = elBody.querySelector(".sbx-search");
    var chips = elBody.querySelector(".sbx-chips");
    var list = elBody.querySelector(".sbx-list");
    var timer = null;

    // search from the 2nd letter, and clearing the box brings everything back
    input.addEventListener("input", function () {
      clearTimeout(timer);
      var v = input.value.trim();
      if (v.length === 1) return;
      timer = setTimeout(function () { state.q = v; load(); }, 250);
    });

    function paintChips() {
      if (!catsCache) return;
      var top = catsCache.filter(function (c) { return !c.parentId; });
      chips.innerHTML =
        '<button class="sbx-chip' + (state.cat ? "" : " on") + '" data-id="">' + esc(t("all")) + "</button>" +
        top.map(function (c) {
          return '<button class="sbx-chip' + (String(state.cat) === String(c.id) ? " on" : "") +
            '" data-id="' + c.id + '">' + esc(c.name) + "</button>";
        }).join("");
      Array.prototype.forEach.call(chips.querySelectorAll(".sbx-chip"), function (b) {
        b.addEventListener("click", function () {
          state.cat = b.getAttribute("data-id") || null;
          paintChips();
          load();
        });
      });
    }

    function load() {
      list.innerHTML = '<div class="sbx-msg">' + esc(t("loading")) + "</div>";
      var qs = ["limit=80"];
      if (state.cat) qs.push("category_id=" + encodeURIComponent(state.cat));
      if (state.q) qs.push("q=" + encodeURIComponent(state.q));
      api("/products?" + qs.join("&"))
        .then(function (d) {
          var items = d.products || [];
          if (!items.length) { list.innerHTML = '<div class="sbx-msg">' + esc(t("empty")) + "</div>"; return; }
          list.innerHTML = '<div class="sbx-grid">' + items.map(cardHTML).join("") + "</div>";
          wireCards(list, items);
        })
        .catch(function (e) { list.innerHTML = '<div class="sbx-msg">' + esc(e.message) + "</div>"; });
    }

    if (catsCache) paintChips();
    else api("/categories").then(function (d) { catsCache = d.categories || []; paintChips(); }).catch(function () {});
    load();
  }

  function cardHTML(p) {
    return (
      '<div class="sbx-card" data-id="' + p.id + '">' +
      '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" data-go="' + p.id + '">' +
      '<div class="b"><div class="n" data-go="' + p.id + '">' + esc(p.name) + "</div>" +
      (p.excerpt ? '<div class="d">' + esc(p.excerpt) + "</div>" : '<div class="d"></div>') +
      '<div class="p">' + esc(money(p.price)) + "</div>" +
      '<button class="sbx-btn" data-add="' + p.id + '">' + esc(t("add")) + "</button></div></div>"
    );
  }

  function wireCards(scope, items) {
    var byId = {};
    (items || []).forEach(function (p) { byId[p.id] = p; });
    Array.prototype.forEach.call(scope.querySelectorAll("[data-go]"), function (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", function () { screenProduct(el.getAttribute("data-go"), true); });
    });
    Array.prototype.forEach.call(scope.querySelectorAll("[data-add]"), function (b) {
      b.addEventListener("click", function () {
        var p = byId[b.getAttribute("data-add")];
        if (p) { addToCart(p, 1); flash(b); }
      });
    });
  }
  function flash(btn) {
    var old = btn.textContent;
    btn.textContent = "✓";
    setTimeout(function () { btn.textContent = old; }, 900);
  }

  function screenProduct(id, push) {
    goTo({ title: t("products"), tab: "products", render: function () { renderProduct(id); } }, push);
  }

  function renderProduct(id) {
    html('<div class="sbx-msg">' + esc(t("loading")) + "</div>");
    api("/product?id=" + encodeURIComponent(id))
      .then(function (p) {
        html(
          '<img class="sbx-hero" src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' +
          '<div class="sbx-pad"><h3 style="margin:.2rem 0 .3rem;font-size:1.02rem;line-height:1.45">' + esc(p.name) + "</h3>" +
          '<div style="color:#8E2D46;font-weight:700;font-size:1.15rem;margin-bottom:.8rem">' + esc(money(p.price)) + "</div>" +
          (p.description ? '<div style="color:#8a6b76;line-height:1.75;font-size:.9rem;margin-bottom:1rem">' + p.description + "</div>" : "") +
          '<div class="sbx-step" style="margin:1rem 0"><button data-m>−</button><span data-q>1</span><button data-p>+</button></div>' +
          '<button class="sbx-btn" data-buy>' + esc(t("add")) + "</button></div>"
        );
        var q = 1, qEl = elBody.querySelector("[data-q]");
        elBody.querySelector("[data-m]").addEventListener("click", function () { q = Math.max(1, q - 1); qEl.textContent = q; });
        elBody.querySelector("[data-p]").addEventListener("click", function () { q++; qEl.textContent = q; });
        elBody.querySelector("[data-buy]").addEventListener("click", function () { addToCart(p, q); screenCart(); });
      })
      .catch(function (e) { html('<div class="sbx-msg">' + esc(e.message) + "</div>"); });
  }

  /* ---------------------------------------------------------------- cart */
  function screenCart() {
    goTo({ title: t("cart"), tab: "cart", render: renderCart }, false);
  }

  function renderCart() {
    if (!cart.length) { html('<div class="sbx-msg">' + esc(t("cartEmpty")) + "</div>"); return; }
    html(
      '<div class="sbx-pad">' +
      cart.map(function (i) {
        return '<div class="sbx-row"><img src="' + esc(i.image) + '" alt="">' +
          '<div class="i"><div>' + esc(i.name) + "</div>" +
          '<div style="color:#8E2D46;font-weight:700;font-size:.85rem">' + esc(money(i.price)) + "</div></div>" +
          '<div class="sbx-step"><button data-m="' + i.id + '">−</button><span>' + i.qty +
          '</span><button data-p="' + i.id + '">+</button></div></div>';
      }).join("") +
      '<div class="sbx-sum"><span>' + esc(t("total")) + "</span><span>" + esc(money(cartTotal())) + "</span></div>" +
      "<form data-order>" +
      field("name", t("name"), "text", auth ? auth.name : "", true) +
      field("phone", t("phone"), "tel", "", true) +
      '<div class="sbx-f"><label>' + esc(t("address")) + '</label><textarea name="address" rows="2" required></textarea></div>' +
      field("notes", t("notes"), "text", "", false) +
      '<div data-err></div><button class="sbx-btn" type="submit">' + esc(t("checkout")) + "</button></form></div>"
    );

    Array.prototype.forEach.call(elBody.querySelectorAll("[data-m]"), function (b) {
      b.addEventListener("click", function () { changeQty(Number(b.getAttribute("data-m")), -1); });
    });
    Array.prototype.forEach.call(elBody.querySelectorAll("[data-p]"), function (b) {
      b.addEventListener("click", function () { changeQty(Number(b.getAttribute("data-p")), 1); });
    });

    elBody.querySelector("[data-order]").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, btn = f.querySelector("button[type=submit]"), errBox = f.querySelector("[data-err]");
      btn.disabled = true;
      btn.textContent = t("sending");
      errBox.innerHTML = "";
      api("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name.value, phone: f.phone.value, address: f.address.value, notes: f.notes.value,
          items: cart.map(function (i) { return { productId: i.id, qty: i.qty }; })
        })
      })
        .then(function (d) {
          rememberOrder(d.orderId, cart.slice());
          cart = []; saveCart();
          html('<div class="sbx-pad"><div class="sbx-note ok">' + esc(t("orderOk")) + d.orderId + " — " +
            esc(t("orderOkSub")) + '</div><button class="sbx-btn" data-cont>' + esc(t("continue")) + "</button></div>");
          elBody.querySelector("[data-cont]").addEventListener("click", function () { screenProducts(null, "", false); });
        })
        .catch(function (err) {
          errBox.innerHTML = '<div class="sbx-note err">' + esc(err.message) + "</div>";
          btn.disabled = false;
          btn.textContent = t("checkout");
        });
    });
  }

  function changeQty(id, delta) {
    var it = cart.filter(function (i) { return i.id === id; })[0];
    if (!it) return;
    it.qty += delta;
    if (it.qty <= 0) cart = cart.filter(function (i) { return i.id !== id; });
    saveCart();
    renderCart();
  }

  function field(name, label, type, val, required) {
    return '<div class="sbx-f"><label>' + esc(label) + '</label><input name="' + name + '" type="' + type +
      '" value="' + esc(val || "") + '"' + (required ? " required" : "") +
      (type === "tel" || type === "email" || type === "password" ? ' dir="ltr"' : "") + "></div>";
  }

  /* ------------------------------------ account panel (on contact page) */
  function mountAccountPanel() {
    if ((window.__TAB__ || "") !== "contact") return;
    if (document.getElementById("sbx-account")) return;
    var main = document.querySelector("main") || document.body;

    var panel = document.createElement("div");
    panel.id = "sbx-account";
    panel.className = "sbx-scope";
    main.insertBefore(panel, main.firstChild);
    paintAccount(panel, "login");

    // one compact row under the account box; hidden entirely when empty
    var count = myOrders().length;
    if (count) {
      var entry = document.createElement("div");
      entry.id = "sbx-orders-entry";
      entry.className = "sbx-scope";
      entry.dir = isRTL() ? "rtl" : "ltr";
      entry.innerHTML = '<button class="sbx-row-btn" data-open-orders><span>' + esc(t("myOrders")) +
        ' <b>(' + count + ')</b></span><span class="sbx-row-arrow">' + (isRTL() ? "‹" : "›") + "</span></button>";
      main.insertBefore(entry, panel.nextSibling);
      entry.querySelector("[data-open-orders]").addEventListener("click", screenOrders);
    }

    // let people switch how they're addressed
    if (isRTL()) {
      var pref = document.createElement("div");
      pref.id = "sbx-pref";
      pref.className = "sbx-scope";
      pref.dir = "rtl";
      pref.innerHTML = '<button class="sbx-btn ghost" data-addr>' + esc(t("changeAddr")) + "</button>";
      var afterEntry = document.getElementById("sbx-orders-entry") || panel;
      main.insertBefore(pref, afterEntry.nextSibling);
      pref.querySelector("[data-addr]").addEventListener("click", function () { askAddress(true); });
    }
  }

  function paintAccount(panel, mode) {
    panel.dir = isRTL() ? "rtl" : "ltr";
    if (auth) return paintLoggedIn(panel);
    panel.innerHTML =
      "<h3>" + esc(mode === "login" ? t("login") : t("register")) + "</h3><form data-auth>" +
      (mode === "register" ? field("name", t("name"), "text", "", true) : "") +
      field("email", t("email"), "email", "", true) +
      (mode === "register" ? field("phone", t("phone"), "tel", "", false) : "") +
      field("password", t("password"), "password", "", true) +
      '<div data-err></div><button class="sbx-btn" type="submit">' +
      esc(mode === "login" ? t("enter") : t("create")) + "</button></form>" +
      '<button class="sbx-btn ghost" style="margin-top:.7rem" data-swap>' +
      esc(mode === "login" ? t("noAccount") : t("haveAccount")) + "</button>";

    panel.querySelector("[data-swap]").addEventListener("click", function () {
      paintAccount(panel, mode === "login" ? "register" : "login");
    });
    panel.querySelector("[data-auth]").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, btn = f.querySelector("button[type=submit]"), errBox = f.querySelector("[data-err]");
      btn.disabled = true;
      errBox.innerHTML = "";
      var body = { email: f.email.value, password: f.password.value };
      if (mode === "register") { body.name = f.name.value; body.phone = f.phone.value; }
      api(mode === "login" ? "/auth/login" : "/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
      })
        .then(function (d) {
          auth = { name: d.name, partnerId: d.partnerId, email: body.email };
          writeJSON(AUTH_KEY, auth);
          paintLoggedIn(panel);
        })
        .catch(function (err) {
          errBox.innerHTML = '<div class="sbx-note err">' + esc(err.message) + "</div>";
          btn.disabled = false;
        });
    });
  }

  /* --------------------------------------------------------- my orders */
  function statusLabel(o) {
    if (o.state === "cancel") return t("st_cancel");
    if (o.state === "done") return t("st_done");
    if (o.delivery === "full") return t("st_done");
    if (o.delivery === "started" || o.delivery === "partial") return t("st_way");
    if (o.state === "sale") return t("st_prep");
    return t("st_new");
  }

  // Opens as its own screen; the account page only shows a one-line entry,
  // and nothing at all when there are no orders yet.
  function screenOrders() {
    goTo({ title: t("myOrders"), tab: "keep", render: function () { renderOrders(elBody, true); } }, false);
  }

  function renderOrders(host, padded) {
    var mine = myOrders();
    var wrap = padded ? "sbx-pad" : "";
    if (!mine.length) {
      host.innerHTML = '<div class="sbx-msg">' + esc(t("noOrders")) + "</div>";
      return;
    }
    host.innerHTML = '<div class="' + wrap + '"><p style="color:#8a6b76;font-size:.85rem">' +
      esc(t("loading")) + "</p></div>";

    api("/orders?ids=" + mine.map(function (o) { return o.id; }).join(","))
      .then(function (d) {
        var live = {};
        (d.orders || []).forEach(function (o) { live[o.id] = o; });

        host.innerHTML = '<div class="' + wrap + '">' +
          mine.map(function (saved) {
            var o = live[saved.id];
            var ref = o ? o.ref : "#" + saved.id;
            var when = new Date(saved.at).toLocaleDateString("en-GB");
            var total = o ? money(o.total) : money((saved.items || []).reduce(function (n, i) { return n + i.qty * i.price; }, 0));
            var lines = o && o.lines.length
              ? o.lines
              : (saved.items || []).map(function (i) { return { name: i.name, qty: i.qty, total: i.qty * i.price }; });

            return '<div class="sbx-order">' +
              '<div class="sbx-order-head"><b>' + esc(ref) + "</b><span>" + esc(when) + "</span></div>" +
              '<div class="sbx-chipstate">' + esc(o ? statusLabel(o) : t("st_new")) + "</div>" +
              '<ul class="sbx-lines">' + lines.map(function (l) {
                return "<li><span>" + esc(l.name) + "</span><span>×" + l.qty + "</span></li>";
              }).join("") + "</ul>" +
              '<div class="sbx-order-total"><span>' + esc(t("total")) + "</span><b>" + esc(total) + "</b></div>" +
              '<button class="sbx-btn ghost" data-reorder="' + saved.id + '">' + esc(t("reorder")) + "</button>" +
              '<a class="sbx-btn wa" style="display:block;text-align:center;margin-top:.45rem;text-decoration:none" href="' +
              esc(issueLink(ref, total)) + '" target="_blank" rel="noreferrer">' + esc(t("orderIssue")) + "</a>" +
              "</div>";
          }).join("") + "</div>";

        Array.prototype.forEach.call(host.querySelectorAll("[data-reorder]"), function (b) {
          b.addEventListener("click", function () {
            var saved = myOrders().filter(function (o) { return String(o.id) === b.getAttribute("data-reorder"); })[0];
            if (!saved || !saved.items) return;
            saved.items.forEach(function (i) { addToCart(i, i.qty); });
            screenCart();
          });
        });
      })
      .catch(function () {
        // Odoo unreachable - still show what this device remembers
        host.innerHTML = '<div class="' + wrap + '">' +
          mine.map(function (saved) {
            return '<div class="sbx-order"><div class="sbx-order-head"><b>#' + saved.id + "</b><span>" +
              new Date(saved.at).toLocaleDateString("en-GB") + "</span></div></div>";
          }).join("") + "</div>";
      });
  }

  function issueLink(ref, total) {
    var msg = "مرحبا، عندي استفسار عن طلبي " + ref + " (" + total + ")";
    return "https://api.whatsapp.com/send/?phone=%2B" + WA + "&text=" + encodeURIComponent(msg);
  }

  function paintLoggedIn(panel) {
    panel.innerHTML =
      "<h3>" + esc(t("myAccount")) + "</h3>" +
      '<p style="color:#8a6b76;margin:.2rem 0 1rem;font-size:.9rem">' + esc(t("hello")) + " " + esc(auth.name || "") + "</p>" +
      '<button class="sbx-btn ghost" data-out>' + esc(t("logout")) + "</button>" +
      '<div style="border-top:1px solid #F2DDE6;margin-top:1.3rem;padding-top:1rem" data-delzone>' +
      '<button class="sbx-btn danger" data-del>' + esc(t("del")) + "</button></div>";

    panel.querySelector("[data-out]").addEventListener("click", function () {
      auth = null;
      try { localStorage.removeItem(AUTH_KEY); } catch (e) {}
      paintAccount(panel, "login");
    });
    panel.querySelector("[data-del]").addEventListener("click", function () {
      var zone = panel.querySelector("[data-delzone]");
      zone.innerHTML =
        '<form data-delform><p style="font-size:.82rem;color:#8a6b76">' + esc(t("delWarn")) + "</p>" +
        field("password", t("password"), "password", "", true) +
        '<div data-err></div><button class="sbx-btn danger" type="submit">' + esc(t("delConfirm")) + "</button>" +
        '<button class="sbx-btn ghost" type="button" data-cancel style="margin-top:.5rem">' + esc(t("cancel")) + "</button></form>";
      zone.querySelector("[data-cancel]").addEventListener("click", function () { paintLoggedIn(panel); });
      zone.querySelector("[data-delform]").addEventListener("submit", function (e) {
        e.preventDefault();
        var f = e.target, errBox = f.querySelector("[data-err]"), btn = f.querySelector("button[type=submit]");
        btn.disabled = true;
        api("/auth/delete-account", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: auth.email, password: f.password.value })
        })
          .then(function () {
            auth = null;
            try { localStorage.removeItem(AUTH_KEY); } catch (e2) {}
            paintAccount(panel, "login");
          })
          .catch(function (err) {
            errBox.innerHTML = '<div class="sbx-note err">' + esc(err.message) + "</div>";
            btn.disabled = false;
          });
      });
    });
  }

  /* ------------------------------------------------------------ nav tabs */
  function svgIcon(kind) {
    var c = 'xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === "cart") {
      return "<svg " + c + '><circle cx="9" cy="21" r="1.4"/><circle cx="18" cy="21" r="1.4"/>' +
        '<path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.4a2 2 0 0 0 2-1.6L21 7H6"/></svg>';
    }
    if (kind === "products") {
      return "<svg " + c + '><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>' +
        '<path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
    }
    return "<svg " + c + '><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
  }

  function addTabs() {
    var nav = document.getElementById("sb-nav");
    if (!nav) return;

    var tabs = Array.prototype.slice.call(nav.querySelectorAll(".sb-tab"));
    function byLabel(ar) {
      return tabs.filter(function (a) { return (a.getAttribute("data-ar") || "").trim() === ar; })[0];
    }

    var home = byLabel("الرئيسية"),
      cats = byLabel("الأقسام"),
      offers = byLabel("العروض"),
      contactTab = byLabel("تواصل") || byLabel("الحساب");

    // the تواصل tab already points at contact.html — turn it into الحساب
    if (contactTab) {
      contactTab.setAttribute("data-ar", "الحساب");
      contactTab.setAttribute("data-en", "Account");
      contactTab.setAttribute("data-ku", "هەژمار");
      var sp = contactTab.querySelector("span");
      var oldSvg = contactTab.querySelector("svg");
      if (oldSvg) oldSvg.outerHTML = svgIcon("account");
      if (sp) sp.textContent = contactTab.getAttribute("data-" + lang()) || "الحساب";
    }

    var cls = (home && home.className ? home.className : "sb-tab").replace(/\bsb-on\b/g, "").trim();

    function mk(kind, ar, en, ku, onClick) {
      var existing = nav.querySelector('[data-sbx-tab="' + kind + '"]');
      if (existing) return existing;
      var a = document.createElement("a");
      a.className = cls;
      a.href = "#";
      a.setAttribute("data-sbx-tab", kind);
      a.setAttribute("data-ar", ar);
      a.setAttribute("data-en", en);
      a.setAttribute("data-ku", ku);
      a.innerHTML = svgIcon(kind) + "<span>" + ar + "</span>";
      a.addEventListener("click", function (e) { e.preventDefault(); onClick(); });
      return a;
    }

    var productsTab = mk("products", "المنتجات", "Products", "بەرهەمەکان", function () { screenProducts(null, "", false); });
    var cartTab = mk("cart", "سلتي", "Cart", "سەبەتە", screenCart);

    // final order (RTL: first = rightmost):
    // الرئيسية · الأقسام · المنتجات · العروض · سلتي · الحساب
    [home, cats, productsTab, offers, cartTab, contactTab].forEach(function (el) {
      if (el) nav.appendChild(el);
    });

    paintTabLabels();
    paintBadge();
  }

  function paintTabLabels() {
    var l = lang();
    Array.prototype.forEach.call(document.querySelectorAll("#sb-nav .sb-tab"), function (a) {
      var s = a.querySelector("span");
      if (s) s.textContent = a.getAttribute("data-" + l) || a.getAttribute("data-ar") || s.textContent;
    });
  }

  function paintBadge() {
    var tab = document.querySelector('#sb-nav [data-sbx-tab="cart"]');
    if (!tab) return;
    var old = tab.querySelector(".sb-badge");
    if (old) old.remove();
    var n = cartCount();
    if (!n) return;
    var b = document.createElement("span");
    b.className = "sb-badge";
    b.textContent = n;
    tab.appendChild(b);
  }

  /* ------------------------------------------- intercept odoo shop links */
  window.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var u;
    try { u = new URL(a.href, location.href); } catch (err) { return; }
    if (u.hostname !== ODOO_HOST) return;

    var mCat = u.pathname.match(/\/shop\/category\/(?:.*?-)?(\d+)\/?$/);
    var mProd = u.pathname.match(/\/shop\/(?:.*?-)?(\d+)\/?$/);
    var search = u.searchParams.get("search");

    // Brand tiles: resolve the category by the brand NAME rather than trusting
    // the id baked into the old build - so a tile can never open another brand,
    // and brands without a category yet start working the moment you add one.
    // the two website pages now live inside the app
    if (/\/about-us\/?$/.test(u.pathname)) {
      e.preventDefault(); e.stopPropagation();
      screenPage("about");
      return;
    }
    if (/\/our-services\/?$/.test(u.pathname)) {
      e.preventDefault(); e.stopPropagation();
      screenPage("services");
      return;
    }

    var inBrands = a.closest && a.closest("[data-sbx-brands]");
    if (inBrands) {
      var img = a.querySelector("img");
      var brand = img ? (img.alt || "").trim() : "";
      var byName = matchCategory(brand);
      if (byName) {
        e.preventDefault(); e.stopPropagation();
        screenProducts(byName, "", false);
        return;
      }
      if (!mCat && brand) {
        e.preventDefault(); e.stopPropagation();
        screenProducts(null, search || brand, false);
        return;
      }
    }

    if (mCat) {
      e.preventDefault(); e.stopPropagation();
      screenProducts(mCat[1], "", false);
    } else if (mProd && u.pathname.indexOf("/shop/category/") === -1) {
      e.preventDefault(); e.stopPropagation();
      screenProduct(mProd[1], false);
    } else if (/\/shop\/?$/.test(u.pathname)) {
      e.preventDefault(); e.stopPropagation();
      screenProducts(null, search || "", false);
    }
  }, true);

  /* --------------------------------------- cosmetic fixes on old design */

  // brand logos: equal-sized cards, whole logo visible, no horizontal cut
  function fixBrandLogos() {
    var links = Array.prototype.filter.call(
      document.querySelectorAll('a[href*="/shop/category/"], a[href*="/shop?search="]'),
      function (a) { return a.querySelector("img"); }
    );
    if (links.length < 5) return;

    // several sections link to /shop/category/ (the korean brand rows too) —
    // the brands grid is the container holding the most of them.
    var groups = [];
    links.forEach(function (a) {
      var p = a.parentElement;
      if (!p) return;
      var g = groups.filter(function (x) { return x.el === p; })[0];
      if (g) g.n++;
      else groups.push({ el: p, n: 1 });
    });
    groups.sort(function (x, y) { return y.n - x.n; });
    if (!groups.length || groups[0].n < 6) return;
    var box = groups[0].el;
    if (box.getAttribute("data-sbx-brands")) return;
    box.setAttribute("data-sbx-brands", "1");
    var cols = window.innerWidth < 430 ? 3 : 4;

    // two rows that scroll sideways by default, so the section stays short
    function compact() {
      box.style.display = "grid";
      box.style.gridAutoFlow = "column";
      box.style.gridTemplateColumns = "";
      box.style.gridTemplateRows = "repeat(2, auto)";
      box.style.gridAutoColumns = "5.6rem";
      box.style.overflowX = "auto";
      box.style.scrollbarWidth = "none";
      box.style.gap = ".6rem";
      box.style.scrollSnapType = "x proximity";
    }
    function expanded() {
      box.style.display = "grid";
      box.style.gridAutoFlow = "row";
      box.style.gridTemplateRows = "auto";
      box.style.gridAutoColumns = "";
      box.style.gridTemplateColumns = "repeat(" + cols + ", minmax(0,1fr))";
      box.style.overflowX = "visible";
      box.style.gap = ".6rem";
    }
    compact();

    links.forEach(function (a) {
      if (a.parentElement !== box) return;
      a.style.height = "4.6rem";
      a.style.padding = ".55rem";
      a.style.display = "grid";
      a.style.placeItems = "center";
      a.style.scrollSnapAlign = "start";
      var span = a.querySelector("span");
      if (span) { span.style.width = "100%"; span.style.height = "100%"; span.style.display = "grid"; span.style.placeItems = "center"; }
      var img = a.querySelector("img");
      if (img) {
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.maxWidth = "100%";
        img.style.maxHeight = "100%";
        img.style.objectFit = "contain";
      }
    });

    // "عرض الكل" - opens the whole wall of brands, and folds it back
    if (!document.getElementById("sbx-brands-toggle")) {
      var wrap = document.createElement("div");
      wrap.id = "sbx-brands-toggle";
      wrap.className = "sbx-scope";
      wrap.dir = isRTL() ? "rtl" : "ltr";
      wrap.innerHTML = '<button type="button">' + esc(t("showAll")) + "</button>";
      box.parentElement.insertBefore(wrap, box.nextSibling);
      var open = false;
      wrap.querySelector("button").addEventListener("click", function () {
        open = !open;
        open ? expanded() : compact();
        this.textContent = open ? t("showLess") : t("showAll");
      });
    }
  }

  // "شنو تحتاج؟" + footer: keep only on the home page and the account page
  function trimContactBlock() {
    var tab = window.__TAB__ || "";
    if (tab !== "categories" && tab !== "offers") return;
    var btns = Array.prototype.filter.call(
      document.querySelectorAll('a[href*="api.whatsapp.com/send"]'),
      function (a) { return /راسلنا|WhatsApp/i.test(a.textContent); }
    );
    if (!btns.length) return;
    var last = btns[btns.length - 1], node = last, hops = 0;
    while (node && node.parentElement && hops < 7) {
      node = node.parentElement;
      hops++;
      if (/شنو تحتاج|What do you need/i.test(node.textContent) && node.textContent.length < 400) {
        var section = node.parentElement && node.parentElement.children.length <= 2 ? node.parentElement : node;
        section.remove();
        return;
      }
    }
  }

  // contact page used to render the same block twice
  function dedupeContactBlock() {
    if ((window.__TAB__ || "") !== "contact") return;
    var btns = Array.prototype.filter.call(
      document.querySelectorAll('a[href*="api.whatsapp.com/send"]'),
      function (a) { return /راسلنا/.test(a.textContent); }
    );
    if (btns.length < 2) return;
    var last = btns[btns.length - 1], node = last, hops = 0;
    while (node && node.parentElement && hops < 6) {
      node = node.parentElement;
      hops++;
      if (/شنو تحتاج/.test(node.textContent) && node.textContent.length < 400) { node.remove(); return; }
    }
  }

  /* ------------------------------------------- how we address the customer */
  // Arabic verbs are gendered, so the app has to know which form to use.
  // Asked once, on the same screen as the language, and changeable later.
  function askAddress(force) {
    if (!isRTL()) return;
    if (!force && hasAddr()) return;
    if (document.getElementById("sbx-addr")) return;

    var sheet = document.createElement("div");
    sheet.id = "sbx-addr";
    sheet.className = "sbx-scope";
    sheet.dir = "rtl";
    sheet.innerHTML =
      '<div class="sbx-addr-card">' +
      "<h3>" + esc(t("addrTitle")) + "</h3>" +
      '<div class="sbx-addr-row">' +
      '<button class="sbx-btn" data-v="m">' + esc(t("addrM")) + "</button>" +
      '<button class="sbx-btn" data-v="f">' + esc(t("addrF")) + "</button>" +
      "</div><p>" + esc(t("addrHint")) + "</p></div>";
    document.body.appendChild(sheet);

    Array.prototype.forEach.call(sheet.querySelectorAll("[data-v]"), function (b) {
      b.addEventListener("click", function () {
        try { localStorage.setItem(ADDR_KEY, b.getAttribute("data-v")); } catch (e) {}
        sheet.remove();
        applyAddressText();
        var panel = document.getElementById("sbx-account");
        if (panel) paintAccount(panel, "login");
      });
    });
  }

  // The old pages' copy is written for a female customer and lives inside a
  // compiled bundle, so it can't be edited - swap the known phrases instead.
  var FEM_TO_MASC = {
    "شنو تحتاجين اليوم؟": "شنو تحتاج اليوم؟",
    "اختاري حالتچ وإحنا ندلچ على المنتجات المناسبة": "اختار حالتك وإحنا ندلك على المنتجات المناسبة",
    "ابدي من هنا": "ابدأ من هنا",
    "قطرات تفرق بنضارة بشرتچ": "قطرات تفرق بنضارة بشرتك",
    "ماسكات تشتغل وانتي نايمة": "ماسكات تشتغل وانت نايم",
    "اكتبي هنا .... و إحنا نساعدچ": "اكتب هنا .... و إحنا نساعدك",
    "اكتبي هنا ... و إحنا نساعدچ": "اكتب هنا ... و إحنا نساعدك",
    // generic fallbacks, applied after the full phrases above
    "تحتاجين": "تحتاج",
    "بشرتچ": "بشرتك",
    "حالتچ": "حالتك",
    "نساعدچ": "نساعدك",
    "ندلچ": "ندلك",
    "اكتبي": "اكتب",
    "اختاري": "اختار",
    "ابدي": "ابدأ",
    "شوفي": "شوف",
    "جربي": "جرب",
    "تريدين": "تريد",
    "وانتي": "وانت",
    "نايمة": "نايم",
    "إلچ": "إلك",
    "عندچ": "عندك",
    "وياچ": "وياك"
  };

  var addrObserver = null;
  function applyAddressText() {
    if (!isRTL() || addr() !== "m") return;
    swapText(document.body);
    if (addrObserver) return;
    // React re-renders would undo the swap, so keep watching
    addrObserver = new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === "characterData" && m.target.parentNode) swapNode(m.target);
        for (var j = 0; j < m.addedNodes.length; j++) swapText(m.addedNodes[j]);
      }
    });
    addrObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function swapNode(node) {
    var v = node.nodeValue;
    if (!v || v.length > 200) return;
    var out = v;
    for (var k in FEM_TO_MASC) if (out.indexOf(k) !== -1) out = out.split(k).join(FEM_TO_MASC[k]);
    if (out !== v) node.nodeValue = out;
  }

  function swapText(root) {
    if (!root) return;
    if (root.nodeType === 3) return swapNode(root);
    if (root.nodeType !== 1) return;
    if (root.id === "sbx" || root.id === "sbx-addr") return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) swapNode(n);
    // placeholders aren't text nodes
    Array.prototype.forEach.call(root.querySelectorAll ? root.querySelectorAll("input[placeholder]") : [], function (el) {
      var p = el.getAttribute("placeholder") || "";
      var out = p;
      for (var k in FEM_TO_MASC) if (out.indexOf(k) !== -1) out = out.split(k).join(FEM_TO_MASC[k]);
      if (out !== p) el.setAttribute("placeholder", out);
    });
  }

  /* ------------------------- the old home search box -> the live search */
  // The home page had its own search with ~126 hand-written entries and no
  // connection to Odoo, so brands like ANUA or VICHY returned nothing.
  function hookHomeSearch() {
    var inputs = Array.prototype.filter.call(
      document.querySelectorAll("input"),
      function (el) {
        if (el.closest("#sbx") || el.closest("#sbx-account") || el.closest("#sbx-orders")) return false;
        var p = (el.getAttribute("placeholder") || "") + " " + (el.getAttribute("aria-label") || "");
        return /اكتب|اكتبي|دوّر|دور على|search/i.test(p);
      }
    );
    inputs.forEach(function (el) {
      if (el.getAttribute("data-sbx-search")) return;
      el.setAttribute("data-sbx-search", "1");

      var timer = null;
      el.addEventListener("input", function (e) {
        // Stop the keystroke from reaching the old build's own search, which
        // would otherwise open a second dropdown saying it found nothing.
        e.stopPropagation();
        clearTimeout(timer);
        var v = el.value.trim();
        if (v.length < 2) { hideHomeResults(); return; }
        timer = setTimeout(function () { runHomeSearch(el, v); }, 260);
      }, true);

      // the results stay put when the keyboard goes down; they close on a tap
      // outside, on Escape, or once a product is picked
      el.addEventListener("keydown", function (e) {
        if (e.key === "Escape") hideHomeResults();
      });
    });

    if (!document.body.getAttribute("data-sbx-outside")) {
      document.body.setAttribute("data-sbx-outside", "1");
      document.addEventListener("click", function (e) {
        if (!homePanel) return;
        if (e.target.closest && (e.target.closest("#sbx-suggest") || e.target.closest("[data-sbx-search]"))) return;
        hideHomeResults();
      }, true);
    }
  }

  var homePanel = null, homeAnchor = null;
  function hideHomeResults() {
    if (homePanel) { homePanel.remove(); homePanel = null; homeAnchor = null; }
  }

  // the page shifts when the keyboard opens or closes - keep the panel glued
  // to the search box instead of leaving it floating in the wrong spot
  function repositionHomeResults() {
    if (!homePanel || !homeAnchor) return;
    var r = homeAnchor.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) { hideHomeResults(); return; }
    homePanel.style.top = Math.round(r.bottom + 6) + "px";
    homePanel.style.left = Math.round(r.left) + "px";
    homePanel.style.width = Math.round(r.width) + "px";
  }
  window.addEventListener("scroll", repositionHomeResults, true);
  window.addEventListener("resize", repositionHomeResults);

  function homeResultsHost(input) {
    if (!homePanel) {
      homePanel = document.createElement("div");
      homePanel.id = "sbx-suggest";
      homePanel.className = "sbx-scope";
      document.body.appendChild(homePanel);
    }
    homePanel.dir = isRTL() ? "rtl" : "ltr";
    homeAnchor = input;
    repositionHomeResults();
    return homePanel;
  }

  function runHomeSearch(input, q) {
    var host = homeResultsHost(input);
    host.innerHTML = '<div class="sbx-sg-msg">' + esc(t("loading")) + "</div>";
    api("/products?limit=6&q=" + encodeURIComponent(q))
      .then(function (d) {
        if (!homePanel) return;
        var items = d.products || [];
        if (!items.length) {
          host.innerHTML = '<div class="sbx-sg-msg">' + esc(t("empty")) + "</div>";
          return;
        }
        host.innerHTML =
          items.map(function (p) {
            return '<button class="sbx-sg-item" data-p="' + p.id + '">' +
              '<img src="' + esc(p.image) + '" alt="" loading="lazy">' +
              '<span class="sbx-sg-n">' + esc(p.name) + "</span>" +
              '<span class="sbx-sg-p">' + esc(money(p.price)) + "</span></button>";
          }).join("") +
          '<button class="sbx-sg-all" data-all>' + esc(t("seeAllResults")) +
          (d.total > items.length ? " (" + d.total + ")" : "") + "</button>";

        Array.prototype.forEach.call(host.querySelectorAll("[data-p]"), function (b) {
          b.addEventListener("mousedown", function (e) { e.preventDefault(); });
          b.addEventListener("click", function () {
            hideHomeResults();
            input.value = "";
            screenProduct(b.getAttribute("data-p"), false);
          });
        });
        host.querySelector("[data-all]").addEventListener("mousedown", function (e) { e.preventDefault(); });
        host.querySelector("[data-all]").addEventListener("click", function () {
          hideHomeResults();
          input.value = "";
          screenProducts(null, q, false);
        });
      })
      .catch(function () { hideHomeResults(); });
  }

  /* ------------------ "من نحن" and "الخدمات" as screens inside the app */
  // Content mirrored from saba-baghdad.odoo.com/about-us and /our-services.
  // If those pages change on the website, tell me and I'll refresh this.
  var PAGES = {
    about: {
      title: "من نحن",
      html:
        "<h3>منو إحنا؟</h3>" +
        "<p>إحنا «صبا بغداد»، موقع عراقي متخصص ببيع الأدوية والمستلزمات الطبية وأدوات العناية بالبشرة. " +
        "نوفرلك كل شي تحتاجه من علاجات وفيتامينات وأعشاب طبية ومنتجات العناية بالصحة، ويوصلك لباب بيتك بأمان وبأسرع وقت.</p>" +
        "<h3>شنو نوفّر؟</h3>" +
        "<ul><li>أدوية موثوقة من أفضل الشركات</li><li>توصيل سريع لكل محافظات العراق</li>" +
        "<li>استشارات مجانية من صيادلة مختصين</li><li>عروض وخصومات بشكل مستمر</li></ul>" +
        "<h3>ليش تختارنا؟</h3>" +
        "<p>لأننا نهتم بصحتك مثل ما نهتم بأهلنا. نتعامل بأمانة، ونتأكد إن كل دوا يوصلك أصلي ومخزون بطريقة صحيحة.</p>" +
        "<h3>🚚 سياسة التوصيل</h3>" +
        "<ul><li><b>رمزي:</b> ٣,٠٠٠ د.ع ضمن بغداد و٥,٠٠٠ د.ع لباقي المحافظات</li>" +
        "<li><b>سريع:</b> أغلب الطلبات توصل خلال ٢٤ إلى ٤٨ ساعة حسب موقعك</li>" +
        "<li><b>آمن:</b> نغلّف طلبك بعناية، خصوصاً الأدوية الحساسة</li></ul>" +
        "<h3>📍 موقعنا</h3>" +
        "<p>تريد تزورنا؟ حيّاك الله بأي وقت.</p>" +
        '<a class="sbx-btn ghost" style="display:block;text-align:center;text-decoration:none" ' +
        'href="https://maps.app.goo.gl/cm1amRPGhojmVsat5" target="_blank" rel="noreferrer">شوف الموقع عالخريطة</a>'
    },
    services: {
      title: "الخدمات والآراء",
      html:
        "<h3>💊 تأمين وبيع الأدوية</h3>" +
        "<p>تدوّر على دوا وما تلاگيه؟ صيدلية صبا تأمّنلك كل أنواع الأدوية الأصلية، وحتى المستعصية نوفرها حسب الطلب. " +
        "بس بلّغنا باسم الدوا وإحنا نرتّبها إلك بسرعة.</p>" +
        "<h3>💬 استشارة طبية مجانية</h3>" +
        "<p>مو متأكد شنو يناسب حالتك؟ دزّلنا سؤالك وفريق الصيادلة يجاوبك مجاناً.</p>" +
        "<h3>🧴 عناية ببشرتك</h3>" +
        "<p>بشرتك تهمنا — تلگى عندنا منتجات العناية من ماركات طبية وآمنة، مناسبة لكل أنواع البشرة.</p>" +
        "<h3>آراء زباين</h3>" +
        '<blockquote>«تجربة رائعة وتتكرر بإذن الله، من ناحية الأسعار والعروض والمنتجات غير المتوفرة بباقي الصيدليات. ' +
        "والمنتجات وصلت سليمة وبشكل أنيق. أتمنى الاستمرار والله يوفقكم.»<cite>رقية عباس</cite></blockquote>" +
        "<h3>الشركاء والثقة</h3>" +
        "<ul><li>أكثر من ٥,٠٠٠ زبون وثقوا بمنتجاتنا</li>" +
        "<li>أطباء جلدية وخبراء تجميل يوصون بينا</li>" +
        "<li>بضاعتنا أصلية ومرخّصة من نقابة صيادلة العراق</li></ul>"
    }
  };

  function screenPage(key) {
    var pg = PAGES[key];
    if (!pg) return;
    goTo({
      title: pg.title,
      tab: "keep",
      render: function () { html('<div class="sbx-pad sbx-article">' + pg.html + "</div>"); }
    }, false);
  }

  /* ------------------------------------------- consultation chat (Odoo) */
  var CHAT_CHANNEL = 2;
  var chatStarted = false;

  // lift Odoo's chat window above the app's screens, and sit its launcher
  // just above the bottom bar instead of on top of it
  function chatCss() {
    if (document.getElementById("sbx-chat-css")) return;
    var st = document.createElement("style");
    st.id = "sbx-chat-css";
    st.textContent =
      ".o-livechat-LivechatWindow,[class*='LivechatWindow'],.o_livechat_chat_window{z-index:10060 !important}" +
      ".o-livechat-LivechatButton,.o_livechat_button,[class*='LivechatButton']{z-index:10055 !important;" +
      "bottom:calc(var(--sb-nav-h,3.6rem) + env(safe-area-inset-bottom) + .6rem) !important}";
    document.head.appendChild(st);
  }

  // Loaded a moment after the page settles, so it never slows the first paint.
  function startChat() {
    if (chatStarted) return;
    chatStarted = true;
    chatCss();

    var base = "https://" + ODOO_HOST;

    // Order matters: the loader defines odoo.__session_info__.livechatData and
    // assets_embed.js builds the widget from it. Dynamically inserted scripts
    // run async regardless of `defer`, so the second one has to wait for the
    // first to finish - otherwise it finds no config and renders nothing.
    var s1 = document.createElement("script");
    s1.async = false;
    s1.src = base + "/im_livechat/loader/" + CHAT_CHANNEL;

    s1.onload = function () {
      var s2 = document.createElement("script");
      s2.async = false;
      s2.src = base + "/im_livechat/assets_embed.js";
      s2.onload = function () {
        chatCss();
        // the widget mounts a moment later; re-apply once it's there
        setTimeout(chatCss, 1200);
      };
      document.head.appendChild(s2);
    };

    document.head.appendChild(s1);
  }

  /* ------------------------- keep home prices in step with Odoo */
  function refreshHomePrices() {
    var byId = {};
    Array.prototype.forEach.call(document.querySelectorAll('a[href*="/shop/"]'), function (a) {
      var path;
      try { path = new URL(a.href, location.href).pathname; } catch (e) { return; }
      if (path.indexOf("/shop/category/") !== -1) return;
      var m = path.match(/-(\d+)\/?$/);
      if (!m) return;
      var el = Array.prototype.filter.call(a.querySelectorAll("*"), function (e) {
        return e.children.length === 0 && /ع\.د|د\.ع/.test(e.textContent || "");
      })[0];
      if (el) (byId[m[1]] = byId[m[1]] || []).push(el);
    });

    var ids = Object.keys(byId);
    if (!ids.length) return;

    api("/prices?ids=" + ids.join(","))
      .then(function (d) {
        (d.prices || []).forEach(function (p) {
          (byId[p.id] || []).forEach(function (el) {
            var next = money(p.price);
            if (el.textContent.trim() !== next) el.textContent = next;
          });
        });
      })
      .catch(function () {});
  }

  /* ------------------------------- remove the "our website" link (asked) */
  function removeWebsiteLink() {
    var links = Array.prototype.filter.call(document.querySelectorAll("a"), function (a) {
      var txt = (a.textContent || "").trim();
      return /موقعنا الإلكتروني|موقعنا الالكتروني|Our website/i.test(txt) && txt.length < 40;
    });
    links.forEach(function (a) { a.remove(); });
  }

  /* ---------------------------------------------------------------- boot */
  function boot() {
    addTabs();
    dedupeContactBlock();
    trimContactBlock();
    fixBrandLogos();
    mountAccountPanel();
    hookHomeSearch();
    removeWebsiteLink();
    refreshHomePrices();
    setTimeout(startChat, 1200);
    applyAddressText();
    if (langChosen() && isRTL() && !hasAddr()) askAddress(false);
  }

  // The language screen is the app's own; watch for the moment it's answered
  // so the address question can follow immediately on the same screen.
  var addrPoll = setInterval(function () {
    if (hasAddr() || !isRTL()) { clearInterval(addrPoll); return; }
    if (!langChosen()) return;
    askAddress(false);
    hookHomeSearch();
    clearInterval(addrPoll);
  }, 700);
  setTimeout(function () { clearInterval(addrPoll); }, 60000);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(prefetchCategories, 2500); // so brand tiles resolve on the first tap
  setTimeout(boot, 600);
  setTimeout(boot, 1800);
  setTimeout(boot, 3200);
  window.addEventListener("pageshow", boot);

  window.SabaShop = {
    products: screenProducts, product: screenProduct, cart: screenCart,
    whatsapp: "https://api.whatsapp.com/send/?phone=%2B" + WA
  };
})();
