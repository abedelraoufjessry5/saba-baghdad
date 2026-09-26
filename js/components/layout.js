/* Page frame pieces: the app header, the inner-screen bar, section titles,
   the language sheet and the footer. */
import { h } from "../dom.js";
import { icon } from "../icons.js";
import { t, lang, setLang, LANGS } from "../i18n.js";
import { back, close, canGoBack, refresh } from "../router.js";
import { whatsappUrl } from "../config.js";

const LOGO_MARK = "/img/brand/logo-mark.png";

export function appHeader() {
  return h("header", { class: "app-header" },
    h("div", { class: "bar" },
      h("img", { class: "logo", src: LOGO_MARK, alt: "", width: 24, height: 32 }),
      h("div", { class: "names" },
        h("p", { class: "brand display truncate" }, t("brand.short")),
        h("p", { class: "tagline truncate" }, t("brand.tagline"))
      ),
      h("button", { class: "round-btn press", type: "button", "aria-label": t("lang.change"), onClick: openLanguageSheet },
        icon("languages", { size: 17 }))
    )
  );
}

// Top bar of inner screens: [back]  title  [✕]
export function screenBar(title) {
  const backBtn = canGoBack()
    ? h("button", { type: "button", onClick: back }, icon("chevronLeft", { size: 18, className: "rtl-flip" }), t("back"))
    : h("span", { class: "spacer" });
  return h("div", { class: "screen-bar" },
    backBtn,
    h("h1", null, title),
    h("button", { class: "x", type: "button", "aria-label": t("close"), onClick: close }, icon("x", { size: 20 }))
  );
}

export function section({ label, title, sub }, ...body) {
  return h("section", { class: "section" },
    h("div", { class: "section-head" },
      label ? h("p", { class: "label" }, label) : null,
      h("h2", { class: "display" }, title),
      sub ? h("p", { class: "sub" }, sub) : null
    ),
    ...body
  );
}

export function openLanguageSheet() {
  const backdrop = h("div", { class: "sheet-backdrop", role: "dialog", "aria-modal": "true", "aria-label": t("lang.change") });
  const onKey = (e) => { if (e.key === "Escape") closeSheet(); };
  function closeSheet() {
    backdrop.remove();
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("popstate", closeSheet);
  }
  backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeSheet(); });
  const panel = h("div", { class: "sheet fade" },
    h("div", { class: "handle" }),
    LANGS.map((l) =>
      h("button", {
        class: "lang-opt press", type: "button",
        onClick: () => { closeSheet(); if (l.code !== lang()) { setLang(l.code); refresh(); } }
      },
      h("span", { style: { textAlign: "start" } }, h("span", { class: "l" }, l.label), h("span", { class: "s" }, l.sub)),
      lang() === l.code ? icon("check", { size: 18, stroke: 2.25 }) : null)
    )
  );
  backdrop.appendChild(panel);
  document.body.appendChild(backdrop);
  document.addEventListener("keydown", onKey);
  window.addEventListener("popstate", closeSheet); // phone back button closes it
}

const MSG_KEYS = ["contact.msg1", "contact.msg2", "contact.msg3"];

// The three ready-made WhatsApp messages + the big WhatsApp button.
export function whatsappBlock() {
  return [
    MSG_KEYS.map((k) =>
      h("a", { class: "wa-row press", href: whatsappUrl(t(k)) },
        h("span", null, t(k)), icon("message", { size: 18 }))),
    h("a", { class: "wa-btn press", href: whatsappUrl() },
      icon("message", { size: 19, stroke: 2.2 }), t("contact.whatsapp"))
  ];
}

// full = home page footer (messages + signature); short = signature only.
export function footer({ full = true } = {}) {
  return h("footer", { class: "footer" + (full ? "" : " short") },
    full ? h("div", { class: "px" }, h("p", { class: "label" }, t("contact.pick")), whatsappBlock()) : null,
    h("div", { class: "sign" },
      h("img", { src: LOGO_MARK, alt: "", width: 33, height: 44 }),
      h("p", { class: "n display" }, t("brand.name")),
      h("p", { class: "by" }, "Designed by Abed El Raouf Jessry")
    )
  );
}
