import { groqChat } from "./groqClient";

interface CampaignParameters {
  campaignGoals: string; // e.g., "reach", "engagement", "conversions"
  platformType: string; // e.g., "instagram", "tiktok", "x", "threads"
  engagementDifficulty: "low" | "medium" | "high";
}

const DEFAULT_MODEL = "llama-3.1-70b-versatile";

function fallbackCPM(params: CampaignParameters): number {
  let baseCPM = 5;

  switch (params.platformType) {
    case "instagram":
      baseCPM += 2;
      break;
    case "tiktok":
      baseCPM += 3;
      break;
    case "x":
      baseCPM += 1;
      break;
    case "threads":
      baseCPM += 2;
      break;
  }

  if (params.campaignGoals === "conversions") {
    baseCPM += 3;
  } else if (params.campaignGoals === "engagement") {
    baseCPM += 1;
  }

  switch (params.engagementDifficulty) {
    case "medium":
      baseCPM += 1;
      break;
    case "high":
      baseCPM += 2;
      break;
  }

  const variability = Math.random() * 2 - 1;
  let recommended = baseCPM + variability;

  if (recommended < 1) {
    recommended = 1;
  }

  return parseFloat(recommended.toFixed(2));
}

function extractJsonNumber(text: string, key: string): number | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[0]);
    const value = parsed?.[key];
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (typeof num === "number" && !Number.isNaN(num)) {
      return num;
    }
  } catch {
    return null;
  }
  return null;
}

export async function recommendCPM(
  params: CampaignParameters
): Promise<number> {
  const useFallback = () => fallbackCPM(params);

  if (!process.env.GROQ_API_KEY) {
    return useFallback();
  }

  const prompt = `
Given campaign inputs, return a JSON object with "recommendedCpm" as a decimal number (USD).
- Consider platform difficulty, goal (reach/engagement/conversions), and engagement difficulty.
- Be conservative when data is sparse.
- Do not exceed $50 CPM; do not go below $0.50.
Inputs:
- campaignGoals: ${params.campaignGoals}
- platformType: ${params.platformType}
- engagementDifficulty: ${params.engagementDifficulty}

Respond ONLY with JSON like: {"recommendedCpm": 7.5, "reason": "brief reason"}
`;

  try {
    const content = await groqChat({
      system:
        "You are an ad pricing assistant. Produce concise JSON only. Keep prices realistic.",
      user: prompt,
      model: DEFAULT_MODEL,
      temperature: 0.2,
      maxTokens: 200,
    });

    const modelValue = extractJsonNumber(content, "recommendedCpm");
    if (modelValue !== null) {
      const clamped = Math.min(Math.max(modelValue, 0.5), 50);
      return parseFloat(clamped.toFixed(2));
    }
  } catch (error) {
    console.error("Groq CPM recommendation failed, using fallback:", error);
  }

  return useFallback();
}
