// POST /api/auth/register { name, email, phone, password } -> { token, exp, user }
// Creates a free Odoo PORTAL user (not a paid internal seat). Odoo itself
// stores and checks the password.
import { execute, existingFields } from "../_lib/odoo.js";
import { handler, send, body, clientIp, HttpError } from "../_lib/http.js";
import { createSession } from "../_lib/tokens.js";
import { limit } from "../_lib/limit.js";
import { cleanText, isEmail, normalizePhone } from "../_lib/text.js";

export default handler(["POST"], async (req, res) => {
  const b = body(req);
  const name = cleanText(b.name, 80);
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  const phoneRaw = cleanText(b.phone, 30);
  const phone = phoneRaw ? normalizePhone(phoneRaw) : "";

  if (name.length < 2) throw new HttpError(400, "الاسم مطلوب");
  if (!isEmail(email)) throw new HttpError(400, "الإيميل غير صحيح");
  if (password.length < 8) throw new HttpError(400, "كلمة المرور لازم تكون ٨ أحرف أو أكثر");
  if (phoneRaw && !phone) throw new HttpError(400, "رقم الهاتف لازم يكون رقم موبايل عراقي، مثل 07701234567");
  limit("register:ip:" + clientIp(req), 30, 3600); // shared mobile IPs: keep loose
  limit("register:email:" + email, 5, 3600);

  const taken = await execute("res.users", "search_count", [[["login", "=", email], ["active", "in", [true, false]]]]);
  if (taken) throw new HttpError(409, "هذا الإيميل مسجّل مسبقاً");

  const [, portalGroup] = await execute("ir.model.data", "check_object_reference", ["base", "group_portal"]);
  // Odoo 18+ renamed res.users.groups_id to group_ids
  const groupField = (await existingFields("res.users", ["group_ids", "groups_id"]))[0] || "groups_id";

  // Odoo creates the contact (partner) together with the user.
  const uid = await execute("res.users", "create", [{
    name, login: email, email, password, [groupField]: [[6, 0, [portalGroup]]]
  }]);
  const [user] = await execute("res.users", "read", [[uid]], { fields: ["partner_id"] });
  const pid = user.partner_id[0];
  if (phone) await execute("res.partner", "write", [[pid], { phone }]);

  send(res, { ...createSession({ uid, pid }), user: { name, email, phone: phone || "" } });
});
