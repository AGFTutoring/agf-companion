export async function POST(req) {
  try {
    const { messages, system, mode } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json({ error: { message: "API key not configured" } }, { status: 500 });
    }
    const maxTokens = mode === "quiz" ? 4000 : 1200;
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: maxTokens,
        system,
        messages,
      }),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    return Response.json({ error: { message: err.message || "Internal server error" } }, { status: 500 });
  }
}