import { NextResponse } from "next/server";
import { createModerationLog } from "@/lib/db";

const BANNED_KEYWORDS = [
  "hate speech", "harass", "kill", "suicide", "murder", "abuse", 
  "insult", "toxicity", "scam", "spam", "f**k", "sh*t", "b*tch",
  "asshole", "bastard", "idiot", "moron", "retard", "slur"
];

export async function POST(request: Request) {
  try {
    const { text, type, targetId } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text content is required" }, { status: 400 });
    }

    let flagged = false;
    let categories: Record<string, boolean> = {
      hate: false,
      harassment: false,
      self_harm: false,
      sexual: false,
      violence: false,
      spam: false,
    };
    let scores: Record<string, number> = {
      hate: 0,
      harassment: 0,
      self_harm: 0,
      sexual: 0,
      violence: 0,
      spam: 0,
    };

    const apiKey = process.env.OPENAI_API_KEY || "";

    if (apiKey && apiKey !== "placeholder") {
      // Call real OpenAI Moderation API
      try {
        const response = await fetch("https://api.openai.com/v1/moderations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ input: text }),
        });

        if (response.ok) {
          const result = await response.json();
          const results = result.results?.[0];
          if (results) {
            flagged = results.flagged;
            categories = {
              hate: results.categories.hate || results.categories["hate/threatening"],
              harassment: results.categories.harassment || results.categories["harassment/threatening"],
              self_harm: results.categories["self-harm"] || results.categories["self-harm/intent"] || results.categories["self-harm/instructions"],
              sexual: results.categories.sexual || results.categories["sexual/minors"],
              violence: results.categories.violence || results.categories["violence/graphic"],
              spam: false, // OpenAI doesn't explicitly flag general spam in this endpoint
            };
            scores = {
              hate: results.category_scores.hate || 0,
              harassment: results.category_scores.harassment || 0,
              self_harm: results.category_scores["self-harm"] || 0,
              sexual: results.category_scores.sexual || 0,
              violence: results.category_scores.violence || 0,
              spam: 0,
            };
          }
        }
      } catch (err) {
        console.error("OpenAI moderation failed, falling back to local:", err);
      }
    }

    // Local Rule-Based Fallback (runs if OpenAI key is missing or calls fail)
    if (!apiKey || apiKey === "placeholder" || !flagged) {
      const lowerText = text.toLowerCase();
      
      // Keyword matching
      const matchedWords = BANNED_KEYWORDS.filter(word => {
        const regex = new RegExp(`\\b${word.replace("*", "\\*")}\\b`, "i");
        return regex.test(lowerText);
      });

      if (matchedWords.length > 0) {
        flagged = true;
        // Simple assignment based on matched terms
        if (matchedWords.some(w => ["hate speech", "slur"].includes(w))) {
          categories.hate = true;
          scores.hate = 0.95;
        }
        if (matchedWords.some(w => ["harass", "abuse", "insult", "b*tch", "asshole", "bastard"].includes(w))) {
          categories.harassment = true;
          scores.harassment = 0.88;
        }
        if (matchedWords.some(w => ["kill", "murder", "violence"].includes(w))) {
          categories.violence = true;
          scores.violence = 0.92;
        }
        if (matchedWords.some(w => ["suicide", "self-harm"].includes(w))) {
          categories.self_harm = true;
          scores.self_harm = 0.99;
        }
        if (matchedWords.some(w => ["spam", "scam"].includes(w))) {
          categories.spam = true;
          scores.spam = 0.85;
        }
        // Default category if generic badwords
        if (!Object.values(categories).some(Boolean)) {
          categories.harassment = true;
          scores.harassment = 0.75;
        }
      }
    }

    const moderationResult = flagged 
      ? `Flagged categories: ${Object.entries(categories).filter(([_, val]) => val).map(([name]) => name).join(", ")}`
      : "Clean";

    // Write to moderation logs
    const logId = `mod-log-${Math.random().toString(36).substr(2, 9)}`;
    await createModerationLog({
      id: logId,
      target_type: type || "comment",
      target_id: targetId || "temp-id",
      moderation_result: moderationResult,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      flagged,
      categories,
      scores,
      result: moderationResult
    });

  } catch (error) {
    console.error("Moderation API Error:", error);
    return NextResponse.json({ error: "Failed to perform moderation" }, { status: 500 });
  }
}
