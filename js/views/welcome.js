/* First launch: pick a language. */
import { h } from "../dom.js";
import { LANGS, setLang } from "../i18n.js";

export function welcomeView(onDone) {
  return h("div", { class: "welcome" },
    h("div", { class: "top fade" },
      h("img", { src: "/img/brand/logo-full.png", alt: "صيدلية صبا بغداد", width: 176, height: 222 }),
      h("div", { class: "rule" }),
      h("p", { class: "label-en" }, "BAGHDAD · SINCE 2019")),
    h("div", { class: "choose" },
      h("p", null, "اختيار اللغة · Choose your language · زمانەکەت هەڵبژێرە"),
      LANGS.map((l) =>
        h("button", { class: "press", type: "button", onClick: () => { setLang(l.code); onDone(); } },
          h("span", { class: "l" }, l.label),
          h("span", { class: "s" }, l.sub)))));
}
