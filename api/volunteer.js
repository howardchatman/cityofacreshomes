import { sql, isValidEmail } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, email, interest, notes, _gotcha } = body;

  if (_gotcha) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email) {
    return res.status(400).json({ ok: false, error: "Please fill in all required fields." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  try {
    await sql`
      insert into volunteers (name, email, interest, notes)
      values (${String(name).slice(0, 200)}, ${String(email).slice(0, 200)}, ${interest ? String(interest).slice(0, 100) : null}, ${notes ? String(notes).slice(0, 2000) : null})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("volunteer insert failed", err);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again shortly." });
  }
}
