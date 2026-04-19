type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
};

const GEMINI_MODEL = "gemini-2.5-flash";

function requireGeminiApiKey() {
  const apiKey =
    process.env.GEMINI_API ??
    process.env.GEMINI_API_KEY ??
    process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing environment variable: GEMINI_API");
  }

  return apiKey;
}

function extractGeminiText(response: GeminiGenerateContentResponse) {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .map((part) => part.text?.trim() ?? "")
    .filter(Boolean)
    .join("\n\n")
    .trim();

  return text || null;
}

export async function generateGeminiText(input: {
  prompt: string;
  systemInstruction: string;
}) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": requireGeminiApiKey(),
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: input.systemInstruction }],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: input.prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.9,
          maxOutputTokens: 500,
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Gemini request failed with status ${response.status}.`);
  }

  const payload =
    (await response.json()) satisfies GeminiGenerateContentResponse;

  if (payload.error?.message) {
    throw new Error(payload.error.message);
  }

  if (payload.promptFeedback?.blockReason) {
    return {
      text: "I can only help with clinic information, bookings, dentist suggestions, and aftercare guidance from your clinic record.",
    };
  }

  return {
    text:
      extractGeminiText(payload) ??
      "I could not prepare a helpful answer right now. Please try rephrasing your question.",
  };
}
