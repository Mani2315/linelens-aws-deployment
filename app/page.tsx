"use client";

import { useCallback, useMemo, useState } from "react";
import { BookOpen, CircleHelp, FileText, Menu, Sparkles } from "lucide-react";

import { ChatPanel } from "@/components/chat-panel";
import { HandoffPanel } from "@/components/handoff-panel";
import { SourcePanel } from "@/components/source-panel";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { usePersistentChat } from "@/hooks/use-persistent-chat";
import { useWebMcp } from "@/hooks/use-webmcp";
import { knowledgeSources } from "@/lib/knowledge";

type ChatApiResponse = {
  answer?: string;
  citations?: string[];
  confidence?: "High" | "Medium" | "Low";
  error?: string;
};

export default function Home() {
  const { messages, addMessage, clearMessages } = usePersistentChat();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileSourcesOpen, setMobileSourcesOpen] = useState(false);

  const citedSourceIds = useMemo(
    () => new Set(messages.flatMap((message) => message.citations ?? [])),
    [messages],
  );

  const submitQuestion = useCallback(async (question: string) => {
    setError("");
    addMessage({ role: "user", content: question });
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json().catch(() => ({})) as ChatApiResponse;
      if (!response.ok) throw new Error(data.error ?? "Unable to get an answer.");
      if (typeof data.answer !== "string") throw new Error("The service returned an invalid response.");
      addMessage({ role: "assistant", content: data.answer, citations: data.citations, confidence: data.confidence });
    } catch (requestError) {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setError("You appear to be offline. Reconnect to the internet and try again.");
      } else if (requestError instanceof TypeError || (requestError instanceof Error && /fetch|network/i.test(requestError.message))) {
        setError("LineLens could not reach the service. Check your connection and try again.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "The answer could not be loaded. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [addMessage]);

  useWebMcp(submitQuestion);

  return (
    <main className="min-h-screen bg-background text-foreground" id="main-content">
      <a className="fixed left-3 top-3 z-50 -translate-y-20 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg focus:translate-y-0" href="#question-input">
        Skip to question
      </a>
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles aria-hidden="true" className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[17px] font-semibold leading-tight tracking-[-0.02em]">LineLens</p>
              <p className="text-xs text-muted-foreground">Knowledge assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button aria-controls="connected-sources" aria-expanded={mobileSourcesOpen} className="lg:hidden" onClick={() => setMobileSourcesOpen((open) => !open)} size="sm" variant="outline">
              <Menu aria-hidden="true" className="mr-2 h-4 w-4" /> Sources
            </Button>
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> 3 verified sources
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[248px_minmax(0,1fr)_280px]">
        <aside className={`${mobileSourcesOpen ? "block" : "hidden"} border-b border-border bg-sidebar px-4 py-5 lg:block lg:min-h-[calc(100vh-64px)] lg:border-b-0 lg:border-r lg:px-5 lg:py-7`} id="connected-sources">
          <SourcePanel citedSourceIds={citedSourceIds} sources={knowledgeSources} />
        </aside>

        <section className="min-w-0 px-4 py-6 sm:px-8 sm:py-8 xl:px-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary"><BookOpen aria-hidden="true" className="h-4 w-4" /> Workspace support</div>
                <h1 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">Ask your documents, not the internet.</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Get concise answers grounded in the approved guides shown beside the conversation.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button size="sm" variant="ghost">Clear</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear this conversation?</AlertDialogTitle>
                    <AlertDialogDescription>This removes the questions and answers saved in this browser tab. This action cannot be undone.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep conversation</AlertDialogCancel>
                    <AlertDialogAction onClick={clearMessages}>Clear conversation</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <ChatPanel error={error} loading={loading} messages={messages} onSubmit={submitQuestion} />
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-muted/45 px-4 py-3 text-xs leading-5 text-muted-foreground">
              <CircleHelp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> LineLens can make mistakes. Review cited sources before making important decisions.
            </div>
          </div>
        </section>

        <aside className="border-t border-border bg-card px-4 py-6 lg:min-h-[calc(100vh-64px)] lg:border-l lg:border-t-0 lg:px-5 lg:py-7">
          <HandoffPanel citedCount={citedSourceIds.size} />
          <div className="mt-6 rounded-xl border border-border p-4">
            <div className="mb-3 flex items-center gap-2"><FileText aria-hidden="true" className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Private session</h2></div>
            <p className="text-xs leading-5 text-muted-foreground">Conversation history is kept only in this browser tab, survives a refresh, and is removed when the tab is closed.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
