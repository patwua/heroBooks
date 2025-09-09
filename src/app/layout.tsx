import "./global.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import OrgThemeClient from "@/components/providers/OrgThemeClient";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "heroBooks — Modern Accounting for Guyana",
  description: "Guyana-ready accounting with VAT, WHT, and clean APIs.",
  icons: { icon: "/logos/favicon.svg" },
  metadataBase: new URL("https://herobooks.net"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <SessionProvider>
          {/* Our ThemeProvider now defaults to data-theme and merges props safely */}
          <ThemeProvider>
            {/* Sync to org settings at runtime */}
            {/* @ts-expect-error client component */}
            <OrgThemeClient />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
