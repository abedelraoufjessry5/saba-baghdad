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

    const partnerId = await execute("res.partner", "create", [
      { name, email, phone: phone || "" }
    ]);

    const userId = await execute("res.users", "create", [
      {
        name,
        login: email,
        email,
        password,
        partner_id: partnerId,
        groups_id: [[6, 0, [portalGroupId]]]
      }
    ]);

    ok(res, { userId, partnerId, name });
  });
}
