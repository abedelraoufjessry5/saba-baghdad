/* One-page app router. Every screen has its own real URL, so the phone's back
   button, reloading and sharing a link all work.

   Main tabs (/, /categories, /account) show the app header.
   Inner screens (products, a product, cart, orders, about...) show a bar with
   "back" and "✕": back returns to the previous screen with its filters, ✕
   returns to the last main tab. */

const routes = [];
let outlet = null;
let currentView = null;
let currentRoute = null;
let lastTab = "/";
let pendingScroll = 0;
const listeners = new Set();

const LEGACY = {
  "/index.html": "/",
  "/index": "/",
  "/categories.html": "/categories",
  "/offers.html": "/",
  "/offers": "/",
  "/contact.html": "/account",
  "/contact": "/account"
};

export function route(pattern, view, { tab, main = false } = {}) {
  const keys = [];
  const re = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, k) => { keys.push(k); return "([^/]+)"; }) + "/?$");
  routes.push({ pattern, re, keys, view, tab, main });
}

export function onRouteChange(fn) {
  listeners.add(fn);
}

function match(pathname) {
  for (const r of routes) {
    const m = pathname.match(r.re);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      return { route: r, params };
    }
  }
  return null;
}

function saveScroll() {
  try {
    history.replaceState({ ...(history.state || {}), scroll: window.scrollY }, "");
  } catch (e) { /* ignore */ }
}

// navigate("/products?q=serum")            opened from a tab, a banner, the bar
// navigate("/product/12", { child: true }) opened from another inner screen:
//                                          its "back" returns there
export function navigate(url, { replace = false, child = false } = {}) {
  const target = new URL(url, location.origin);
  const found = match(target.pathname);
  const here = history.state || {};
  let state;
  if (!found || found.route.main) state = { depth: 0, rooted: true };
  else state = { depth: (here.depth || 0) + 1, child, rooted: here.depth ? !!here.rooted : true };
  if (replace) {
    // same slot in the history: keep its place in the chain
    if (state.depth) state = { depth: here.depth || 1, child: !!here.child, rooted: here.depth ? !!here.rooted : false };
    history.replaceState(state, "", target.pathname + target.search);
  } else {
    saveScroll();
    history.pushState(state, "", target.pathname + target.search);
  }
  pendingScroll = 0;
  render();
}

// The bar's back button: previous inner screen.
export function back() {
  if (canGoBack()) history.back();
  else close();
}

// The bar's ✕: straight back to the main tab the screens were opened from,
// at the same scroll position.
export function close() {
  const s = history.state || {};
  if (s.depth > 0 && s.rooted) history.go(-s.depth);
  else navigate(lastTab);
}

export function canGoBack() {
  return !!(history.state && history.state.child);
}

export function current() {
  return currentRoute;
}

export function refresh() {
  saveScroll();
  pendingScroll = (history.state && history.state.scroll) || 0;
  render();
}

// Views that fill in after a network call call this once they are tall
// enough, so a "back" lands on the same spot in the list.
export function restoreScroll() {
  if (pendingScroll) window.scrollTo(0, pendingScroll);
  pendingScroll = 0; // only once: a later filter change starts at the top
}

function render() {
  let path = location.pathname;
  if (LEGACY[path]) {
    history.replaceState(history.state, "", LEGACY[path] + location.search);
    path = LEGACY[path];
  }
  let found = match(path);
  if (!found) {
    history.replaceState({ depth: 0, rooted: true }, "", "/");
    found = match("/");
  }
  if (currentView && typeof currentView.destroy === "function") currentView.destroy();
  if (found.route.main) lastTab = path;

  const query = Object.fromEntries(new URLSearchParams(location.search));
  currentRoute = { ...found, path, query };
  const view = found.route.view({ params: found.params, query, path });
  currentView = view;
  outlet.replaceChildren(view.el || view);
  window.scrollTo(0, pendingScroll || 0);
  listeners.forEach((fn) => fn(currentRoute));
}

export function start(el) {
  outlet = el;
  if (!history.state) {
    // opened straight on an inner screen (a shared link, a reload): nothing
    // of ours behind it in the history
    const m = match(LEGACY[location.pathname] || location.pathname);
    history.replaceState(m && !m.route.main ? { depth: 1, rooted: false } : { depth: 0, rooted: true }, "");
  }
  window.addEventListener("popstate", () => {
    pendingScroll = (history.state && history.state.scroll) || 0;
    render();
  });
  // Plain <a href="/..."> links inside the app are handled here, so they
  // never reload the page.
  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
    e.preventDefault();
    navigate(url.pathname + url.search, { child: a.dataset.child === "1" });
  });
  render();
}
