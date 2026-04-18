import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * POST /api/simplify
 *
 * Accepts { text: string } and returns { simplified: string }.
 * Uses Gemini Flash to convert complex English into simple,
 * deaf-friendly language (5th-grade reading level).
 *
 * The API key stays server-side — never exposed to the client.
 */
export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json(
        { simplified: text || "" },
        { status: 200 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `Convert this to simple English for deaf students. Use short, clear sentences with 5th-grade vocabulary. Return ONLY the simplified text, nothing else: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let simplified = response.text();

    // Clean any AI artifacts (brackets, preamble, etc.)
    simplified = simplified
      .replace(/\[.*?\]/g, "")
      .replace(/^(Sure|Here.*?:)/i, "")
      .trim();

    return Response.json(
      { simplified: simplified || text },
      { status: 200 }
    );
  } catch (error) {
    console.error("Simplify API error:", error);

    return Response.json(
      { error: "Failed to simplify text", simplified: null },
      { status: 500 }
    );
  }
}
