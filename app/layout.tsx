import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import AppHeader from "./components/AppHeader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manuel Caballero — AI Solutions Engineer",
  description:
    "Manuel Caballero designs intelligent workflows and AI agents that automate business operations end-to-end with n8n, LLMs, and modern AI infrastructure.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AppHeader />

        {children}
      </body>
    </html>
  );
}
