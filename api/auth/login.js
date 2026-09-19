import { authenticateUser, execute } from "../_lib/odoo.js";
import { ok, guarded } from "../_lib/respond.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }
  await guarded(res, async () => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      res.status(400).json({ error: "email and password are required" });
      return;
    }

    const uid = await authenticateUser(email, password);
    if (!uid) {
      res.status(401).json({ error: "إيميل أو كلمة مرور غلط" });
      return;
    }

    const rows = await execute("res.users", "search_read", [
      [["id", "=", uid]]
    ], { fields: ["id", "name", "partner_id"], limit: 1 });

    const user = rows[0];
    ok(res, {
      userId: user.id,
      partnerId: user.partner_id[0],
      name: user.name
      // NOTE (v1 limitation): this just confirms the credentials are valid.
      // There's no session token/cookie yet - the front-end keeps a local
      // "logged in" flag. Fine to ship, but a real session (signed cookie
      // or JWT) should replace this before this handles anything sensitive
      // beyond browsing order history.
    });
  });
}
