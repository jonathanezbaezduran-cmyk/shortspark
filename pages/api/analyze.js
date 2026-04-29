export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { topic, niche, mode } = req.body;
  if (!topic || !niche) return res.status(400).json({ error: "Missing topic or niche" });
  if (topic.length > 500) return res.status(400).json({ error: "Topic too long" });

  const isGenerator = mode === "generate";

  const prompt = isGenerator
    ? `You are a YouTube Shorts viral content expert. Generate 5 viral hook variations for this topic in the "${niche}" niche: "${topic}". Each hook should be optimized for the 2026 YouTube Shorts algorithm. Respond ONLY with valid JSON, no markdown, no fences:
{"hooks":[{"hook":"<hook text>","score":<0-100>,"reason":"<1 sentence why it works>"},...]}`
    : `You are a YouTube Shorts viral content expert with deep knowledge of the 2026 algorithm. Analyze this YouTube Shorts topic/hook for the "${niche}" niche: "${topic}". Respond ONLY with a single valid JSON object. No markdown, no code fences, no explanation:
{"viral_score":<0-100>,"hook_strength":<0-100>,"thumbnail_score":<0-100>,"optimal_length":"<e.g. '15-30 seconds' or '45-60 seconds'>","trending_status":"<HOT|RISING|COOLING|SATURATED>","competition_level":"<Low|Medium|High|Very High>","estimated_views":"<e.g. '5K-50K'>","one_liner":"<1 sentence insight>","title_variations":["<title 1>","<title 2>","<title 3>"],"hashtags":["<tag1>","<tag2>","<tag3>","<tag4>","<tag5>"],"strengths":["<s1>","<s2>","<s3>"],"weaknesses":["<w1>","<w2>"],"improvements":["<step1>","<step2>","<step3>"],"best_times":["<time1>","<time2>","<time3>"]}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, messages: [{ role: "user", content: prompt }] }),
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    const raw = (data.content || []).map(b => b.text || "").join("");
    const clean = raw.replace(/```[a-z]*\n?|```/g, "").trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    console.error("analyze error:", err);
    return res.status(500).json({ error: "Analysis failed. Try again." });
  }
}
