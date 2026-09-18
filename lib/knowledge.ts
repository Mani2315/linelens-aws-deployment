export type KnowledgeSource = { id: string; title: string; shortTitle: string; updated: string };
export const knowledgeSources: KnowledgeSource[] = [
  { id: "account", title: "Account Setup Guide", shortTitle: "Account Guide", updated: "Updated Aug 2026" },
  { id: "billing", title: "Billing and Refund Policy", shortTitle: "Billing Policy", updated: "Updated Sep 2026" },
  { id: "support", title: "Support Operations Handbook", shortTitle: "Support Handbook", updated: "Updated Jul 2026" },
];
export const sourceById = Object.fromEntries(knowledgeSources.map((source) => [source.id, source])) as Record<string, KnowledgeSource>;
export function answerQuestion(question: string) {
  const normalized = question.toLowerCase();
  if (/password|login|sign in|account/.test(normalized)) return { answer: "Use the “Forgot password” link on the sign-in page. A reset link is sent to the verified email address and expires after 30 minutes. If the email does not arrive, check spam before contacting support.", citations: ["account", "support"], confidence: "High" as const };
  if (/refund|billing|charge|invoice|cancel/.test(normalized)) return { answer: "Refund requests are accepted within 14 calendar days of the original purchase when the service has not been substantially used. Submit the invoice number through Billing Support; approved refunds return to the original payment method.", citations: ["billing", "support"], confidence: "High" as const };
  if (/support|human|person|contact|urgent/.test(normalized)) return { answer: "Standard support is available through the Help Center form, with an expected response within one business day. For an account-access or payment issue, include the account email and relevant invoice number, but never send a password or full card number.", citations: ["support"], confidence: "High" as const };
  return { answer: "I could not find enough verified information in the connected documents to answer that confidently. Please rephrase the question or request human support so a specialist can review it.", citations: [], confidence: "Low" as const };
}
