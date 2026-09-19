import { authenticateUser, execute } from "../_lib/odoo.js";
import { ok, guarded } from "../_lib/respond.js";

// Apple App Store guideline 5.1.1(v): apps with account creation must offer
// in-app account deletion. This is the agreed approach (option 2, not a hard
// delete): archive the portal user so they can never log in again, and
// anonymize the personal fields on their partner record. Their past orders
// stay intact for accounting/invoicing, just no longer tied to identifiable
// personal data.
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
    ], { fields: ["id", "partner_id"], limit: 1 });
    const user = rows[0];

    await execute("res.users", "write", [[user.id], { active: false }]);
    await execute("res.partner", "write", [
      [user.partner_id[0]],
      {
        name: "مستخدم محذوف",
        email: false,
        phone: false,
        street: false,
        active: false
      }
    ]);

    ok(res, { deleted: true });
  });
}
