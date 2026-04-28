export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { topic, niche } = req.body;
  if (!topic || !niche) return res.status(400).json({ error: "Missing topic or niche" });
  if (topic.length > 500) return res.status(400).json({ error: "Topic too long" });

  const prompt = `You are a YouTube Shorts viral content expert with deep knowledge of the 2026 algorithm, trending hooks, and what makes Shorts go viral.

Analyze this YouTube Shorts topic/hook for the "${niche}" niche:
"${topic}"

Respond ONLY with a single valid JSON object. No markdown, no code fences, no explanation, nothing else. Exactly this structure:
{
  "viral_score": <integer 0-100>,
  "hook_strength": <integer 0-100>,
  "trending_status": "<HOT | RISING | COOLING | SATURATED>",
  "competition_level": "<Low | Medium | High | Very High>",
  "estimated_views": "<e.g. '5K–50K' or '100K–500K' or '1M+'>",
  "one_liner": "<1 sentence, the single most important insight>",
  "title_variations": ["<title 1 max 60 chars>", "<title 2 max 60 chars>", "<title 3 max 60 chars>"],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "improvements": ["<step 1>", "<step 2>", "<step 3>"],
  "best_times": ["<e.g. Tue 7–9 AM EST>", "<e.g. Fri 5–7 PM EST>", "<e.g. Sat 11 AM–1 PM EST>"]
}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });

    const raw = (data.content || []).map((b) => b.text || "").join("");
    const clean = raw.replace(/```[a-z]*\n?|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ error: "Analysis failed. Try again." });
  }
}
