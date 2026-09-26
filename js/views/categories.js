/* الأقسام: search + the category tree. */
import { h } from "../dom.js";
import { appHeader } from "../components/layout.js";
import { searchBox } from "../components/search.js";
import { categoryList } from "../components/blocks.js";

export function categoriesView() {
  const search = searchBox();
  return {
    el: h("div", null, appHeader(), h("main", { class: "page fade" }, search.el, categoryList())),
    destroy() { search.destroy(); }
  };
}
