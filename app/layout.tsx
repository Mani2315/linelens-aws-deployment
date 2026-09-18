import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "LineLens Knowledge Assistant", description: "A cited support assistant grounded in approved organizational documents.", icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
