// GET /api/delivery -> { zones: { baghdad: 3000, provinces: 5000 } }
import { handler, send } from "./_lib/http.js";
import { ZONES } from "./_lib/delivery.js";

export default handler(["GET"], async (req, res) => {
  send(res, { zones: Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, z.fee])) }, 300);
});
