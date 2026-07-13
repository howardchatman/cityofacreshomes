import { sql, isValidEmail } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, address, email, phone, confirm, _gotcha } = body;

  // Honeypot: real users never fill this hidden field. Pretend success so bots move on.
  if (_gotcha) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !address || !email || !confirm) {
    return res.status(400).json({ ok: false, error: "Please fill in all required fields." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  try {
    await sql`
      insert into petition_signatures (name, address, email, phone)
      values (${String(name).slice(0, 200)}, ${String(address).slice(0, 300)}, ${String(email).slice(0, 200)}, ${phone ? String(phone).slice(0, 40) : null})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("petition insert failed", err);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again shortly." });
  }
}
