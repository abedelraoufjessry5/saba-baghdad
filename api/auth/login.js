// POST /api/auth/login { email, password } -> { token, exp, user }
import { authenticateUser, execute } from "../_lib/odoo.js";
import { handler, send, body, clientIp, HttpError } from "../_lib/http.js";
import { createSession } from "../_lib/tokens.js";
import { limit } from "../_lib/limit.js";

export default handler(["POST"], async (req, res) => {
  const b = body(req);
  const email = String(b.email || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (!email || !password) throw new HttpError(400, "اكتبوا الإيميل وكلمة المرور");
  limit("login:ip:" + clientIp(req), 60, 600); // shared mobile IPs: keep loose
  limit("login:email:" + email, 8, 600);

  const uid = await authenticateUser(email, password);
  if (!uid) throw new HttpError(401, "الإيميل أو كلمة المرور غلط");

  const [user] = await execute("res.users", "read", [[uid]], { fields: ["id", "name", "login", "partner_id"] });
  const pid = user.partner_id[0];
  const [partner] = await execute("res.partner", "read", [[pid]], { fields: ["phone"] });
  send(res, {
    ...createSession({ uid, pid }),
    user: { name: user.name, email: user.login, phone: (partner && partner.phone) || "" }
  });
});
