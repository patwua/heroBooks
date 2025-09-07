import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "heroBooks — Modern Accounting for Guyana",
  description: "Guyana-ready accounting with VAT, WHT, and clean APIs.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://herobooks.net"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
