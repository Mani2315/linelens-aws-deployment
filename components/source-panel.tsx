import { Check, FileText } from "lucide-react";
import type { KnowledgeSource } from "@/lib/knowledge";

type SourcePanelProps = { sources: KnowledgeSource[]; citedSourceIds: Set<string> };
export function SourcePanel({ sources, citedSourceIds }: SourcePanelProps) {
  return <div><div className="mb-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Approved knowledge</p><h2 className="mt-1 text-sm font-semibold">Connected sources</h2></div><div className="space-y-2">{sources.map((source) => { const cited = citedSourceIds.has(source.id); return <div className={`rounded-xl border p-3 transition ${cited ? "border-primary/35 bg-primary/5" : "border-sidebar-border bg-card"}`} key={source.id}><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground"><FileText aria-hidden="true" className="h-4 w-4" /></span><div className="min-w-0"><p className="text-sm font-medium leading-5">{source.title}</p><p className="mt-1 text-xs text-muted-foreground">{source.updated}</p></div>{cited && <Check aria-label="Cited in this session" className="h-4 w-4 shrink-0 text-primary" />}</div></div>; })}</div><p className="mt-5 text-xs leading-5 text-muted-foreground">Answers are limited to these documents. Unverified questions are routed to a person.</p></div>;
}
