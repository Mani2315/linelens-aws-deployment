import { NextResponse } from "next/server";
import { answerQuestion } from "@/lib/knowledge";
import { checkRateLimit } from "@/lib/rate-limit";
import { validateQuestionInput } from "@/lib/security";

const responseHeaders = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(body: object, status = 200, extraHeaders: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...responseHeaders, ...extraHeaders } });
}

export async function POST(request: Request) {
  try {
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
      return json({ error: "Content-Type must be application/json." }, 415);
    }
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (Number.isFinite(contentLength) && contentLength > 2048) {
      return json({ error: "The request is too large." }, 413);
    }
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const clientId = request.headers.get("cf-connecting-ip") ?? forwardedFor ?? "unknown-client";
    const rateLimit = checkRateLimit(clientId);
    if (!rateLimit.allowed) {
      return json({ error: "Too many requests. Please wait a moment and try again." }, 429, { "Retry-After": String(rateLimit.retryAfterSeconds) });
    }
    const body: unknown = await request.json();
    const question = body && typeof body === "object" && "question" in body
      ? (body as { question?: unknown }).question
      : undefined;
    const validation = validateQuestionInput(question);
    if (!validation.success) return json({ error: validation.error }, 400);
    await new Promise((resolve) => setTimeout(resolve, 550));
    return json(answerQuestion(validation.value));
  } catch {
    return json({ error: "The request could not be read. Please try again." }, 400);
  }
}
