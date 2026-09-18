"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createMessageId } from "@/lib/id";

export type ChatMessage = { id: string; role: "assistant" | "user"; content: string; citations?: string[]; confidence?: "High" | "Medium" | "Low" };
const welcomeMessage: ChatMessage = { id: "welcome", role: "assistant", content: "Hi Sai — I can answer questions using the Account Guide, Billing Policy, and Support Handbook. What would you like to know?" };
const storageKey = "linelens-private-session";

function restoreMessages(value: string | null): ChatMessage[] {
  if (!value) return [welcomeMessage];
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [welcomeMessage];
  const valid = parsed.slice(-50).filter((item): item is ChatMessage => {
    if (typeof item !== "object" || item === null) return false;
    const candidate = item as Partial<ChatMessage>;
    return typeof candidate.id === "string" &&
      (candidate.role === "assistant" || candidate.role === "user") &&
      typeof candidate.content === "string" && candidate.content.length <= 1200;
  });
  return valid.length > 0 ? valid : [welcomeMessage];
}

export function usePersistentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const hydrated = useRef(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setMessages(restoreMessages(window.sessionStorage.getItem(storageKey))); }
      catch { window.sessionStorage.removeItem(storageKey); setMessages([welcomeMessage]); }
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    try { window.sessionStorage.setItem(storageKey, JSON.stringify(messages.slice(-50))); }
    catch { /* The app still works when browser storage is unavailable. */ }
  }, [messages]);
  const addMessage = useCallback((message: Omit<ChatMessage, "id">) => { setMessages((current) => [...current.slice(-49), { ...message, id: createMessageId() }]); }, []);
  const clearMessages = useCallback(() => { setMessages([welcomeMessage]); }, []);
  return { messages, addMessage, clearMessages };
}
