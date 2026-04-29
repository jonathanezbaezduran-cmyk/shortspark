export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { hooks, niche } = req.body;
  if (!hooks || !Array.isArray(hooks) || hooks.length === 0) return res.status(400).json({ error: "Missing hooks" });
  if (hooks.length > 10) return res.status(400).json({ error: "Max 10 hooks at once" });

  const prompt = `You are a YouTube Shorts viral content expert. Analyze these ${hooks.length} hooks for the "${niche}" niche and rank them by viral potential.

Hooks to analyze:
${hooks.map((h, i) => `${i + 1}. "${h}"`).join("\n")}

Respond ONLY with valid JSON, no markdown, no fences:
{"results":[{"hook":"<exact hook text>","viral_score":<0-100>,"hook_strength":<0-100>,"trending_status":"<HOT|RISING|COOLING|SATURATED>","estimated_views":"<e.g. 5K-50K>","verdict":"<1 sentence, what makes it win or lose>","fix":"<1 sentence improvement if score below 70, otherwise empty string>"}]}

Order results from highest to lowest viral_score.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const raw = (data.content || []).map(b => b.text || "").join("");
    const clean = raw.replace(/```[a-z]*\n?|```/g, "").trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error("batch error:", err);
    return res.status(500).json({ error: "Batch analysis failed. Try again." });
  }
}
