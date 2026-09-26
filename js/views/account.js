/* الحساب: sign in / create account / my account (with delete), my orders,
   then the contact block - same place the old "تواصل" tab was. */
import { h } from "../dom.js";
import { icon } from "../icons.js";
import { t } from "../i18n.js";
import { LINKS, whatsappUrl } from "../config.js";
import { api } from "../api.js";
import { getAuth, setAuth, getOrders, onChange } from "../store.js";
import { navigate } from "../router.js";
import { appHeader, section, whatsappBlock, footer } from "../components/layout.js";
import { field } from "./cart.js";

function sessionFrom(d) {
  return { token: d.token, exp: d.exp, name: d.user.name, email: d.user.email, phone: d.user.phone || "" };
}

function accountPanel() {
  const panel = h("div", { class: "panel" });
  let mode = "login";
  let flash = null; // a one-off message, e.g. after deleting the account

  function paint() {
    const auth = getAuth();
    if (auth) return paintSignedIn(auth);
    const err = h("div");
    const submit = h("button", { class: "btn", type: "submit" }, mode === "login" ? t("acc.enter") : t("acc.create"));
    const form = h("form", { novalidate: true },
      mode === "register" ? field("name", t("cart.name"), { required: true, autocomplete: "name" }) : null,
      field("email", t("acc.email"), { type: "email", required: true, autocomplete: "email" }),
      mode === "register" ? field("phone", t("acc.phone"), { type: "tel", autocomplete: "tel" }) : null,
      field("password", t("acc.password"), {
        type: "password", required: true,
        autocomplete: mode === "login" ? "current-password" : "new-password",
        hint: mode === "register" ? t("acc.passwordHint") : ""
      }),
      err, submit);

    // handled on the button (a tap, or Enter in a field): works even where
    // the page may not submit forms itself
    form.addEventListener("submit", (e) => e.preventDefault());
    submit.addEventListener("click", async (e) => {
      e.preventDefault();
      const val = (n) => { const el = form.elements.namedItem(n); return el ? el.value.trim() : ""; };
      err.replaceChildren();
      submit.disabled = true;
      try {
        const d = mode === "login"
          ? await api.login(val("email"), form.elements.namedItem("password").value)
          : await api.register({ name: val("name"), email: val("email"), phone: val("phone"), password: form.elements.namedItem("password").value });
        flash = null;
        setAuth(sessionFrom(d)); // repaints through onChange
      } catch (ex) {
        err.replaceChildren(h("div", { class: "note err" }, ex.message));
        submit.disabled = false;
      }
    });

    panel.replaceChildren(
      flash ? h("div", { class: "note ok" }, flash) : "",
      h("h3", null, mode === "login" ? t("acc.login") : t("acc.register")),
      form,
      h("button", {
        class: "btn ghost", type: "button", style: { marginTop: ".7rem" },
        onClick: () => { mode = mode === "login" ? "register" : "login"; flash = null; paint(); }
      }, mode === "login" ? t("acc.toRegister") : t("acc.toLogin")));
  }

  function paintSignedIn(auth) {
    const zone = h("div", { class: "danger-zone" });
    function askDelete() {
      const err = h("div");
      const confirmBtn = h("button", { class: "btn danger", type: "submit" }, t("acc.deleteConfirm"));
      const form = h("form", { novalidate: true },
        h("p", null, t("acc.deleteWarn")),
        field("password", t("acc.password"), { type: "password", required: true, autocomplete: "current-password" }),
        err, confirmBtn,
        h("button", { class: "btn ghost", type: "button", onClick: () => paint() }, t("acc.cancel")));
      form.addEventListener("submit", (e) => e.preventDefault());
      confirmBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        err.replaceChildren();
        confirmBtn.disabled = true;
        try {
          await api.deleteAccount(form.elements.namedItem("password").value);
          flash = t("acc.deleted");
          mode = "login";
          setAuth(null);
        } catch (ex) {
          err.replaceChildren(h("div", { class: "note err" }, ex.message));
          confirmBtn.disabled = false;
        }
      });
      zone.replaceChildren(form);
    }
    zone.append(h("button", { class: "btn danger", type: "button", onClick: askDelete }, t("acc.delete")));

    panel.replaceChildren(
      h("h3", null, t("acc.mine")),
      h("p", { class: "hello" }, t("acc.hello") + " " + (auth.name || "")),
      h("button", { class: "btn ghost", type: "button", onClick: () => { mode = "login"; setAuth(null); } }, t("acc.logout")),
      zone);
  }

  paint();
  return { el: panel, paint };
}

function ordersRow() {
  const wrap = h("div");
  function paint() {
    const n = getOrders().length;
    wrap.replaceChildren(n || getAuth()
      ? h("button", { class: "row-link press", type: "button", onClick: () => navigate("/orders") },
          h("span", null, t("orders.title") + (n ? " (" + n + ")" : "")),
          h("span", { class: "arrow" }, icon("chevronLeft", { size: 18, className: "flip-ltr" })))
      : "");
  }
  paint();
  return { el: wrap, paint };
}

function contactSection() {
  return h("div", { class: "account-contact" },
    section({ label: t("contact.label"), title: t("contact.title"), sub: t("contact.sub") },
      h("div", { class: "contact" },
        h("p", { class: "pick" }, t("contact.pick")),
        whatsappBlock(),
        h("a", { class: "loc-row press", href: LINKS.maps },
          h("span", { class: "ic" }, icon("mapPin", { size: 18 })),
          h("span", { style: { flex: "1" } }, t("contact.location"))),
        h("div", { class: "link-box" },
          h("a", { class: "press", href: "/services" }, icon("star", { size: 17 }), h("span", null, t("contact.services"))),
          h("a", { class: "press", href: "/about" }, icon("info", { size: 17 }), h("span", null, t("contact.about")))),
        h("p", { class: "label", style: { marginTop: "1.5rem", marginBottom: ".5rem" } }, t("contact.follow")),
        h("div", { class: "follow" },
          h("a", { class: "press", href: whatsappUrl(), "aria-label": "WhatsApp" }, icon("message", { size: 18 })),
          h("a", { class: "press", href: LINKS.instagram, "aria-label": "Instagram" }, icon("instagram", { size: 18 })),
          h("a", { class: "press", href: LINKS.facebook, "aria-label": "Facebook" }, icon("facebook", { size: 18 })),
          h("a", { class: "press", href: LINKS.tiktok, "aria-label": "TikTok" }, icon("store", { size: 18 }))))));
}

export function accountView() {
  const panel = accountPanel();
  const orders = ordersRow();
  const off = onChange((what) => {
    if (what === "auth") { panel.paint(); orders.paint(); }
    if (what === "orders") orders.paint();
  });
  return {
    el: h("div", null, appHeader(),
      h("main", { class: "page fade" }, panel.el, orders.el, contactSection(), footer({ full: false }))),
    destroy: off
  };
}
