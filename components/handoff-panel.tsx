"use client";

import { CheckCircle2, Headphones, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Toaster } from "@/components/ui/sonner";

export function HandoffPanel({ citedCount }: { citedCount: number }) {
  const grounding = citedCount === 0 ? 0 : Math.min(100, 68 + citedCount * 10);
  return <><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Answer quality</p><h2 className="mt-1 text-sm font-semibold">Session checks</h2></div><div className="mt-5 space-y-4"><div className="rounded-xl border border-border p-4"><div className="mb-3 flex items-center justify-between text-xs"><span className="font-medium">Source grounding</span><span className="text-muted-foreground">{grounding}%</span></div><Progress aria-label={`Source grounding ${grounding} percent`} value={grounding} /><p className="mt-3 text-xs leading-5 text-muted-foreground">Increases when an answer cites an approved document.</p></div><div className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"><ShieldCheck aria-hidden="true" className="h-4 w-4 text-emerald-600" /><div><p className="font-medium">Private workspace</p><p className="text-xs text-muted-foreground">No open-web search</p></div></div><div className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm"><CheckCircle2 aria-hidden="true" className="h-4 w-4 text-emerald-600" /><div><p className="font-medium">Citations enabled</p><p className="text-xs text-muted-foreground">Trace each answer</p></div></div></div><div className="mt-6 border-t border-border pt-6"><div className="mb-3 flex items-center gap-2"><Headphones aria-hidden="true" className="h-4 w-4 text-primary" /><h2 className="text-sm font-semibold">Need a person?</h2></div><p className="mb-4 text-xs leading-5 text-muted-foreground">Request a human review when the answer is incomplete or the issue is urgent.</p><Button className="w-full" onClick={() => toast.success("Support request created", { description: "A specialist will follow up within one business day." })} variant="outline">Request human support</Button></div><Toaster position="bottom-right" richColors /></>;
}
