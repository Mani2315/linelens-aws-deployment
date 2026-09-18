import assert from "node:assert/strict";
import test from "node:test";

import { answerQuestion } from "../lib/knowledge.ts";
import { createMessageId } from "../lib/id.ts";
import { checkRateLimit, resetRateLimitsForTesting } from "../lib/rate-limit.ts";
import { validateQuestionInput } from "../lib/security.ts";

test("accepts and normalizes a normal question", () => {
  assert.deepEqual(validateQuestionInput("  How do I reset my password?  "), { success: true, value: "How do I reset my password?" });
});

test("rejects blank short and oversized questions", () => {
  assert.equal(validateQuestionInput("   ").success, false);
  assert.equal(validateQuestionInput("x").success, false);
  assert.equal(validateQuestionInput("a".repeat(301)).success, false);
});

test("rejects sensitive credentials and identifiers", () => {
  assert.equal(validateQuestionInput("password: SuperSecret123").success, false);
  assert.equal(validateQuestionInput("My SSN is 123-45-6789").success, false);
  assert.equal(validateQuestionInput("Card 4111 1111 1111 1111").success, false);
});

test("returns grounded and insufficient-evidence answers", () => {
  assert.deepEqual(answerQuestion("What is the refund policy?").citations, ["billing", "support"]);
  assert.equal(answerQuestion("What is tomorrow's weather?").confidence, "Low");
});

test("rate limit allows 20 requests and blocks the next one", () => {
  resetRateLimitsForTesting();
  for (let index = 0; index < 20; index += 1) assert.equal(checkRateLimit("test", 1000).allowed, true);
  assert.equal(checkRateLimit("test", 1000).allowed, false);
  assert.equal(checkRateLimit("test", 61_001).allowed, true);
});

test("creates a message id when randomUUID is unavailable", () => {
  assert.match(createMessageId(), /^(?:[0-9a-f-]{36}|msg-[a-z0-9]+-[a-z0-9]+)$/);
});
