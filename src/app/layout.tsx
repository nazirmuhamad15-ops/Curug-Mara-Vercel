"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";
import { AIChatWidget } from "@/components/AIChatWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <SessionProvider>
          {children}
          <AIChatWidget />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
