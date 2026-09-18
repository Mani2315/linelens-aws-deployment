"use client";

import { useEffect } from "react";

type LineLensTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => Promise<{ status: string; question: string }>;
};

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: LineLensTool, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
  }
}

export function useWebMcp(askLineLens: (question: string) => Promise<void>) {
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;

    const lifecycle = new AbortController();
    void Promise.resolve(
      context.registerTool(
        {
          name: "ask_line_lens",
          title: "Ask LineLens",
          description: "Ask a support question using the same verified sources and conversation shown in the LineLens interface.",
          inputSchema: {
            type: "object",
            properties: { question: { type: "string", minLength: 3, maxLength: 300 } },
            required: ["question"],
            additionalProperties: false,
          },
          annotations: { readOnlyHint: false, untrustedContentHint: false },
          async execute(input) {
            const question = typeof input === "object" && input !== null && "question" in input
              ? String((input as { question: unknown }).question).trim()
              : "";
            if (question.length < 3 || question.length > 300) throw new Error("Question must be between 3 and 300 characters.");
            await askLineLens(question);
            return { status: "answered", question };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => undefined);

    return () => lifecycle.abort();
  }, [askLineLens]);
}
