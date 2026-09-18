import { z } from "zod";

const questionSchema = z.string().trim().min(3, "Enter a question with at least 3 characters.").max(300, "Keep your question under 300 characters.");
const sensitivePatterns = [
  /\b\d{3}[- ]\d{2}[- ]\d{4}\b/,
  /\b(?:\d[ -]*?){13,19}\b/,
  /\b(?:password|passwd|api[_ -]?key|secret|access[_ -]?token)\s*[:=]\s*\S+/i,
  /\bsk-[a-z0-9_-]{16,}\b/i,
];

export type QuestionValidation = { success: true; value: string } | { success: false; error: string };

export function validateQuestionInput(input: unknown): QuestionValidation {
  const result = questionSchema.safeParse(input);
  if (!result.success) return { success: false, error: result.error.issues[0]?.message ?? "Enter a valid question." };
  const normalized = result.data.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
  if (sensitivePatterns.some((pattern) => pattern.test(normalized))) {
    return { success: false, error: "Remove passwords, payment numbers, government IDs, or API credentials before submitting." };
  }
  return { success: true, value: normalized };
}
