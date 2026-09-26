/* The search box on the home and categories tabs. Suggestions come live from
   Odoo from the 2nd letter; Enter or "all results" opens the product list. */
import { h, clear, money, debounce, hideOnError } from "../dom.js";
import { icon } from "../icons.js";
import { t } from "../i18n.js";
import { api } from "../api.js";
import { navigate } from "../router.js";

export function searchBox() {
  let panel = null;
  let lastQuery = "";
  let requestNo = 0;

  const input = h("input", {
    type: "search",
    inputmode: "search",
    enterkeyhint: "search",
    autocomplete: "off",
    placeholder: t("search.placeholder"),
    "aria-label": t("search.placeholder")
  });
  const spinner = h("span", { class: "muted", hidden: true }, icon("loader", { size: 16, className: "spin" }));
  const clearBtn = h("button", { type: "button", class: "muted", hidden: true, "aria-label": t("close") }, icon("x", { size: 16 }));
  const wrap = h("div", { class: "search" },
    h("div", { class: "box" }, icon("search", { size: 18 }), input, spinner, clearBtn));

  function closePanel() {
    if (panel) { panel.remove(); panel = null; }
  }
  function openList(q) {
    closePanel();
    input.blur();
    navigate("/products?q=" + encodeURIComponent(q));
  }
  function showPanel(content) {
    if (!panel) {
      panel = h("div", { class: "suggest", role: "listbox" });
      wrap.appendChild(panel);
    }
    clear(panel).append(...content);
  }

  const run = debounce(async (q) => {
    const my = ++requestNo;
    spinner.hidden = false;
    clearBtn.hidden = true;
    try {
      const d = await api.products({ q, limit: 6 });
      if (my !== requestNo) return; // a newer search is on its way
      const items = d.products || [];
      if (!items.length) {
        showPanel([h("div", { class: "msg" }, t("search.empty"))]);
        return;
      }
      showPanel([
        ...items.map((p) =>
          h("button", {
            class: "item", type: "button",
            onMousedown: (e) => e.preventDefault(), // keep the keyboard from jumping
            onClick: () => { closePanel(); input.value = ""; navigate("/product/" + p.id); }
          },
          hideOnError(h("img", { src: p.image, alt: "", loading: "lazy" })),
          h("span", { class: "n clamp-2" }, p.name),
          h("span", { class: "p" }, money(p.price)))
        ),
        h("button", {
          class: "all", type: "button",
          onMousedown: (e) => e.preventDefault(),
          onClick: () => openList(q)
        }, t("search.all") + (d.total > items.length ? " (" + d.total + ")" : ""))
      ]);
    } catch (e) {
      if (my === requestNo) showPanel([h("div", { class: "msg" }, e.message)]);
    } finally {
      if (my === requestNo) {
        spinner.hidden = true;
        clearBtn.hidden = !input.value;
      }
    }
  }, 280);

  input.addEventListener("input", () => {
    const q = input.value.trim();
    clearBtn.hidden = !input.value;
    if (q.length < 2) { run.cancel(); requestNo++; spinner.hidden = true; closePanel(); return; }
    if (q === lastQuery && panel) return;
    lastQuery = q;
    run(q);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const q = input.value.trim();
      if (q) openList(q);
    } else if (e.key === "Escape") closePanel();
  });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    lastQuery = "";
    clearBtn.hidden = true;
    closePanel();
    input.focus();
  });

  // tap outside closes the suggestions
  const outside = (e) => { if (panel && !wrap.contains(e.target)) closePanel(); };
  document.addEventListener("pointerdown", outside);

  return {
    el: wrap,
    destroy() {
      run.cancel();
      document.removeEventListener("pointerdown", outside);
    }
  };
}
