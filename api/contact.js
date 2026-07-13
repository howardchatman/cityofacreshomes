import { sql, isValidEmail } from "./_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = req.body || {};
  const { name, email, topic, message, _gotcha } = body;

  if (_gotcha) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Please fill in all required fields." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  try {
    await sql`
      insert into contact_messages (name, email, topic, message)
      values (${String(name).slice(0, 200)}, ${String(email).slice(0, 200)}, ${topic ? String(topic).slice(0, 100) : null}, ${String(message).slice(0, 5000)})
    `;
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("contact insert failed", err);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again shortly." });
  }
}
