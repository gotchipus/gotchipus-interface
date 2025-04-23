import { NextRequest } from "next/server";
import { streamText, LanguageModelV1 } from "ai";
import { createXai } from "@ai-sdk/xai";

export const runtime = 'edge';

const xaiApiKey = process.env.NEXT_PUBLIC_XAI_API_KEY || '';
if (!xaiApiKey) {
  throw new Error("NEXT_PUBLIC_XAI_API_KEY is not defined in environment variables");
}

const xai = createXai({ apiKey: xaiApiKey });

enum Models {
  XAI = "XAI",
}

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const { messages, modelName, temperature = 0.7, maxTokens = 200 } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing messages" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!modelName) {
      return new Response(
        JSON.stringify({ error: "Missing modelName" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    let model: LanguageModelV1;
    let maxTokensLimit: number;

    switch (modelName) {
      case Models.XAI:
        model = xai("grok-3-beta");
        maxTokensLimit = 131072;
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unsupported model: ${modelName}` }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    let tokenCount = 0;
    const truncatedMessages = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const estimatedTokens = Math.ceil((msg.content?.length || 0) / 4);
      if (tokenCount + estimatedTokens <= maxTokensLimit) {
        truncatedMessages.unshift(msg);
        tokenCount += estimatedTokens;
      } else {
        break;
      }
    }

    const result = await streamText({
      model,
      messages: truncatedMessages,
      temperature,
      maxTokens,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}