// POST /api/auth/delete-account { password } + sign-in token -> { deleted: true }
// Apple guideline 5.1.1(v): accounts created in the app can be deleted in
// the app. The portal user is archived (can never sign in again) and the
// personal fields on the contact are wiped; past orders stay for the books,
// no longer tied to a name, phone or email.
import { authenticateUser, execute, existingFields } from "../_lib/odoo.js";
import { handler, send, body, clientIp, HttpError } from "../_lib/http.js";
import { activeSession } from "../_lib/tokens.js";
import { limit } from "../_lib/limit.js";

export default handler(["POST"], async (req, res) => {
  const session = await activeSession(req, execute, { required: true });
  const password = String(body(req).password || "");
  if (!password) throw new HttpError(400, "اكتبوا كلمة المرور للتأكيد");
  limit("delete:" + session.uid, 5, 600);

  const [user] = await execute("res.users", "read", [[session.uid]], { fields: ["id", "login", "partner_id", "share"] });
  if (!user) throw new HttpError(401, "انتهت الجلسة، سجّلوا الدخول مرة ثانية");
  if (!user.share) throw new HttpError(403, "هذا الحساب ما ينحذف من التطبيق"); // never staff accounts
  const uid = await authenticateUser(user.login, password);
  if (uid !== session.uid) throw new HttpError(401, "كلمة المرور غلط");

  const pid = user.partner_id[0];
  // free the email (so it can sign up again later) and close the account
  await execute("res.users", "write", [[uid], { login: `deleted-${uid}-${Date.now()}@deleted.invalid`, active: false }]);

  // wipe what exists on this Odoo version ("mobile" is gone in newer ones)
  const personal = await existingFields("res.partner", ["email", "phone", "mobile", "street", "street2", "city"]);
  const wipe = { name: "مستخدم محذوف", active: false };
  personal.forEach((f) => (wipe[f] = false));
  // the contact + the delivery addresses saved under it
  const children = await execute("res.partner", "search", [[["parent_id", "=", pid], ["active", "in", [true, false]]]]);
  await execute("res.partner", "write", [[pid, ...children], wipe]);
  send(res, { deleted: true });
});
