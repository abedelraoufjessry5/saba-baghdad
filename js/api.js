/* Calls to our own /api (the Vercel functions that talk to Odoo).
   Every call has a timeout and returns a readable error message. */
import { API_BASE } from "./config.js";
import { t } from "./i18n.js";
import { getAuth, setAuth } from "./store.js";

const TIMEOUT_MS = 20000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const session = getAuth();
  if (auth && session) headers.Authorization = "Bearer " + session.token;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: ctrl.signal
    });
  } catch (e) {
    throw new ApiError(navigator.onLine === false ? t("offline") : t("err"), 0);
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  try { data = await res.json(); } catch (e) { /* not JSON */ }
  if (!res.ok) {
    // An expired or revoked sign-in: forget it so the account screen asks again.
    if (res.status === 401 && auth && session) setAuth(null);
    throw new ApiError((data && data.error) || t("err"), res.status);
  }
  return data || {};
}

function qs(params) {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== null && v !== undefined && v !== "") s.set(k, v);
  const str = s.toString();
  return str ? "?" + str : "";
}

export const api = {
  categories: () => request("/categories"),
  delivery: () => request("/delivery"),
  products: (p) => request("/products" + qs(p)),
  product: (id) => request("/product" + qs({ id })),
  prices: (ids) => request("/prices" + qs({ ids: ids.join(",") })),
  checkout: (order) => request("/checkout", { method: "POST", body: order, auth: true }),
  orders: (refs) => request("/orders" + qs({ refs: refs.join(",") }), { auth: true }),
  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),
  register: (data) => request("/auth/register", { method: "POST", body: data }),
  deleteAccount: (password) => request("/auth/delete-account", { method: "POST", body: { password }, auth: true })
};

/* The category list rarely changes - fetch it once per app start. */
let categoriesPromise = null;
export function loadCategories() {
  if (!categoriesPromise) {
    categoriesPromise = api.categories()
      .then((d) => d.categories || [])
      .catch((e) => { categoriesPromise = null; throw e; });
  }
  return categoriesPromise;
}
