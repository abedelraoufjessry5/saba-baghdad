import { execute } from "../_lib/odoo.js";
import { ok, guarded } from "../_lib/respond.js";

// Creates a free Odoo PORTAL user (not an internal/paid seat) so customers
// get a real, secure Odoo login (password hashing, etc. handled by Odoo
// itself) without touching your internal-user license count.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  await guarded(res, async () => {
    const { name, email, phone, password } = req.body || {};
    if (!name || !email || !password) {
      res.status(400).json({ error: "name, email and password are required" });
      return;
    }

    const dupe = await execute("res.users", "search_read", [
      [["login", "=", email]]
    ], { fields: ["id"], limit: 1 });
    if (dupe.length) {
      res.status(409).json({ error: "هذا الإيميل مسجل مسبقاً" });
      return;
    }

    const [, portalGroupId] = await execute("ir.model.data", "check_object_reference", [
      "base",
      "group_portal"
    ]);

    // Odoo renamed res.users.groups_id -> group_ids in recent versions (18/19),
    // so ask the server which one it actually has instead of guessing.
    let groupField = "groups_id";
    try {
      const f = await execute("res.users", "fields_get", [["group_ids", "groups_id"]], {
        attributes: ["type"]
      });
      if (f && f.group_ids) groupField = "group_ids";
    } catch {
      /* fall back to the legacy name */
    }

    const partnerId = await execute("res.partner", "create", [
      { name, email, phone: phone || "" }
    ]);

    const baseVals = { name, login: email, email, password, partner_id: partnerId };

    let userId;
    try {
      userId = await execute("res.users", "create", [
        Object.assign({}, baseVals, { [groupField]: [[6, 0, [portalGroupId]]] })
      ]);
    } catch (err) {
      // last resort: try the other field name before giving up
      const other = groupField === "group_ids" ? "groups_id" : "group_ids";
      userId = await execute("res.users", "create", [
        Object.assign({}, baseVals, { [other]: [[6, 0, [portalGroupId]]] })
      ]);
    }

    ok(res, { userId, partnerId, name });
  });
}
