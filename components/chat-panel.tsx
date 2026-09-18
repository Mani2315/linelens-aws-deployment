"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowUp, Bot, LoaderCircle, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ChatMessage } from "@/hooks/use-persistent-chat";
import { sourceById } from "@/lib/knowledge";
import { validateQuestionInput } from "@/lib/security";

type ChatPanelProps = { messages: ChatMessage[]; loading: boolean; error: string; onSubmit: (question: string) => Promise<void> };
const suggestions = ["How do I reset my password?", "What is the refund policy?", "How do I contact support?"];

export function ChatPanel({ messages, loading, error, onSubmit }: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [validation, setValidation] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const result = validateQuestionInput(question);
    if (!result.success) { setValidation(result.error); return; }
    const value = result.value;
    setValidation(""); setQuestion(""); void onSubmit(value);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_16px_40px_rgba(10,35,45,0.07)]">
      <div aria-live="polite" aria-relevant="additions text" className="min-h-[385px] space-y-5 p-4 sm:p-6" role="log">
        {messages.map((message) => (
          <article className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`} key={message.id}>
            {message.role === "assistant" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot aria-hidden="true" className="h-4 w-4" /></span>}
            <div className={`max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "rounded-tr-md bg-primary text-primary-foreground" : "rounded-tl-md border border-border bg-background"}`}>
              <p>{message.content}</p>
              {message.citations && message.citations.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                  {message.citations.map((citation) => <Badge className="font-normal" key={citation} variant="secondary">{sourceById[citation]?.shortTitle ?? citation}</Badge>)}
                  {message.confidence && <span className="ml-auto text-[11px] text-muted-foreground">{message.confidence} confidence</span>}
                </div>
              )}
            </div>
            {message.role === "user" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground"><UserRound aria-hidden="true" className="h-4 w-4" /></span>}
          </article>
        ))}
        {loading && <div className="flex items-center gap-3 text-sm text-muted-foreground"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Bot aria-hidden="true" className="h-4 w-4" /></span><LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />Checking approved sources…</div>}
        {messages.length === 1 && !loading && <div className="grid gap-2 pt-2 sm:grid-cols-3">{suggestions.map((suggestion) => <button className="rounded-xl border border-border bg-background px-3 py-3 text-left text-xs leading-5 text-muted-foreground transition hover:border-primary/40 hover:text-foreground" key={suggestion} onClick={() => setQuestion(suggestion)} type="button">{suggestion}</button>)}</div>}
      </div>

      <form className="border-t border-border bg-muted/30 p-3 sm:p-4" onSubmit={submit}>
        <div className="flex items-end gap-2 rounded-xl border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring/35">
          <Textarea aria-describedby="question-help question-error" aria-label="Ask LineLens a question" className="min-h-[52px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0" disabled={loading} id="question-input" maxLength={300} onChange={(event) => { setQuestion(event.target.value); if (validation) setValidation(""); }} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Ask about accounts, billing, or support…" value={question} />
          <Button aria-label="Send question" disabled={loading} size="icon" type="submit"><ArrowUp aria-hidden="true" className="h-4 w-4" /></Button>
        </div>
        {(validation || error) && <p className="mt-2 flex items-center gap-2 text-xs text-destructive" id="question-error" role="alert"><AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />{validation || error}</p>}
        <div className="mt-2 flex justify-between text-xs text-muted-foreground" id="question-help"><span>Press Enter to send · Shift+Enter for a new line</span><span aria-label={`${question.length} of 300 characters`}>{question.length}/300</span></div>
      </form>
    </div>
  );
}
