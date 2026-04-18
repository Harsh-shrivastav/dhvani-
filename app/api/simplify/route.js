import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'edge';

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

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Convert this to simple English for deaf students. Use short, clear sentences with 5th-grade vocabulary. Return ONLY the simplified text, nothing else: "${text}"`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            let chunkText = chunk.text();
            // Basic cleanup on the fly
            chunkText = chunkText.replace(/\[.*?\]/g, "").replace(/^(Sure|Here.*?:)/i, "");
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache",
      }
    });
  } catch (error) {
    console.error("Simplify API error:", error);

    return Response.json(
      { error: "Failed to simplify text", simplified: null },
      { status: 500 }
    );
  }
}
