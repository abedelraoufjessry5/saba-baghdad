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
      search: "دوّر على منتج، ماركة...", all: "الكل", loading: "جاري التحميل...",
      empty: "ما في نتائج", cartEmpty: "سلتك فاضية", add: "أضف للسلة",
      total: "المجموع", checkout: "إتمام الطلب (دفع عند التوصيل)",
      name: "الاسم", phone: "رقم الهاتف", address: "العنوان", notes: "ملاحظات (اختياري)",
      sending: "جاري الإرسال...", orderOk: "تم استلام طلبك رقم #",
      orderOkSub: "رح نتواصل وياك لتأكيد التوصيل. الدفع عند الاستلام.",
      continue: "متابعة التسوق", login: "تسجيل الدخول", register: "حساب جديد",
      email: "الإيميل", password: "كلمة المرور", enter: "دخول", create: "إنشاء حساب",
      noAccount: "ما عندك حساب؟ سجّل وحدة جديدة", haveAccount: "عندك حساب؟ سجّل دخول",
      hello: "مرحباً", logout: "تسجيل الخروج", del: "حذف حسابي",
      delWarn: "هذا الإجراء يوقف حسابك نهائياً ويحذف بياناتك الشخصية. أدخل كلمة المرور للتأكيد.",
      delConfirm: "تأكيد حذف الحساب", cancel: "تراجع", currency: "ع.د",
      err: "صار خطأ، حاول مرة ثانية", myAccount: "حسابي"
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
      err: "Something went wrong, try again", myAccount: "My account"
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
  function t(k) { return (T[lang()] || T.ar)[k] || T.ar[k] || k; }
  function isRTL() { var l = lang(); return l === "ar" || l === "ku"; }
  function money(n) {
    try { return Number(n).toLocaleString(isRTL() ? "ar-IQ" : "en-US") + " " + t("currency"); }
    catch (e) { return n + " " + t("currency"); }
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------------------------------------------------------- store */
  var CART_KEY = "saba.cart.v1", AUTH_KEY = "saba.auth.v1";
  function readJSON(k, d) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : d; } catch (e) { return d; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  var cart = readJSON(CART_KEY, []);
  var auth = readJSON(AUTH_KEY, null);

  function saveCart() { writeJSON(CART_KEY, cart); paintBadge(); }
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
    "#sbx-account{margin:1rem 1rem 0;background:#fff;border:1px solid #F2DDE6;border-radius:1.1rem;padding:1rem}",
    "#sbx-account h3{margin:0 0 .8rem;font-size:1.02rem;font-weight:700;color:#8E2D46}"
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
    // 3 columns on a phone: 4 made the tiles small enough to mis-tap
    var cols = window.innerWidth < 430 ? 3 : 4;
    box.style.display = "grid";
    box.style.gridAutoFlow = "row";
    box.style.gridTemplateRows = "auto";
    box.style.gridTemplateColumns = "repeat(" + cols + ", minmax(0,1fr))";
    box.style.gap = ".6rem";
    box.style.overflowX = "visible";

    links.forEach(function (a) {
      if (a.parentElement !== box) return;
      a.style.height = cols === 3 ? "5rem" : "4.2rem";
      a.style.padding = ".55rem";
      a.style.display = "grid";
      a.style.placeItems = "center";
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

  /* ---------------------------------------------------------------- boot */
  function boot() {
    addTabs();
    dedupeContactBlock();
    trimContactBlock();
    fixBrandLogos();
    mountAccountPanel();
  }
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
