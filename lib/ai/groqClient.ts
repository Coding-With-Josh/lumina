const DEFAULT_MODEL = "llama-3.1-70b-versatile";

type ChatArgs = {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
};

/**
 * Lightweight Groq chat helper. Falls back to throwing if the API key is missing.
 */
export async function groqChat({
  system,
  user,
  model = DEFAULT_MODEL,
  temperature = 0.3,
  maxTokens = 400,
}: ChatArgs): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set");
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("Groq response missing content");
  }

  return content;
}
