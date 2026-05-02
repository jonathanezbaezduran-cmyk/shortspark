export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { niche } = req.body;
  if (!niche) return res.status(400).json({ error: "Missing niche" });

  const prompt = `You are a YouTube Shorts trending expert. List the 5 hottest trending topic angles RIGHT NOW for the "${niche}" niche on YouTube Shorts in 2026.

Respond ONLY with valid JSON, no markdown, no fences:
{"trending":[{"topic":"<short trending angle, max 8 words>","heat":<integer 60-100>,"velocity":"<🔥 EXPLODING | 📈 RISING | ⚡ HOT>","window":"<time-sensitivity, e.g. 'next 7 days' or 'evergreen' or 'next 24h'>"}]}

Order from hottest to coolest. Be specific and current — not generic categories.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 700, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const raw = (data.content || []).map(b => b.text || "").join("");
    const clean = raw.replace(/```[a-z]*\n?|```/g, "").trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error("trending error:", err);
    return res.status(500).json({ error: "Trending fetch failed" });
  }
}
