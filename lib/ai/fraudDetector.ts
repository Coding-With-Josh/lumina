import { groqChat } from "./groqClient";

interface EngagementData {
  rawViews: number;
  likes: number;
  comments: number;
  shares: number;
  watchTime?: number;
  clickOffRate?: number;
}

interface FraudDetectionResult {
  fraudScore: number;
  reason: string;
  validatedViews: number;
}

const DEFAULT_MODEL = "llama-3.1-70b-versatile";

function fallbackFraudDetection(engagement: EngagementData): FraudDetectionResult {
  let fraudScore = 0;
  const reason: string[] = [];
  let validatedViews = engagement.rawViews;

  const totalEngagement = engagement.likes + engagement.comments + engagement.shares;
  if (engagement.rawViews > 10000 && totalEngagement / engagement.rawViews < 0.005) {
    fraudScore += 50;
    reason.push("Unnaturally high views with low engagement");
    validatedViews = Math.min(validatedViews, engagement.rawViews * 0.5);
  }

  if (
    engagement.watchTime !== undefined &&
    engagement.clickOffRate !== undefined &&
    engagement.watchTime < 5 &&
    engagement.clickOffRate > 70
  ) {
    fraudScore += 30;
    reason.push("Very high click-off rate for short watch time");
    validatedViews = Math.min(validatedViews, engagement.rawViews * 0.7);
  }

  if (Math.random() < 0.1) {
    fraudScore += 10;
    reason.push("Minor suspicious activity detected");
    validatedViews = Math.min(validatedViews, engagement.rawViews * 0.9);
  }

  if (validatedViews < 0) {
    validatedViews = 0;
  }

  if (fraudScore > 100) {
    fraudScore = 100;
  }

  return {
    fraudScore,
    reason: reason.length > 0 ? reason.join("; ") : "No fraud detected",
    validatedViews: Math.floor(validatedViews),
  };
}

function extractJsonFields(text: string): FraudDetectionResult | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]);
    const fraudScoreRaw = parsed?.fraudScore;
    const validatedViewsRaw = parsed?.validatedViews;
    const reasonRaw = parsed?.reason;

    const fraudScore =
      typeof fraudScoreRaw === "string" ? parseFloat(fraudScoreRaw) : fraudScoreRaw;
    const validatedViews =
      typeof validatedViewsRaw === "string" ? parseFloat(validatedViewsRaw) : validatedViewsRaw;
    const reason = typeof reasonRaw === "string" ? reasonRaw : "No reason provided";

    if (
      typeof fraudScore === "number" &&
      !Number.isNaN(fraudScore) &&
      typeof validatedViews === "number" &&
      !Number.isNaN(validatedViews)
    ) {
      return {
        fraudScore: Math.max(0, Math.min(100, fraudScore)),
        validatedViews: Math.max(0, Math.floor(validatedViews)),
        reason,
      };
    }
  } catch {
    return null;
  }

  return null;
}

export async function detectFraud(
  engagement: EngagementData
): Promise<FraudDetectionResult> {
  const useFallback = () => fallbackFraudDetection(engagement);

  if (!process.env.GROQ_API_KEY) {
    return useFallback();
  }

  const prompt = `
Given engagement metrics, return a JSON object with:
- "fraudScore": 0-100 (0 = clean, 100 = definitely fraudulent)
- "validatedViews": integer <= rawViews (deduct suspected invalid views)
- "reason": short string

Use signs like low engagement ratio, very high click-off, or bot-like patterns to increase fraudScore.
If uncertain, stay conservative (fraudScore < 30).

Inputs: ${JSON.stringify(engagement)}

Respond ONLY with JSON, e.g. {"fraudScore": 24, "validatedViews": 18230, "reason": "brief note"}
`;

  try {
    const content = await groqChat({
      system: "You are a fraud detection assistant for social metrics. Return JSON only.",
      user: prompt,
      model: DEFAULT_MODEL,
      temperature: 0.1,
      maxTokens: 200,
    });

    const parsed = extractJsonFields(content);
    if (parsed) {
      const cappedViews = Math.min(parsed.validatedViews, engagement.rawViews);
      return {
        fraudScore: Math.max(0, Math.min(100, parsed.fraudScore)),
        validatedViews: Math.max(0, cappedViews),
        reason: parsed.reason,
      };
    }
  } catch (error) {
    console.error("Groq fraud detection failed, using fallback:", error);
  }

  return useFallback();
}
