import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "WholeU",
  description: "Evidence-based learning for communication, consent, and relationships.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {/* @ts-expect-error Async Server Component */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
